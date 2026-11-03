"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Wand2,
  Sparkles,
  Upload,
  Zap,
  CheckCircle2,
  Eye,
  RotateCcw,
  Download,
  Share2,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Columns2,
  Layers,
  ArrowRight,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

// 2. Test Portrait Images (Normal Headshots)
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

// B. Makeup Try-On Styles
const TRYON_STYLES = [
  {
    id: "style-french",
    name: "French Girl Nude",
    badge: "Everyday",
    lipstick: "#C47B66",
    blush: "#E89B84",
    description: "Effortless brushed brows, minimal contour, and hydrated soft nude lips.",
  },
  {
    id: "style-redcarpet",
    name: "Red Carpet Siren",
    badge: "High Glam",
    lipstick: "#A31621",
    blush: "#C8626D",
    description: "Classic scarlet velvet matte lips, winged liner, and sculpted cheekbones.",
  },
  {
    id: "style-kbeauty",
    name: "K-Beauty Dewy Glow",
    badge: "Dewy",
    lipstick: "#E36577",
    blush: "#F4A5AE",
    description: "Ultra-hydrated glass skin finish with soft gradient lips and puppy eyeliner.",
  },
  {
    id: "style-latte",
    name: "Warm Latte Mocha",
    badge: "Trending",
    lipstick: "#7B4B3A",
    blush: "#B27A59",
    description: "Monochromatic caramel and cocoa tones with golden highlight accents.",
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

export default function BeautyStudioPage() {
  // 1. Tool Selection
  const [selectedTool, setSelectedTool] = useState<BeautyToolId>("transfer");

  // 2. Source Image State - Upload Photo is FIRST
  const [sourceTab, setSourceTab] = useState<"upload" | "test">("upload");
  const [selectedSource, setSelectedSource] = useState<string>("/normal-headshot/girl1.png");
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Look Selection State
  const [selectedTransferLook, setSelectedTransferLook] = useState<string>("/makeup-transfer/webp_makeup_transfer_01.png");
  const [selectedTryOnStyle, setSelectedTryOnStyle] = useState<string>("style-redcarpet");
  const [selectedEyeLens, setSelectedEyeLens] = useState<string>("lens-1");
  const [selectedLipstick, setSelectedLipstick] = useState<string>("#A31621");

  // 4. Generation & Result State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"result" | "split" | "original">("result");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Active Tool Object
  const currentTool = BEAUTY_TOOLS.find((t) => t.id === selectedTool) || BEAUTY_TOOLS[0];

  // Effective Source Image
  const activeSourceImage = sourceTab === "upload" && uploadedPreview ? uploadedPreview : selectedSource;

  // Resolved Generated Result Image based on selected tool & look
  const getGeneratedImage = () => {
    if (selectedTool === "transfer") {
      return "/ai-photo-editing-images/ai-makeup-transfer.jpg";
    }
    if (selectedTool === "try-on") {
      return "/ai-photo-editing-images/ai-makeup-try-on.jpg";
    }
    return "/ai-photo-editing-images/eye-color-try-on.webp";
  };

  // Handle Local File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setUploadedPreview(objectUrl);
      setSourceTab("upload");
      setHasGenerated(false);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setUploadedPreview(objectUrl);
      setSourceTab("upload");
      setHasGenerated(false);
    }
  };

  // Run AI Generation
  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      setViewMode("result");
    }, 1200);
  };

  // Reset to initial state
  const handleReset = () => {
    setHasGenerated(false);
    setViewMode("result");
  };

  // Handle Split Slider Dragging
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div className="space-y-6 pb-16">
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
            Transfer celebrity makeup looks, experiment with virtual palettes, and simulate natural colored contact lenses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/80 px-3.5 py-1 text-xs font-bold text-zinc-800">
            <Zap className="h-3.5 w-3.5 text-[#FF5500] fill-current" />
            <span>1 Credit / render</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* =========================================================================
            LEFT COLUMN: Controls & Customization
           ========================================================================= */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-6">
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

            {/* Tab 2: Sample Portraits Grid (Fixed Aspect Ratio with Full Face Visible) */}
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
                        }}
                        className="group flex flex-col items-center text-center cursor-pointer transition-all"
                        title={portrait.name}
                      >
                        {/* 3:4 Aspect Ratio Container showing 100% of the face */}
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

                        {/* Name Label Placed Cleanly Below (Does NOT block the chin/face) */}
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
                    {sourceTab === "upload" && uploadedPreview ? "Uploaded Custom Photo" : "Selected Portrait (" + (TEST_PORTRAITS.find(p => p.src === selectedSource)?.name || "Elena") + ")"}
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
                  ? "Styles & Swatches"
                  : "Lens Palette"}
              </span>
            </div>

            {/* A. DYNAMIC OPTIONS FOR: AI Makeup Transfer */}
            {selectedTool === "transfer" && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500 font-medium">
                  Select a reference celebrity or editorial look to extract lipstick, eyeliner, and shadow tone:
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {TRANSFER_LOOKS.map((look) => {
                    const isSelected = selectedTransferLook === look.src;
                    return (
                      <button
                        key={look.id}
                        type="button"
                        onClick={() => {
                          setSelectedTransferLook(look.src);
                          setHasGenerated(false);
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
              </div>
            )}

            {/* B. DYNAMIC OPTIONS FOR: AI Makeup Virtual Try-On */}
            {selectedTool === "try-on" && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-500 font-medium">
                  Choose a signature curated beauty style:
                </p>

                {/* Style Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  {TRYON_STYLES.map((style) => {
                    const isSelected = selectedTryOnStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          setSelectedTryOnStyle(style.id);
                          setSelectedLipstick(style.lipstick);
                          setHasGenerated(false);
                        }}
                        className={cn(
                          "relative rounded-2xl border p-3 text-left transition-all cursor-pointer",
                          isSelected
                            ? "border-[#FF5500] ring-2 ring-[#FF5500]/25 bg-orange-50/50 shadow-xs"
                            : "border-orange-100 bg-stone-50/60 hover:border-orange-200"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="h-3 w-3 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: style.lipstick }}
                          />
                          <span className="rounded-full bg-orange-100 px-1.5 py-0.2 text-[9px] font-bold text-orange-800">
                            {style.badge}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 truncate">
                          {style.name}
                        </h4>
                        <p className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5">
                          {style.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Lipstick Palette Swatches */}
                <div className="space-y-2 border-t border-orange-100/70 pt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span>Lipstick Shade Palette</span>
                    <span className="text-[10px] text-zinc-400">Click to switch</span>
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
                        onClick={() => setSelectedLipstick(shade.hex)}
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
              </div>
            )}

            {/* C. DYNAMIC OPTIONS FOR: AI Eye Color Virtual Try-On (Using public/eye-lens images) */}
            {selectedTool === "eye-color" && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500 font-medium">
                  Select a realistic optical lens from the catalog to simulate on your iris:
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {EYE_LENSES.map((lens) => {
                    const isSelected = selectedEyeLens === lens.id;
                    return (
                      <button
                        key={lens.id}
                        type="button"
                        onClick={() => {
                          setSelectedEyeLens(lens.id);
                          setHasGenerated(false);
                        }}
                        className={cn(
                          "group relative flex flex-col items-center rounded-2xl border p-3 transition-all cursor-pointer text-center",
                          isSelected
                            ? "border-[#FF5500] ring-2 ring-[#FF5500]/25 bg-orange-50/50 shadow-xs"
                            : "border-orange-100 bg-stone-50/60 hover:border-orange-200 hover:bg-stone-50"
                        )}
                      >
                        {/* Lens Optical Disc */}
                        <div className="relative h-14 w-14 overflow-hidden rounded-full border border-orange-200/80 bg-zinc-950 mb-2 shadow-xs flex items-center justify-center p-1">
                          <Image
                            src={lens.src}
                            alt={lens.name}
                            fill
                            sizes="56px"
                            className="object-contain transition-transform group-hover:scale-115"
                          />
                        </div>
                        <span className="text-xs font-bold text-zinc-900 truncate w-full">
                          {lens.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 truncate w-full">
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
              </div>
            )}

            {/* Primary Generation CTA Button (Without Sliders) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 hover:shadow-orange-500/35 transition cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Synthesizing {currentTool.title}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Transformation (1 Credit)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Generated Result / Studio Viewport
           ========================================================================= */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-white p-4 sm:p-5 shadow-lg flex flex-col justify-between min-h-[580px] sm:min-h-[660px]">
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
                  <span>Preview matches source resolution</span>
                </div>
              )}
            </div>

            {/* Viewport Main Display Canvas */}
            <div className="relative my-4 flex-1 flex items-center justify-center min-h-[460px] sm:min-h-[520px] rounded-2xl bg-gradient-to-b from-stone-50 to-orange-50/20 border border-orange-100 overflow-hidden">
              {/* CASE 1: Generating Loading State */}
              {isGenerating && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs p-6 space-y-4">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#FF5500] to-[#FFA033] text-white shadow-xl shadow-orange-500/30">
                    <Wand2 className="h-9 w-9 animate-bounce" />
                    <div className="absolute inset-0 rounded-3xl border-2 border-orange-300 animate-ping" />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="text-base font-extrabold text-zinc-900">
                      Transforming with AI...
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Synthesizing neural skin layers, color optical map &amp; blend
                    </p>
                  </div>
                  <div className="w-48 h-1.5 bg-orange-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] animate-pulse w-3/4 rounded-full" />
                  </div>
                </div>
              )}

              {/* CASE 2: Generated Result Visible */}
              {hasGenerated ? (
                <>
                  {/* Mode: Result Only */}
                  {viewMode === "result" && (
                    <div className="relative h-full w-full flex items-center justify-center p-2">
                      <div className="relative h-full w-full max-h-[560px] aspect-[4/5] sm:aspect-[3/4] mx-auto overflow-hidden rounded-2xl shadow-md border border-orange-200/70">
                        <Image
                          src={getGeneratedImage()}
                          alt="AI Generated Beauty Result"
                          fill
                          sizes="(max-width: 1024px) 100vw, 55vw"
                          className="object-contain bg-zinc-950"
                          priority
                        />
                        <div className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                          ✨ 4K HD Output
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode: Original Only */}
                  {viewMode === "original" && (
                    <div className="relative h-full w-full flex items-center justify-center p-2">
                      <div className="relative h-full w-full max-h-[560px] aspect-[4/5] sm:aspect-[3/4] mx-auto overflow-hidden rounded-2xl shadow-md border border-orange-200/70">
                        <Image
                          src={activeSourceImage}
                          alt="Original Portrait"
                          fill
                          sizes="(max-width: 1024px) 100vw, 55vw"
                          className="object-contain bg-zinc-950"
                          priority
                        />
                        <div className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                          Original Photo
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode: Interactive Split Compare Slider */}
                  {viewMode === "split" && (
                    <div
                      ref={sliderContainerRef}
                      onMouseMove={(e) => handleSliderMove(e.clientX)}
                      onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
                      className="relative h-full w-full max-h-[560px] aspect-[4/5] sm:aspect-[3/4] mx-auto overflow-hidden rounded-2xl select-none cursor-ew-resize border border-orange-200/70 shadow-md bg-zinc-950"
                    >
                      {/* After Image (Background) */}
                      <Image
                        src={getGeneratedImage()}
                        alt="After AI"
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-contain"
                        priority
                      />

                      {/* Before Image (Clipped Left Layer) */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${sliderPosition}%` }}
                      >
                        <div className="relative h-full w-full">
                          <Image
                            src={activeSourceImage}
                            alt="Before AI"
                            fill
                            sizes="(max-width: 1024px) 100vw, 55vw"
                            className="object-contain max-w-none"
                            style={{ width: "100%", height: "100%" }}
                            priority
                          />
                        </div>
                      </div>

                      {/* Draggable Divider Handle */}
                      <div
                        className="absolute inset-y-0 w-0.5 bg-white shadow-2xl z-20 flex items-center justify-center"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg border border-orange-300 text-[#FF5500]">
                          <Columns2 className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs z-10">
                        Before
                      </div>
                      <div className="absolute top-3 right-3 rounded-full bg-[#FF5500]/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs z-10">
                        After
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* CASE 3: Pre-generation State (Show Source Portrait or Clean Empty State) */
                <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                  {/* Subtle Background Glow */}
                  <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />

                  {activeSourceImage ? (
                    /* Source Portrait Ready State */
                    <div className="relative z-10 flex flex-col items-center space-y-4 max-w-sm">
                      <div className="relative h-64 w-48 sm:h-72 sm:w-56 overflow-hidden rounded-2xl border-2 border-orange-200/80 bg-white shadow-lg">
                        <Image
                          src={activeSourceImage}
                          alt="Source Preview"
                          fill
                          sizes="240px"
                          className="object-cover object-center"
                        />
                        <div className="absolute bottom-2 inset-x-2 rounded-xl bg-black/70 py-1 px-2 text-center text-[10px] font-bold text-white backdrop-blur-xs">
                          Source Portrait Ready
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base font-extrabold text-zinc-900">
                          Your result will appear here
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Click <span className="font-bold text-[#FF5500]">Generate Transformation</span> on the left to apply {currentTool.title}.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerate}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 transition cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Apply {currentTool.title}</span>
                      </button>
                    </div>
                  ) : (
                    /* Clean Empty State */
                    <div className="relative z-10 flex flex-col items-center space-y-3 max-w-xs">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-[#FF5500] shadow-inner">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                      <h4 className="text-base font-extrabold text-zinc-900">
                        Your result will appear here
                      </h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Select a Beauty AI tool and choose a portrait on the left to start editing.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Viewport Bottom Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100/80 pt-3.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-500">
                  Export Spec: 4K UHD Lossless PNG
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
                      <span>Reset</span>
                    </button>

                    <a
                      href={getGeneratedImage()}
                      download="beautyaura-makeover.png"
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-orange-500/25 hover:opacity-95 transition cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download 4K Result</span>
                    </a>
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
