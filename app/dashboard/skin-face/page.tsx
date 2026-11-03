"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Smile,
  Sparkles,
  Upload,
  Zap,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Eye,
} from "lucide-react";

export default function SkinFacePage() {
  const [selectedTool, setSelectedTool] = useState<string>("analysis");
  const [activePreset, setActivePreset] = useState<string>("radiance");

  const tools = [
    {
      id: "analysis",
      title: "Skin Health & Pore Score",
      description: "Deep AI diagnostic analyzing texture, sebum, dark circles & hydration levels.",
      image: "/ai-photo-editing-images/ai-skin-analaysis.webp",
      badge: "Clinical AI",
    },
    {
      id: "type",
      title: "Skin Tone & Type Mapping",
      description: "Spectral melanin indexation and undertone classification across Fitzpatrick scale.",
      image: "/ai-photo-editing-images/skin-type-analaysis.webp",
      badge: "Photometric",
    },
    {
      id: "age",
      title: "Age Progression Time Travel",
      description: "De-age by 10 years or simulate graceful collagen evolution across decades.",
      image: "/ai-photo-editing-images/ai-age.webp",
      badge: "Generative",
    },
    {
      id: "faceswap",
      title: "Face Symmetry & Retouch",
      description: "Even out lighting, natural smile harmonization, and jawline definition.",
      image: "/ai-photo-editing-images/face-swap.jpg",
      badge: "Retouch",
    },
  ];

  const currentTool = tools.find((t) => t.id === selectedTool) || tools[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <Smile className="h-3.5 w-3.5" />
            <span>AI Dermatology &amp; Face Lab</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            AI Skin &amp; Face Analysis
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Analyze skin health parameters, correct pigmentation, and preview anti-aging transformations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-orange-100 text-orange-800 px-3 py-1 text-xs font-bold">
            1 Credit / Scan
          </span>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tools.map((tool) => {
          const isActive = selectedTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-br from-orange-50 to-amber-50/50 border-[#FF5500] shadow-sm ring-1 ring-[#FF5500]"
                  : "bg-white border-orange-100 hover:border-orange-200 hover:bg-stone-50/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5500]">
                  {tool.badge}
                </span>
                {isActive && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5500]" />
                )}
              </div>
              <span className="text-xs font-extrabold text-zinc-900 mt-1">
                {tool.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Viewport / Showcase Display */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-white p-3 shadow-lg">
            {/* Signature Double Wireframe Sketches */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100">
              <Image
                src={currentTool.image}
                alt={currentTool.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-contain bg-stone-900/5"
                priority
              />

              {/* Floating diagnostic badge */}
              <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 shadow-md backdrop-blur-xs flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
                <span>{currentTool.title}</span>
              </div>

              <div className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs">
                Ultra-Precision AI
              </div>
            </div>

            {/* Quick action bar */}
            <div className="mt-3 flex items-center justify-between px-2 pt-1 text-xs text-zinc-500">
              <span>Resolution: 4096 × 2732 px (Ultra HD)</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                Dermatologically Calibrated
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Parameters */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                Transformation Settings
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Adjust intensity &amp; analysis thresholds.
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Skin Tone Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {["Natural Glow", "Porcelain", "Warm Amber", "Deep Radiance"].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setActivePreset(preset)}
                    className={`rounded-xl py-2 px-3 text-xs font-bold border transition text-center cursor-pointer ${
                      activePreset === preset
                        ? "bg-[#FF5500] text-white border-[#FF5500]"
                        : "bg-stone-50 border-orange-100 text-zinc-700 hover:bg-orange-50"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 border-t border-orange-100/80 pt-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-zinc-700">
                  <span>Smoothing &amp; Retouch</span>
                  <span className="text-[#FF5500]">85%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] w-[85%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-zinc-700">
                  <span>Hydration &amp; Glass Finish</span>
                  <span className="text-[#FF5500]">92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] w-[92%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-zinc-700">
                  <span>Blemish &amp; Pigment Eraser</span>
                  <span className="text-[#FF5500]">100%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] w-full" />
                </div>
              </div>
            </div>

            {/* Run Button */}
            <div className="border-t border-orange-100/80 pt-4 space-y-2">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 transition cursor-pointer"
              >
                <Zap className="h-4 w-4 fill-current" />
                <span>Run Analysis (1 Credit)</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white py-2.5 text-xs font-bold text-zinc-700 hover:bg-orange-50 transition cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-[#FF5500]" />
                <span>Upload Your Portrait</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

