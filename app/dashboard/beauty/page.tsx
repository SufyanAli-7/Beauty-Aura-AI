"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Wand2,
  Sparkles,
  Upload,
  Zap,
  CheckCircle2,
  RotateCcw,
  Download,
  Check,
  RefreshCw,
  Columns2,
  Info,
  Sliders,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

// 1. Tool Options
export type BeautyToolId = "transfer" | "try-on" | "eye-color";

interface BeautyTool {
  id: BeautyToolId;
  title: string;
  tagline: string;
  badge: string;
  image: string;
  description: string;
}

const BEAUTY_TOOLS: BeautyTool[] = [
  {
    id: "transfer",
    title: "AI Makeup Transfer",
    tagline: "Extract & apply look from reference",
    badge: "Viral Trend",
    image: "/ai-photo-editing-images/ai-makeup-transfer.jpg",
    description: "Extract lipstick, eyeliner, and contour from any inspiration picture and apply it seamlessly.",
  },
  {
    id: "try-on",
    title: "AI Makeup Virtual Try-On",
    tagline: "Instant cosmetics & glam makeover",
    badge: "Popular",
    image: "/ai-photo-editing-images/ai-makeup-try-on.jpg",
    description: "Try curated red carpet aesthetics, soft Parisian glam, glass-skin blush, and designer lipstick shades.",
  },
  {
    id: "eye-color",
    title: "AI Eye Color Virtual Try-On",
    tagline: "Realistic optical contact lenses",
    badge: "HD Optics",
    image: "/ai-photo-editing-images/eye-color-try-on.webp",
    description: "Transform eye iris color with natural optical lens patterns: Hazel, Sapphire, Emerald, and Violet.",
  },
];

// 2. Sample Portrait Images (Normal Headshots)
interface TestImage {
  id: string;
  name: string;
  src: string;
  gender: string;
}

const TEST_PORTRAITS: TestImage[] = [
  { id: "girl1", name: "Elena", src: "/normal-headshot/girl1.png", gender: "Female" },
  { id: "girl2", name: "Sophia", src: "/normal-headshot/girl2.png", gender: "Female" },
  { id: "girl3", name: "Amara", src: "/normal-headshot/girl3.png", gender: "Female" },
  { id: "girl4", name: "Mia", src: "/normal-headshot/girl4.png", gender: "Female" },
  { id: "boy1", name: "Lucas", src: "/normal-headshot/boy1.png", gender: "Male" },
];

// 3. Dynamic Looks per Tool
// A. Makeup Transfer Reference Looks
const TRANSFER_LOOKS = [
  {
    id: "ref-1",
    name: "Golden Glamour",
    src: "/makeup-transfer/webp_makeup_transfer_01.png",
    tone: "Warm Bronze & Gloss",
  },
  {
    id: "ref-2",
    name: "Smokey Velvet",
    src: "/makeup-transfer/webp_makeup_transfer_02_.png",
    tone: "Dramatic Wing & Matte",
  },
  {
    id: "ref-3",
    name: "Sunset Coral",
    src: "/makeup-transfer/webp_makeup_transfer_03.png",
    tone: "Peachy Glow & Radiance",
  },
  {
    id: "ref-4",
    name: "Editorial Crimson",
    src: "/makeup-transfer/webp_makeup_transfer_04_21e14d1789.png",
    tone: "Bold Red Lip & Sculpt",
  },
];

// B. Makeup Try-On: Curated Look Templates
const CURATED_LOOK_TEMPLATES = [
  {
    id: "all_golden_glam",
    name: "Golden Glam",
    badge: "Red Carpet",
    thumb: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA191028-0005/48/191014_newyear_collection_01_store_thumb.jpg",
    description: "Golden champagne shimmer, bronze contour & warm glossy lips.",
  },
  {
    id: "all_velour",
    name: "Velour",
    badge: "Editorial",
    thumb: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA241030-0070/63/241107_NewYear_free_01_store_thumb.jpg",
    description: "Deep velvety matte crimson lips with soft winged liner.",
  },
  {
    id: "all_blush_rush",
    name: "Blush Rush",
    badge: "Fresh Glow",
    thumb: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA241030-0070/65/241107_Newyear_02_store_thumb.jpg",
    description: "Rosy cheek apple highlight, puppy eyeliner & glass skin glow.",
  },
  {
    id: "all_gilded_glam",
    name: "Gilded Glam",
    badge: "High Glam",
    thumb: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA191028-0005/41/191014_newyear_collection_04_store_thumb.jpg",
    description: "Luminous gold pigments with sculptured cheekbones and nude satin lips.",
  },
  {
    id: "all_galaxy_glow",
    name: "Galaxy Glow",
    badge: "Luminous",
    thumb: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA231108-0047/28/231116_NewYear_free_02_store_thumb.jpg",
    description: "Celestial highlighter accents, soft smokey eye & berry tint.",
  },
  {
    id: "all_silver_shine",
    name: "Silver Shine",
    badge: "Fashion Week",
    thumb: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA240820-0002/1/191014_newyear_collection_03_store_thumb.jpg",
    description: "Sleek metallic lid shimmer with modern Parisian contours.",
  },
  {
    id: "all_candy",
    name: "Candy Chic",
    badge: "Doll Glow",
    thumb: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA191209-0017/2/181207_Holiday_02_store_thumb.jpg",
    description: "Sweet bubblegum pink cheeks and glossy hydrated gradient pout.",
  },
  {
    id: "all_frosty",
    name: "Frosty Crystal",
    badge: "Clean Glam",
    thumb: "https://cdn.perfectcorp.com/store/makeupstore/MSR/PFA191209-0017/1/181207_Holiday_01_store_thumb.jpg",
    description: "Iced champagne lid wash, feathered brows & hydrated nude balm.",
  },
];

