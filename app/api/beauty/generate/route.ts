import { NextRequest, NextResponse } from "next/server";
import { getInsforgeAdmin } from "@/lib/insforge";
import { callYouCamMCP } from "@/lib/youcam-client";

// Mapping of sample paths to InSForge storage keys
const SAMPLE_STORAGE_MAP: Record<string, string> = {
  "/normal-headshot/girl1.png": "samples/girl1.png",
  "/normal-headshot/girl2.png": "samples/girl2.png",
  "/normal-headshot/girl3.png": "samples/girl3.png",
  "/normal-headshot/girl4.png": "samples/girl4.png",
  "/normal-headshot/boy1.png": "samples/boy1.png",
  "/makeup-transfer/webp_makeup_transfer_01.png": "samples/makeup-transfer-1.png",
  "/makeup-transfer/webp_makeup_transfer_02_.png": "samples/makeup-transfer-2.png",
  "/makeup-transfer/webp_makeup_transfer_03.png": "samples/makeup-transfer-3.png",
  "/makeup-transfer/webp_makeup_transfer_04_21e14d1789.png": "samples/makeup-transfer-4.png",
  "/eye-lens/webp_eye_len_01.png": "samples/eye-lens-1.png",
  "/eye-lens/webp_eye_len_02.png": "samples/eye-lens-2.png",
  "/eye-lens/webp_eye_len_03.png": "samples/eye-lens-3.png",
  "/eye-lens/webp_eye_len_04.png": "samples/eye-lens-4.png",
  "/eye-lens/webp_eye_len_05_a2cb4f207a.png": "samples/eye-lens-5.png",
  "/eye-lens/webp_eye_len_06_a6bc280531.png": "samples/eye-lens-6.png",
};

const BUCKET_NAME = "generated-images";
const BASE_STORAGE_URL =
  process.env.NEXT_PUBLIC_INSFORGE_URL ||
  "https://m5294326.ap-southeast.insforge.app";

function getPublicStorageUrl(key: string): string {
  return `${BASE_STORAGE_URL}/api/storage/buckets/${BUCKET_NAME}/objects/${encodeURIComponent(
    key
  )}`;
}

/**
 * Ensures an image has a publicly accessible URL.
 * If given a data URI (base64 from user upload), uploads it to InSForge storage.
 */
