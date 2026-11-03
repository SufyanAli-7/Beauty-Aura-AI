"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Sparkles, Wand2, UploadCloud, CheckCircle2, ArrowRight, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickTryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickTryModal({ isOpen, onClose }: QuickTryModalProps) {
  const [activeCategory, setActiveCategory] = useState<"fashion" | "skin" | "beard" | "makeup">("fashion");
  const [selectedSample, setSelectedSample] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  if (!isOpen) return null;

  const demoData = {
    fashion: {
      title: "Virtual Wardrobe & Outfits",
      samples: [
        {
          before: "/normal-headshot/girl1.png",
          after: "/ai-photo-editing-images/ai-virtual-cloth-try-on.webp",
          title: "Evening Haute Couture",
        },
        {
          before: "/fashion-samples/source/sample_Image_1_202b6bf6e6.jpg",
          after: "/fashion-looks/clothes/upper_blazer.jpg",
          title: "Executive Tailored Blazer",
        },
        {
          before: "/normal-headshot/girl3.png",
          after: "/fashion-looks/clothes/dress_full.jpg",
          title: "Summer Runway Dress",
        },
      ],
    },
    skin: {
      title: "Skin & Face AI Retouch",
      samples: [
        {
          before: "/normal-headshot/girl3.png",
          after: "/ai-photo-editing-images/ai-skin-analaysis.webp",
          title: "Pore Smoothing & Tone Balance",
        },
        {
          before: "/normal-headshot/girl4.png",
          after: "/ai-photo-editing-images/photo-enhance.jpg",
          title: "Radiant Studio Glow",
        },
      ],
    },
    beard: {
      title: "Hair & Beard Studio",
      samples: [
        {
          before: "/normal-headshot/boy1.png",
          after: "/ai-photo-editing-images/beard-try-on.jpg",
          title: "Sharp Fade & Styled Beard",
        },
        {
          before: "/normal-headshot/girl2.png",
          after: "/ai-photo-editing-images/hair-color-try-on.png",
          title: "Pastel Dye & Balayage",
        },
      ],
    },
    makeup: {
      title: "Glamour & Makeup Transfer",
      samples: [
        {
          before: "/normal-headshot/girl2.png",
          after: "/ai-photo-editing-images/ai-makeup-try-on.jpg",
          title: "Red Carpet Hollywood Glam",
        },
        {
          before: "/normal-headshot/girl1.png",
          after: "/ai-photo-editing-images/ai-makeup-transfer.jpg",
          title: "Smokey Eye & Nude Lip",
        },
      ],
    },
  };

  const currentCategory = demoData[activeCategory];
  const currentSample = currentCategory.samples[selectedSample] || currentCategory.samples[0];

  const handleSimulateTransform = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessed(true);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-orange-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-orange-100 bg-[#FFFBF7] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5500] text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Instant AI Studio Preview
              </h3>
              <p className="text-xs text-zinc-500">
                Test your 5 free transformations with live sample portraits
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Category Selector */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "fashion", label: "👗 Virtual Outfit Try-On" },
              { id: "skin", label: "✨ Skin & Face Glow" },
              { id: "beard", label: "🧔 Hair & Beard" },
              { id: "makeup", label: "💄 Makeup & Beauty" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setSelectedSample(0);
                  setProcessed(false);
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all border-0 border-none outline-none ring-0 ${
                  activeCategory === cat.id
                    ? "bg-[#FF5500] text-white shadow-md shadow-orange-500/20 border-0 border-none outline-none ring-0"
                    : "bg-zinc-100 text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sample Selectors */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Choose a sample portrait or upload:
            </span>
            <div className="flex items-center gap-3">
              {currentCategory.samples.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSample(idx);
                    setProcessed(false);
                  }}
                  className={`group relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedSample === idx
                      ? "border-[#FF5500] ring-2 ring-orange-500/30 scale-105"
                      : "border-zinc-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={item.before}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}

              <div className="flex h-16 w-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 p-2 text-center hover:bg-orange-50 cursor-pointer">
                <UploadCloud className="h-4 w-4 text-[#FF5500]" />
                <span className="text-[10px] font-semibold text-zinc-600 mt-1">
                  Upload Yours
                </span>
              </div>
            </div>
          </div>

          {/* Comparison Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before */}
            <div className="relative rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50 flex flex-col">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={currentSample.before}
                  alt="Raw Portrait"
                  fill
                  className="object-cover object-top"
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                  Original
                </span>
              </div>
              <div className="p-3 bg-white border-t border-zinc-100 text-xs font-medium text-zinc-600">
                Natural raw portrait
              </div>
            </div>

            {/* After */}
            <div className="relative rounded-2xl border border-orange-200 overflow-hidden bg-orange-50/30 flex flex-col">
              <div className="relative aspect-[4/5] w-full">
                {isProcessing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs gap-3">
                    <RefreshCw className="h-8 w-8 text-[#FF5500] animate-spin" />
                    <span className="text-xs font-bold text-zinc-700">
                      Generating AI Look...
                    </span>
                  </div>
                ) : (
                  <>
                    <Image
                      src={currentSample.after}
                      alt="AI Transformed"
                      fill
                      className="object-cover object-top"
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-[#FF5500] px-3 py-1 text-xs font-semibold text-white shadow-md flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI Studio Result
                    </span>
                  </>
                )}
              </div>
              <div className="p-3 bg-white border-t border-orange-100 flex items-center justify-between text-xs font-semibold text-[#FF5500]">
                <span>{currentSample.title}</span>
                <span className="text-[10px] bg-orange-100 text-[#FF5500] px-2 py-0.5 rounded-full">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-orange-100 bg-[#FFFBF7] px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>4 transformations remaining on free trial</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleSimulateTransform}
              disabled={isProcessing}
              className="flex-1 sm:flex-none rounded-full border-orange-200 text-xs font-semibold text-zinc-700 hover:bg-orange-50"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 text-[#FF5500]" />
              Regenerate Style
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#FF5500] hover:bg-[#E64C00] text-xs font-semibold text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer border-0 border-none outline-none ring-0 focus:outline-none"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              <span>Download High-Res</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
