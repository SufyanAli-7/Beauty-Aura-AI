"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Scissors,
  Sparkles,
  Upload,
  Zap,
  CheckCircle2,
  Crown,
  Palette,
  Sliders,
} from "lucide-react";

export default function HairBeardPage() {
  const [selectedTool, setSelectedTool] = useState<string>("hair");

  const tools = [
    {
      id: "hair",
      title: "Hairstyle & Cut Studio",
      description: "Preview over 40 cuts: textured crops, fades, layered bobs, bangs, and curls.",
      image: "/ai-photo-editing-images/hairstyle.jpg",
      badge: "Cuts & Styling",
    },
    {
      id: "beard",
      title: "Beard Grooming & Stubble",
      description: "Shape stubble, sharp jawline fades, full lumberjack beards, and goatees.",
      image: "/ai-photo-editing-images/beard-try-on.jpg",
      badge: "Grooming",
    },
    {
      id: "color",
      title: "Hair Color & Highlights",
      description: "Vibrant platinum blonde, copper auburn, honey balayage, and pastel hues.",
      image: "/ai-photo-editing-images/hair-color-try-on.png",
      badge: "Color Dye",
    },
    {
      id: "extensions",
      title: "Hair Extensions & Volume",
      description: "Add realistic density, length extensions, and reduce frizziness in one click.",
      image: "/ai-photo-editing-images/hair-extension.jpg",
      badge: "Volume Boost",
    },
  ];

  const currentTool = tools.find((t) => t.id === selectedTool) || tools[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <Scissors className="h-3.5 w-3.5" />
            <span>AI Barber &amp; Hair Salon</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            Hair &amp; Beard Studio
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Try new hairstyles, simulate beard growth, test salon color dyes, and eliminate frizz with neural hair synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-orange-100 text-orange-800 px-3 py-1 text-xs font-bold">
            1 Credit / Style
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
              <span>Strand-Level Follicle Physics</span>
              <span className="text-emerald-600 font-semibold">Natural Hairline Blend</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                Styling Controls
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Refine hair texture, sheen, and density.
              </p>
            </div>

            {/* Hair color shades */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Dye Swatches</label>
              <div className="flex items-center gap-2.5">
                {[
                  { name: "Platinum Blonde", bg: "bg-amber-100" },
                  { name: "Chestnut Brown", bg: "bg-amber-900" },
                  { name: "Copper Ginger", bg: "bg-orange-700" },
                  { name: "Jet Black", bg: "bg-zinc-900" },
                  { name: "Pastel Lavender", bg: "bg-purple-300" },
                ].map((dye, i) => (
                  <button
                    key={dye.name}
                    title={dye.name}
                    className={`h-8 w-8 rounded-full ${dye.bg} ring-2 ring-white hover:scale-110 transition cursor-pointer shadow-xs ${
                      i === 1 ? "ring-2 ring-offset-2 ring-[#FF5500]" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 border-t border-orange-100/80 pt-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-zinc-700">
                  <span>Volume &amp; Fullness</span>
                  <span className="text-[#FF5500]">88%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] w-[88%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-zinc-700">
                  <span>Fade Sharpness</span>
                  <span className="text-[#FF5500]">95%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] w-[95%]" />
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
                <span>Generate Hairstyle (1 Credit)</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white py-2.5 text-xs font-bold text-zinc-700 hover:bg-orange-50 transition cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-[#FF5500]" />
                <span>Upload Portrait</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

