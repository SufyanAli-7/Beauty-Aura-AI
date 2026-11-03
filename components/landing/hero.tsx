"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Wand2, CheckCircle2 } from "lucide-react";

export function Hero() {
  const [activeCategory, setActiveCategory] = useState("makeup");

  // All 10 user-specified images + new categories
  const categories = [
    {
      id: "makeup",
      label: "💄 Makeup Transfer",
      title: "Red Carpet Makeup Transfer & Beauty",
      badge: "Makeup Transfer",
      description: "Transfer iconic red-carpet beauty looks, bespoke lip shades, and flawless facial contouring in seconds.",
      image: "/ai-photo-editing-images/ai-makeup-transfer.jpg",
    },
    {
      id: "enhance",
      label: "✨ Photo Enhance",
      title: "Ultra-HD Portrait Retouch & Clarity",
      badge: "Instant Enhance",
      description: "Restore fine skin textures, remove blur and noise, and bring out high-definition studio clarity.",
      image: "/ai-photo-editing-images/photo-enhance.jpg",
    },
    {
      id: "hairstyle",
      label: "✂️ Hairstyle Studio",
      title: "Trending Haircuts, Extensions & Volume",
      badge: "Hairstyle AI",
      description: "Experiment with trending hairstyles, fringe cuts, volume extensions, and vibrant hair dye colors.",
      image: "/ai-photo-editing-images/hairstyle.jpg",
    },
    {
      id: "colorize",
      label: "🎨 Photo Colorize",
      title: "Vintage Black & White Photo Restoration",
      badge: "B&W to Life",
      description: "Transform vintage family and historic portraits into rich, lifelike, authentic full-color photographs.",
      image: "/ai-photo-editing-images/photo-colorize.jpg",
    },
    {
      id: "object-remove",
      label: "🪄 Object Erase",
      title: "Magic Object & Clutter Erase",
      badge: "Clean Scene",
      description: "Erase photobombers, background distractions, and unwanted objects with seamless AI in-painting.",
      image: "/ai-photo-editing-images/object-remove.jpg",
    },
    {
      id: "bg-change",
      label: "🌄 Background Change",
      title: "Studio Background Replacement & Atmosphere",
      badge: "AI Backdrop",
      description: "Transport your portraits or product shots to luxurious studios, nature scenes, or minimalist solid backdrops.",
      image: "/ai-photo-editing-images/bg-change.jpg",
    },
    {
      id: "bg-remove",
      label: "🔲 Background Cutout",
      title: "One-Click Transparent Background Cutout",
      badge: "Alpha Cutout",
      description: "Pixel-accurate subject extraction with clean hair strand separation for eCommerce, resumes, and collages.",
      image: "/ai-photo-editing-images/bg-remove.jpg",
    },
    {
      id: "color-correction",
      label: "🌈 Color Grading",
      title: "Cinematic Color Correction & Dynamics",
      badge: "Vibrant Color",
      description: "Professional color grading, tonal curve balancing, and lush saturation adjustments.",
      image: "/ai-photo-editing-images/color-correction.jpg",
    },
    {
      id: "relighting",
      label: "💡 Studio Relighting",
      title: "AI Studio Lighting & Golden Hour",
      badge: "Lighting AI",
      description: "Add dramatic rim lighting, soft diffused fill lights, and golden hour sunset glows to any photo.",
      image: "/ai-photo-editing-images/photo-lightining.jpg",
    },
    {
      id: "studio-gen",
      label: "📸 Studio Generator",
      title: "Full Editorial Studio Portrait Generator",
      badge: "Studio Generator",
      description: "Generate magazine-cover studio headshots and high-fashion editorial portraits in one click.",
      image: "/ai-photo-editing-images/ai-studio-generator.jpg",
    },
    {
      id: "virtual-try-on",
      label: "👗 Virtual Try-On",
      title: "Virtual Wardrobe & Fashion Outfit Swap",
      badge: "Fashion Try-On",
      description: "Drape designer clothes, jackets, streetwear, and dresses onto your body shape with real fabric physics.",
      image: "/ai-photo-editing-images/ai-virtual-cloth-try-on.webp",
    },
    {
      id: "beard-groom",
      label: "🧔 Beard & Grooming",
      title: "Precision Beard Grooming & Trimming",
      badge: "Barber Studio",
      description: "Visualize sharp fades, full beards, stubble, and goatee styles with realistic hair texture.",
      image: "/ai-photo-editing-images/beard-try-on.jpg",
    },
  ];

  const currentIndex = categories.findIndex((c) => c.id === activeCategory);
  const current = categories[currentIndex] || categories[0];

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % categories.length;
    setActiveCategory(categories[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + categories.length) % categories.length;
    setActiveCategory(categories[prevIdx].id);
  };

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
              All-In-One AI Photo &amp; Beauty Studio
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

          {/* Category Switcher Tabs - All user categories + new ones */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer border-0 border-none outline-none ring-0 focus:outline-none ${
                  activeCategory === cat.id
                    ? "bg-[#FF5500] text-white shadow-md shadow-orange-500/25 scale-105"
                    : "bg-white text-zinc-600 hover:bg-orange-50 hover:text-[#FF5500] border border-orange-100/90 shadow-2xs"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Central Showcase with Signature Floating Sketch Cards */}
        <div className="relative mt-12 lg:mt-16">
          {/* Floating Decorative Preview Card 1: Hairstyle Preview (Top Left) */}
          <div className="hidden lg:block absolute -top-6 left-0 lg:-left-2 xl:-left-8 2xl:-left-12 z-20 w-44 transition-transform hover:-translate-y-1.5 duration-300">
            <div className="absolute inset-0 rounded-2xl border border-amber-300/60 rotate-[-6deg] translate-x-[-4px] translate-y-[-4px] pointer-events-none" />
            <div className="relative rounded-2xl border border-orange-100 bg-white/95 p-2 shadow-xl shadow-orange-950/5 backdrop-blur-sm">
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-orange-50">
                <Image
                  src="/ai-photo-editing-images/hairstyle.jpg"
                  alt="Hairstyle Studio Preview"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                  Hairstyle
                </span>
              </div>
            </div>
          </div>

          {/* Floating Decorative Preview Card 2: Photo Colorize (Bottom Left) */}
          <div className="hidden lg:block absolute -bottom-10 left-0 lg:-left-2 xl:-left-8 2xl:-left-12 z-20 w-40 transition-transform hover:translate-y-1 duration-300">
            <div className="absolute inset-0 rounded-2xl border border-orange-300/60 rotate-[4deg] translate-x-[4px] translate-y-[4px] pointer-events-none" />
            <div className="relative rounded-2xl border border-orange-100 bg-white/95 p-2 shadow-xl shadow-orange-950/5 backdrop-blur-sm">
              <div className="relative h-36 w-full overflow-hidden rounded-xl bg-orange-50">
                <Image
                  src="/ai-photo-editing-images/photo-colorize.jpg"
                  alt="Colorize Restoration Preview"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                  Colorize
                </span>
              </div>
            </div>
          </div>

          {/* Floating Decorative Preview Card 3: Object Erase (Top Right) */}
          <div className="hidden lg:block absolute -top-6 right-0 lg:-right-2 xl:-right-8 2xl:-right-12 z-20 w-44 transition-transform hover:-translate-y-1.5 duration-300">
            <div className="absolute inset-0 rounded-2xl border border-amber-300/60 rotate-[6deg] translate-x-[4px] translate-y-[-4px] pointer-events-none" />
            <div className="relative rounded-2xl border border-orange-100 bg-white/95 p-2 shadow-xl shadow-orange-950/5 backdrop-blur-sm">
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-orange-50">
                <Image
                  src="/ai-photo-editing-images/object-remove.jpg"
                  alt="Object Erase Preview"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                  Object Erase
                </span>
              </div>
            </div>
          </div>

          {/* Floating Decorative Preview Card 4: Studio Lighting (Bottom Right) */}
          <div className="hidden lg:block absolute -bottom-10 right-0 lg:-right-2 xl:-right-8 2xl:-right-12 z-20 w-40 transition-transform hover:translate-y-1 duration-300">
            <div className="absolute inset-0 rounded-2xl border border-orange-300/60 rotate-[-4deg] translate-x-[-4px] translate-y-[4px] pointer-events-none" />
            <div className="relative rounded-2xl border border-orange-100 bg-white/95 p-2 shadow-xl shadow-orange-950/5 backdrop-blur-sm">
              <div className="relative h-36 w-full overflow-hidden rounded-xl bg-orange-50">
                <Image
                  src="/ai-photo-editing-images/photo-lightining.jpg"
                  alt="Photo Lighting Preview"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                  Lighting
                </span>
              </div>
            </div>
          </div>

          {/* Main Single Showcase Card (One prominent image showing selected transformation) */}
          <div className="relative mx-auto max-w-3xl">
            {/* Outer offset wireframe outline frame (signature design motif from mockup) */}
            <div className="absolute -inset-3.5 rounded-3xl border border-amber-300/50 -rotate-[1deg] pointer-events-none hidden sm:block" />
            <div className="absolute -inset-1.5 rounded-3xl border border-orange-200/60 rotate-[1deg] pointer-events-none hidden sm:block" />

            <div className="relative overflow-hidden rounded-3xl border border-orange-200/90 bg-white p-3 sm:p-5 shadow-2xl shadow-orange-900/10">
              {/* Single Prominent Showcase Image Container */}
              <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-orange-50/30">
                <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden">
                  <Image
                    key={current.image}
                    src={current.image}
                    alt={current.title}
                    fill
                    priority
                    className="object-cover object-center transition-all duration-700 group-hover:scale-102"
                  />

                  {/* Top Badges Overlay */}
                  <div className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md flex items-center gap-1.5 border-0 border-none outline-none ring-0">
                    <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
                    <span>BeautyAura AI Showcase</span>
                  </div>

                  <div className="absolute top-3 right-3 rounded-full bg-[#FF5500] px-3.5 py-1 text-xs font-semibold text-white shadow-md shadow-orange-500/30 backdrop-blur-md border-0 border-none outline-none ring-0">
                    {current.badge}
                  </div>

                  {/* Quick Arrow Navigation */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous showcase look"
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-110 cursor-pointer border-0 border-none outline-none ring-0"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next showcase look"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-110 cursor-pointer border-0 border-none outline-none ring-0"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Bottom Card Caption Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 bg-white border-t border-orange-100">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-zinc-900">
                      {current.title}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {current.description}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full shrink-0 border-0 outline-none ring-0">
                    AI Studio Grade
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Descriptive Caption from Mockup */}
          <div className="mx-auto mt-8 max-w-xl text-center">
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              BeautyAura helps you try on any outfit, enhance skin naturally, shape hair &amp; beard, and produce studio-level fashion portraits you&apos;ll love sharing, printing, and gifting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
