"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eraser,
  Scissors,
  Palette,
  Maximize2,
  Crown,
  Upload,
  Zap,
  CheckCircle2,
  RotateCcw,
  Download,
  Check,
  RefreshCw,
  Sliders,
  AlertTriangle,
  ExternalLink,
  Layers,
  Undo2,
  Sparkles,
  Columns2,
  Info,
  Maximize,
  Ratio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { HEADSHOT_TEMPLATES, HeadshotTemplate } from "@/lib/headshot-templates";

// =============================================================================
// 1. TOOL DEFINITIONS
// =============================================================================
export type ExtraToolId = "object-remove" | "bg-remove" | "colorize" | "extender" | "headshot";

interface ExtraTool {
  id: ExtraToolId;
  title: string;
  tagline: string;
  badge: string;
  image: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const EXTRA_TOOLS: ExtraTool[] = [
  {
    id: "object-remove",
    title: "AI Object Remover",
    tagline: "Magic inpainting & clutter erase",
    badge: "Inpainting Pro",
    image: "/ai-photo-editing-images/object-remove.jpg",
    description: "Brush over photobombers, power lines, and unwanted distractions to seamlessly erase them with neural diffusion.",
    icon: Eraser,
  },
  {
    id: "bg-remove",
    title: "AI Photo Background Remover",
    tagline: "Instant cutout & transparent PNG",
    badge: "Cutout HD",
    image: "/ai-photo-editing-images/bg-remove.jpg",
    description: "Isolate subjects with pixel-perfect edge detection and transparent alpha export or modern studio backdrop replacement.",
    icon: Scissors,
  },
  {
    id: "colorize",
    title: "AI Photo Colorize",
    tagline: "Monochrome to vivid 4K color",
    badge: "Restoration",
    image: "/ai-photo-editing-images/photo-colorize.jpg",
    description: "Revitalize vintage black-and-white family portraits with historically accurate skin tones, textures, and rich color spectra.",
    icon: Palette,
  },
  {
    id: "extender",
    title: "AI Photo Extender",
    tagline: "Uncrop & generative outpainting",
    badge: "Outpaint AI",
    image: "/ai-photo-editing-images/image-extender.jpg",
    description: "Expand image borders beyond original boundaries for social banners, TikTok reels, and ultra-wide cinematic compositions.",
    icon: Maximize2,
  },
  {
    id: "headshot",
    title: "AI Headshot Generator",
    tagline: "69+ executive & editorial styles",
    badge: "Corporate 4K",
    image: "/ai-photo-editing-images/head-shot-generator.jpg",
    description: "Transform casual selfies into LinkedIn-ready corporate headshots with tailored blazers, suits, and studio lighting.",
    icon: Crown,
  },
];

// =============================================================================
// 2. SAMPLE SOURCE IMAGES (TAILORED PER TOOL)
// =============================================================================
interface SampleSource {
  id: string;
  name: string;
  src: string;
  hint: string;
  forTools: ExtraToolId[];
}

const SAMPLE_SOURCES: SampleSource[] = [
  {
    id: "object-scene",
    name: "Coastal Vista",
    src: "/extras-samples/object-remove-scene.jpg",
    hint: "Beach scene with background photobombers",
    forTools: ["object-remove"],
  },
  {
    id: "bg-product",
    name: "Studio Portrait",
    src: "/extras-samples/bg-remove-product.jpg",
    hint: "Crisp portrait ideal for background cutout",
    forTools: ["bg-remove"],
  },
  {
    id: "vintage-bw",
    name: "Vintage 1954",
    src: "/extras-samples/colorize-bw-01.jpg",
    hint: "Historic black & white portrait",
    forTools: ["colorize"],
  },
  {
    id: "extender-landscape",
    name: "Golden Field",
    src: "/extras-samples/extender-landscape.jpg",
    hint: "Portrait ready for wide 16:9 uncrop extension",
    forTools: ["extender"],
  },
  {
    id: "headshot-01",
    name: "Lucas (Business)",
    src: "/extras-samples/headshot-source-01.jpg",
    hint: "Front-facing portrait with shoulders for executive headshots",
    forTools: ["headshot"],
  },
  {
    id: "headshot-02",
    name: "Elena (Executive)",
    src: "/extras-samples/headshot-source-02.jpg",
    hint: "Front-facing portrait with shoulders for executive headshots",
    forTools: ["headshot"],
  },
  {
    id: "boy1",
    name: "Lucas",
    src: "/normal-headshot/boy1.png",
    hint: "High-resolution portrait",
    forTools: ["extender", "object-remove"],
  },
  {
    id: "girl1",
    name: "Sophia",
    src: "/normal-headshot/girl1.png",
    hint: "High-resolution portrait",
    forTools: ["headshot", "bg-remove", "colorize"],
  },
];

// =============================================================================
// 3. TOOL OPTIONS & PRESETS
// =============================================================================

// Background Remover Backdrops
const BG_BACKDROPS = [
  { id: "transparent", name: "Transparent PNG", style: "checkerboard", desc: "Pure alpha cutout for design apps" },
  { id: "white", name: "Studio Pure White", bg: "#FFFFFF", desc: "Amazon / Shopify clean product standard" },
  { id: "slate", name: "Executive Slate", bg: "#F8FAFC", desc: "Modern neutral corporate studio backdrop" },
  { id: "warm", name: "Warm Amber Studio", bg: "linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%)", desc: "Golden hour aesthetic warm glow" },
  { id: "dark", name: "Editorial Noir", bg: "#0F172A", desc: "Dramatic high-contrast studio spotlight" },
  { id: "bokeh", name: "Soft Bokeh Blur", style: "blur", desc: "Simulated f/1.4 lens depth-of-field blur" },
];

// Colorize Profiles
const COLORIZE_PROFILES = [
  { id: "natural", name: "Natural Warm", desc: "Balanced realistic skin tones & amber warmth", hex: "#E0A96D" },
  { id: "vivid", name: "Rich Vivid", desc: "Lush, high-saturation cinematic color spectrum", hex: "#FF5500" },
  { id: "vintage", name: "Kodachrome 1960", desc: "Nostalgic golden-era analog film tones", hex: "#C86432" },
  { id: "daylight", name: "Modern Daylight", desc: "Crisp, balanced neutral daylight color profile", hex: "#5680E9" },
];

// Extender Aspect Ratios
const EXTENDER_ASPECTS = [
  { id: "16:9", name: "16:9 Cinema Landscape", desc: "YouTube Banners, Desktop, Cinematic", ratio: "16 / 9", visualW: "w-24", visualH: "h-14" },
  { id: "9:16", name: "9:16 Mobile Story", desc: "TikTok, IG Reels, Shorts Vertical", ratio: "9 / 16", visualW: "w-12", visualH: "h-20" },
  { id: "1:1", name: "1:1 Square Feed", desc: "Instagram Square, E-Commerce Grid", ratio: "1 / 1", visualW: "w-16", visualH: "h-16" },
  { id: "4:5", name: "4:5 Portrait Feed", desc: "Instagram Vertical Post Standard", ratio: "4 / 5", visualW: "w-14", visualH: "h-18" },
  { id: "1.5x", name: "1.5x Wide Panoramic", desc: "Balanced 25% boundary expansion on all edges", ratio: "3 / 2", visualW: "w-20", visualH: "h-14" },
];

// Headshot Categories
const HEADSHOT_CATEGORIES = ["All", "Suit", "Shirt", "Casual", "Medical Attire", "Blouse"];

// AI Extras Pipeline Stages (World-Class Studio Loader)
const EXTRAS_STAGES = [
  { id: "masking", label: "Segmentation & Mask", detail: "Isolating target subjects, outlines & canvas boundaries..." },
  { id: "diffusion", label: "Diffusion Synthesis", detail: "Synthesizing deep contextual neural diffusion inpainting..." },
  { id: "harmonization", label: "Lighting & Texture Blend", detail: "Harmonizing ambient light rays, color spectrum & tone..." },
  { id: "rendering", label: "4K UHD Export", detail: "Finalizing lossless 4K high-resolution studio render..." },
];

export default function ExtrasStudioPage() {
  const { credits, refreshCredits, user } = useAuth();

  // Studio Selection State
  const [selectedTool, setSelectedTool] = useState<ExtraToolId>("object-remove");
  const [sourceType, setSourceType] = useState<"sample" | "upload">("sample");
  const [selectedSampleId, setSelectedSampleId] = useState<string>("object-scene");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Tool Specific Customization States
  // 1. Object Remover
  const [brushSize, setBrushSize] = useState<number>(28);
  const [removeShadow, setRemoveShadow] = useState<boolean>(true);
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
  const [hasPaintedMask, setHasPaintedMask] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // 2. Background Remover
  const [selectedBackdrop, setSelectedBackdrop] = useState<string>("transparent");
  const [edgeSoftness, setEdgeSoftness] = useState<"clean" | "soft">("clean");

  // 3. Colorize
  const [colorizeProfile, setColorizeProfile] = useState<string>("natural");
  const [saturationLevel, setSaturationLevel] = useState<number>(100);
  const [reduceScratches, setReduceScratches] = useState<boolean>(true);
  const [variationIndex, setVariationIndex] = useState<number>(0);
  const [extraVariations, setExtraVariations] = useState<string[]>([]);

  // 4. Extender
  const [selectedAspect, setSelectedAspect] = useState<string>("16:9");

  // 5. Headshot
  const [headshotCategory, setHeadshotCategory] = useState<string>("All");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("male_dark_gray_suit");

  // Generation & Viewport States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStageIndex, setGenerationStageIndex] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Layout Refs & Height Synchronization
  const leftColRef = useRef<HTMLDivElement>(null);
  const canvasCardRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [sourceDimensions, setSourceDimensions] = useState<{ width: number; height: number }>({
    width: 900,
    height: 600,
  });

  // Viewport breakpoint detection
  useEffect(() => {
    const checkViewport = () => setIsDesktop(window.innerWidth >= 1024);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Synchronize left column maxHeight with Live Studio Canvas height
  useEffect(() => {
    if (!isDesktop) {
      setCanvasHeight(null);
      return;
    }
    const updateHeight = () => {
      if (canvasCardRef.current) {
        setCanvasHeight(canvasCardRef.current.offsetHeight);
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (canvasCardRef.current) {
      observer.observe(canvasCardRef.current);
    }
    return () => observer.disconnect();
  }, [isDesktop, hasGenerated, selectedTool]);

  // Determine current active source image
  const getActiveSourceUrl = useCallback(() => {
    if (sourceType === "upload" && uploadedImage) {
      return uploadedImage;
    }
    const matchingSample = SAMPLE_SOURCES.find((s) => s.id === selectedSampleId);
    if (matchingSample) return matchingSample.src;
    return SAMPLE_SOURCES[0].src;
  }, [sourceType, uploadedImage, selectedSampleId]);

  // Handle switching tool
  const handleSelectTool = (toolId: ExtraToolId) => {
    setSelectedTool(toolId);
    setHasGenerated(false);
    setGeneratedImageUrl(null);
    setExtraVariations([]);
    setErrorMessage(null);
    setMaskDataUrl(null);
    setHasPaintedMask(false);

    // Auto-select the best sample image tailored for this tool if currently in sample mode
    if (sourceType === "sample") {
      const bestSample = SAMPLE_SOURCES.find((s) => s.forTools.includes(toolId));
      if (bestSample) {
        setSelectedSampleId(bestSample.id);
      }
    }
  };

  // Upload Photo handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        setErrorMessage("File exceeds 12MB. Please upload a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setSourceType("upload");
        setHasGenerated(false);
        setErrorMessage(null);
        setMaskDataUrl(null);
        setHasPaintedMask(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drawing Canvas for Object Remover
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (selectedTool !== "object-remove") return;
    setIsDrawing(true);
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 85, 0, 0.75)";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasPaintedMask(true);
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool !== "object-remove") return;
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "rgba(255, 85, 0, 0.75)";
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    setHasPaintedMask(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = maskCanvasRef.current;
    if (!canvas) return;

    // Export B&W Mask for YouCam API: White (#FFFFFF) for erase areas, Black (#000000) for keep
    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext("2d");
    if (offCtx) {
      // 1. Fill black background
      offCtx.fillStyle = "#000000";
      offCtx.fillRect(0, 0, offscreen.width, offscreen.height);

      // 2. Read mask pixels where alpha > 0 and paint white
      const userImgData = canvas.getContext("2d")?.getImageData(0, 0, canvas.width, canvas.height);
      if (userImgData) {
        const offImgData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
        for (let i = 0; i < userImgData.data.length; i += 4) {
          if (userImgData.data[i + 3] > 10) {
            offImgData.data[i] = 255;
            offImgData.data[i + 1] = 255;
            offImgData.data[i + 2] = 255;
            offImgData.data[i + 3] = 255;
          }
        }
        offCtx.putImageData(offImgData, 0, 0);
      }
      setMaskDataUrl(offscreen.toDataURL("image/png"));
    }
  };

  const handleClearMask = () => {
    const canvas = maskCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setMaskDataUrl(null);
    setHasPaintedMask(false);
  };

  // Slider dragging logic for Before/After
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDraggingSlider(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      }
    };
    if (isDraggingSlider) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("mousemove", handleGlobalMouseMove);
    }
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isDraggingSlider]);

