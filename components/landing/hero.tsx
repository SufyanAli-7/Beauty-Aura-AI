"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, Wand2, RefreshCw, UploadCloud, CheckCircle2, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onOpenQuickTry?: () => void;
}

export function Hero({ onOpenQuickTry }: HeroProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeTab, setActiveTab] = useState<"fashion" | "skin" | "beard" | "makeup">("fashion");

  // Presets for interactive before-after switch
  const showcaseData = {
    fashion: {
      before: "/normal-headshot/girl1.png",
      after: "/ai-photo-editing-images/ai-virtual-cloth-try-on.webp",
      beforeLabel: "Original Look",
      afterLabel: "Virtual Haute Couture",
      pill: "Designer Outfits & Dresses",
    },
    skin: {
      before: "/normal-headshot/girl3.png",
      after: "/ai-photo-editing-images/ai-skin-analaysis.webp",
      beforeLabel: "Blemishes & Uneven Tone",
      afterLabel: "Studio Radiant Glow",
      pill: "Skin & Pore Smoothing",
    },
    beard: {
      before: "/normal-headshot/boy1.png",
      after: "/ai-photo-editing-images/beard-try-on.jpg",
      beforeLabel: "Casual Headshot",
      afterLabel: "Precision Beard & Hair",
      pill: "Barber Grooming Studio",
    },
    makeup: {
      before: "/normal-headshot/girl2.png",
      after: "/ai-photo-editing-images/ai-makeup-try-on.jpg",
      beforeLabel: "Bare Face",
      afterLabel: "Red Carpet Makeup",
      pill: "Luxury Beauty Transfer",
    },
  };

  const current = showcaseData[activeTab];

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background warm aesthetic glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden -z-10 opacity-70">
        <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute top-24 right-1/4 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-orange-100/30 blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Headline & Subtitle */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-4 py-1.5 shadow-xs">
            <Sparkles className="h-4 w-4 text-[#FF5500]" />
            <span className="text-xs font-semibold tracking-wide text-[#E64C00] uppercase">
              All-In-One AI Photo & Beauty Studio
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl uppercase leading-tight sm:leading-tight">
            TRANSFORM YOUR STYLE &amp; LOOKS WITH{" "}
            <span className="relative inline-block text-[#FF5500]">
              NEXT-GEN AI
              <span className="absolute -bottom-1.5 left-0 h-1.5 w-full rounded-full bg-gradient-to-r from-orange-400 via-[#FF5500] to-amber-300 opacity-80" />
            </span>{" "}
            FASHION &amp; VIRTUAL TRY-ON
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-600 sm:text-lg sm:leading-8 font-normal">
            &ldquo;Edit skin, face &amp; body, test trending haircuts, groom beards, try on fashion outfits, and create studio-grade photo magic in seconds.&rdquo;
          </p>

          {/* Upload Pill Input (Exact match from mockup) */}
          <div className="mt-8 flex justify-center">
            <div
              onClick={onOpenQuickTry}
              className="group flex w-full max-w-md items-center justify-between rounded-full border border-orange-200/90 bg-white/95 px-4 py-2.5 shadow-lg shadow-orange-500/10 backdrop-blur-sm transition-all hover:border-[#FF5500] hover:shadow-orange-500/15 cursor-pointer"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[#FF5500] transition-transform group-hover:scale-105">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <div className="flex flex-col text-left truncate">
                  <span className="text-sm font-semibold text-zinc-800 truncate">
                    family_or_portrait_photo.png
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Click to upload or pick a model to try
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-semibold text-orange-600">
                  Instant
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF5500] to-[#FFA033] text-white shadow-md transition-transform group-hover:scale-110">
                  <Wand2 className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Category Switcher Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "fashion", label: "👗 Virtual Outfit Try-On" },
              { id: "skin", label: "✨ Skin & Face Glow" },
              { id: "beard", label: "🧔 Hair & Beard Studio" },
              { id: "makeup", label: "💄 Makeup & Beauty" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#FF5500] text-white shadow-md shadow-orange-500/25 scale-105"
                    : "bg-white text-zinc-600 hover:bg-orange-50 hover:text-[#FF5500] border border-orange-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Central Showcase with Floating Sketch Cards (Matching mockup layout) */}
        <div className="relative mt-12 lg:mt-16">
          {/* Floating Decorative Sketched Cards (Desktop positions) */}

          {/* Top Left Floating Card: Hair & Beard Styling */}
          <div className="hidden lg:block absolute -top-4 left-4 z-20 w-44 transition-transform hover:-translate-y-1.5 duration-300">
            {/* Wireframe border layers */}
            <div className="absolute inset-0 rounded-2xl border border-amber-300/60 rotate-[-6deg] translate-x-[-4px] translate-y-[-4px] pointer-events-none" />
            <div className="relative rounded-2xl border border-orange-100 bg-white/95 p-2 shadow-xl shadow-orange-950/5 backdrop-blur-sm">
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-orange-50">
                <Image
                  src="/ai-photo-editing-images/beard-try-on.jpg"
                  alt="AI Beard & Hairstyle Preview"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                  Beard Try-On
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Left Floating Card: Hair Color & Extensions */}
          <div className="hidden lg:block absolute -bottom-6 left-12 z-20 w-40 transition-transform hover:translate-y-1 duration-300">
            <div className="absolute inset-0 rounded-2xl border border-orange-300/60 rotate-[4deg] translate-x-[4px] translate-y-[4px] pointer-events-none" />
            <div className="relative rounded-2xl border border-orange-100 bg-white/95 p-2 shadow-xl shadow-orange-950/5 backdrop-blur-sm">
              <div className="relative h-36 w-full overflow-hidden rounded-xl bg-orange-50">
                <Image
                  src="/ai-photo-editing-images/hair-color-try-on.png"
                  alt="AI Hair Color Try-On"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                  Hair Dye &amp; Style
                </span>
              </div>
            </div>
          </div>

          {/* Top Right Floating Card: Skin Tone & Blemish Analysis */}
          <div className="hidden lg:block absolute -top-4 right-4 z-20 w-44 transition-transform hover:-translate-y-1.5 duration-300">
            <div className="absolute inset-0 rounded-2xl border border-amber-300/60 rotate-[6deg] translate-x-[4px] translate-y-[-4px] pointer-events-none" />
            <div className="relative rounded-2xl border border-orange-100 bg-white/95 p-2 shadow-xl shadow-orange-950/5 backdrop-blur-sm">
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-orange-50">
                <Image
                  src="/ai-photo-editing-images/ai-skin-analaysis.webp"
                  alt="Skin Retouching & Analysis"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                  Skin Analysis
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Right Floating Card: Luxury Bags & Fashion Try-On */}
          <div className="hidden lg:block absolute -bottom-6 right-12 z-20 w-40 transition-transform hover:translate-y-1 duration-300">
            <div className="absolute inset-0 rounded-2xl border border-orange-300/60 rotate-[-4deg] translate-x-[-4px] translate-y-[4px] pointer-events-none" />
            <div className="relative rounded-2xl border border-orange-100 bg-white/95 p-2 shadow-xl shadow-orange-950/5 backdrop-blur-sm">
              <div className="relative h-36 w-full overflow-hidden rounded-xl bg-orange-50">
                <Image
                  src="/ai-photo-editing-images/bag-try-on.png"
                  alt="Bag & Luxury Accessories Try-On"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                  Bag &amp; Accessories
                </span>
              </div>
            </div>
          </div>

          {/* Main Showcase Centerpiece: Two Side-by-Side Cards with Center Sync Icon */}
          <div className="relative mx-auto max-w-3xl">
            {/* Outer offset wireframe outline frame (signature design motif from mockup) */}
            <div className="absolute -inset-3.5 rounded-3xl border border-amber-300/50 -rotate-[1deg] pointer-events-none hidden sm:block" />
            <div className="absolute -inset-1.5 rounded-3xl border border-orange-200/60 rotate-[1deg] pointer-events-none hidden sm:block" />

            <div className="relative overflow-hidden rounded-3xl border border-orange-200/90 bg-white p-3 sm:p-5 shadow-2xl shadow-orange-900/10">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 relative">
                {/* Left Card: Before (Raw / Original) */}
                <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50">
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={current.before}
                      alt={current.beforeLabel}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      Before: Raw Input
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white border-t border-zinc-100">
                    <span className="text-xs font-medium text-zinc-500 truncate">
                      {current.beforeLabel}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Original
                    </span>
                  </div>
                </div>

                {/* Center Sync / AI Transformation Floating Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gradient-to-tr from-[#FF5500] to-[#FFA433] text-white shadow-xl shadow-orange-600/30 animate-pulse">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                </div>

                {/* Right Card: After (AI Transformed Look) */}
                <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-orange-200 bg-orange-50/40">
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={current.after}
                      alt={current.afterLabel}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-[#FF5500] px-3 py-1 text-xs font-semibold text-white shadow-md shadow-orange-500/30 backdrop-blur-md flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      After: AI Enhanced
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white border-t border-orange-100">
                    <span className="text-xs font-semibold text-[#FF5500] truncate">
                      {current.afterLabel}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      Studio AI
                    </span>
                  </div>
                </div>
              </div>

              {/* Showcase Controls & Explorer Pill */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-orange-100">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Preset: <strong className="text-zinc-900">{current.pill}</strong>
                  </span>
                </div>

                <button
                  onClick={onOpenQuickTry}
                  className="group inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-[#FF5500] transition-all hover:bg-orange-100 hover:border-orange-400"
                >
                  <span>Turn photos into fashion art with GlamMorph</span>
                  <span className="text-zinc-400">|</span>
                  <span className="font-bold underline underline-offset-2">Explore Studio &gt;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Descriptive Caption from Mockup */}
          <div className="mx-auto mt-8 max-w-xl text-center">
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              GlamMorph helps you try on any outfit, enhance skin naturally, shape hair &amp; beard, and produce studio-level fashion portraits you&apos;ll love sharing, printing, and gifting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

