import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function FeatureIntro() {
  return (
    <section className="pt-16 pb-10 sm:pt-20 sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-14">
          {/* Left Column: Text & Action CTAs */}
          <div className="max-w-2xl flex-1">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/90 px-3.5 py-1 text-xs font-semibold text-zinc-700">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF5500]" />
              5 Free Transformations Included
            </div>

            {/* Headline */}
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl leading-tight">
              Try your first 5 transformations{" "}
              <span className="text-[#FF5500] block sm:inline">Completely Free</span>
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl">
              Select your favorite style from Virtual Try-On, Flawless Skin Retouch, Hair &amp; Beard, or Makeup Transfer, upload your image to instantly transform it, and download your result in seconds.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="#features"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] hover:from-[#E64C00] hover:to-[#FF6A00] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all cursor-pointer border-0 border-none outline-none ring-0 focus:outline-none"
              >
                <Sparkles className="h-4 w-4" />
                <span>Try Your First 5 Transformations Free</span>
              </a>

              <a
                href="#features"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-orange-200/90 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-orange-50 hover:border-orange-300 outline-none ring-0"
              >
                Explore all Features
                <ArrowUpRight className="h-4 w-4 text-[#FF5500]" />
              </a>
            </div>
          </div>

          {/* Right Column: AI Age Progression Image Showcase (Web / Desktop only, hidden on mobile) */}
          <div className="hidden lg:block relative shrink-0 w-full max-w-md xl:max-w-lg">
            {/* Background offset wireframe outlines (exact match with Virtual Try-On card) */}
            <div className="absolute inset-0 rounded-3xl border border-amber-300/60 pointer-events-none transition-transform duration-500 rotate-[3deg] translate-x-[8px] translate-y-[-6px]" />
            <div className="absolute inset-0 rounded-3xl border border-orange-200/70 pointer-events-none transition-transform duration-500 rotate-[-2deg] translate-x-[-6px] translate-y-[8px]" />

            {/* Main Rounded Photo Card */}
            <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-2.5 shadow-xl shadow-orange-950/5">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-orange-50/50">
                <Image
                  src="/ai-photo-editing-images/ai-age.webp"
                  alt="AI Age Transformation & Photo Styling"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(min-width: 1280px) 512px, (min-width: 1024px) 448px, 100vw"
                />
                
                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>Age Progression &amp; Time Travel</span>
                </div>

                <div className="absolute bottom-3 right-3 rounded-full bg-[#FF5500] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                  AI Transformation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
