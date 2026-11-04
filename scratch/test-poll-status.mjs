// scratch/test-poll-status.mjs
const YOUCAM_CREATORS_URL = "https://mcp-api-01.makeupar.com/mcp/creators";
const YOUCAM_API_KEY =
  process.env.NEXT_YOUCAM_API_KEY ||
  "sk-XFFGN1JU3BgzDBhQ6tVn-9A0Qy5FHbscuZoTlo_UHVeyeH3cMe8dJi2qFj5PKBsp";

async function checkTask(taskId, taskType) {
  console.log(`Checking task ${taskId} (${taskType})...`);

  // Initialize
  const initRes = await fetch(YOUCAM_CREATORS_URL, {
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
        clientInfo: { name: "BeautyAura-Poll-Test", version: "1.0.0" },
      },
    }),
  });

  const sessionId = initRes.headers.get("mcp-session-id");
  console.log("Session ID:", sessionId);

  const res = await fetch(YOUCAM_CREATORS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${YOUCAM_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...(sessionId ? { "mcp-session-id": sessionId } : {}),
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 10,
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

  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Result:\n", text);
}

// Check the task from previous step: bA1040S5P493NkMjjOA8xEiIQpzDh5YEMWNg-hPFAQjUc22TAR3d04QLof_lz1L3
checkTask("bA1040S5P493NkMjjOA8xEiIQpzDh5YEMWNg-hPFAQjUc22TAR3d04QLof_lz1L3", "AI-Headshot-Generator");

