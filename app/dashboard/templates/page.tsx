"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutTemplate,
  Sparkles,
  ArrowRight,
  Zap,
  Bookmark,
  Check,
} from "lucide-react";

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const templates = [
    {
      id: 1,
      title: "Paris Haute Couture Editorial",
      category: "fashion",
      categoryLabel: "High Fashion",
      image: "/fashion-looks/fashion-3.png",
      promptHint: "Silk draped structured blazer with studio volumetric spotlight and film grain.",
      rating: "4.9 ★",
      uses: "14.2k uses",
    },
    {
      id: 2,
      title: "Executive LinkedIn Studio Headshot",
      category: "headshot",
      categoryLabel: "Headshots",
      image: "/ai-photo-editing-images/head-shot-generator.jpg",
      promptHint: "Crisp corporate executive lighting, navy tailored suit, neutral blurred studio.",
      rating: "4.9 ★",
      uses: "38.5k uses",
    },
    {
      id: 3,
      title: "K-Beauty Glass Skin & Dewy Blush",
      category: "beauty",
      categoryLabel: "Beauty",
      image: "/ai-photo-editing-images/ai-makeup-try-on.jpg",
      promptHint: "Ultra-hydrated glass skin finish, subtle peach gradient lips and fine eyeliner.",
      rating: "5.0 ★",
      uses: "22.8k uses",
    },
    {
      id: 4,
      title: "Golden Hour Cinematic Portrait",
      category: "extras",
      categoryLabel: "Lighting",
      image: "/ai-photo-editing-images/photo-lightining.jpg",
      promptHint: "Warm low-angle sunset rays, golden halo flare on hair, soft cinematic bokeh.",
      rating: "4.8 ★",
      uses: "18.1k uses",
    },
    {
      id: 5,
      title: "Modern Fade & Groomed Stubble",
      category: "hair-beard",
      categoryLabel: "Hair & Beard",
      image: "/ai-photo-editing-images/beard-try-on.jpg",
      promptHint: "Clean textured crop fade with razor-sharp beard lineup and matte styling.",
      rating: "4.9 ★",
      uses: "12.7k uses",
    },
    {
      id: 6,
      title: "Vintage 1970s Kodachrome Aesthetic",
      category: "extras",
      categoryLabel: "Color Grading",
      image: "/ai-photo-editing-images/photo-colorize.jpg",
      promptHint: "Authentic 35mm film grain, warm saturated tones, and soft vintage diffusion.",
      rating: "4.7 ★",
      uses: "9.4k uses",
    },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <LayoutTemplate className="h-3.5 w-3.5" />
            <span>Preset Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            Creative Templates &amp; Styles
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            One-click aesthetic formulas engineered by pro fashion photographers and makeup artists.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "all", label: "All Templates" },
          { id: "fashion", label: "High Fashion" },
          { id: "headshot", label: "Headshots" },
          { id: "beauty", label: "Beauty & Makeup" },
          { id: "hair-beard", label: "Hair & Beard" },
          { id: "extras", label: "Lighting & Color" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-[#FF5500] text-white shadow-xs"
                : "bg-white border border-orange-100 text-zinc-600 hover:bg-orange-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-orange-100 bg-white p-4 shadow-xs hover:border-orange-300 hover:shadow-xl transition-all duration-300"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-100 mb-3">
              <Image
                src={template.image}
                alt={template.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2.5 left-2.5 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-zinc-800">
                {template.categoryLabel}
              </div>
              <div className="absolute top-2.5 right-2.5 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white">
                {template.rating}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 truncate">
                  {template.title}
                </h3>
              </div>

              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                {template.promptHint}
              </p>

              <div className="flex items-center justify-between border-t border-orange-100/70 pt-3">
                <span className="text-[11px] font-semibold text-zinc-400">
                  {template.uses}
                </span>

                <Link
                  href="/dashboard/fashion"
                  className="inline-flex items-center gap-1 rounded-full bg-orange-50 hover:bg-[#FF5500] hover:text-white px-3 py-1 text-xs font-bold text-[#FF5500] transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Use Template</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

