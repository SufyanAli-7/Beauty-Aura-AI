/**
 * YouCam MCP Client
 * Communicates with the YouCam Beauty MCP Server via Streamable HTTP (JSON-RPC over SSE).
 */

const YOUCAM_BEAUTY_URL = "https://mcp-api-01.makeupar.com/mcp/beauty";
const YOUCAM_FASHION_URL = "https://mcp-api-01.makeupar.com/mcp/fashion";
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
 * Supports both "beauty" and "fashion" servers.
 */
export async function callYouCamMCP(
  toolName: string,
  args: Record<string, any>,
  timeoutMs = 60000,
  serverType: "beauty" | "fashion" | string = "beauty"
): Promise<YouCamCallResult> {
  const targetUrl =
    serverType === "fashion"
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
    let lastStatus: string | null = null;

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const parsed = JSON.parse(line.slice(6));

          // Check notifications for task_id or status
          if (parsed.params?.data?.extra?.task_id) {
            fallbackTaskId = parsed.params.data.extra.task_id;
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
    let status = "success";

    if (finalResultData) {
      // FastMCP structuredContent
      const structuredResult = finalResultData.structuredContent?.result;
      if (structuredResult?.data?.results?.url) {
        extractedUrl = structuredResult.data.results.url;
      }
      if (structuredResult?.data?.results) {
        analysisData = structuredResult.data.results;
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
          if (innerJson.data?.results?.url) {
            extractedUrl = innerJson.data.results.url;
          }
          if (innerJson.data?.results) {
            analysisData = innerJson.data.results;
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

    // If task is still processing or needs manual polling
    if (!extractedUrl && !analysisData && taskId && (status === "running" || status === "processing")) {
      console.log(`[YouCam MCP] Task ${taskId} is still running. Initiating polling on ${targetUrl}...`);
      const polled = await pollTaskStatus(taskId, toolName, sessionId, 15, 3000, targetUrl);
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
  maxAttempts = 15,
  intervalMs = 3000,
  targetUrl = YOUCAM_BEAUTY_URL
): Promise<{ imageUrl?: string; data?: any; status?: string }> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    try {
      const toolHeaders: Record<string, string> = {
        Authorization: `Bearer ${YOUCAM_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      };
      if (sessionId) toolHeaders["mcp-session-id"] = sessionId;

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
              polling: false,
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

