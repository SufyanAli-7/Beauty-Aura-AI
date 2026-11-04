// scratch/verify-all-5-tools.mjs
const BASE_URL = "http://localhost:3000";

function create1x1WhiteMaskBase64() {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
}

async function callTool(name, payload) {
  console.log(`\n======================================================`);
  console.log(`[TESTING] ${name}`);
  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/api/extras/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "guest-user",
        ...payload,
      }),
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const data = await res.json();
    console.log(`HTTP Status: ${res.status} (${elapsed}s)`);
    console.log(`Success:`, data.success);
    if (data.success) {
      console.log(`Result URL:`, data.resultUrl);
      console.log(`Outputs:`, data.outputs?.length || 1);
      console.log(`Remaining Credits:`, data.remainingCredits);
      return { tool: name, ok: true, elapsed, url: data.resultUrl };
    } else {
      console.error(`Error:`, data.error);
      return { tool: name, ok: false, elapsed, error: data.error };
    }
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.error(`Network Exception (${elapsed}s):`, err.message);
    return { tool: name, ok: false, elapsed, error: err.message };
  }
}

async function run() {
  const results = [];

  // 1. Background Remover
  results.push(
    await callTool("1. AI Photo Background Remover", {
      toolId: "bg-remove",
      sourceImageUrl: "/extras-samples/bg-remove-product.jpg",
      options: { backdrop: "transparent" },
    })
  );

  // 2. Photo Colorize
  results.push(
    await callTool("2. AI Photo Colorize", {
      toolId: "colorize",
      sourceImageUrl: "/extras-samples/colorize-bw-01.jpg",
      options: { profile: "natural" },
    })
  );

  // 3. Photo Extender
  results.push(
    await callTool("3. AI Photo Extender", {
      toolId: "extender",
      sourceImageUrl: "/extras-samples/extender-landscape.jpg",
      options: { aspectRatio: "16:9" },
    })
  );

  // 4. Object Remover
  results.push(
    await callTool("4. AI Object Remover", {
      toolId: "object-remove",
      sourceImageUrl: "/extras-samples/object-remove-scene.jpg",
      maskImageUrl: create1x1WhiteMaskBase64(),
      options: { removeShadow: false },
    })
  );

  console.log(`\n======================================================`);
  console.log(`FINAL RESULTS SUMMARY:`);
  console.table(results);
}

run().catch(console.error);