async function resolveToPublicUrl(
  input: string,
  userId: string,
  prefix: string,
  admin: ReturnType<typeof getInsforgeAdmin>
): Promise<string> {
  // If it's one of our predefined sample images
  if (SAMPLE_STORAGE_MAP[input]) {
    return getPublicStorageUrl(SAMPLE_STORAGE_MAP[input]);
  }

  // If already an absolute HTTP/HTTPS URL
  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input;
  }

  // If base64 data URI (from user drag and drop / local upload)
  if (input.startsWith("data:image")) {
    const matches = input.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");
      const ext = mimeType.includes("png") ? "png" : "jpg";
      const key = `user-uploads/${userId}/${prefix}-${Date.now()}.${ext}`;

      const blob = new Blob([buffer], { type: mimeType });
      const { error: uploadErr } = await admin.storage
        .from(BUCKET_NAME)
        .upload(key, blob);

      if (uploadErr) {
        console.error("Failed to upload base64 image to storage:", uploadErr);
        throw new Error("Failed to store uploaded photo in cloud storage.");
      }

      return getPublicStorageUrl(key);
    }
  }

  // Fallback default sample
  return getPublicStorageUrl("samples/girl1.png");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, toolId, sourceImageUrl, lookData } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required." },
        { status: 400 }
      );
    }

    if (!toolId || !["transfer", "try-on", "eye-color"].includes(toolId)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing tool ID." },
        { status: 400 }
      );
    }

    const admin = getInsforgeAdmin();

    // 1. Check user credit balance (5 credits required per generation)
    const { data: userRecord, error: userError } = await admin.database
      .from("users")
      .select("credits, email, name")
      .eq("id", userId)
      .maybeSingle();

    if (userError || !userRecord) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    const currentCredits = userRecord.credits ?? 50;
    const REQUIRED_CREDITS = 5;

    if (currentCredits < REQUIRED_CREDITS) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient credits. You need ${REQUIRED_CREDITS} credits for this transformation, but have ${currentCredits} remaining.`,
          credits: currentCredits,
        },
        { status: 402 }
      );
    }

    // 2. Resolve source image to a public URL
    const publicSourceUrl = await resolveToPublicUrl(
      sourceImageUrl,
      userId,
      "source",
      admin
    );

    // 3. Dispatch to YouCam MCP
    let youcamResult;
    let toolName = "";

    if (toolId === "transfer") {
      toolName = "AI Makeup Transfer";
      const refInput =
        lookData?.refImageUrl || "/makeup-transfer/webp_makeup_transfer_01.png";
      const publicRefUrl = await resolveToPublicUrl(
        refInput,
        userId,
        "ref",
        admin
      );

      console.log("[Generate] Calling YouCam AI-Makeup-Transfer with:", {
        publicSourceUrl,
        publicRefUrl,
      });

      youcamResult = await callYouCamMCP("AI-Makeup-Transfer", {
        request: {
          src_file_url: publicSourceUrl,
          ref_file_url: publicRefUrl,
        },
        polling: true,
      });
    } else if (toolId === "try-on") {
      toolName = "AI Makeup Virtual Try-On";

      // If user selected a predefined template (from YouCam's curated template library)
      if (lookData?.type === "template" || lookData?.templateId) {
        const templateId = lookData.templateId || "all_golden_glam";
        console.log("[Generate] Calling YouCam AI-Look-Virtual-Try-On with:", {
          publicSourceUrl,
          templateId,
        });

        youcamResult = await callYouCamMCP("AI-Look-Virtual-Try-On", {
          request: {
            src_file_url: publicSourceUrl,
            template_id: templateId,
          },
          polling: true,
        });
      } else {
        // Custom cosmetic combination (Lipstick, Blush, Eyeliner)
        const lipstickColor = lookData?.lipstick || "#A31621";
        const lipstickTexture = lookData?.texture || "matte";
        const blushColor = lookData?.blush || "#e19f9f";

        const effects: any[] = [
          {
            category: "skin_smooth",
            skinSmoothColorIntensity: 50,
            skinSmoothStrength: 50,
          },
          {
            category: "lip_color",
            palettes: [
              {
                color: lipstickColor,
                colorIntensity: 85,
                texture: lipstickTexture,
                ...(lipstickTexture === "gloss" ? { gloss: 70 } : {}),
              },
            ],
            shape: { name: "plump" },
            style: { type: "full" },
          },
          {
            category: "blush",
            palettes: [
              {
                color: blushColor,
                colorIntensity: 65,
                texture: "matte",
              },
            ],
            pattern: { name: "1color1" },
          },
        ];

        console.log("[Generate] Calling YouCam AI-Makeup-Virtual-Try-On with effects:", effects);

        youcamResult = await callYouCamMCP("AI-Makeup-Virtual-Try-On", {
          request: {
            src_file_url: publicSourceUrl,
            effects,
          },
          polling: true,
        });
      }
    } else if (toolId === "eye-color") {
      toolName = "AI Eye Color Virtual Try-On";
      const lensInput = lookData?.lensImageUrl || "/eye-lens/webp_eye_len_01.png";
      const publicLensUrl = await resolveToPublicUrl(
        lensInput,
        userId,
        "lens",
        admin
      );
      const intensity = Math.min(100, Math.max(1, lookData?.intensity ?? 85));

      console.log("[Generate] Calling YouCam AI-Eye-Color-Lens-Virtual-Try-On with:", {
        publicSourceUrl,
        publicLensUrl,
        intensity,
      });

      youcamResult = await callYouCamMCP("AI-Eye-Color-Lens-Virtual-Try-On", {
        request: {
          version: "1.0",
          src_file_url: publicSourceUrl,
          ref_file_url: publicLensUrl,
          effect: {
            intensity,
            enlargement: 0,
            skin_smooth_color_intensity: 50,
            skin_smooth_strength: 50,
          },
        },
        polling: true,
      });
    }

    if (!youcamResult || !youcamResult.success || !youcamResult.imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            youcamResult?.error ||
            "YouCam generation failed. Please try a different photo or style.",
        },
        { status: 500 }
      );
    }

    // 4. Download the generated result image from YouCam S3
    const imageRes = await fetch(youcamResult.imageUrl);
    if (!imageRes.ok) {
      throw new Error(`Failed to download rendered image from YouCam (${imageRes.status})`);
    }
    const imageArrayBuffer = await imageRes.arrayBuffer();

    // 5. Save generated image permanently in InSForge Storage
    const storageKey = `transformations/${userId}/${Date.now()}-${toolId}.jpg`;
    const imageBlob = new Blob([imageArrayBuffer], { type: "image/jpeg" });

    const { error: storageError } = await admin.storage
      .from(BUCKET_NAME)
      .upload(storageKey, imageBlob);

    if (storageError) {
      console.warn("Storage upload warning, fallback to direct url:", storageError);
    }

    const permanentInsforgeUrl = getPublicStorageUrl(storageKey);

    // 6. Deduct 5 credits from the user's account
    const newCredits = Math.max(0, currentCredits - REQUIRED_CREDITS);
    await admin.database
      .from("users")
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq("id", userId);

    // 7. Insert transformation record into database
    const { data: transformation, error: dbErr } = await admin.database
      .from("transformations")
      .insert([
        {
          user_id: userId,
          tool_id: toolId,
          tool_name: toolName,
          source_image_url: publicSourceUrl,
          result_image_url: permanentInsforgeUrl,
          storage_key: storageKey,
          look_name: lookData?.lookName || "Custom Transformation",
          settings: lookData || {},
          task_id: youcamResult.taskId || null,
          status: "completed",
          credits_deducted: REQUIRED_CREDITS,
        },
      ])
      .select()
      .maybeSingle();

    if (dbErr) {
      console.error("Database insert error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      resultUrl: permanentInsforgeUrl,
      youcamUrl: youcamResult.imageUrl,
      transformation,
      remainingCredits: newCredits,
    });
  } catch (error: any) {
    console.error("[API Beauty Generate Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during generation.",
      },
      { status: 500 }
    );
  }
}
