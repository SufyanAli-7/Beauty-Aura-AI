/**
 * YouCam MCP Client
 * Communicates with the YouCam Beauty MCP Server via Streamable HTTP (JSON-RPC over SSE).
 */

const YOUCAM_BEAUTY_URL = "https://mcp-api-01.makeupar.com/mcp/beauty";
const YOUCAM_FASHION_URL = "https://mcp-api-01.makeupar.com/mcp/fashion";
const YOUCAM_CREATORS_URL = "https://mcp-api-01.makeupar.com/mcp/creators";
const YOUCAM_API_KEY =
  process.env.NEXT_YOUCAM_API_KEY ||
  "sk-XFFGN1JU3BgzDBhQ6tVn-9A0Qy5FHbscuZoTlo_UHVeyeH3cMe8dJi2qFj5PKBsp";

export interface YouCamCallResult {
  success: boolean;
  imageUrl?: string;
  data?: any;
  taskId?: string;
  status?: string;
  rawResponse?: any;
  error?: string;
}

/**
 * Initializes an MCP session and calls a YouCam MCP tool.
 * Supports "beauty", "fashion", and "creators" servers.
 */
export async function callYouCamMCP(
  toolName: string,
  args: Record<string, any>,
  timeoutMs = 60000,
  serverType: "beauty" | "fashion" | "creators" | string = "beauty"
): Promise<YouCamCallResult> {
  const targetUrl =
    serverType === "creators"
      ? YOUCAM_CREATORS_URL
      : serverType === "fashion"
      ? YOUCAM_FASHION_URL
      : serverType.startsWith("http")
      ? serverType
      : YOUCAM_BEAUTY_URL;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // 1. Initialize MCP session
    const initResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${YOUCAM_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "BeautyAura-App", version: "1.0.0" },
        },
      }),
      signal: controller.signal,
    });

    if (!initResponse.ok) {
      const errText = await initResponse.text();
      throw new Error(`MCP initialize failed (${initResponse.status}): ${errText}`);
    }

    const sessionId = initResponse.headers.get("mcp-session-id");

    // 2. Execute tools/call
    const toolHeaders: Record<string, string> = {
      Authorization: `Bearer ${YOUCAM_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    };
    if (sessionId) {
      toolHeaders["mcp-session-id"] = sessionId;
    }

    const toolResponse = await fetch(targetUrl, {
      method: "POST",
      headers: toolHeaders,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: toolName,
          arguments: args,
        },
      }),
      signal: controller.signal,
    });

    if (!toolResponse.ok) {
      const errText = await toolResponse.text();
      throw new Error(`MCP tool call failed (${toolResponse.status}): ${errText}`);
    }

    const responseText = await toolResponse.text();

    // 3. Parse SSE stream lines to find JSON-RPC response
    const lines = responseText.split("\n");
    let finalResultData: any = null;
    let fallbackTaskId: string | null = null;
    let lastErrorMessage: string | null = null;

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const parsed = JSON.parse(line.slice(6));

          // Check notifications for task_id or request_id or status or error
          if (parsed.params?.data?.extra?.task_id) {
            fallbackTaskId = parsed.params.data.extra.task_id;
          } else if (parsed.params?.data?.task_id) {
            fallbackTaskId = parsed.params.data.task_id;
          } else if (parsed.params?.data?.extra?.request_id && !fallbackTaskId) {
            fallbackTaskId = parsed.params.data.extra.request_id;
          }

          if (parsed.params?.level === "error" && parsed.params?.data?.msg) {
            lastErrorMessage = parsed.params.data.msg;
          }

          // Check final result
          if (parsed.result) {
            finalResultData = parsed.result;
          }
        } catch {
          // ignore invalid chunks
        }
      }
    }

    // Extract image URL or analysis data from finalResultData
    let extractedUrl: string | undefined;
    let analysisData: any = undefined;
    let taskId: string | undefined = fallbackTaskId || undefined;
    let status = "running";
    let detectedError: string | null = lastErrorMessage;

    if (finalResultData) {
      // FastMCP structuredContent
      const structuredResult = finalResultData.structuredContent?.result;
      if (structuredResult?.error_message) {
        detectedError = structuredResult.error_message;
      }
      if (structuredResult?.data?.results?.url) {
        extractedUrl = structuredResult.data.results.url;
        status = "success";
      } else if (structuredResult?.data?.results?.output?.[0]?.url) {
        extractedUrl = structuredResult.data.results.output[0].url;
        status = "success";
      } else if (Array.isArray(structuredResult?.data?.results) && structuredResult.data.results[0]?.url) {
        extractedUrl = structuredResult.data.results[0].url;
        status = "success";
      }

      if (structuredResult?.data?.results) {
        analysisData = structuredResult.data.results;
        status = "success";
      }
      if (structuredResult?.data?.task_id) {
        taskId = structuredResult.data.task_id;
      }
      if (structuredResult?.data?.task_status) {
        status = structuredResult.data.task_status;
      }

      // Or parse content[0].text
      if (finalResultData.content?.[0]?.text) {
        try {
          const innerJson = JSON.parse(finalResultData.content[0].text);
          if (innerJson?.error_message) {
            detectedError = innerJson.error_message;
          }
          if (innerJson.data?.results?.url) {
            extractedUrl = innerJson.data.results.url;
            status = "success";
          } else if (innerJson.data?.results?.output?.[0]?.url) {
            extractedUrl = innerJson.data.results.output[0].url;
            status = "success";
          } else if (Array.isArray(innerJson.data?.results) && innerJson.data.results[0]?.url) {
            extractedUrl = innerJson.data.results[0].url;
            status = "success";
          }

          if (innerJson.data?.results) {
            analysisData = innerJson.data.results;
            status = "success";
          }
          if (innerJson.data?.task_id) {
            taskId = innerJson.data.task_id;
          }
          if (innerJson.data?.task_status) {
            status = innerJson.data.task_status;
          }
        } catch {
          // ignore
        }
      }
    }

    if (detectedError && !extractedUrl && !analysisData) {
      let friendlyError = detectedError;
      if (detectedError.includes("error_no_shoulders")) {
        friendlyError = "Please choose or upload a portrait where the neck and shoulders are clearly visible.";
      } else if (detectedError.includes("invalid_parameter")) {
        friendlyError = "Image dimensions or aspect ratio parameter out of bounds. Please try another preset.";
      } else if (detectedError.includes("error_no_face")) {
        friendlyError = "No face detected in the portrait. Please upload a clear photo looking towards the camera.";
      }
      throw new Error(friendlyError);
    }

    // If task is still processing or needs manual polling
    if (!extractedUrl && !analysisData && taskId && status !== "failed") {
      console.log(`[YouCam MCP] Task ${taskId} is still in progress (${status}). Initiating polling on ${targetUrl}...`);
      const polled = await pollTaskStatus(taskId, toolName, sessionId, 4, 2000, targetUrl);
      if (polled.imageUrl) {
        extractedUrl = polled.imageUrl;
        status = "success";
      }
      if (polled.data) {
        analysisData = polled.data;
        status = "success";
      }
    }

    if (!extractedUrl && !analysisData) {
      throw new Error(
        `YouCam did not return an image URL or analysis data. Status: ${status}. Response: ${responseText.slice(
          0,
          500
        )}`
      );
    }

    return {
      success: true,
      imageUrl: extractedUrl,
      data: analysisData,
      taskId,
      status,
      rawResponse: finalResultData,
    };
  } catch (err: any) {
    console.error(`[YouCam MCP Error - ${toolName}]:`, err);
    return {
      success: false,
      error: err.message || "Unknown YouCam error",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Polls Get-Running-Task-Status until completion.
 */
async function pollTaskStatus(
  taskId: string,
  taskType: string,
  sessionId?: string | null,
  maxAttempts = 4,
  intervalMs = 2000,
  targetUrl = YOUCAM_BEAUTY_URL
): Promise<{ imageUrl?: string; data?: any; status?: string }> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (attempt > 1) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    try {
      const toolHeaders: Record<string, string> = {
        Authorization: `Bearer ${YOUCAM_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      };
      if (sessionId) toolHeaders["mcp-session-id"] = sessionId;

      console.log(`[YouCam Polling] Attempt ${attempt}/${maxAttempts} for task ${taskId} (${taskType})...`);

      const res = await fetch(targetUrl, {
        method: "POST",
        headers: toolHeaders,
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 100 + attempt,
          method: "tools/call",
          params: {
            name: "Get-Running-Task-Status",
            arguments: {
              task_id: taskId,
              task_type: taskType,
              polling: true,
            },
          },
        }),
      });

      if (!res.ok) continue;
      const text = await res.text();
      const lines = text.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const parsed = JSON.parse(line.slice(6));
          const result = parsed.result;
          if (result) {
            const raw =
              result.structuredContent?.result ||
              (result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null);
            if (raw?.data?.results?.url) {
              return { imageUrl: raw.data.results.url, status: "success" };
            }
            if (raw?.data?.results?.output?.[0]?.url) {
              return { imageUrl: raw.data.results.output[0].url, status: "success" };
            }
            if (Array.isArray(raw?.data?.results) && raw.data.results[0]?.url) {
              return { imageUrl: raw.data.results[0].url, status: "success" };
            }
            if (raw?.data?.results) {
              return { data: raw.data.results, status: "success" };
            }
          }
        }
      }
    } catch (e) {
      console.warn(`[YouCam Polling] Attempt ${attempt} failed:`, e);
    }
  }

  return {};
}

