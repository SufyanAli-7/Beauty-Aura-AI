"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Smile,
  Activity,
  Sparkles,
  Clock,
  User,
  ShieldCheck,
  Upload,
  RotateCcw,
  Download,
  CheckCircle2,
  Check,
  Sliders,
  AlertTriangle,
  Layers,
  ExternalLink,
  Columns2,
  Maximize2,
  Sun,
  HeartPulse,
  Info,
  Zap,
  RefreshCw,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

// =============================================================================
// 1. TOOL DEFINITIONS (6 AI TOOLS)
// =============================================================================
export type SkinBodyToolId =
  | "abs"
  | "smile"
  | "aging"
  | "body_reshape"
  | "fitzpatrick"
  | "skin_analysis";

interface SkinBodyTool {
  id: SkinBodyToolId;
  title: string;
  tagline: string;
  badge: string;
  image: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SKIN_BODY_TOOLS: SkinBodyTool[] = [
  {
    id: "abs",
    title: "AI Abs Filter",
    tagline: "Realistic abdominal definition & athletic toning",
    badge: "Sculpt 4K",
    image: "/fashion-samples/source/fullbody_01.jpg",
    description: "Generate natural six-pack or sleek vest-line abdominal definition on athletic or swimwear photos with neural contouring.",
    icon: Flame,
  },
  {
    id: "smile",
    title: "AI Smile Generator",
    tagline: "Transform neutral portraits into radiant smiles",
    badge: "Generative",
    image: "/ai-photo-editing-images/face-swap.jpg",
    description: "Instantly convert neutral, serious, or closed facial expressions into cheerful, warm smiles with natural teeth visibility.",
    icon: Smile,
  },
  {
    id: "aging",
    title: "AI Aging Simulation",
    tagline: "Simulate decades of graceful age progression",
    badge: "Time Travel",
    image: "/ai-photo-editing-images/ai-age.webp",
    description: "Simulate youthful de-aging or explore future decades with clinically informed facial collagen, wrinkle, and volume evolution.",
    icon: Clock,
  },
  {
    id: "body_reshape",
    title: "AI Body Reshape & Slimming",
    tagline: "Natural proportions, waistline & leg lengthening",
    badge: "3D Contour",
    image: "/fashion-samples/source/fullbody_02.jpg",
    description: "Effortlessly refine anatomical proportions: sculpt the waist, contour hips and arms, flatten the belly, and lengthen legs.",
    icon: Activity,
  },
  {
    id: "fitzpatrick",
    title: "Fitzpatrick Skin Type Mapping",
    tagline: "Photometric UV response & phototype I-VI classification",
    badge: "Photometric",
    image: "/ai-photo-editing-images/skin-type-analaysis.webp",
    description: "Accurately classify skin melanin index across the clinical Fitzpatrick Scale (I to VI) to forecast UV sensitivity and SPF needs.",
    icon: Sun,
  },
  {
    id: "skin_analysis",
    title: "AI Clinical Skin Analysis",
    tagline: "12-point dermatological scan for wrinkles, pores & texture",
    badge: "Clinical AI",
    image: "/ai-photo-editing-images/ai-skin-analaysis.webp",
    description: "Comprehensive medical-grade scan evaluating wrinkle depth, pore visibility, hydration, redness, dark circles, and sebum levels.",
    icon: HeartPulse,
  },
];

// =============================================================================
// 2. SAMPLE PORTRAITS & BODY MODELS (MATCHING BEAUTY STUDIO SPEC)
// =============================================================================
interface SampleModel {
  id: string;
  name: string;
  src: string;
  gender: string;
  category: "portrait" | "body";
}

const SAMPLE_MODELS: SampleModel[] = [
  // 5 Portrait Models (Exact same 5 models from Beauty Studio)
  { id: "girl1", name: "Elena", src: "/normal-headshot/girl1.png", gender: "Female", category: "portrait" },
  { id: "girl2", name: "Sophia", src: "/normal-headshot/girl2.png", gender: "Female", category: "portrait" },
  { id: "girl3", name: "Amara", src: "/normal-headshot/girl3.png", gender: "Female", category: "portrait" },
  { id: "girl4", name: "Mia", src: "/normal-headshot/girl4.png", gender: "Female", category: "portrait" },
  { id: "boy1", name: "Lucas", src: "/normal-headshot/boy1.png", gender: "Male", category: "portrait" },

  // 5 Body Models (For Abs Filter & Body Reshape)
  { id: "body1", name: "Elena Fit", src: "/skin-body-samples/body-sample-01.jpg", gender: "Female", category: "body" },
  { id: "body2", name: "Marcus", src: "/skin-body-samples/body-sample-02.jpg", gender: "Male", category: "body" },
  { id: "body3", name: "Athletic", src: "/fashion-samples/source/sample_Image_1_202b6bf6e6.jpg", gender: "Female", category: "body" },
  { id: "body4", name: "Runway", src: "/fashion-samples/source/clothes_03_cccd5d4803.jpeg", gender: "Female", category: "body" },
  { id: "body5", name: "Lucas Sport", src: "/normal-headshot/boy1.png", gender: "Male", category: "body" },
];

// =============================================================================
// 3. FITZPATRICK SCALE REFERENCE METADATA
// =============================================================================
const FITZPATRICK_SCALE_DATA: Record<
  string,
  {
    title: string;
    skinType: string;
    sunReaction: string;
    spf: string;
    melanin: string;
    color: string;
    bgBadge: string;
    recommendation: string;
  }
> = {
  I: {
    title: "Type I - Pale / Ivory",
    skinType: "Very Fair, porcelain skin",
    sunReaction: "Always burns severely, never tans, high freckling propensity",
    spf: "SPF 50+ Broad Spectrum (Daily Essential)",
    melanin: "Very Low (Minimal photoprotection)",
    color: "#FDE68A",
    bgBadge: "bg-amber-100 text-amber-900 border-amber-300",
    recommendation: "High UV sensitivity. Reapply mineral sunscreen every 2 hours; incorporate topical Vitamin C and avoid peak solar midday UV.",
  },
  II: {
    title: "Type II - Fair / Beige",
    skinType: "Fair skin, usually blue/green eyes, light hair",
    sunReaction: "Burns easily, tans minimally and with difficulty",
    spf: "SPF 50+ Broad Spectrum",
    melanin: "Low Melanin Index",
    color: "#FCD34D",
    bgBadge: "bg-yellow-100 text-yellow-900 border-yellow-300",
    recommendation: "Susceptible to erythema and photo-aging. Utilize broad-spectrum antioxidant protection and daily PA++++ UV defense.",
  },
  III: {
    title: "Type III - Light Brown / Golden",
    skinType: "Medium-fair to golden undertone",
    sunReaction: "Burns moderately, gradually tans to light bronze",
    spf: "SPF 30 to 50 Broad Spectrum",
    melanin: "Moderate Melanin Balance",
    color: "#F59E0B",
    bgBadge: "bg-orange-100 text-orange-900 border-orange-300",
    recommendation: "Balanced melanin response with moderate risk of post-inflammatory hyperpigmentation. Prioritize niacinamide and barrier ceramides.",
  },
  IV: {
    title: "Type IV - Medium Brown / Olive",
    skinType: "Olive or Mediterranean undertone",
    sunReaction: "Burns minimally, tans easily to moderate brown",
    spf: "SPF 30 Broad Spectrum",
    melanin: "High-Moderate Melanin",
    color: "#D97706",
    bgBadge: "bg-amber-200 text-amber-950 border-amber-400",
    recommendation: "High natural photoprotection, but predisposed to dark spots. Apply gentle exfoliation and tinted sunscreen with iron oxides for visible light defense.",
  },
  V: {
    title: "Type V - Dark Brown",
    skinType: "Deep brown skin tone",
    sunReaction: "Very rarely burns, tans very easily and profusely",
    spf: "SPF 30 Broad Spectrum",
    melanin: "High Melanin Density",
    color: "#B45309",
    bgBadge: "bg-orange-200 text-orange-950 border-orange-400",
    recommendation: "Natural resistance to UV sunburn; prioritize hydration, azelaic acid for evening tone, and non-comedogenic mineral sunscreens without white cast.",
  },
  VI: {
    title: "Type VI - Deep Bronze / Noir",
    skinType: "Deepest pigmented skin",
    sunReaction: "Never burns, deeply pigmented melanin matrix",
    spf: "SPF 30 Hydrating Gel Sunscreen",
    melanin: "Maximum Natural Photoprotection",
    color: "#78350F",
    bgBadge: "bg-stone-200 text-stone-900 border-stone-400",
    recommendation: "Robust photoprotection against sunburn. Focus on lipid barrier reinforcement, hyaluronic acid hydration, and uniform hyperpigmentation defense.",
  },
};

// =============================================================================
// 4. PIPELINE STAGES (WORLD-CLASS STUDIO LOADER)
// =============================================================================
const STUDIO_STAGES = [
  { id: "detect", label: "Anatomical Detection", detail: "Detecting facial landmarks, posture geometry & skin contours..." },
  { id: "synthesis", label: "Neural Synthesis", detail: "Applying athletic definition, smile curvature or dermal analysis..." },
  { id: "blend", label: "Photorealistic Blend", detail: "Harmonizing subsurface light rays, organic texture & tone..." },
  { id: "upscale", label: "4K UHD Export", detail: "Enhancing resolution, micro-details & studio telemetry..." },
];

export default function SkinFaceStudioPage() {
  const { credits, refreshCredits, user } = useAuth();

  // 1. Tool Selection State
  const [selectedTool, setSelectedTool] = useState<SkinBodyToolId>("abs");

  // 2. Source Image State - UPLOAD PHOTO IS FIRST BY DEFAULT
  const [sourceTab, setSourceTab] = useState<"upload" | "test">("upload");
  const [selectedSource, setSelectedSource] = useState<string>("/skin-body-samples/body-sample-01.jpg");
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Tool Specific Customization States
  // A. Abs Filter
  const [absMode, setAbsMode] = useState<"Six-pack" | "Vest-line">("Six-pack");
  const [absIntensity, setAbsIntensity] = useState<number>(1);

  // B. Smile Generator
  const [expressionType, setExpressionType] = useState<"smile_with_teeth_visible" | "closed_mouth_smile">("smile_with_teeth_visible");

  // C. Aging Simulation
  const [agingStageIndex, setAgingStageIndex] = useState<number>(0);
  const [agingStageUrls, setAgingStageUrls] = useState<string[]>([]);

  // D. Body Reshape
  const [bodyFeatures, setBodyFeatures] = useState({
    slim: -20,
    waist: -25,
    taller: 15,
    leg: -10,
    hip: 10,
    hip_lift: 15,
    belly: -20,
    arm: -10,
    shoulder: 0,
    neck: 0,
    breast: 0,
  });

  // E. Fitzpatrick Skin Type Analysis Focus
  const [fitzpatrickFocus, setFitzpatrickFocus] = useState<string>("spf");

  // F. Skin Analysis View Mode & Scan Scope
  const [diagnosticScanType, setDiagnosticScanType] = useState<"full" | "anti_aging" | "clarity">("full");
  const [analysisData, setAnalysisData] = useState<any>(null);

  // 4. Viewport & View Mode States (Result | Split / Compare | Original)
  const [viewMode, setViewMode] = useState<"result" | "split" | "original">("split");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // 5. Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStageIndex, setGenerationStageIndex] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Layout Height Synchronization (Matching Beauty Studio)
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
  }, []);

  // Active Source Image Resolution
  const activeSourceImage = uploadedPreview || selectedSource;
  const currentTool = SKIN_BODY_TOOLS.find((t) => t.id === selectedTool) || SKIN_BODY_TOOLS[0];
  const ActiveToolIcon = currentTool.icon;

  const isBodyTool = selectedTool === "abs" || selectedTool === "body_reshape";

  // Curated 5 samples matching current tool category (5 models per category, identical grid to Beauty Studio)
  const visibleSamples = React.useMemo(() => {
    if (isBodyTool) {
      return SAMPLE_MODELS.filter((m) => m.category === "body");
    }
    return SAMPLE_MODELS.filter((m) => m.category === "portrait");
  }, [isBodyTool]);

  // Handle Tool Switch
  const handleSelectTool = (toolId: SkinBodyToolId) => {
    setSelectedTool(toolId);
    setHasGenerated(false);
    setGeneratedImageUrl(null);
    setAgingStageUrls([]);
    setAnalysisData(null);
    setErrorMessage(null);
    setViewMode("result");

    // Automatically assign suitable default sample if currently using samples
    if (!uploadedPreview) {
      if (toolId === "abs" || toolId === "body_reshape") {
        setSelectedSource("/skin-body-samples/body-sample-01.jpg");
      } else {
        setSelectedSource("/normal-headshot/girl1.png");
      }
    }
  };

  // Upload Photo File Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        setErrorMessage("Photo size exceeds 12MB. Please upload a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPreview(event.target?.result as string);
        setSourceTab("upload");
        setHasGenerated(false);
        setErrorMessage(null);
        setAnalysisData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop Handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        setErrorMessage("Photo size exceeds 12MB. Please upload a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPreview(event.target?.result as string);
        setSourceTab("upload");
        setHasGenerated(false);
        setErrorMessage(null);
        setAnalysisData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Slider Dragging Handler (Container bounds calculation)
  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  // Global mouse/touch events for smooth drag
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) handleSliderMove(e.clientX);
    };
    const handleGlobalMouseUp = () => {
      if (isDraggingSlider) setIsDraggingSlider(false);
    };
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDraggingSlider && e.touches[0]) handleSliderMove(e.touches[0].clientX);
    };

    if (isDraggingSlider) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("touchmove", handleGlobalTouchMove);
      window.addEventListener("touchend", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [isDraggingSlider, handleSliderMove]);

  // Main Generation Handler
  const handleGenerate = async () => {
    if (credits < 5) {
      setErrorMessage("Insufficient credits (5 required). Please refill your credit balance.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationProgress(10);
    setGenerationStageIndex(0);

    // Auto-scroll to Studio Viewport on mobile
    if (window.innerWidth < 1024 && canvasCardRef.current) {
      canvasCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const pInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(pInterval);
          return 95;
        }
        const step = Math.floor(Math.random() * 8) + 4;
        const next = prev + step;
        if (next > 75) setGenerationStageIndex(3);
        else if (next > 50) setGenerationStageIndex(2);
        else if (next > 25) setGenerationStageIndex(1);
        return Math.min(next, 95);
      });
    }, 450);

    try {
      const payload: any = {
        toolId: selectedTool,
        srcImage: activeSourceImage,
        userId: user?.id,
        settings: {},
      };

      if (selectedTool === "abs") {
        payload.settings = { mode: absMode, intensity: absIntensity };
      } else if (selectedTool === "smile") {
        payload.settings = { expressionType };
      } else if (selectedTool === "aging") {
        payload.settings = { simulationType: "time-lapse" };
      } else if (selectedTool === "body_reshape") {
        payload.settings = { features: bodyFeatures };
      } else if (selectedTool === "fitzpatrick") {
        payload.settings = { focus: fitzpatrickFocus };
      } else if (selectedTool === "skin_analysis") {
        payload.settings = { scanType: diagnosticScanType };
      }

      const res = await fetch("/api/skin-face/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      clearInterval(pInterval);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Transformation failed. Please verify source photo clarity.");
      }

      setGenerationProgress(100);
      setGenerationStageIndex(3);

      setTimeout(() => {
        setGeneratedImageUrl(data.resultImageUrl);
        if (Array.isArray(data.urls) && data.urls.length > 0) {
          setAgingStageUrls(data.urls);
        } else {
          setAgingStageUrls([data.resultImageUrl]);
        }
        setAnalysisData(data.analysisData || null);
        setHasGenerated(true);
        setViewMode("result");
        setIsGenerating(false);
        refreshCredits();
      }, 400);
    } catch (err: any) {
      clearInterval(pInterval);
      setIsGenerating(false);
      setErrorMessage(err.message || "Failed to complete AI processing.");
    }
  };

  // Download Lossless 4K Image
  const handleDownload = async (urlToDownload?: string) => {
    const targetUrl = urlToDownload || generatedImageUrl || activeSourceImage;
    if (!targetUrl) return;
    try {
      setIsDownloading(true);
      const res = await fetch(targetUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `beautyaura-${selectedTool}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download failed:", e);
      window.open(targetUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const currentSampleName =
    SAMPLE_MODELS.find((m) => m.src === selectedSource)?.name || "Elena";

  return (
    <div className="space-y-6 pb-2">
      {/* =========================================================================
          TOP HEADER & CREDIT STATUS (MATCHING BEAUTY STUDIO EXACTLY)
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <Smile className="h-3.5 w-3.5 text-[#FF5500]" />
            <span>AI Dermatology, Face &amp; Body Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-0.5">
            AI Skin &amp; Face &amp; Body Studio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Sculpt athletic abs, transform smile expressions, simulate aging, contour 3D body proportions, and conduct clinical dermatological scans.
          </p>
        </div>

        {/* Minimalist Top Credit Pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/80 px-3.5 py-1 text-xs font-bold text-zinc-800 shadow-2xs">
            <Zap className="h-3.5 w-3.5 fill-[#FF5500] text-[#FF5500]" />
            <span>5 Credits / render</span>
          </div>
          <span className="text-xs font-bold text-zinc-500">
            Balance: <span className="text-zinc-900 font-black">{credits}</span>
          </span>
        </div>
      </div>

      {/* Credit Warning Banner */}
      {credits < 5 && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>
              Low credit balance ({credits} remaining). You need at least 5 credits to generate transformations.
            </span>
          </div>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-1 font-bold text-rose-700 hover:text-rose-900 underline ml-2 shrink-0"
          >
            Refill Credits <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* =========================================================================
          MAIN 2-COLUMN STUDIO LAYOUT (MATCHING BEAUTY STUDIO EXACTLY)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* =======================================================================
            LEFT COLUMN: TOOL SELECTION, SOURCE PHOTO & CONTROLS (SCROLLABLE 1, 2, 3)
        ======================================================================= */}
        <div
          style={isDesktop && canvasHeight ? { maxHeight: `${canvasHeight}px` } : undefined}
          className="order-1 lg:order-none lg:col-span-5 xl:col-span-5 space-y-5 lg:overflow-y-auto lg:pr-2.5 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-stone-100/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-200/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5500]/70 transition-colors"
        >
          {/* 1. SELECT AI TOOL SECTION */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  1
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Select AI Tool
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#FF5500]">
                6 Studio Engines
              </span>
            </div>

            {/* Tool Selection Cards Stack */}
            <div className="space-y-2.5">
              {SKIN_BODY_TOOLS.map((tool) => {
                const isActive = selectedTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleSelectTool(tool.id)}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all cursor-pointer",
                      isActive
                        ? "bg-gradient-to-r from-orange-50/90 to-amber-50/50 border-[#FF5500] ring-2 ring-[#FF5500]/20 shadow-xs"
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
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div>
                        <span
                          className={cn(
                            "inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider mb-1",
                            isActive
                              ? "bg-[#FF5500] text-white shadow-2xs"
                              : "bg-orange-100 text-orange-700"
                          )}
                        >
                          {tool.badge}
                        </span>
                      </div>
                      <span className="text-xs font-black text-zinc-900 leading-snug">
                        {tool.title}
                      </span>
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

          {/* 2. SOURCE IMAGE SECTION (UPLOAD PHOTO TAB FIRST BY DEFAULT) */}
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
                {selectedTool === "abs" || selectedTool === "body_reshape"
                  ? "Full body or torso"
                  : "Front-facing portrait"}
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
                Sample {isBodyTool ? "Models" : "Portraits"} (5)
              </button>
            </div>

            {/* Tab 1: Upload Image Dropzone (First) */}
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
                  PNG, JPG or WebP up to 12MB
                </p>
              </div>
            )}

            {/* Tab 2: Sample Portraits Grid (Matching Beauty Studio Exactly) */}
            {sourceTab === "test" && (
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2">
                  {visibleSamples.map((portrait) => {
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

            {/* Selected Image Preview Pill (Matching Beauty Studio Exactly) */}
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
                      : `Selected Portrait (${currentSampleName})`}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    {selectedTool === "abs" || selectedTool === "body_reshape"
                      ? "Full Body / Torso Calibrated"
                      : "Portrait Detected (Face Centered)"}
                  </span>
                </div>
              </div>

              {sourceTab === "upload" && uploadedPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setUploadedPreview(null);
                    setSelectedSource(
                      isBodyTool
                        ? "/skin-body-samples/body-sample-01.jpg"
                        : "/normal-headshot/girl1.png"
                    );
                  }}
                  className="text-xs font-bold text-zinc-400 hover:text-rose-600 transition px-2 py-1 cursor-pointer shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 3. CONFIGURE TOOL SECTION (DYNAMIC PER SELECTED TOOL) */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  3
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Configure AI Tool
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#FF5500]">
                {currentTool.title}
              </span>
            </div>

            {/* A. Dynamic Controls: AI Abs Filter */}
            {selectedTool === "abs" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-2">
                    Abdominal Sculpt Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAbsMode("Six-pack")}
                      className={cn(
                        "p-3 rounded-2xl border text-left cursor-pointer transition-all",
                        absMode === "Six-pack"
                          ? "bg-orange-50/70 border-[#FF5500] ring-1 ring-[#FF5500]"
                          : "border-stone-200 hover:border-orange-200 bg-white"
                      )}
                    >
                      <p className="text-xs font-bold text-zinc-900">Six-Pack Definition</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        Deep anatomical rectus abdominis muscle sculpting.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAbsMode("Vest-line")}
                      className={cn(
                        "p-3 rounded-2xl border text-left cursor-pointer transition-all",
                        absMode === "Vest-line"
                          ? "bg-orange-50/70 border-[#FF5500] ring-1 ring-[#FF5500]"
                          : "border-stone-200 hover:border-orange-200 bg-white"
                      )}
                    >
                      <p className="text-xs font-bold text-zinc-900">Vest-Line / 11-Line</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        Sleek central abdominal line for athletic fit elegance.
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-zinc-700">
                      Muscle Definition Intensity
                    </label>
                    <span className="text-xs font-black text-[#FF5500]">
                      {absIntensity === 1 ? "Level 1: Natural Fit" : "Level 2: Deep Sculpted"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAbsIntensity(1)}
                      className={cn(
                        "py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                        absIntensity === 1
                          ? "bg-[#FF5500] text-white border-[#FF5500] shadow-2xs"
                          : "bg-stone-50 border-stone-200 text-zinc-700 hover:bg-stone-100"
                      )}
                    >
                      Natural Sculpt (1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAbsIntensity(2)}
                      className={cn(
                        "py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                        absIntensity === 2
                          ? "bg-[#FF5500] text-white border-[#FF5500] shadow-2xs"
                          : "bg-stone-50 border-stone-200 text-zinc-700 hover:bg-stone-100"
                      )}
                    >
                      Deep Athletic (2)
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 rounded-xl bg-orange-50/50 p-2.5 text-[11px] text-zinc-500">
                  <Info className="h-3.5 w-3.5 shrink-0 text-[#FF5500] mt-0.5" />
                  <span>
                    Torso or midriff should be visible in swimwear, fitness apparel, or unbuttoned top for optimal muscular synthesis.
                  </span>
                </div>
              </div>
            )}

            {/* B. Dynamic Controls: AI Smile Generator */}
            {selectedTool === "smile" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-2">
                    Smile Expression Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setExpressionType("smile_with_teeth_visible")}
                      className={cn(
                        "p-3 rounded-2xl border text-left cursor-pointer transition-all",
                        expressionType === "smile_with_teeth_visible"
                          ? "bg-orange-50/70 border-[#FF5500] ring-1 ring-[#FF5500]"
                          : "border-stone-200 hover:border-orange-200 bg-white"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Smile className="h-4 w-4 text-[#FF5500]" />
                        <p className="text-xs font-bold text-zinc-900">Radiant Teeth Smile</p>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">
                        Bright, joyful smile with naturally visible, photorealistic teeth. Ideal for upbeat social and candid portraits.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpressionType("closed_mouth_smile")}
                      className={cn(
                        "p-3 rounded-2xl border text-left cursor-pointer transition-all",
                        expressionType === "closed_mouth_smile"
                          ? "bg-orange-50/70 border-[#FF5500] ring-1 ring-[#FF5500]"
                          : "border-stone-200 hover:border-orange-200 bg-white"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="h-4 w-4 text-[#FF5500]" />
                        <p className="text-xs font-bold text-zinc-900">Gentle Closed-Lip</p>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">
                        Subtle, warm smile with lips closed. Ideal for executive headshots, professional bios, and serene portraits.
                      </p>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 rounded-xl bg-orange-50/50 p-2.5 text-[11px] text-zinc-500">
                  <Info className="h-3.5 w-3.5 shrink-0 text-[#FF5500] mt-0.5" />
                  <span>
                    Generative smile model detects lip landmarks, teeth alignment, cheek muscle lift, and periorbital smile crinkles.
                  </span>
                </div>
              </div>
            )}

            {/* C. Dynamic Controls: AI Aging Simulation */}
            {selectedTool === "aging" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/70">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 mb-1">
                    <Clock className="h-4 w-4 text-[#FF5500]" />
                    <span>Multi-Decade Time Progression</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Generative AI Aging synthesizes a progressive chronological timeline from a single selfie portrait, tracking collagen maturity and volume changes.
                  </p>
                </div>

                {agingStageUrls.length > 1 && (
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-2">
                      Generated Chronological Stages
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {agingStageUrls.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setAgingStageIndex(idx);
                            setGeneratedImageUrl(url);
                          }}
                          className={cn(
                            "relative aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer",
                            agingStageIndex === idx
                              ? "border-[#FF5500] ring-2 ring-[#FF5500]"
                              : "border-stone-200 hover:border-orange-200"
                          )}
                        >
                          <Image
                            src={url}
                            alt={`Aging stage ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] font-bold text-center py-0.5">
                            Stage {idx + 1}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* D. Dynamic Controls: AI Body Reshape */}
            {selectedTool === "body_reshape" && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-zinc-700">Quick Shape Presets</label>
                    <button
                      type="button"
                      onClick={() =>
                        setBodyFeatures({
                          slim: -20,
                          waist: -25,
                          taller: 15,
                          leg: -10,
                          hip: 10,
                          hip_lift: 15,
                          belly: -20,
                          arm: -10,
                          shoulder: 0,
                          neck: 0,
                          breast: 0,
                        })
                      }
                      className="text-[10px] text-zinc-400 hover:text-[#FF5500] font-bold cursor-pointer"
                    >
                      Reset Defaults
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                    <button
                      type="button"
                      onClick={() =>
                        setBodyFeatures({
                          slim: -25,
                          waist: -35,
                          hip: 20,
                          hip_lift: 25,
                          taller: 10,
                          leg: -15,
                          belly: -30,
                          arm: -15,
                          shoulder: 0,
                          neck: 0,
                          breast: 10,
                        })
                      }
                      className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-orange-50 hover:text-[#FF5500] text-[11px] font-bold text-zinc-700 transition-colors text-center cursor-pointer"
                    >
                      Hourglass
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBodyFeatures({
                          slim: -30,
                          waist: -20,
                          taller: 30,
                          leg: -25,
                          hip: 0,
                          hip_lift: 10,
                          belly: -20,
                          arm: -15,
                          shoulder: 10,
                          neck: 10,
                          breast: 0,
                        })
                      }
                      className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-orange-50 hover:text-[#FF5500] text-[11px] font-bold text-zinc-700 transition-colors text-center cursor-pointer"
                    >
                      Runway Tall
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBodyFeatures({
                          slim: -15,
                          waist: -25,
                          belly: -35,
                          arm: -20,
                          shoulder: 15,
                          hip: 10,
                          hip_lift: 15,
                          leg: -10,
                          taller: 5,
                          neck: 0,
                          breast: 0,
                        })
                      }
                      className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-orange-50 hover:text-[#FF5500] text-[11px] font-bold text-zinc-700 transition-colors text-center cursor-pointer"
                    >
                      Athletic Fit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBodyFeatures({
                          slim: -10,
                          waist: -15,
                          belly: -15,
                          taller: 10,
                          hip: 5,
                          hip_lift: 10,
                          leg: -5,
                          arm: -5,
                          shoulder: 0,
                          neck: 0,
                          breast: 0,
                        })
                      }
                      className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-orange-50 hover:text-[#FF5500] text-[11px] font-bold text-zinc-700 transition-colors text-center cursor-pointer"
                    >
                      Natural Slim
                    </button>
                  </div>
                </div>

                {/* Precision Sliders */}
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-700">Waist Slimming</span>
                      <span className="text-[#FF5500] font-black">{bodyFeatures.waist}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={bodyFeatures.waist}
                      onChange={(e) =>
                        setBodyFeatures((prev) => ({ ...prev, waist: Number(e.target.value) }))
                      }
                      className="w-full accent-[#FF5500] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-700">Belly Flattening</span>
                      <span className="text-[#FF5500] font-black">{bodyFeatures.belly}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={bodyFeatures.belly}
                      onChange={(e) =>
                        setBodyFeatures((prev) => ({ ...prev, belly: Number(e.target.value) }))
                      }
                      className="w-full accent-[#FF5500] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-700">Height / Lengthen Legs</span>
                      <span className="text-[#FF5500] font-black">+{bodyFeatures.taller}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={bodyFeatures.taller}
                      onChange={(e) =>
                        setBodyFeatures((prev) => ({ ...prev, taller: Number(e.target.value) }))
                      }
                      className="w-full accent-[#FF5500] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-700">Overall Body Slim</span>
                      <span className="text-[#FF5500] font-black">{bodyFeatures.slim}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={bodyFeatures.slim}
                      onChange={(e) =>
                        setBodyFeatures((prev) => ({ ...prev, slim: Number(e.target.value) }))
                      }
                      className="w-full accent-[#FF5500] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-700">Hip Curve &amp; Lift</span>
                      <span className="text-[#FF5500] font-black">+{bodyFeatures.hip_lift}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={bodyFeatures.hip_lift}
                      onChange={(e) =>
                        setBodyFeatures((prev) => ({
                          ...prev,
                          hip_lift: Number(e.target.value),
                          hip: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-[#FF5500] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* E. Dynamic Controls: AI Fitzpatrick Skin Type Analysis */}
            {selectedTool === "fitzpatrick" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-2">
                    Dermatological Report Focus
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "spf", label: "SPF & PA Rating" },
                      { id: "melanin", label: "Melanin Index" },
                      { id: "sunburn", label: "UV Burn Risk" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFitzpatrickFocus(f.id)}
                        className={cn(
                          "py-2 px-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer",
                          fitzpatrickFocus === f.id
                            ? "bg-orange-50 border-[#FF5500] text-[#FF5500]"
                            : "bg-stone-50 border-stone-200 text-zinc-700 hover:bg-stone-100"
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-600 block mb-1.5">
                    Fitzpatrick Scale Spectrum (Types I - VI)
                  </label>
                  <div className="grid grid-cols-6 gap-1 h-3 rounded-md overflow-hidden border border-stone-200 mb-1.5">
                    <div className="bg-[#FDE68A]" title="Type I - Very Fair" />
                    <div className="bg-[#FCD34D]" title="Type II - Fair" />
                    <div className="bg-[#F59E0B]" title="Type III - Medium" />
                    <div className="bg-[#D97706]" title="Type IV - Olive" />
                    <div className="bg-[#B45309]" title="Type V - Brown" />
                    <div className="bg-[#78350F]" title="Type VI - Deep" />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                    <span>Type I (Burns)</span>
                    <span>Type VI (Deep)</span>
                  </div>
                </div>
              </div>
            )}

            {/* F. Dynamic Controls: AI Skin Analysis */}
            {selectedTool === "skin_analysis" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-2">
                    Diagnostic Scan Scope
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDiagnosticScanType("full")}
                      className={cn(
                        "p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                        diagnosticScanType === "full"
                          ? "bg-orange-50 border-[#FF5500] text-[#FF5500]"
                          : "bg-white border-stone-200 hover:border-orange-200 text-zinc-700"
                      )}
                    >
                      <p className="text-xs font-bold">12-Point Scan</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Full Clinical</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDiagnosticScanType("anti_aging")}
                      className={cn(
                        "p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                        diagnosticScanType === "anti_aging"
                          ? "bg-orange-50 border-[#FF5500] text-[#FF5500]"
                          : "bg-white border-stone-200 hover:border-orange-200 text-zinc-700"
                      )}
                    >
                      <p className="text-xs font-bold">Anti-Aging</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Wrinkle Depth</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDiagnosticScanType("clarity")}
                      className={cn(
                        "p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                        diagnosticScanType === "clarity"
                          ? "bg-orange-50 border-[#FF5500] text-[#FF5500]"
                          : "bg-white border-stone-200 hover:border-orange-200 text-zinc-700"
                      )}
                    >
                      <p className="text-xs font-bold">Clarity &amp; Pore</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Blemish &amp; Oil</p>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 rounded-xl bg-orange-50/50 p-2.5 text-[11px] text-zinc-500">
                  <Info className="h-3.5 w-3.5 shrink-0 text-[#FF5500] mt-0.5" />
                  <span>
                    Dermal scanning evaluates micro-relief, follicular pores, sebum balance, dark circles, and erythema redness.
                  </span>
                </div>
              </div>
            )}

            {/* Primary Generation CTA Button (Matching Beauty Studio Exactly) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || credits < 5}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] py-3.5 px-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 hover:shadow-orange-500/35 transition cursor-pointer disabled:opacity-50 whitespace-nowrap overflow-hidden"
              >
                {isGenerating ? (
                  <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
                    <span>Generating Transformation... ({generationProgress}%)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <ActiveToolIcon className="h-4 w-4 shrink-0" />
                    <span>Generate Transformation (5 Credits)</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Error Message Notice */}
          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 flex items-start gap-2.5 text-xs text-red-800">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Transformation Notice: </span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Studio Viewport & Result (Matching Beauty Studio Exactly)
        ========================================================================= */}
        <div className="order-2 lg:order-none lg:col-span-7 xl:col-span-7 space-y-4">
          <div
            ref={canvasCardRef}
            className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-white p-4 shadow-lg space-y-4"
          >
            {/* Viewport Top Controls Bar (Matching Beauty Studio Exactly) */}
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
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/11] min-h-[360px] sm:min-h-[400px] w-full overflow-hidden rounded-2xl flex items-center justify-center transition-all border border-orange-100 bg-gradient-to-b from-stone-50 via-white to-orange-50/20">
              {/* CASE 1: Generating Loading State - Minimal Clean Studio Loader */}
              {isGenerating && (
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
                          alt="AI Generated Result"
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

                  {/* Mode: Interactive Split Compare Slider (Original on Left, Result on Right) */}
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
                        {/* Layer 1: After Image (Full background layer, revealed on the RIGHT) */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={generatedImageUrl}
                          alt="After AI"
                          className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
                        />

                        {/* Layer 2: Before Image (Exact same position & size, clipped from right, visible on the LEFT) */}
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

                        {/* Draggable Divider Line & Knob */}
                        <div
                          className="absolute inset-y-0 w-0.5 bg-white shadow-2xl z-20 pointer-events-none"
                          style={{ left: `${sliderPosition}%` }}
                        >
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xl border-2 border-orange-400 text-[#FF5500]">
                            <Columns2 className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Badges (Matching Beauty Studio Exactly) */}
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
                /* CASE 3: Pre-generation State */
                <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative h-56 w-44 sm:h-64 sm:w-52 overflow-hidden rounded-2xl border-2 border-orange-200/80 bg-white shadow-lg">
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
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Viewport Control Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100/80 pt-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                <span className="font-bold text-zinc-700">Studio Specs:</span>
                <span>Lossless 4K Render</span>
                <span>&bull;</span>
                <span>Neural Studio Cloud</span>
                <span>&bull;</span>
                <span>High Precision Synthesis</span>
              </div>

              {hasGenerated && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHasGenerated(false);
                      setGeneratedImageUrl(null);
                      setAnalysisData(null);
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-orange-200 px-3.5 py-1.5 text-xs font-bold text-zinc-600 hover:bg-stone-50 transition cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload()}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:opacity-95 transition cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isDownloading ? "Exporting..." : "Export 4K UHD"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