  // Primary Generation Action
  const handleGenerate = async () => {
    setErrorMessage(null);

    if (selectedTool === "object-remove" && !hasPaintedMask && !maskDataUrl) {
      setErrorMessage("Please brush over the object or photobomb you want to erase on the live canvas.");
      return;
    }

    setIsGenerating(true);
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

    // Scroll to canvas on mobile
    if (!isDesktop && canvasCardRef.current) {
      canvasCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    try {
      let optionsPayload: any = {};

      if (selectedTool === "object-remove") {
        optionsPayload = {
          removeShadow,
          lookName: "Object Removal Pro",
        };
      } else if (selectedTool === "bg-remove") {
        optionsPayload = {
          backdrop: selectedBackdrop,
          edgeSoftness,
          lookName: `Background Removal - ${selectedBackdrop}`,
        };
      } else if (selectedTool === "colorize") {
        optionsPayload = {
          profile: colorizeProfile,
          saturationLevel,
          reduceScratches,
          lookName: `Colorize - ${colorizeProfile}`,
        };
      } else if (selectedTool === "extender") {
        optionsPayload = {
          aspectRatio: selectedAspect,
          lookName: `Image Extender (${selectedAspect})`,
        };
      } else if (selectedTool === "headshot") {
        const tpl = HEADSHOT_TEMPLATES.find((t) => t.id === selectedTemplateId);
        optionsPayload = {
          templateId: selectedTemplateId,
          lookName: `Executive Headshot - ${tpl?.title || selectedTemplateId}`,
        };
      }

      const activeSource = getActiveSourceUrl();

      const response = await fetch("/api/extras/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          toolId: selectedTool,
          sourceImageUrl: activeSource,
          maskImageUrl: maskDataUrl || undefined,
          options: optionsPayload,
        }),
      });

