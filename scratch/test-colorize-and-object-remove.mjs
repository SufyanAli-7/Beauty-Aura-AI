// scratch/test-colorize-and-object-remove.mjs
const YOUCAM_CREATORS_URL = "https://mcp-api-01.makeupar.com/mcp/creators";
const YOUCAM_API_KEY =
  process.env.NEXT_YOUCAM_API_KEY ||
  "sk-XFFGN1JU3BgzDBhQ6tVn-9A0Qy5FHbscuZoTlo_UHVeyeH3cMe8dJi2qFj5PKBsp";

async function testTool(toolName, args) {
  console.log(`\n======================================================`);
  console.log(`TESTING TOOL: ${toolName}`);

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

  const start = Date.now();
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
  
  // Extract results
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.startsWith("data: ")) {
      try {
        const parsed = JSON.parse(line.slice(6));
        if (parsed.result) {
          console.log("Parsed Result:", JSON.stringify(parsed.result, null, 2));
        }
      } catch {}
    }
  }
}

async function run() {
  // Test Colorize
  await testTool("AI-Photo-Colorize", {
    request: {
      src_file_url: "https://m5294326.ap-southeast.insforge.app/api/storage/buckets/generated-images/objects/extras-assets/extras-samples-colorize-bw-01.jpg"
    },
    polling: true
  });
}

run().catch(console.error);

