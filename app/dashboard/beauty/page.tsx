"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Wand2,
  Sparkles,
  Upload,
  Zap,
  CheckCircle2,
  Eye,
  Heart,
  Palette,
  Sliders,
} from "lucide-react";

export default function BeautyPage() {
  const [selectedTool, setSelectedTool] = useState<string>("transfer");

  const tools = [
    {
      id: "transfer",
      title: "Viral Makeup Transfer",
      description: "Extract lipstick, winged eyeliner, and contour from any reference picture.",
      image: "/ai-photo-editing-images/ai-makeup-transfer.jpg",
      badge: "Signature",
    },
    {
      id: "glamour",
      title: "Red Carpet Glamour Makeover",
      description: "Full Hollywood beauty glam with velvet matte finish and sculpted cheekbones.",
      image: "/ai-photo-editing-images/ai-makeup-try-on.jpg",
      badge: "High Glam",
    },
    {
      id: "eyes",
      title: "Iris & Colored Contact Lens",
      description: "Hyper-realistic optical color changes: Hazel, Emerald, Sapphire, and Amethyst.",
      image: "/ai-photo-editing-images/eye-color-try-on.webp",
      badge: "Precision Optics",
    },
  ];

  const currentTool = tools.find((t) => t.id === selectedTool) || tools[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <Wand2 className="h-3.5 w-3.5" />
            <span>Cosmetics &amp; Glamour Lab</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            Beauty Studio
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Transfer celebrity makeup looks, experiment with vibrant contact lenses, and polish your aesthetics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-orange-100 text-orange-800 px-3 py-1 text-xs font-bold">
            1 Credit / Transformation
          </span>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

      {/* Main Studio Canvas */}
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
              <span>Studio Mode: 4K Neural Makeup Rendering</span>
              <span className="text-emerald-600 font-semibold">100% Skin Texture Retention</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                Cosmetic Attributes
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Customize shades, gloss, and liner sharpness.
              </p>
            </div>

            {/* Lipstick Palette */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Lip Shade Palette</label>
              <div className="flex items-center gap-2.5">
                {[
                  { name: "Crimson Velvet", bg: "bg-red-700" },
                  { name: "Coral Peach", bg: "bg-orange-500" },
                  { name: "Nude Mocha", bg: "bg-amber-800" },
                  { name: "Plum Rose", bg: "bg-pink-700" },
                  { name: "Berry Wine", bg: "bg-rose-950" },
                ].map((shade, i) => (
                  <button
                    key={shade.name}
                    title={shade.name}
                    className={`h-8 w-8 rounded-full ${shade.bg} ring-2 ring-white hover:scale-110 transition cursor-pointer shadow-xs ${
                      i === 0 ? "ring-2 ring-offset-2 ring-[#FF5500]" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 border-t border-orange-100/80 pt-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-zinc-700">
                  <span>Makeup Intensity</span>
                  <span className="text-[#FF5500]">90%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] w-[90%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-zinc-700">
                  <span>Eye Contact Opacity</span>
                  <span className="text-[#FF5500]">75%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] w-[75%]" />
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
                <span>Apply Makeup (1 Credit)</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white py-2.5 text-xs font-bold text-zinc-700 hover:bg-orange-50 transition cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-[#FF5500]" />
                <span>Upload Reference Look</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