// C. Eye Color Contact Lens Options (from public/eye-lens)
const EYE_LENSES = [
  {
    id: "lens-1",
    name: "Hazel Olive",
    src: "/eye-lens/webp_eye_len_01.png",
    shade: "Olive Gold",
  },
  {
    id: "lens-2",
    name: "Rose Petal",
    src: "/eye-lens/webp_eye_len_02.png",
    shade: "Soft Rose",
  },
  {
    id: "lens-3",
    name: "Galaxy Violet",
    src: "/eye-lens/webp_eye_len_03.png",
    shade: "Deep Violet",
  },
  {
    id: "lens-4",
    name: "Amber Gold",
    src: "/eye-lens/webp_eye_len_04.png",
    shade: "Sunburst Honey",
  },
  {
    id: "lens-5",
    name: "Lavender Mist",
    src: "/eye-lens/webp_eye_len_05_a2cb4f207a.png",
    shade: "Pastel Lilac",
  },
  {
    id: "lens-6",
    name: "Ocean Aqua",
    src: "/eye-lens/webp_eye_len_06_a6bc280531.png",
    shade: "Deep Azure",
  },
];

// Beauty AI Pipeline Stages
const BEAUTY_STAGES = [
  { id: "landmarks", label: "Facial Landmark Map", detail: "Detecting facial contours, lips & iris bounds..." },
  { id: "pigments", label: "Cosmetic Synthesis", detail: "Applying pigment transfer & optical shade match..." },
  { id: "blending", label: "Texture & Skin Blend", detail: "Preserving natural pore texture & micro-lighting..." },
  { id: "rendering", label: "4K UHD Export", detail: "Finalizing lossless high-resolution render..." },
];

