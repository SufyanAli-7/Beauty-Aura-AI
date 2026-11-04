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
  ArrowRight,
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
// 2. CURATED SAMPLE SOURCE IMAGES (TAILORED PER TOOL)
// =============================================================================
interface SampleSource {
  id: string;
  name: string;
  label: string;
  src: string;
  forTools: SkinBodyToolId[];
  desc: string;
}

const SAMPLE_SOURCES: SampleSource[] = [
  {
    id: "body-01",
    name: "Elena - Athletic Full Body",
    label: "Full Body Standing",
    src: "/skin-body-samples/body-sample-01.jpg",
    forTools: ["abs", "body_reshape"],
    desc: "Full-body fitness portrait ideal for abdominal sculpt and 3D silhouette contouring.",
  },
  {
    id: "body-02",
    name: "Marcus - Studio Full Body",
    label: "Full Body Standing",
    src: "/skin-body-samples/body-sample-02.jpg",
    forTools: ["abs", "body_reshape"],
    desc: "Standing upright pose perfect for waist slimming, height elongation, and torso toning.",
  },
  {
    id: "face-01",
    name: "Chloe - Frontal Portrait",
    label: "Fair Tone (Fitzpatrick II)",
    src: "/skin-body-samples/face-sample-01.png",
    forTools: ["smile", "aging", "fitzpatrick", "skin_analysis"],
    desc: "Studio frontal portrait with neutral expression for smile, aging, and dermal analysis.",
  },
  {
    id: "face-02",
    name: "Aria - Serene Portrait",
    label: "Light Olive Tone (Fitzpatrick III)",
    src: "/skin-body-samples/face-sample-02.png",
    forTools: ["smile", "aging", "fitzpatrick"],
    desc: "Natural expression suited for closed-mouth smile simulation and phototype mapping.",
  },
  {
    id: "face-03",
    name: "Lucas - Male Executive",
    label: "Medium Tone (Fitzpatrick IV)",
    src: "/skin-body-samples/face-sample-03.png",
    forTools: ["smile", "aging", "fitzpatrick", "skin_analysis"],
    desc: "Clear frontal male portrait for age progression and clinical pore/sebum scanning.",
  },
  {
    id: "face-04",
    name: "Sophia - Studio Close-Up",
    label: "Beige Tone (Fitzpatrick II)",
    src: "/skin-body-samples/face-sample-04.jpg",
    forTools: ["smile", "aging", "fitzpatrick", "skin_analysis"],
    desc: "High-resolution close-up portrait optimal for 12-point dermatological diagnostic scans.",
  },
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
    skinType: "Olive or Mediterranean Mediterranean undertone",
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
const SKIN_BODY_STAGES = [
  { id: "alignment", label: "Pose & Anatomical Detection", detail: "Locating facial landmarks, torso geometry & dermal zones..." },
  { id: "synthesis", label: "Generative Neural Modeling", detail: "Synthesizing athletic contouring, smile curvature or spectral dermis..." },
  { id: "harmonization", label: "Subsurface Scattering & Light", detail: "Harmonizing ambient light rays, skin pigments & organic texture..." },
  { id: "rendering", label: "4K UHD Export & Diagnostic Spec", detail: "Finalizing lossless 4K studio render & clinical telemetry data..." },
];

export default function SkinFaceStudioPage() {
  const { credits, refreshCredits, user } = useAuth();

  // Studio Selection State
  const [selectedTool, setSelectedTool] = useState<SkinBodyToolId>("abs");
  const [sourceType, setSourceType] = useState<"sample" | "upload">("sample");
  const [selectedSampleId, setSelectedSampleId] = useState<string>("body-01");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Tool Specific Customization States
  // 1. Abs Filter
  const [absMode, setAbsMode] = useState<"Six-pack" | "Vest-line">("Six-pack");
  const [absIntensity, setAbsIntensity] = useState<number>(1);

  // 2. Smile Generator
  const [expressionType, setExpressionType] = useState<"smile_with_teeth_visible" | "closed_mouth_smile">("smile_with_teeth_visible");

  // 3. Aging Simulation
  const [agingStageIndex, setAgingStageIndex] = useState<number>(0);
  const [agingStageUrls, setAgingStageUrls] = useState<string[]>([]);

  // 4. Body Reshape (Features)
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

  // 5. Fitzpatrick Skin Type Analysis Focus
  const [fitzpatrickFocus, setFitzpatrickFocus] = useState<string>("spf");

  // 6. Skin Analysis View Mode (Clinical Dashboard vs Before/After Photo)
  const [analysisViewMode, setAnalysisViewMode] = useState<"dashboard" | "photo">("dashboard");
  const [diagnosticScanType, setDiagnosticScanType] = useState<"full" | "anti_aging" | "clarity">("full");

  // Output Telemetry & Diagnostics
  const [analysisData, setAnalysisData] = useState<any>(null);

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
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

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
  }, [isDesktop, hasGenerated, selectedTool, analysisViewMode]);

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
  const handleSelectTool = (toolId: SkinBodyToolId) => {
    setSelectedTool(toolId);
    setHasGenerated(false);
    setGeneratedImageUrl(null);
    setAgingStageUrls([]);
    setAnalysisData(null);
    setErrorMessage(null);

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
        setAnalysisData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Slider Dragging
  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDraggingSlider(true);
  const handleMouseUp = () => setIsDraggingSlider(false);

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

    // Auto-scroll to Live Studio Canvas on mobile viewports
    if (window.innerWidth < 1024 && canvasCardRef.current) {
      canvasCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Realistic Multi-Stage Progress Simulation
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
      const activeSource = getActiveSourceUrl();

      // Assemble payload according to selected tool
      const payload: any = {
        toolId: selectedTool,
        srcImage: activeSource,
        userId: user?.id,
        settings: {},
      };

      if (selectedTool === "abs") {
        payload.settings = {
          mode: absMode,
          intensity: absIntensity,
        };
      } else if (selectedTool === "smile") {
        payload.settings = {
          expressionType,
        };
      } else if (selectedTool === "aging") {
        payload.settings = {
          simulationType: "time-lapse",
        };
      } else if (selectedTool === "body_reshape") {
        payload.settings = {
          features: bodyFeatures,
        };
      } else if (selectedTool === "fitzpatrick") {
        payload.settings = {
          focus: fitzpatrickFocus,
        };
      } else if (selectedTool === "skin_analysis") {
        payload.settings = {
          scanType: diagnosticScanType,
        };
      }

      const res = await fetch("/api/skin-face/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      clearInterval(pInterval);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Transformation failed. Please check source photo specifications.");
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
        setIsGenerating(false);
        refreshCredits();
      }, 400);
    } catch (err: any) {
      clearInterval(pInterval);
      setIsGenerating(false);
      setErrorMessage(err.message || "Failed to complete AI processing.");
    }
  };

  // Download Handler
  const handleDownload = async (urlToDownload?: string) => {
    const targetUrl = urlToDownload || generatedImageUrl || getActiveSourceUrl();
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

  // Filter curated samples matching current tool
  const currentToolSamples = SAMPLE_SOURCES.filter((s) => s.forTools.includes(selectedTool));
  const activeToolDef = SKIN_BODY_TOOLS.find((t) => t.id === selectedTool) || SKIN_BODY_TOOLS[0];
  const ActiveToolIcon = activeToolDef.icon;

  return (
    <div className="space-y-6 pb-16">
      {/* =========================================================================
          TOP HEADER & CREDIT STATUS
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
          MAIN 2-COLUMN STUDIO LAYOUT
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =======================================================================
            LEFT COLUMN: TOOL SELECTION & CONTROLS
        ======================================================================= */}
        <div
          ref={leftColRef}
          style={canvasHeight ? { maxHeight: `${canvasHeight}px` } : undefined}
          className={cn(
            "lg:col-span-5 flex flex-col gap-5",
            isDesktop &&
              "overflow-y-auto pr-1.5 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-stone-100/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-200/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5500]/70"
          )}
        >
          {/* CARD 1: CHOOSE TOOL */}
          <div className="rounded-2xl bg-white border border-orange-100/90 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                1 Choose Tool
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                6 Studio AI Engines
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SKIN_BODY_TOOLS.map((tool) => {
                const isActive = selectedTool === tool.id;
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTool(tool.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer relative group",
                      isActive
                        ? "bg-gradient-to-br from-orange-50/90 to-amber-50/50 border-[#FF5500] ring-1 ring-[#FF5500] shadow-xs"
                        : "bg-stone-50/70 border-stone-200/70 hover:bg-white hover:border-orange-200"
                    )}
                  >
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-orange-200/60 shrink-0 bg-stone-100">
                      <Image
                        src={tool.image}
                        alt={tool.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="48px"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute bottom-1 right-1 h-5 w-5 rounded-md bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#FF5500] shadow-2xs">
                        <IconComponent className="h-3 w-3" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-100/80 text-[#FF5500]">
                          {tool.badge}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-zinc-900 truncate mt-1">
                        {tool.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                        {tool.tagline}
                      </p>
                    </div>

                    {isActive && (
                      <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-[#FF5500] flex items-center justify-center text-white shadow-2xs">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 2: SOURCE PHOTO */}
          <div className="rounded-2xl bg-white border border-orange-100/90 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                2 Source Photo
              </span>
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSourceType("sample")}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                    sourceType === "sample"
                      ? "bg-white text-zinc-900 shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-900"
                  )}
                >
                  Curated Models
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType("upload")}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                    sourceType === "upload"
                      ? "bg-white text-zinc-900 shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-900"
                  )}
                >
                  Upload Photo
                </button>
              </div>
            </div>

            {/* Curated Model Gallery */}
            {sourceType === "sample" ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {currentToolSamples.map((sample) => {
                    const isSelected = selectedSampleId === sample.id;
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          setSelectedSampleId(sample.id);
                          setHasGenerated(false);
                          setErrorMessage(null);
                        }}
                        className={cn(
                          "relative rounded-xl overflow-hidden border text-left transition-all cursor-pointer group flex flex-col",
                          isSelected
                            ? "border-[#FF5500] ring-2 ring-[#FF5500] shadow-sm"
                            : "border-stone-200 hover:border-orange-300"
                        )}
                      >
                        <div className="relative aspect-4/5 w-full bg-stone-100">
                          <Image
                            src={sample.src}
                            alt={sample.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="140px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                          <div className="absolute bottom-1.5 left-2 right-2 text-white">
                            <p className="text-[11px] font-bold truncate leading-tight">
                              {sample.name.split(" - ")[0]}
                            </p>
                            <p className="text-[9px] text-zinc-200 font-medium truncate">
                              {sample.label}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-[#FF5500] flex items-center justify-center text-white shadow-2xs">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-zinc-500 bg-stone-50 rounded-lg p-2.5 border border-stone-200/60 leading-normal">
                  <span className="font-semibold text-zinc-700">Active Preset:</span>{" "}
                  {SAMPLE_SOURCES.find((s) => s.id === selectedSampleId)?.desc || "Curated studio portrait."}
                </p>
              </div>
            ) : (
              /* Custom Upload Interface */
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-orange-200 hover:border-[#FF5500] rounded-2xl p-6 bg-orange-50/20 hover:bg-orange-50/40 transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="h-10 w-10 rounded-full bg-orange-100 text-[#FF5500] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-zinc-900">
                    Click to upload portrait or full-body photo
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">
                    JPG, PNG, WebP up to 12MB
                  </span>
                </label>

                {uploadedImage && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/60 border border-orange-200/70">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-orange-200">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate">
                        Custom User Photo Loaded
                      </p>
                      <p className="text-[10px] text-[#FF5500] font-semibold">
                        Ready for neural transformation
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedImage(null)}
                      className="text-xs text-zinc-400 hover:text-rose-600 px-2 py-1 font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CARD 3: TOOL-SPECIFIC CUSTOMIZATION CONTROLS */}
          <div className="rounded-2xl bg-white border border-orange-100/90 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                3 Customization Controls
              </span>
              <span className="text-xs font-bold text-[#FF5500]">
                {activeToolDef.title}
              </span>
            </div>

            {/* =================================================================
                TOOL 1: AI ABS FILTER CONTROLS
            ================================================================= */}
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
                        "p-3 rounded-xl border text-left cursor-pointer transition-all",
                        absMode === "Six-pack"
                          ? "bg-orange-50 border-[#FF5500] ring-1 ring-[#FF5500]"
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
                        "p-3 rounded-xl border text-left cursor-pointer transition-all",
                        absMode === "Vest-line"
                          ? "bg-orange-50 border-[#FF5500] ring-1 ring-[#FF5500]"
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
                          ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
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
                          ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                          : "bg-stone-50 border-stone-200 text-zinc-700 hover:bg-stone-100"
                      )}
                    >
                      Deep Athletic (2)
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-orange-50/70 p-3 border border-orange-200/60 text-[11px] text-orange-950">
                  <span className="font-bold">Pose Guidance:</span> Torso or midriff should be visible in swimwear, fitness apparel, or unbuttoned top for optimal muscular synthesis.
                </div>
              </div>
            )}

            {/* =================================================================
                TOOL 2: AI SMILE GENERATOR CONTROLS
            ================================================================= */}
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
                        "p-3 rounded-xl border text-left cursor-pointer transition-all",
                        expressionType === "smile_with_teeth_visible"
                          ? "bg-orange-50 border-[#FF5500] ring-1 ring-[#FF5500]"
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
                        "p-3 rounded-xl border text-left cursor-pointer transition-all",
                        expressionType === "closed_mouth_smile"
                          ? "bg-orange-50 border-[#FF5500] ring-1 ring-[#FF5500]"
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

                <div className="rounded-xl bg-orange-50/70 p-3 border border-orange-200/60 text-[11px] text-orange-950">
                  <span className="font-bold">Neural Harmonization:</span> Automatically detects lip landmarks, teeth alignment, cheek muscle lift, and periorbital smile crinkles.
                </div>
              </div>
            )}

            {/* =================================================================
                TOOL 3: AI AGING SIMULATION CONTROLS
            ================================================================= */}
            {selectedTool === "aging" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/70">
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

            {/* =================================================================
                TOOL 4: AI BODY RESHAPE CONTROLS
            ================================================================= */}
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

                {/* Individual Precision Sliders */}
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  {/* Waist Slimming */}
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

                  {/* Belly Flattening */}
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

                  {/* Height / Leg Lengthening */}
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

                  {/* Overall Slimming */}
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

                  {/* Hip Lift & Curvature */}
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

                  {/* Arm Contouring */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-700">Arm Toning</span>
                      <span className="text-[#FF5500] font-black">{bodyFeatures.arm}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={bodyFeatures.arm}
                      onChange={(e) =>
                        setBodyFeatures((prev) => ({ ...prev, arm: Number(e.target.value) }))
                      }
                      className="w-full accent-[#FF5500] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================
                TOOL 5: AI FITZPATRICK SKIN TYPE ANALYSIS CONTROLS
            ================================================================= */}
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

                {/* Fitzpatrick Scale Quick Reference Spectrum */}
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

            {/* =================================================================
                TOOL 6: AI SKIN ANALYSIS CONTROLS
            ================================================================= */}
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

                <div className="rounded-xl bg-orange-50/70 p-3 border border-orange-200/60 text-[11px] text-orange-950">
                  <span className="font-bold">Dermatology Telemetry:</span> Automatically assesses epidermal micro-relief, follicular pores, sebum, periorbital dark circles, and erythema redness.
                </div>
              </div>
            )}
          </div>

          {/* GENERATE CTA BUTTON */}
          <div className="pt-1">
            <button
              type="button"
              disabled={isGenerating || credits < 5}
              onClick={handleGenerate}
              className={cn(
                "w-full h-12 rounded-xl font-black text-sm text-white shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden whitespace-nowrap",
                isGenerating || credits < 5
                  ? "bg-zinc-400 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-[#FF5500] via-[#FF6A1A] to-[#FFA033] hover:shadow-orange-500/25 hover:shadow-lg active:scale-[0.99]"
              )}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
                  <span className="truncate">Synthesizing {activeToolDef.title}... ({generationProgress}%)</span>
                </>
              ) : (
                <>
                  <ActiveToolIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">Generate {activeToolDef.title}</span>
                  <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/20 text-white/90 shrink-0">
                    5 Credits
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Generation Notice</p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* =======================================================================
            RIGHT COLUMN: LIVE STUDIO VIEWPORT & CLINICAL DASHBOARD
        ======================================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div
            ref={canvasCardRef}
            className="rounded-3xl bg-gradient-to-b from-stone-50 via-white to-orange-50/20 border border-orange-100 p-4 sm:p-6 shadow-sm flex flex-col min-h-[580px] lg:min-h-[640px] relative overflow-hidden"
          >
            {/* Studio Canvas Bar */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-orange-100/70">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-zinc-800">
                  Live 4K Studio Viewport
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5500]">
                  {activeToolDef.badge}
                </span>
              </div>

              {/* View Toggle for Skin Analysis */}
              {selectedTool === "skin_analysis" && hasGenerated && (
                <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setAnalysisViewMode("dashboard")}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                      analysisViewMode === "dashboard"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    Clinical Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalysisViewMode("photo")}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                      analysisViewMode === "photo"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    Split View
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {hasGenerated && (
                  <button
                    type="button"
                    onClick={() => handleDownload()}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isDownloading ? "Saving..." : "Export 4K"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Viewport Canvas Frame */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-stone-900/5 border border-stone-200/80 flex items-center justify-center min-h-[460px]">
              {/* ===============================================================
                  STATE A: WORLD-CLASS STUDIO LOADER (LIGHT WARM THEME)
              =============================================================== */}
              {isGenerating && (
                <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-orange-400/20 via-[#FF5500]/15 to-amber-300/20 blur-3xl rounded-full pointer-events-none" />

                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50/80 border border-orange-200/80 text-[#FF5500] text-xs font-bold mb-6">
                    <span className="h-2 w-2 rounded-full bg-[#FF5500] animate-ping" />
                    <span>Neural Studio Engine Active</span>
                  </div>

                  {/* Icon Squircle with glowing halo */}
                  <div className="relative mb-5">
                    <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#FF5500]/30 to-amber-400/30 blur-lg animate-pulse" />
                    <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-[#FF5500] to-[#E04800] text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                      <ActiveToolIcon className="h-10 w-10 animate-pulse" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-zinc-950 text-amber-300 ring-4 ring-white flex items-center justify-center shadow-xs">
                      <Sparkles className="h-3.5 w-3.5 animate-spin" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-zinc-900 mb-1">
                    Rendering {activeToolDef.title}
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mb-6 leading-relaxed">
                    {SKIN_BODY_STAGES[generationStageIndex]?.detail}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full max-w-xs space-y-2 mb-6">
                    <div className="h-2.5 w-full rounded-full bg-stone-100 border border-orange-200/60 p-0.5 shadow-inner">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF5500] via-[#FF7A1A] to-[#FFA033] transition-all duration-300 shadow-sm"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-extrabold text-zinc-500 px-1">
                      <span>Neural Diffusion</span>
                      <span className="text-[#FF5500]">{generationProgress}%</span>
                    </div>
                  </div>

                  {/* 4 Pipeline Milestones */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-md">
                    {SKIN_BODY_STAGES.map((stg, sIdx) => {
                      const isComplete = generationStageIndex > sIdx;
                      const isCurrent = generationStageIndex === sIdx;
                      return (
                        <div
                          key={stg.id}
                          className={cn(
                            "p-2 rounded-xl border text-[10px] font-bold text-left transition-all",
                            isComplete
                              ? "bg-orange-50/80 border-orange-300 text-[#FF5500]"
                              : isCurrent
                              ? "bg-white border-[#FF5500] ring-1 ring-[#FF5500] text-zinc-900 shadow-xs"
                              : "bg-stone-50/50 border-stone-200/60 text-zinc-400"
                          )}
                        >
                          <div className="flex items-center gap-1 mb-0.5">
                            {isComplete ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <div
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  isCurrent ? "bg-[#FF5500] animate-ping" : "bg-zinc-300"
                                )}
                              />
                            )}
                            <span className="truncate">Step {sIdx + 1}</span>
                          </div>
                          <p className="truncate font-semibold text-zinc-700">{stg.label.split(" ")[0]}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ===============================================================
                  STATE B: FITZPATRICK CLINICAL REPORT CARD
              =============================================================== */}
              {selectedTool === "fitzpatrick" && hasGenerated && analysisData ? (
                <div className="w-full h-full p-4 sm:p-6 overflow-y-auto max-h-[580px] bg-stone-50/60 space-y-5 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent]">
                  {/* Top Phototype Banner */}
                  {(() => {
                    const rawScale = String(analysisData?.fitzpatrick_scale || "II").toUpperCase();
                    const scaleInfo = FITZPATRICK_SCALE_DATA[rawScale] || FITZPATRICK_SCALE_DATA["II"];
                    return (
                      <div className="rounded-2xl bg-white border border-orange-200/80 p-5 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-md">
                              Clinical Phototype Classification
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 mt-1">
                              Fitzpatrick Scale: Type {rawScale}
                            </h3>
                            <p className="text-xs font-semibold text-zinc-600 mt-0.5">
                              {scaleInfo.title} • {scaleInfo.skinType}
                            </p>
                          </div>

                          <div
                            className={cn(
                              "px-3.5 py-1.5 rounded-xl border text-xs font-black self-start sm:self-auto",
                              scaleInfo.bgBadge
                            )}
                          >
                            Type {rawScale} Classified
                          </div>
                        </div>

                        {/* Interactive Visual Spectrum Bar */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-[11px] font-bold text-zinc-600">
                            <span>Melanin Index &amp; UV Susceptibility</span>
                            <span className="text-orange-600 font-extrabold">{scaleInfo.melanin}</span>
                          </div>
                          <div className="grid grid-cols-6 gap-1 h-4 rounded-lg overflow-hidden border border-stone-200 p-0.5 bg-stone-100 relative">
                            {["I", "II", "III", "IV", "V", "VI"].map((lvl) => {
                              const isTarget = lvl === rawScale;
                              return (
                                <div
                                  key={lvl}
                                  className="relative h-full rounded-sm flex items-center justify-center font-black text-[9px]"
                                  style={{ backgroundColor: FITZPATRICK_SCALE_DATA[lvl].color }}
                                >
                                  {isTarget && (
                                    <div className="absolute inset-0 ring-2 ring-zinc-950 ring-offset-1 rounded-sm shadow-xs flex items-center justify-center">
                                      <span className="text-zinc-950 font-black">✓</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-[9px] font-extrabold text-zinc-400">
                            <span>Type I (Burns)</span>
                            <span>Type III (Golden)</span>
                            <span>Type VI (Deep)</span>
                          </div>
                        </div>

                        {/* Dermatological Prescriptions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 mb-1">
                              <Sun className="h-4 w-4 text-[#FF5500]" />
                              <span>UV Sunburn Tendency</span>
                            </div>
                            <p className="text-xs text-zinc-600 leading-relaxed">
                              {scaleInfo.sunReaction}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 mb-1">
                              <ShieldCheck className="h-4 w-4 text-amber-600" />
                              <span>Prescribed Sunscreen (SPF)</span>
                            </div>
                            <p className="text-xs font-bold text-zinc-800 leading-relaxed">
                              {scaleInfo.spf}
                            </p>
                          </div>
                        </div>

                        {/* Personalized Clinical Regimen */}
                        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-zinc-700 leading-relaxed">
                          <span className="font-bold text-zinc-900">Dermatologist Directive:</span>{" "}
                          {scaleInfo.recommendation}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : null}

              {/* ===============================================================
                  STATE C: CLINICAL SKIN ANALYSIS 12-POINT TELEMETRY DASHBOARD
              =============================================================== */}
              {selectedTool === "skin_analysis" && hasGenerated && analysisViewMode === "dashboard" ? (
                <div className="w-full h-full p-4 sm:p-6 overflow-y-auto max-h-[580px] bg-stone-50/60 space-y-4 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent]">
                  {/* Top Score Summary Card */}
                  <div className="rounded-2xl bg-white border border-orange-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-md">
                        12-Point Dermatological Analysis
                      </span>
                      <h3 className="text-2xl font-black text-zinc-900">
                        Overall Skin Health: 89/100
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Grade A- • High barrier integrity with optimal cellular turnover
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                        Skin Type: Balanced Combination
                      </div>
                    </div>
                  </div>

                  {/* 8-Metric Clinical Score Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { label: "Pore Refinement", score: 86, status: "Smooth", color: "text-emerald-600" },
                      { label: "Wrinkle Depth", score: 92, status: "Minimal", color: "text-emerald-600" },
                      { label: "Texture & Firmness", score: 84, status: "Resilient", color: "text-emerald-600" },
                      { label: "Hydration Barrier", score: 79, status: "Adequate", color: "text-amber-600" },
                      { label: "Sebum / Oiliness", score: 81, status: "Balanced", color: "text-emerald-600" },
                      { label: "Radiance & Glow", score: 90, status: "Vibrant", color: "text-emerald-600" },
                      { label: "Erythema / Redness", score: 88, status: "Low Irritation", color: "text-emerald-600" },
                      { label: "Dark Circles", score: 82, status: "Mild Periorbital", color: "text-amber-600" },
                    ].map((metric, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-1"
                      >
                        <p className="text-[11px] font-bold text-zinc-500 truncate">{metric.label}</p>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-black text-zinc-900">{metric.score}</span>
                          <span className={cn("text-[10px] font-extrabold", metric.color)}>
                            {metric.status}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-[#FF5500]"
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Clinical Skincare Prescriptions */}
                  <div className="rounded-2xl bg-white border border-orange-200/80 p-4 shadow-xs space-y-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800">
                      Tailored Dermal Protocol
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
                      <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                        <span className="font-bold text-zinc-900 block mb-0.5">AM Regimen:</span>
                        Gentle hyaluronic hydration cleanser, 10% Vitamin C antioxidant serum, lightweight gel moisturizer, and Broad Spectrum SPF 50+.
                      </div>
                      <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                        <span className="font-bold text-zinc-900 block mb-0.5">PM Regimen:</span>
                        Double lipid cleanse, 2% Niacinamide + Ceramide barrier repair balm, alternate with low-strength encapsulated Retinol twice weekly.
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* ===============================================================
                  STATE D: BEFORE / AFTER INTERACTIVE SLIDER VIEWPORT
              =============================================================== */}
              {(hasGenerated && generatedImageUrl && (selectedTool !== "fitzpatrick") && (selectedTool !== "skin_analysis" || analysisViewMode === "photo")) ||
              (!hasGenerated && !isGenerating) ? (
                <div
                  ref={sliderContainerRef}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                  className="relative w-full h-full min-h-[460px] select-none cursor-ew-resize flex items-center justify-center overflow-hidden bg-stone-900"
                >
                  {/* Layer 1: After Image (Generated Transformed Result - Background layer, visible on the RIGHT) */}
                  {hasGenerated && generatedImageUrl && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-stone-900">
                      <Image
                        src={generatedImageUrl}
                        alt="Transformed Result"
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                      />
                    </div>
                  )}

                  {/* Layer 2: Before Image (Original Source - Clipped from right, visible on the LEFT) */}
                  <div
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-stone-900 transition-none"
                    style={
                      hasGenerated && generatedImageUrl
                        ? {
                            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                            WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                          }
                        : undefined
                    }
                  >
                    <Image
                      src={getActiveSourceUrl()}
                      alt="Original Source"
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                  </div>

                  {/* Badges: Placed at container level so they stay visible in their respective halves */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold z-20 pointer-events-none">
                    Original
                  </div>

                  {hasGenerated && generatedImageUrl && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#FF5500]/90 backdrop-blur-xs text-white text-[11px] font-bold z-20 pointer-events-none shadow-xs">
                      {activeToolDef.title} 4K
                    </div>
                  )}

                  {/* Slider Divider Line & Knob (Visible when generation completes) */}
                  {hasGenerated && generatedImageUrl && (
                    <div
                      className="absolute top-0 bottom-0 z-20 pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-0 bottom-0 -left-px w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white border-2 border-[#FF5500] shadow-lg flex items-center justify-center text-[#FF5500]">
                        <Columns2 className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  {/* Initial Idle Hint Overlay */}
                  {!hasGenerated && !isGenerating && (
                    <div className="absolute bottom-4 inset-x-4 mx-auto max-w-sm rounded-xl bg-black/65 backdrop-blur-md p-3 text-center text-white z-10 shadow-lg">
                      <p className="text-xs font-bold">
                        Ready to process with {activeToolDef.title}
                      </p>
                      <p className="text-[10px] text-zinc-300 mt-0.5">
                        Adjust controls on the left, then click Generate to preview live transformation.
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Bottom Viewport Control Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 mt-2 border-t border-orange-100/70 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-700">Studio Specs:</span>
                <span>Lossless 4K Render</span>
                <span>•</span>
                <span>Neural Studio Cloud</span>
                <span>•</span>
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
                    className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 font-bold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset View</span>
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
