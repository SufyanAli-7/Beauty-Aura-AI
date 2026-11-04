// scratch/test-youcam-direct.mjs
import fs from "fs";

const YOUCAM_CREATORS_URL = "https://mcp-api-01.makeupar.com/mcp/creators";
const YOUCAM_API_KEY =
  process.env.NEXT_YOUCAM_API_KEY ||
  "sk-XFFGN1JU3BgzDBhQ6tVn-9A0Qy5FHbscuZoTlo_UHVeyeH3cMe8dJi2qFj5PKBsp";

async function testTool(toolName, args) {
  console.log(`\n======================================================`);
  console.log(`TESTING TOOL: ${toolName}`);
  console.log(`Args:`, JSON.stringify(args, null, 2));

  // 1. Initialize
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
        clientInfo: { name: "BeautyAura-Test", version: "1.0.0" },
      },
    }),
  });

  const sessionId = initRes.headers.get("mcp-session-id");
  console.log(`Session ID: ${sessionId}`);

  // 2. Call tool
  const start = Date.now();
  const toolHeaders = {
    Authorization: `Bearer ${YOUCAM_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (sessionId) toolHeaders["mcp-session-id"] = sessionId;

  const res = await fetch(YOUCAM_CREATORS_URL, {
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
  });

  const duration = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`HTTP Status: ${res.status} (${duration}s)`);
  const text = await res.text();
  console.log(`Raw SSE Output:\n${text}`);

  return text;
}

async function run() {
  // Test Headshot with headshot-source-01.jpg
  await testTool("AI-Headshot-Generator", {
    request: {
      src_file_url: "https://m5294326.ap-southeast.insforge.app/api/storage/buckets/generated-images/objects/extras-assets/extras-samples-headshot-source-01.jpg",
      template_id: "male_dark_gray_suit",
      output_count: 1
    },
    polling: true
  });
}

run().catch(console.error);