export default function BeautyStudioPage() {
  const { user, credits, setCredits } = useAuth();

  // 1. Tool Selection
  const [selectedTool, setSelectedTool] = useState<BeautyToolId>("transfer");

  // 2. Source Image State - Upload Photo is FIRST
  const [sourceTab, setSourceTab] = useState<"upload" | "test">("upload");
  const [selectedSource, setSelectedSource] = useState<string>("/normal-headshot/girl1.png");
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Look Selection State
  // A. Transfer
  const [selectedTransferLook, setSelectedTransferLook] = useState<string>(
    "/makeup-transfer/webp_makeup_transfer_01.png"
  );
  const [customRefPreview, setCustomRefPreview] = useState<string | null>(null);
  const customRefInputRef = useRef<HTMLInputElement>(null);

  // B. Try-On (Templates vs Custom)
  const [tryOnTab, setTryOnTab] = useState<"templates" | "custom">("templates");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("all_golden_glam");
  const [selectedLipstick, setSelectedLipstick] = useState<string>("#A31621");
  const [selectedLipTexture, setSelectedLipTexture] = useState<"matte" | "gloss" | "satin">("matte");
  const [selectedBlush, setSelectedBlush] = useState<string>("#e19f9f");

  // C. Eye Lens
  const [selectedEyeLens, setSelectedEyeLens] = useState<string>("lens-1");
  const [lensIntensity, setLensIntensity] = useState<number>(85);

  // 4. Generation & Result State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStageIndex, setGenerationStageIndex] = useState<number>(0);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"result" | "split" | "original">("result");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Reference & state to match Left Options (1, 2, 3) scroll container height with Live Studio Canvas
  const canvasCardRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Professional AI Generation Progress & Milestone Simulator
  useEffect(() => {
    if (!isGenerating) {
      setGenerationProgress(0);
      setGenerationStageIndex(0);
      return;
    }

    setGenerationProgress(12);
    setGenerationStageIndex(0);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 96) return 96;
        const inc = prev < 35 ? 7 : prev < 70 ? 4 : prev < 88 ? 2 : 1;
        const next = Math.min(96, prev + inc);
        if (next >= 75) setGenerationStageIndex(3);
        else if (next >= 50) setGenerationStageIndex(2);
        else if (next >= 25) setGenerationStageIndex(1);
        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    if (!canvasCardRef.current) return;

    const updateHeight = () => {
      if (canvasCardRef.current) {
        setCanvasHeight(canvasCardRef.current.getBoundingClientRect().height);
      }
    };

    updateHeight();

    const ro = new ResizeObserver(() => {
      updateHeight();
    });

    ro.observe(canvasCardRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [hasGenerated, isGenerating, viewMode]);

  // Active Tool Object
  const currentTool = BEAUTY_TOOLS.find((t) => t.id === selectedTool) || BEAUTY_TOOLS[0];

  // Effective Source Image
  const activeSourceImage =
    sourceTab === "upload" && uploadedPreview ? uploadedPreview : selectedSource;

  // Active Reference Image for Transfer
  const activeTransferRef = customRefPreview || selectedTransferLook;

  // Handle Split Slider Dragging
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  // Window listeners for fluid slider drag tracking
  useEffect(() => {
    if (!isDraggingSlider) return;

    const onMouseMove = (e: MouseEvent) => {
      handleSliderMove(e.clientX);
    };
    const onMouseUp = () => {
      setIsDraggingSlider(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDraggingSlider]);

  // Handle Source File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPreview(reader.result as string);
        setSourceTab("upload");
        setHasGenerated(false);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Drag & Drop Source
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPreview(reader.result as string);
        setSourceTab("upload");
        setHasGenerated(false);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Custom Reference Photo for Transfer
  const handleCustomRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomRefPreview(reader.result as string);
        setHasGenerated(false);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct File Download Handler (downloads directly to user disk)
  const handleDownloadResult = async () => {
    if (!generatedImageUrl) return;
    try {
      setIsDownloading(true);
      const filename = `beautyaura-${selectedTool}-${Date.now()}.jpg`;
      const response = await fetch(generatedImageUrl);
      if (!response.ok) throw new Error("Network fetch failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (err) {
      console.warn("Direct blob download error, attempting canvas fallback:", err);
      try {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = `beautyaura-${selectedTool}-${Date.now()}.jpg`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(blobUrl);
                }, 1000);
              }
            }, "image/jpeg", 0.98);
          }
        };
        img.src = generatedImageUrl;
      } catch {
        window.open(generatedImageUrl, "_blank");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Run Real AI Generation Workflow
  const handleGenerate = async () => {
    setErrorMessage(null);

    // Check credits
    if (credits < 5) {
      setErrorMessage(
        "You do not have enough credits (5 credits required). Please refill your credits in Billing."
      );
      return;
    }

    setIsGenerating(true);
    setGenerationStep("Initializing Beauty AI Engine...");

    if (typeof window !== "undefined" && window.innerWidth < 1024 && canvasCardRef.current) {
      canvasCardRef.current.scrollIntoView({ behavior: "smooth" });
    }

    try {
      // Step A: Prepare Look Payload based on selected tool
      let lookData: any = {};

      if (selectedTool === "transfer") {
        const selectedLookObj = TRANSFER_LOOKS.find((l) => l.src === selectedTransferLook);
        lookData = {
          refImageUrl: activeTransferRef,
          lookName: customRefPreview ? "Custom Inspiration Reference" : selectedLookObj?.name || "Golden Glamour",
        };
      } else if (selectedTool === "try-on") {
        if (tryOnTab === "templates") {
          const tmpl = CURATED_LOOK_TEMPLATES.find((t) => t.id === selectedTemplateId);
          lookData = {
            type: "template",
            templateId: selectedTemplateId,
            lookName: tmpl?.name || "Golden Glam",
          };
        } else {
          lookData = {
            type: "custom",
            lipstick: selectedLipstick,
            texture: selectedLipTexture,
            blush: selectedBlush,
            lookName: "Custom Cosmetic Palette",
          };
        }
      } else if (selectedTool === "eye-color") {
        const lensObj = EYE_LENSES.find((l) => l.id === selectedEyeLens);
        lookData = {
          lensImageUrl: lensObj?.src || "/eye-lens/webp_eye_len_01.png",
          intensity: lensIntensity,
          lookName: `${lensObj?.name || "Hazel Olive"} (${lensIntensity}%)`,
        };
      }

      setGenerationStep("Synthesizing facial features & optical layers...");

      const userId = user?.id || "guest-user";

      // Step B: Call backend API route
      const res = await fetch("/api/beauty/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          toolId: selectedTool,
          sourceImageUrl: activeSourceImage,
          lookData,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Generation request failed.");
      }

      setGenerationStep("Finalizing 4K studio render...");
      setGenerationProgress(100);

      // Step C: Update state with permanent URL
      setGeneratedImageUrl(data.resultUrl || data.youcamUrl);
      if (typeof data.remainingCredits === "number") {
        setCredits(data.remainingCredits);
      }

      setHasGenerated(true);
      setViewMode("result");
    } catch (err: any) {
      console.error("Beauty Studio Generation error:", err);
      setErrorMessage(err.message || "Failed to generate transformation. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  // Reset to initial state
  const handleReset = () => {
    setHasGenerated(false);
    setGeneratedImageUrl("");
    setViewMode("result");
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6 pb-2">
      {/* Studio Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <Wand2 className="h-3.5 w-3.5" />
            <span>Beauty &amp; Aesthetics Lab</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            Beauty AI Studio
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Instant beauty makeover, viral makeup transfer &amp; optical iris simulation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/80 px-3.5 py-1 text-xs font-bold text-zinc-800">
            <Zap className="h-3.5 w-3.5 text-[#FF5500] fill-current" />
            <span>5 Credits / render</span>
          </div>
          <div className="text-xs font-bold text-zinc-500">
            Balance: <span className="text-zinc-900 font-black">{credits}</span>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs font-semibold text-rose-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          {credits < 5 && (
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1 font-bold text-white hover:bg-rose-700 transition"
            >
              <span>Refill</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}

      {/* Main Two-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* =========================================================================
            LEFT COLUMN: Controls & Customization (Scrollable Options 1, 2, 3)
           ========================================================================= */}
        <div
          style={isDesktop && canvasHeight ? { maxHeight: `${canvasHeight}px` } : undefined}
          className="order-1 lg:order-none lg:col-span-5 xl:col-span-5 space-y-5 lg:overflow-y-auto lg:pr-2.5 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-stone-100/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-200/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5500]/70 transition-colors"
        >
          {/* 1. CHOOSE & CUSTOMIZE: 3 Selectable Tool Cards */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  1
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Choose Beauty AI Tool
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#FF5500]">
                3 Features
              </span>
            </div>

            {/* Selectable Cards */}
            <div className="space-y-2.5">
              {BEAUTY_TOOLS.map((tool) => {
                const isActive = selectedTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      setSelectedTool(tool.id);
                      setHasGenerated(false);
                      setErrorMessage(null);
                    }}
                    className={cn(
                      "w-full group relative flex items-center gap-3.5 rounded-2xl p-3 text-left transition-all duration-200 border cursor-pointer",
                      isActive
                        ? "bg-gradient-to-r from-orange-50 via-amber-50/50 to-white border-[#FF5500] ring-2 ring-[#FF5500]/25 shadow-md shadow-orange-500/10"
                        : "bg-stone-50/60 border-orange-100 hover:border-orange-200 hover:bg-orange-50/40"
                    )}
                  >
                    {/* Tool Thumbnail Image */}
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-orange-200/70 bg-stone-100 shadow-2xs">
                      <Image
                        src={tool.image}
                        alt={tool.title}
                        fill
                        sizes="56px"
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Tool Information */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-xs font-black text-zinc-900">
                          {tool.title}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider shrink-0",
                            isActive
                              ? "bg-[#FF5500] text-white"
                              : "bg-orange-100 text-orange-700"
                          )}
                        >
                          {tool.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate font-medium">
                        {tool.tagline}
                      </p>
                    </div>

                    {/* Active Check Indicator */}
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all",
                        isActive
                          ? "bg-[#FF5500] text-white shadow-xs"
                          : "border border-zinc-200 text-transparent group-hover:border-orange-300"
                      )}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SOURCE IMAGE SECTION */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  2
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Source Portrait Image
                </h3>
              </div>
              <span className="text-[11px] font-medium text-zinc-400">
                Front-facing portrait
              </span>
            </div>

            {/* Toggle: Upload Photo is FIRST, Sample Portraits is SECOND */}
            <div className="flex rounded-xl bg-stone-100/80 p-1 border border-orange-100/60">
              <button
                type="button"
                onClick={() => setSourceTab("upload")}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer text-center",
                  sourceTab === "upload"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                Upload Photo
              </button>
              <button
                type="button"
                onClick={() => setSourceTab("test")}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer text-center",
                  sourceTab === "test"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                Sample Portraits (5)
              </button>
            </div>

            {/* Tab 1: Upload Image Zone (First) */}
            {sourceTab === "upload" && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200/90 bg-stone-50/60 p-6 text-center hover:border-orange-400 hover:bg-orange-50/30 transition cursor-pointer"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-[#FF5500] mb-2.5 shadow-2xs">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-zinc-900">
                  Click to browse or drag and drop
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  PNG, JPG or WebP up to 10MB
                </p>
              </div>
            )}

            {/* Tab 2: Sample Portraits Grid */}
            {sourceTab === "test" && (
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2">
                  {TEST_PORTRAITS.map((portrait) => {
                    const isSelected = selectedSource === portrait.src && !uploadedPreview;
                    return (
                      <button
                        key={portrait.id}
                        type="button"
                        onClick={() => {
                          setSelectedSource(portrait.src);
                          setUploadedPreview(null);
                          setHasGenerated(false);
                          setErrorMessage(null);
                        }}
                        className="group flex flex-col items-center text-center cursor-pointer transition-all"
                        title={portrait.name}
                      >
                        <div
                          className={cn(
                            "relative aspect-[3/4] w-full overflow-hidden rounded-xl border bg-stone-100 transition-all shadow-xs",
                            isSelected
                              ? "border-[#FF5500] ring-2 ring-[#FF5500] shadow-sm scale-102"
                              : "border-orange-100 hover:border-orange-300 opacity-90 hover:opacity-100"
                          )}
                        >
                          <Image
                            src={portrait.src}
                            alt={portrait.name}
                            fill
                            sizes="90px"
                            className="object-cover object-center"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-2xs">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <span
                          className={cn(
                            "mt-1 text-[11px] font-bold truncate transition-colors",
                            isSelected
                              ? "text-[#FF5500]"
                              : "text-zinc-600 group-hover:text-zinc-900"
                          )}
                        >
                          {portrait.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Image Preview Pill */}
            <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-stone-50/80 p-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-orange-200 bg-white">
                  <Image
                    src={activeSourceImage}
                    alt="Selected Source"
                    fill
                    sizes="48px"
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-zinc-900 truncate">
                    {sourceTab === "upload" && uploadedPreview
                      ? "Uploaded Custom Photo"
                      : "Selected Portrait (" +
                        (TEST_PORTRAITS.find((p) => p.src === selectedSource)?.name || "Elena") +
                        ")"}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    Portrait Detected (Face Centered)
                  </span>
                </div>
              </div>

              {sourceTab === "upload" && uploadedPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setUploadedPreview(null);
                    setSelectedSource("/normal-headshot/girl1.png");
                  }}
                  className="text-xs font-bold text-zinc-400 hover:text-rose-600 transition px-2 py-1 cursor-pointer shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 3. CHOOSE LOOK SECTION (Dynamic per Selected Tool) */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  3
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Choose Look
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#FF5500]">
                {selectedTool === "transfer"
                  ? "Reference Looks"
                  : selectedTool === "try-on"
                  ? "Curated Looks & Custom"
                  : "Lens Palette & Opacity"}
              </span>
            </div>

            {/* A. DYNAMIC OPTIONS FOR: AI Makeup Transfer */}
            {selectedTool === "transfer" && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500 font-medium">
                  Select an editorial reference look to extract makeup tones, or upload your own inspiration image:
                </p>

                {/* Grid of editorial reference looks */}
                <div className="grid grid-cols-2 gap-2.5">
                  {TRANSFER_LOOKS.map((look) => {
                    const isSelected = selectedTransferLook === look.src && !customRefPreview;
                    return (
                      <button
                        key={look.id}
                        type="button"
                        onClick={() => {
                          setSelectedTransferLook(look.src);
                          setCustomRefPreview(null);
                          setHasGenerated(false);
                          setErrorMessage(null);
                        }}
                        className={cn(
                          "group relative flex flex-col overflow-hidden rounded-2xl border p-2 text-left transition-all cursor-pointer",
                          isSelected
                            ? "border-[#FF5500] ring-2 ring-[#FF5500]/25 bg-orange-50/50 shadow-xs"
                            : "border-orange-100 bg-stone-50/60 hover:border-orange-200"
                        )}
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white mb-2">
                          <Image
                            src={look.src}
                            alt={look.name}
                            fill
                            sizes="140px"
                            className="object-cover object-top transition-transform group-hover:scale-105"
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-xs">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-zinc-900 truncate">
                          {look.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate">
                          {look.tone}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Upload Custom Reference Look */}
                <div className="pt-2 border-t border-orange-100/80">
                  <input
                    ref={customRefInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleCustomRefChange}
                  />
                  {customRefPreview ? (
                    <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50/60 p-2">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={customRefPreview}
                          alt="Custom Reference"
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="text-xs font-bold text-zinc-900">
                          Custom Look Selected
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCustomRefPreview(null)}
                        className="text-xs font-semibold text-zinc-400 hover:text-rose-600 px-2"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => customRefInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-orange-200 py-2.5 text-xs font-bold text-zinc-700 hover:border-orange-400 hover:bg-orange-50/50 transition cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5 text-[#FF5500]" />
                      <span>Upload Custom Look Inspiration</span>
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-1.5 rounded-xl bg-orange-50/50 p-2.5 text-[11px] text-zinc-500">
                  <Info className="h-3.5 w-3.5 shrink-0 text-[#FF5500] mt-0.5" />
                  <span>
                    Beauty AI Makeup Transfer extracts lipstick pigments, contouring, and eyeliner geometry from the reference look and blends them to your facial structure.
                  </span>
                </div>
              </div>
            )}

            {/* B. DYNAMIC OPTIONS FOR: AI Makeup Virtual Try-On */}
            {selectedTool === "try-on" && (
              <div className="space-y-4">
                {/* Sub-tabs: Curated Looks vs Custom Palette */}
                <div className="flex rounded-xl bg-stone-100/80 p-1 border border-orange-100/60">
                  <button
                    type="button"
                    onClick={() => setTryOnTab("templates")}
                    className={cn(
                      "flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer text-center",
                      tryOnTab === "templates"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    Curated Looks (8)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTryOnTab("custom")}
                    className={cn(
                      "flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer text-center",
                      tryOnTab === "custom"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    Custom Palette
                  </button>
                </div>

                {/* Sub-tab 1: Curated Templates */}
                {tryOnTab === "templates" && (
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-500 font-medium">
                      Signature studio beauty looks with premium cosmetics:
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {CURATED_LOOK_TEMPLATES.map((tmpl) => {
                        const isSelected = selectedTemplateId === tmpl.id;
                        return (
                          <button
                            key={tmpl.id}
                            type="button"
                            onClick={() => {
                              setSelectedTemplateId(tmpl.id);
                              setHasGenerated(false);
                              setErrorMessage(null);
                            }}
                            className={cn(
                              "relative flex flex-col rounded-2xl border p-2 text-left transition-all cursor-pointer overflow-hidden",
                              isSelected
                                ? "border-[#FF5500] ring-2 ring-[#FF5500]/25 bg-orange-50/50 shadow-xs"
                                : "border-orange-100 bg-stone-50/60 hover:border-orange-200"
                            )}
                          >
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white mb-1.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={tmpl.thumb}
                                alt={tmpl.name}
                                className="h-full w-full object-cover object-top"
                              />
                              <span className="absolute bottom-1 right-1 rounded-full bg-black/75 px-1.5 py-0.2 text-[8px] font-bold text-white">
                                {tmpl.badge}
                              </span>
                              {isSelected && (
                                <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-xs">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-zinc-900 truncate">
                              {tmpl.name}
                            </h4>
                            <p className="text-[10px] text-zinc-500 line-clamp-1">
                              {tmpl.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-tab 2: Custom Cosmetic Palette */}
                {tryOnTab === "custom" && (
                  <div className="space-y-3.5">
                    {/* Lipstick Shade Palette */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                        <span>Lipstick Shade</span>
                        <span className="text-[10px] text-zinc-400">Click to pick</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {[
                          { name: "Scarlet Crimson", hex: "#A31621" },
                          { name: "French Nude", hex: "#C47B66" },
                          { name: "Petal Pink", hex: "#E36577" },
                          { name: "Warm Mocha", hex: "#7B4B3A" },
                          { name: "Plum Berry", hex: "#631A33" },
                          { name: "Coral Sunset", hex: "#E86A53" },
                        ].map((shade) => (
                          <button
                            key={shade.name}
                            type="button"
                            title={shade.name}
                            onClick={() => {
                              setSelectedLipstick(shade.hex);
                              setHasGenerated(false);
                            }}
                            className={cn(
                              "h-8 w-8 rounded-full transition-transform hover:scale-110 cursor-pointer shadow-xs",
                              selectedLipstick === shade.hex
                                ? "ring-2 ring-offset-2 ring-[#FF5500] scale-110"
                                : "ring-1 ring-black/10"
                            )}
                            style={{ backgroundColor: shade.hex }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Lipstick Finish Texture */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-zinc-700">Lip Texture Finish</div>
                      <div className="flex rounded-xl bg-stone-100 p-1">
                        {(["matte", "gloss", "satin"] as const).map((tex) => (
                          <button
                            key={tex}
                            type="button"
                            onClick={() => {
                              setSelectedLipTexture(tex);
                              setHasGenerated(false);
                            }}
                            className={cn(
                              "flex-1 rounded-lg py-1 text-xs font-bold capitalize transition cursor-pointer text-center",
                              selectedLipTexture === tex
                                ? "bg-white text-zinc-900 shadow-2xs"
                                : "text-zinc-500 hover:text-zinc-900"
                            )}
                          >
                            {tex}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Blush Shade Palette */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-zinc-700">Cheek Blush Tone</div>
                      <div className="flex items-center gap-2.5">
                        {[
                          { name: "Peachy Rose", hex: "#e19f9f" },
                          { name: "Soft Coral", hex: "#f4a5ae" },
                          { name: "Terracotta Glow", hex: "#b27a59" },
                          { name: "Warm Nude", hex: "#c98a8a" },
                        ].map((b) => (
                          <button
                            key={b.name}
                            type="button"
                            title={b.name}
                            onClick={() => {
                              setSelectedBlush(b.hex);
                              setHasGenerated(false);
                            }}
                            className={cn(
                              "h-7 w-7 rounded-full transition-transform hover:scale-110 cursor-pointer shadow-xs",
                              selectedBlush === b.hex
                                ? "ring-2 ring-offset-2 ring-[#FF5500] scale-110"
                                : "ring-1 ring-black/10"
                            )}
                            style={{ backgroundColor: b.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* C. DYNAMIC OPTIONS FOR: AI Eye Color Virtual Try-On */}
            {selectedTool === "eye-color" && (
              <div className="space-y-3.5">
                <p className="text-xs text-zinc-500 font-medium">
                  Select a realistic optical lens pattern to simulate on your iris:
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  {EYE_LENSES.map((lens) => {
                    const isSelected = selectedEyeLens === lens.id;
                    return (
                      <button
                        key={lens.id}
                        type="button"
                        onClick={() => {
                          setSelectedEyeLens(lens.id);
                          setHasGenerated(false);
                          setErrorMessage(null);
                        }}
                        className={cn(
                          "group relative flex flex-col items-center rounded-2xl border p-2.5 transition-all cursor-pointer text-center",
                          isSelected
                            ? "border-[#FF5500] ring-2 ring-[#FF5500]/25 bg-orange-50/50 shadow-xs"
                            : "border-orange-100 bg-stone-50/60 hover:border-orange-200 hover:bg-stone-50"
                        )}
                      >
                        {/* Lens Optical Disc */}
                        <div className="relative h-13 w-13 overflow-hidden rounded-full border border-orange-200/80 bg-zinc-950 mb-1.5 shadow-xs flex items-center justify-center p-1">
                          <Image
                            src={lens.src}
                            alt={lens.name}
                            fill
                            sizes="52px"
                            className="object-contain transition-transform group-hover:scale-115"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-zinc-900 truncate w-full">
                          {lens.name}
                        </span>
                        <span className="text-[9px] text-zinc-400 truncate w-full">
                          {lens.shade}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-2xs">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Lens Opacity / Intensity Slider */}
                <div className="rounded-2xl border border-orange-100 bg-stone-50/60 p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5 text-[#FF5500]" />
                      <span>Lens Blend Intensity</span>
                    </span>
                    <span className="font-mono text-[#FF5500]">{lensIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={lensIntensity}
                    onChange={(e) => {
                      setLensIntensity(Number(e.target.value));
                      setHasGenerated(false);
                    }}
                    className="w-full accent-[#FF5500] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                    <span>Subtle tint (20%)</span>
                    <span>Vibrant contact lens (100%)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Generation CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] py-3.5 px-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 hover:shadow-orange-500/35 transition cursor-pointer disabled:opacity-50 whitespace-nowrap overflow-hidden"
              >
                {isGenerating ? (
                  <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
                    <span>Generating Transformation...</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span>Generate Transformation (5 Credits)</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Generated Result / Studio Viewport
           ========================================================================= */}
        <div className="order-2 lg:order-none lg:col-span-7 xl:col-span-7 flex flex-col space-y-4 lg:sticky lg:top-24">
          <div
            ref={canvasCardRef}
            className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-white p-4 sm:p-5 shadow-lg flex flex-col justify-between min-h-[580px] sm:min-h-[660px]"
          >
            {/* Viewport Top Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100/80 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                  {currentTool.title}
                </span>
                <span className="text-xs font-bold text-zinc-800 hidden sm:inline">
                  {hasGenerated ? "Ready for Export" : "Live Studio Canvas"}
                </span>
              </div>

              {/* View Mode Switcher (When result has generated) */}
              {hasGenerated ? (
                <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-stone-50/80 p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("result")}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer",
                      viewMode === "result"
                        ? "bg-[#FF5500] text-white shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    )}
                  >
                    Result
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("split")}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer",
                      viewMode === "split"
                        ? "bg-[#FF5500] text-white shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    )}
                  >
                    <Columns2 className="h-3 w-3" />
                    <span>Compare</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("original")}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer",
                      viewMode === "original"
                        ? "bg-[#FF5500] text-white shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    )}
                  >
                    Original
                  </button>
                </div>
              ) : (
                <div className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  <span>4K Lossless Rendering Engine</span>
                </div>
              )}
            </div>

            {/* Viewport Main Display Canvas */}
            <div className="relative my-4 flex-1 flex items-center justify-center min-h-[460px] sm:min-h-[520px] rounded-2xl bg-gradient-to-b from-stone-50 to-orange-50/20 border border-orange-100 overflow-hidden">
              {/* CASE 1: Generating Loading State - World-Class Professional Studio Loader */}
              {isGenerating && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md p-4 sm:p-6 overflow-hidden">
                  {/* Subtle Background Glow Aura */}
                  <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-gradient-to-tr from-orange-400/20 via-[#FF5500]/15 to-amber-300/20 blur-3xl animate-pulse" />

                  {/* Central Animated Content Card */}
                  <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-4 sm:space-y-5">
                    {/* Top Studio Engine Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1 text-[11px] font-extrabold text-[#FF5500] shadow-2xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5500]"></span>
                      </span>
                      <span>AI Neural Beauty Engine Active</span>
                    </div>

                    {/* Dynamic Tool Icon with Orbiting Rings & Glow */}
                    <div className="relative my-1 sm:my-2 flex items-center justify-center">
                      {/* Outer Rotating Dashed Ring */}
                      <div className="absolute h-28 w-28 rounded-full border-2 border-dashed border-orange-300/80 animate-spin [animation-duration:12s]" />

                      {/* Inner Rotating Glowing Ring */}
                      <div className="absolute h-24 w-24 rounded-full border-2 border-transparent border-t-[#FF5500] border-r-amber-400 animate-spin [animation-duration:3s]" />

                      {/* Pulsing Ambient Halo */}
                      <div className="absolute h-20 w-20 rounded-3xl bg-gradient-to-tr from-[#FF5500] to-[#FFA033] blur-lg opacity-60 animate-pulse" />

                      {/* Main Icon Container */}
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#FF5500] via-[#FF6E1A] to-[#FFA033] text-white shadow-xl shadow-orange-500/35 ring-4 ring-white">
                        <Wand2 className="h-9 w-9 text-white drop-shadow-sm animate-pulse" />

                        {/* Sparkle Badge */}
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950 text-amber-300 border-2 border-white shadow-sm">
                          <Sparkles className="h-3 w-3 animate-spin [animation-duration:4s]" />
                        </div>
                      </div>
                    </div>

                    {/* Heading & Subtitle */}
                    <div className="space-y-1">
                      <h4 className="text-base sm:text-lg font-black tracking-tight text-zinc-900">
                        Generating {currentTool.title}...
                      </h4>
                      <p className="text-xs font-semibold text-zinc-500 min-h-[1.25rem] transition-all">
                        {BEAUTY_STAGES[generationStageIndex]?.detail ||
                          "Synthesizing facial skin layers, color optical map & blend..."}
                      </p>
                    </div>

                    {/* Progress Bar & Percentage Readout */}
                    <div className="w-full max-w-xs space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-zinc-600 flex items-center gap-1.5">
                          <RefreshCw className="h-3 w-3 animate-spin text-[#FF5500]" />
                          <span>{BEAUTY_STAGES[generationStageIndex]?.label}</span>
                        </span>
                        <span className="text-[#FF5500] font-mono font-black">
                          {generationProgress}%
                        </span>
                      </div>

                      {/* Fluid Track */}
                      <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden border border-orange-200/60 p-0.5 shadow-inner">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FF5500] via-[#FF7A1A] to-[#FFA033] shadow-xs shadow-orange-500/40 transition-all duration-300 ease-out relative"
                          style={{ width: `${generationProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* 4 Multi-Step Visual Pipeline Milestones */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-1">
                      {BEAUTY_STAGES.map((stage, idx) => {
                        const isDone =
                          generationStageIndex > idx || generationProgress >= (idx + 1) * 25;
                        const isCurrent = generationStageIndex === idx && !isDone;
                        return (
                          <div
                            key={stage.id}
                            className={cn(
                              "flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-bold transition-all duration-300",
                              isDone
                                ? "bg-orange-50/80 border-orange-200/90 text-orange-900"
                                : isCurrent
                                ? "bg-white border-[#FF5500] text-zinc-900 shadow-sm shadow-orange-500/10 ring-1 ring-[#FF5500]/25"
                                : "bg-stone-50/50 border-stone-200/60 text-zinc-400 opacity-60"
                            )}
                          >
                            <div className="flex items-center gap-1 mb-0.5">
                              {isDone ? (
                                <Check className="h-3 w-3 text-[#FF5500] stroke-[3]" />
                              ) : isCurrent ? (
                                <RefreshCw className="h-3 w-3 animate-spin text-[#FF5500]" />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                              )}
                              <span className="text-[9px] uppercase tracking-wider">
                                Step {idx + 1}
                              </span>
                            </div>
                            <span className="truncate max-w-full font-bold">{stage.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Metadata Disclaimer */}
                    <div className="pt-1 text-[11px] font-medium text-zinc-400 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
                      <span>Deducting 5 Credits</span>
                      <span>&bull;</span>
                      <span>Lossless 4K Spec</span>
                      <span>&bull;</span>
                      <span>Saved to Cloud</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 2: Generated Result Visible */}
              {hasGenerated && generatedImageUrl ? (
                <>
                  {/* Mode: Result Only */}
                  {viewMode === "result" && (
                    <div className="relative h-full w-full flex items-center justify-center p-2">
                      <div className="relative h-full w-full max-h-[560px] aspect-[4/5] sm:aspect-[3/4] mx-auto overflow-hidden rounded-2xl shadow-md border border-orange-200/70 bg-zinc-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={generatedImageUrl}
                          alt="AI Generated Beauty Result"
                          className="h-full w-full object-contain"
                        />
                        <div className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span>4K UHD Enhanced</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode: Original Only */}
                  {viewMode === "original" && (
                    <div className="relative h-full w-full flex items-center justify-center p-2">
                      <div className="relative h-full w-full max-h-[560px] aspect-[4/5] sm:aspect-[3/4] mx-auto overflow-hidden rounded-2xl shadow-md border border-orange-200/70 bg-zinc-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeSourceImage}
                          alt="Original Portrait"
                          className="h-full w-full object-contain"
                        />
                        <div className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                          Original Photo
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode: Interactive Split Compare Slider */}
                  {viewMode === "split" && (
                    <div className="relative h-full w-full flex items-center justify-center p-2">
                      <div
                        ref={sliderContainerRef}
                        onMouseDown={(e) => {
                          setIsDraggingSlider(true);
                          handleSliderMove(e.clientX);
                        }}
                        onMouseMove={(e) => {
                          if (isDraggingSlider || e.buttons === 1) {
                            handleSliderMove(e.clientX);
                          }
                        }}
                        onMouseUp={() => setIsDraggingSlider(false)}
                        onTouchStart={(e) => {
                          setIsDraggingSlider(true);
                          handleSliderMove(e.touches[0].clientX);
                        }}
                        onTouchMove={(e) => {
                          handleSliderMove(e.touches[0].clientX);
                        }}
                        onTouchEnd={() => setIsDraggingSlider(false)}
                        className="relative h-full w-full max-h-[560px] aspect-[4/5] sm:aspect-[3/4] mx-auto overflow-hidden rounded-2xl select-none cursor-ew-resize border border-orange-200/70 shadow-md bg-zinc-950"
                      >
                        {/* Layer 1: After Image (Full background layer) */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={generatedImageUrl}
                          alt="After AI"
                          className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
                        />

                        {/* Layer 2: Before Image (Exact same position, size & scale, clipped from right) */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeSourceImage}
                          alt="Before AI"
                          className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
                          style={{
                            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                            WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                          }}
                        />

                        {/* Draggable Divider Line & Handle */}
                        <div
                          className="absolute inset-y-0 w-0.5 bg-white shadow-2xl z-20 pointer-events-none"
                          style={{ left: `${sliderPosition}%` }}
                        >
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xl border-2 border-orange-400 text-[#FF5500]">
                            <Columns2 className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs z-20 pointer-events-none">
                          Before
                        </div>
                        <div className="absolute top-3 right-3 rounded-full bg-[#FF5500]/95 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs z-20 pointer-events-none shadow-xs">
                          After
                        </div>

                        {/* Drag instruction tooltip */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-0.5 text-[10px] font-semibold text-white/80 backdrop-blur-xs z-20 pointer-events-none">
                          Drag slider to compare Before &amp; After
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* CASE 3: Pre-generation State (Show Source Portrait Ready) */
                <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />

                  <div className="relative z-10 flex flex-col items-center space-y-4 max-w-sm">
                    <div className="relative h-64 w-48 sm:h-72 sm:w-56 overflow-hidden rounded-2xl border-2 border-orange-200/80 bg-white shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeSourceImage}
                        alt="Source Preview"
                        className="h-full w-full object-cover object-center"
                      />
                      <div className="absolute bottom-2 inset-x-2 rounded-xl bg-black/70 py-1 px-2 text-center text-[10px] font-bold text-white backdrop-blur-xs">
                        Source Portrait Ready
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-zinc-900">
                        Ready to Transform
                      </h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Click <span className="font-bold text-[#FF5500]">Generate Transformation</span> on the left to render your makeover (5 Credits).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 transition cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Render {currentTool.title}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Viewport Bottom Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100/80 pt-3.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-500">
                  Export Spec: 4K UHD Lossless Quality
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {hasGenerated ? (
                  <>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500] transition cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>New Makeover</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadResult}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-orange-500/25 hover:opacity-95 transition cursor-pointer disabled:opacity-60"
                    >
                      {isDownloading ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      <span>{isDownloading ? "Downloading..." : "Download 4K Result"}</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-orange-500/25 hover:opacity-95 transition cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Quick Preview</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