      const data = await response.json();
      clearInterval(interval);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "AI generation failed. Please try again.");
      }

      setGenerationProgress(100);
      setGenerationStageIndex(3);
      setGeneratedImageUrl(data.resultUrl);
      if (data.outputs && Array.isArray(data.outputs)) {
        setExtraVariations(data.outputs);
        setVariationIndex(0);
      }
      setHasGenerated(true);

      refreshCredits?.();
    } catch (err: any) {
      clearInterval(interval);
      setErrorMessage(err.message || "Failed to generate transformation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Output
  const handleDownload = async () => {
    if (!generatedImageUrl) return;
    setIsDownloading(true);
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const isPng = selectedTool === "bg-remove";
      link.download = `beautyaura-extras-${selectedTool}-${Date.now()}.${isPng ? "png" : "jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      window.open(generatedImageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setHasGenerated(false);
    setGeneratedImageUrl(null);
    setExtraVariations([]);
    setErrorMessage(null);
    setGenerationProgress(0);
    setGenerationStageIndex(0);
    handleClearMask();
  };

  // Filtered headshot templates
  const filteredHeadshotTemplates = HEADSHOT_TEMPLATES.filter((tpl) => {
    if (headshotCategory === "All") return true;
    return tpl.category.toLowerCase().includes(headshotCategory.toLowerCase());
  });

  const activeSource = getActiveSourceUrl();
  const currentTool = EXTRA_TOOLS.find((t) => t.id === selectedTool) || EXTRA_TOOLS[0];
  const CurrentIcon = currentTool.icon;

  return (
    <div className="space-y-6 pb-2">
      {/* =========================================================================
          TOP HEADER STRIP: Title & Synchronized Studio Rate / Balance Pill
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <Layers className="h-3.5 w-3.5" />
            <span>AI Extras &amp; Creative Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            AI Extras Studio
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Magic object erase, instant background removal, photo colorization, uncrop extender &amp; corporate headshots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/80 px-3.5 py-1 text-xs font-bold text-zinc-800">
            <Zap className="h-3.5 w-3.5 text-[#FF5500] fill-current" />
            <span>5 Credits / render</span>
          </div>
          <div className="text-xs font-bold text-zinc-500">
            Balance: <span className="text-zinc-900 font-black">{credits !== null ? credits : "..."}</span>
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
          {credits !== null && credits < 5 && (
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

      {/* =========================================================================
          MAIN STUDIO GRID
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            LEFT COLUMN: Studio Controls & Customization (Synced Height + Light Scrollbar)
           ========================================================================= */}
        <div
          ref={leftColRef}
          style={{
            maxHeight: isDesktop && canvasHeight ? `${canvasHeight}px` : undefined,
          }}
          className={cn(
            "order-1 lg:order-none lg:col-span-5 xl:col-span-5 space-y-5",
            isDesktop &&
              "lg:overflow-y-auto lg:pr-2.5 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-stone-100/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-200/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5500]/70 transition-colors"
          )}
        >
          {/* STEP 1: Choose Tool */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  1
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Choose AI Extras Tool
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#FF5500]">5 Features</span>
            </div>

            <div className="space-y-2.5">
              {EXTRA_TOOLS.map((tool) => {
                const isActive = selectedTool === tool.id;
                const IconComp = tool.icon;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleSelectTool(tool.id)}
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

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div>
                        <span
                          className={cn(
                            "inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide mb-1",
                            isActive
                              ? "bg-[#FF5500] text-white shadow-2xs"
                              : "bg-orange-100/90 text-orange-800"
                          )}
                        >
                          {tool.badge}
                        </span>
                      </div>
                      <span className="text-xs font-black text-zinc-900 leading-snug">
                        {tool.title}
                      </span>
                    </div>

                    {isActive && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#FF5500]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Source Image Section */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  2
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Source Image
                </h3>
              </div>
              <span className="text-[11px] font-bold text-zinc-400">Portrait or Scene</span>
            </div>

            {/* Source Type Toggle */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-stone-100 p-1">
              <button
                type="button"
                onClick={() => setSourceType("upload")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer",
                  sourceType === "upload"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                )}
              >
                <Upload className="h-3.5 w-3.5 text-[#FF5500]" />
                <span>Upload Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceType("sample")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer",
                  sourceType === "sample"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                )}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
                <span>Sample Library</span>
              </button>
            </div>

            {sourceType === "upload" ? (
              <label className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200/90 bg-orange-50/20 p-5 text-center transition hover:border-[#FF5500] hover:bg-orange-50/40 cursor-pointer">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xs group-hover:scale-105 transition">
                  <Upload className="h-5 w-5 text-[#FF5500]" />
                </div>
                <span className="text-xs font-bold text-zinc-800 mt-2.5">
                  {uploadedImage ? "Click to change photo" : "Upload source image"}
                </span>
                <span className="text-[10px] text-zinc-400 mt-0.5">
                  PNG, JPG, WebP up to 12MB (Lossless 4K Spec)
                </span>
              </label>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_SOURCES.map((sample) => {
                    const isSelected = selectedSampleId === sample.id && sourceType === "sample";
                    const isRelevant = sample.forTools.includes(selectedTool);
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          setSelectedSampleId(sample.id);
                          setSourceType("sample");
                          setHasGenerated(false);
                          setMaskDataUrl(null);
                          setHasPaintedMask(false);
                        }}
                        className={cn(
                          "group relative aspect-square overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
                          isSelected
                            ? "border-[#FF5500] ring-2 ring-[#FF5500]/30 shadow-xs scale-[0.98]"
                            : "border-stone-200 hover:border-orange-200",
                          !isRelevant && "opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={sample.src}
                          alt={sample.name}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-1 text-[9px] font-bold text-white text-center truncate">
                          {sample.name}
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5500] text-white">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-zinc-400 italic">
                  Tip: Filtered samples match your selected {currentTool.title} feature.
                </p>
              </div>
            )}
          </div>

          {/* STEP 3: Dynamic Customization Controls */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  3
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Customize {currentTool.badge}
                </h3>
              </div>
              <CurrentIcon className="h-4 w-4 text-[#FF5500]" />
            </div>

            {/* ===============================================================
                TOOL 1: OBJECT REMOVER CONTROLS
               =============================================================== */}
            {selectedTool === "object-remove" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-orange-200/70 bg-orange-50/40 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-800">
                      Interactive Mask Brush
                    </span>
                    <span className="text-[10px] font-bold text-[#FF5500]">
                      {hasPaintedMask ? "Custom Area Painted" : "Ready to Brush"}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    Paint directly over photobombers, power lines, or objects in the live canvas on the right to remove them.
                  </p>
                </div>

                {/* Brush Size Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span>Brush Radius</span>
                    <span className="text-[#FF5500] font-black">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="64"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-[#FF5500] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Precision (10px)</span>
                    <span>Broad Area (64px)</span>
                  </div>
                </div>

                {/* Actions & Shadow Toggle */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={handleClearMask}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-orange-50 transition cursor-pointer"
                  >
                    <Undo2 className="h-3.5 w-3.5 text-[#FF5500]" />
                    <span>Clear Brush Mask</span>
                  </button>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={removeShadow}
                      onChange={(e) => setRemoveShadow(e.target.checked)}
                      className="rounded text-[#FF5500] focus:ring-[#FF5500]"
                    />
                    <span className="text-xs font-bold text-zinc-700">Erase Cast Shadows</span>
                  </label>
                </div>
              </div>
            )}

            {/* ===============================================================
                TOOL 2: BACKGROUND REMOVER CONTROLS
               =============================================================== */}
            {selectedTool === "bg-remove" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-2">
                    Studio Backdrop Replacement
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {BG_BACKDROPS.map((bd) => {
                      const isSelected = selectedBackdrop === bd.id;
                      return (
                        <button
                          key={bd.id}
                          type="button"
                          onClick={() => setSelectedBackdrop(bd.id)}
                          className={cn(
                            "group flex flex-col items-start rounded-2xl border p-2.5 text-left transition cursor-pointer",
                            isSelected
                              ? "bg-orange-50/70 border-[#FF5500] ring-1 ring-[#FF5500]"
                              : "bg-white border-orange-100 hover:border-orange-200"
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-zinc-900">
                              {bd.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5500]" />
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                            {bd.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Edge Refinement */}
                <div className="border-t border-stone-100 pt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700">Edge Feathering</span>
                  <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setEdgeSoftness("clean")}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer",
                        edgeSoftness === "clean" ? "bg-white text-zinc-900 shadow-2xs" : "text-zinc-600"
                      )}
                    >
                      Clean Crisp
                    </button>
                    <button
                      type="button"
                      onClick={() => setEdgeSoftness("soft")}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer",
                        edgeSoftness === "soft" ? "bg-white text-zinc-900 shadow-2xs" : "text-zinc-600"
                      )}
                    >
                      Soft Feather
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                TOOL 3: COLORIZE CONTROLS
               =============================================================== */}
            {selectedTool === "colorize" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-2">
                    Vintage Color Palette Profile
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLORIZE_PROFILES.map((prof) => {
                      const isSelected = colorizeProfile === prof.id;
                      return (
                        <button
                          key={prof.id}
                          type="button"
                          onClick={() => setColorizeProfile(prof.id)}
                          className={cn(
                            "flex flex-col items-start rounded-2xl border p-2.5 text-left transition cursor-pointer",
                            isSelected
                              ? "bg-orange-50/70 border-[#FF5500] ring-1 ring-[#FF5500]"
                              : "bg-white border-orange-100 hover:border-orange-200"
                          )}
                        >
                          <div className="flex items-center gap-1.5 w-full">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: prof.hex }}
                            />
                            <span className="text-xs font-bold text-zinc-900 truncate">
                              {prof.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 mt-1 line-clamp-1">
                            {prof.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Saturation Slider */}
                <div className="space-y-2 border-t border-stone-100 pt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span>Pigment Saturation</span>
                    <span className="text-[#FF5500] font-black">{saturationLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={saturationLevel}
                    onChange={(e) => setSaturationLevel(Number(e.target.value))}
                    className="w-full accent-[#FF5500] cursor-pointer"
                  />
                </div>

                {/* Film Scratch Toggle */}
                <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                  <span className="text-xs font-bold text-zinc-700">Restore &amp; De-Scratch</span>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={reduceScratches}
                      onChange={(e) => setReduceScratches(e.target.checked)}
                      className="rounded text-[#FF5500] focus:ring-[#FF5500]"
                    />
                    <span className="text-xs font-semibold text-zinc-600">Active</span>
                  </label>
                </div>
              </div>
            )}

            {/* ===============================================================
                TOOL 4: EXTENDER CONTROLS
               =============================================================== */}
            {selectedTool === "extender" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-2">
                    Target Aspect Ratio Presets
                  </label>
                  <div className="space-y-2">
                    {EXTENDER_ASPECTS.map((asp) => {
                      const isSelected = selectedAspect === asp.id;
                      return (
                        <button
                          key={asp.id}
                          type="button"
                          onClick={() => setSelectedAspect(asp.id)}
                          className={cn(
                            "flex items-center justify-between w-full rounded-2xl border p-2.5 text-left transition cursor-pointer",
                            isSelected
                              ? "bg-orange-50/70 border-[#FF5500] ring-1 ring-[#FF5500]"
                              : "bg-white border-orange-100 hover:border-orange-200"
                          )}
                        >
                          <div>
                            <span className="text-xs font-bold text-zinc-900 block">
                              {asp.name}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {asp.desc}
                            </span>
                          </div>
                          <div className={cn("border-2 rounded-md bg-stone-100 flex items-center justify-center text-[10px] font-bold text-zinc-500", asp.visualW, asp.visualH, isSelected ? "border-[#FF5500] text-[#FF5500]" : "border-stone-300")}>
                            {asp.id}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-200/70 bg-orange-50/30 p-3 text-[11px] text-zinc-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                    <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
                    <span>Neural Outpainting Engine</span>
                  </div>
                  <p>
                    Outpaints seamlessly while synthesizing continuous lighting, depth-of-field, and texture coherence.
                  </p>
                </div>
              </div>
            )}

            {/* ===============================================================
                TOOL 5: HEADSHOT GENERATOR CONTROLS
               =============================================================== */}
            {selectedTool === "headshot" && (
              <div className="space-y-3.5">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {HEADSHOT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setHeadshotCategory(cat)}
                      className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full transition whitespace-nowrap cursor-pointer",
                        headshotCategory === cat
                          ? "bg-[#FF5500] text-white shadow-xs"
                          : "bg-stone-100 text-zinc-600 hover:bg-orange-50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 69 Official YouCam Headshot Templates Grid */}
                <div className="max-h-60 overflow-y-auto pr-1 space-y-1.5 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent]">
                  <div className="grid grid-cols-3 gap-2">
                    {filteredHeadshotTemplates.slice(0, 36).map((tpl) => {
                      const isSelected = selectedTemplateId === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => setSelectedTemplateId(tpl.id)}
                          className={cn(
                            "group relative flex flex-col rounded-xl overflow-hidden border transition text-left cursor-pointer",
                            isSelected
                              ? "border-[#FF5500] ring-2 ring-[#FF5500]/30 shadow-xs"
                              : "border-stone-200 hover:border-orange-200"
                          )}
                        >
                          <div className="relative aspect-[3/4] w-full bg-stone-100">
                            <Image
                              src={tpl.thumb}
                              alt={tpl.title}
                              fill
                              unoptimized
                              sizes="96px"
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            {isSelected && (
                              <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5500] text-white">
                                <Check className="h-2.5 w-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <div className="p-1.5 bg-white">
                            <span className="text-[10px] font-bold text-zinc-800 line-clamp-1">
                              {tpl.title}
                            </span>
                            <span className="text-[9px] text-zinc-400 block line-clamp-1">
                              {tpl.category}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Primary Action Button (Strictly Single-Line) */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerate}
                className={cn(
                  "w-full h-12 flex items-center justify-center gap-2 rounded-2xl py-3 px-4 font-bold text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer whitespace-nowrap overflow-hidden select-none",
                  isGenerating
                    ? "bg-orange-400 cursor-not-allowed opacity-90"
                    : "bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] hover:opacity-95 hover:shadow-orange-500/35"
                )}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
                    <span className="text-sm font-black tracking-wide">
                      Generating Transformation...
                    </span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 fill-current shrink-0" />
                    <span className="text-sm font-black tracking-wide">
                      Generate Edit (5 Credits)
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Live Studio Canvas & Interactive Viewport
           ========================================================================= */}
        <div
          ref={canvasCardRef}
          className="order-2 lg:order-none lg:col-span-7 xl:col-span-7 space-y-4"
        >
          <div className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-white p-4 shadow-lg space-y-4">
            {/* Viewport Top Bar */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-zinc-800">
                  Live Studio Canvas
                </span>
                <span className="rounded-full bg-orange-100/90 text-[#FF5500] px-2 py-0.5 text-[10px] font-extrabold uppercase">
                  {currentTool.badge}
                </span>
              </div>

              {hasGenerated && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-2.5 py-1 text-xs font-bold text-zinc-700 hover:bg-stone-50 transition cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5500] px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-[#e04b00] transition cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isDownloading ? "Saving..." : "Download 4K"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Canvas Viewport Frame */}
            <div
              className={cn(
                "relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/11] min-h-[360px] sm:min-h-[400px] w-full overflow-hidden rounded-2xl flex items-center justify-center transition-all border border-orange-100",
                selectedTool === "bg-remove" && hasGenerated && selectedBackdrop === "transparent"
                  ? "bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0]"
                  : "bg-gradient-to-b from-stone-50 via-white to-orange-50/20"
              )}
              style={
                selectedTool === "bg-remove" && hasGenerated && selectedBackdrop !== "transparent"
                  ? {
                      background:
                        BG_BACKDROPS.find((b) => b.id === selectedBackdrop)?.bg || undefined,
                    }
                  : undefined
              }
            >
              {/* STATE A: MINIMAL CLEAN STUDIO LOADER */}
              {isGenerating ? (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md p-6 overflow-hidden">
                  <div className="relative z-10 flex flex-col items-center text-center max-w-xs w-full space-y-4">
                    {/* Sleek Modern Spinner */}
                    <div className="relative flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full border-[3px] border-orange-100 border-t-[#FF5500] animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-[#FF5500] animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-zinc-900">
                        Generating {currentTool.title}...
                      </h4>
                      <p className="text-xs text-zinc-500">
                        Applying high-precision AI transformation
                      </p>
                    </div>

                    {/* Progress Bar & Percentage */}
                    <div className="w-full space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500">
                        <span>Processing</span>
                        <span className="text-[#FF5500] font-black">{generationProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] transition-all duration-300"
                          style={{ width: `${generationProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : hasGenerated && generatedImageUrl ? (
                /* STATE B: POST-GENERATION RESULT WITH BEFORE/AFTER SLIDER */
                <div
                  ref={sliderContainerRef}
                  className="relative h-full w-full select-none overflow-hidden cursor-ew-resize"
                  onMouseDown={() => setIsDraggingSlider(true)}
                  onTouchStart={() => setIsDraggingSlider(true)}
                >
                  {/* Before (Original) Image */}
                  <Image
                    src={activeSource}
                    alt="Original Photo"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain"
                  />

                  {/* After (Generated) Image with Dynamic Clip Path */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                    }}
                  >
                    <Image
                      src={
                        extraVariations.length > 0 && extraVariations[variationIndex]
                          ? extraVariations[variationIndex]
                          : generatedImageUrl
                      }
                      alt="AI Edit Result"
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-contain"
                    />
                  </div>

                  {/* Draggable Divider Handle */}
                  <div
                    className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-2xl cursor-ew-resize"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-900 shadow-xl border-2 border-[#FF5500]">
                      <Columns2 className="h-4 w-4 text-[#FF5500]" />
                    </div>
                  </div>

                  {/* Before / After Badges */}
                  <div className="absolute top-3 left-3 z-10 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    Original
                  </div>
                  <div className="absolute top-3 right-3 z-10 rounded-full bg-[#FF5500] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                    AI Transformation
                  </div>
                </div>
              ) : (
                /* STATE C: PRE-GENERATION SOURCE VIEWPORT WITH OBJECT REMOVER BRUSH CANVAS */
                <div className="relative h-full w-full">
                  <Image
                    src={activeSource}
                    alt="Source Portrait"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain"
                    priority
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      if (img.naturalWidth && img.naturalHeight) {
                        setSourceDimensions({
                          width: img.naturalWidth,
                          height: img.naturalHeight,
                        });
                      }
                    }}
                  />

                  {/* Interactive Mask Brush Canvas for Object Remover */}
                  {selectedTool === "object-remove" && (
                    <canvas
                      ref={maskCanvasRef}
                      width={sourceDimensions.width}
                      height={sourceDimensions.height}
                      onMouseDown={startDrawing}
                      onMouseMove={drawMove}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={drawMove}
                      onTouchEnd={stopDrawing}
                      className="absolute inset-0 h-full w-full cursor-crosshair z-10 touch-none"
                    />
                  )}

                  <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs flex items-center gap-1.5">
                    <CurrentIcon className="h-3.5 w-3.5 text-[#FF5500]" />
                    <span>{currentTool.title}</span>
                  </div>

                  {selectedTool === "object-remove" && (
                    <div className="absolute top-3 right-3 rounded-full bg-[#FF5500] px-3 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1.5">
                      <Eraser className="h-3.5 w-3.5" />
                      <span>{hasPaintedMask ? "Mask Active" : "Brush to Erase"}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Extra Output Variation Chips (When Colorize or Multiple Outputs exist) */}
            {hasGenerated && extraVariations.length > 1 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
                  Colorized Variations:
                </span>
                <div className="flex items-center gap-2">
                  {extraVariations.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setVariationIndex(idx)}
                      className={cn(
                        "px-3 py-1 text-xs font-bold rounded-xl border transition cursor-pointer",
                        variationIndex === idx
                          ? "bg-[#FF5500] text-white border-[#FF5500] shadow-xs"
                          : "bg-stone-50 border-stone-200 text-zinc-700 hover:bg-orange-50"
                      )}
                    >
                      Variation {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Viewport Metadata Footer */}
            <div className="flex items-center justify-between px-2 pt-1 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Lossless 4K Neural Diffusion Engine</span>
              </span>
              <span className="text-[11px] font-semibold text-zinc-400">
                Neural Studio Cloud
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
