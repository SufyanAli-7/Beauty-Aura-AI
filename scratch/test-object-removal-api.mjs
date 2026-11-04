// scratch/test-object-removal-api.mjs
import fs from "fs";

// Create a small 900x598 black PNG with a white box in memory or use a minimal base64 PNG
// We can use a 1x1 or a valid PNG buffer.
// Let's create a 100x100 PNG with a white center
function createTestMaskBase64() {
  // A minimal valid PNG: 8-bit grayscale 100x100
  // Instead of manual zlib, let's create a minimal SVG converted or 1-pixel white dot PNG scaled
  // Actually, standard base64 1x1 white png:
  // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
}

async function testObjectRemoval() {
  console.log("Calling /api/extras/generate for object-remove...");
  const res = await fetch("http://localhost:3000/api/extras/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: "guest-user",
      toolId: "object-remove",
      sourceImageUrl: "/extras-samples/object-remove-scene.jpg",
      maskImageUrl: createTestMaskBase64(),
      options: { removeShadow: false }
    })
  });

  const json = await res.json();
  console.log("Status:", res.status);
  console.log("Response:", JSON.stringify(json, null, 2));
}

testObjectRemoval().catch(console.error);

