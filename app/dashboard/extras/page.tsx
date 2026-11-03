"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Layers,
  Sparkles,
  Upload,
  Zap,
  CheckCircle2,
  Sliders,
  Sun,
  Palette,
  Eraser,
  Maximize2,
} from "lucide-react";

export default function ExtrasPage() {
  const [selectedTool, setSelectedTool] = useState<string>("enhance");

  const tools = [
    {
      id: "enhance",
      title: "4K Clarity & Super-Resolution",
      description: "Upscale blurry portraits into crystal-clear editorial prints.",
      image: "/ai-photo-editing-images/photo-enhance.jpg",
      badge: "4K Upscaler",
    },
    {
      id: "remove",
      title: "Magic Object & Photobomb Erase",
      description: "Cleanly remove people, cables, and unwanted clutter with inpainting.",
      image: "/ai-photo-editing-images/object-remove.jpg",
      badge: "Inpainting",
    },
    {
      id: "relight",
      title: "Studio Relighting & Golden Hour",
      description: "Reposition keylights, softboxes, and simulate cinematic volumetric rays.",
      image: "/ai-photo-editing-images/photo-lightining.jpg",
      badge: "Relighting",
    },
    {
      id: "colorize",
      title: "Vintage Restoration & Colorize",
      description: "Breathe vivid, historical color palettes into monochrome photos.",
      image: "/ai-photo-editing-images/photo-colorize.jpg",
      badge: "Restoration",
    },
    {
      id: "bgchange",
      title: "AI Studio Background Replace",
      description: "Transport portraits from bedroom walls to Parisian penthouses.",
      image: "/ai-photo-editing-images/bg-change.jpg",
      badge: "Environments",
    },
  ];

  const currentTool = tools.find((t) => t.id === selectedTool) || tools[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <Layers className="h-3.5 w-3.5" />
            <span>AI Extras &amp; Utility Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            AI Extras
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Complete high-fidelity photo editing: magic eraser, 4K super-resolution upscaler, studio relighting, and background swapping.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-orange-100 text-orange-800 px-3 py-1 text-xs font-bold">
            1 Credit / Edit
          </span>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {tools.map((tool) => {
          const isActive = selectedTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer ${
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
              <span className="text-xs font-extrabold text-zinc-900 mt-1 line-clamp-1">
                {tool.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-white p-3 shadow-lg">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100">
              <Image
                src={currentTool.image}
                alt={currentTool.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-contain bg-stone-900/5"
                priority
              />

              <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 shadow-md backdrop-blur-xs flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
                <span>{currentTool.title}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between px-2 pt-1 text-xs text-zinc-500">
              <span>Lossless Neural Diffusion Engine</span>
              <span className="text-emerald-600 font-semibold">Zero Artifacts</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                Tool Parameters
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Fine-tune lighting and enhancement intensity.
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Lighting Environment</label>
              <div className="grid grid-cols-2 gap-2">
                {["Golden Sunset", "Softbox Studio", "Moody Cyber", "Rimlight Contrast"].map((env, i) => (
                  <button
                    key={env}
                    className={`rounded-xl py-2 px-2 text-xs font-bold border transition text-center cursor-pointer ${
                      i === 0
                        ? "bg-[#FF5500] text-white border-[#FF5500]"
                        : "bg-stone-50 border-orange-100 text-zinc-700 hover:bg-orange-50"
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 border-t border-orange-100/80 pt-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-zinc-700">
                  <span>Clarity &amp; Sharpness</span>
                  <span className="text-[#FF5500]">95%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] w-[95%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-zinc-700">
                  <span>Shadow Fill Balance</span>
                  <span className="text-[#FF5500]">80%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] w-[80%]" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-orange-100/80 pt-4 space-y-2">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 transition cursor-pointer"
              >
                <Zap className="h-4 w-4 fill-current" />
                <span>Process Enhancement (1 Credit)</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white py-2.5 text-xs font-bold text-zinc-700 hover:bg-orange-50 transition cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-[#FF5500]" />
                <span>Upload Source Image</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

