"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureIntroProps {
  onOpenQuickTry?: () => void;
}

export function FeatureIntro({ onOpenQuickTry }: FeatureIntroProps) {
  return (
    <section className="pt-16 pb-10 sm:pt-20 sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
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
            <Button
              onClick={onOpenQuickTry}
              className="h-11 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:from-[#E64C00] hover:to-[#FF6A00] transition-all cursor-pointer"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Try Your First 5 Transformations Free
            </Button>

            <a
              href="#features"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-orange-200/90 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-orange-50 hover:border-orange-300"
            >
              Explore all Features
              <ArrowUpRight className="h-4 w-4 text-[#FF5500]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

