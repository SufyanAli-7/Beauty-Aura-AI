"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shirt,
  Sparkles,
  Upload,
  Zap,
  CheckCircle2,
  RotateCcw,
  Download,
  Check,
  RefreshCw,
  Columns2,
  Info,
  Sliders,
  AlertTriangle,
  ExternalLink,
  ShoppingBag,
  Footprints,
  Crown,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

// 1. Tool Options
export type FashionToolId = "clothes" | "bag" | "shoes" | "hat";

interface FashionTool {
  id: FashionToolId;
  title: string;
  tagline: string;
  badge: string;
  image: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FASHION_TOOLS: FashionTool[] = [
  {
    id: "clothes",
    title: "AI Clothes Virtual Try-On",
    tagline: "Drape couture gowns, blazers & casual outfits",
    badge: "Flagship",
    image: "/ai-photo-editing-images/ai-virtual-cloth-try-on.webp",
    description: "Fit luxury dresses, tailored blazers, denim, and full streetwear looks with realistic fabric folds.",
    icon: Shirt,
  },
  {
    id: "bag",
    title: "AI Bag Virtual Try-On",
    tagline: "Hyper-realistic designer totes & handbags",
    badge: "Luxury",
    image: "/ai-photo-editing-images/bag-try-on.png",
    description: "Position luxury leather totes, crossbody bags, and evening clutches with natural posture tracking.",
    icon: ShoppingBag,
  },
  {
    id: "shoes",
    title: "AI Shoes Virtual Try-On",
    tagline: "Instant footwear fit: sneakers, boots & heels",
    badge: "Precision Fit",
    image: "/ai-photo-editing-images/shoes-try-on.jpg",
    description: "Try on trending sneakers, high heels, loafers, and leather boots with realistic foot alignment.",
    icon: Footprints,
  },
  {
    id: "hat",
    title: "AI Hat Virtual Try-On",
    tagline: "Contoured headwear: fedoras, caps & beanies",
    badge: "Headwear",
    image: "/ai-photo-editing-images/hat-try-on.jpg",
    description: "Preview stylish fedoras, baseball caps, bucket hats, and knit beanies with exact head curvature.",
    icon: Crown,
  },
];

// 2. Sample Model Source Images (Full Body / Portrait)
interface FashionModel {
  id: string;
  name: string;
  src: string;
  gender: "female" | "male";
  framing: string;
}

const FASHION_MODELS: FashionModel[] = [
  {
    id: "model-1",
    name: "Amara",
    src: "/fashion-samples/source/fullbody_01.jpg",
    gender: "female",
    framing: "Full Body Studio",
  },
  {
    id: "model-2",
    name: "Sophia",
    src: "/fashion-samples/source/fullbody_02.jpg",
    gender: "female",
    framing: "Full Body Chic",
  },
  {
    id: "model-3",
    name: "Elena",
    src: "/fashion-samples/source/sample_Image_1_202b6bf6e6.jpg",
    gender: "female",
    framing: "Portrait & Torso",
  },
  {
    id: "model-4",
    name: "Lucas",
    src: "/fashion-samples/source/clothes_03_cccd5d4803.jpeg",
    gender: "male",
    framing: "Full Body Casual",
  },
];

// 3. Dynamic Looks per Tool
// A. Clothes Looks
const CLOTHES_LOOKS = [
  {
    id: "cloth-1",
    name: "Silk Evening Gown",
    category: "full_body",
    categoryLabel: "Full Body",
    src: "/fashion-looks/clothes/dress_full.jpg",
    styleTone: "Floor-length Emerald Glamour",
  },
  {
    id: "cloth-2",
    name: "Tailored Navy Blazer",
    category: "upper_body",
    categoryLabel: "Upper Body",
    src: "/fashion-looks/clothes/upper_blazer.jpg",
    styleTone: "Double-breasted Sartorial Wool",
  },
  {
    id: "cloth-3",
    name: "Classic Denim Trousers",
    category: "lower_body",
    categoryLabel: "Lower Body",
    src: "/fashion-looks/clothes/lower_denim.jpg",
    styleTone: "High-waist Straight Leg",
  },
  {
    id: "cloth-4",
    name: "High-Fashion Ensemble",
    category: "full_body",
    categoryLabel: "Full Body",
    src: "/fashion-looks/clothes/full_body_01_5a000d999f.png",
    styleTone: "Runway Silhouette & Drapes",
  },
];

// B. Bag Looks
const BAG_LOOKS = [
  {
    id: "bag-1",
    name: "Parisian Leather Tote",
    style: "style_parisian_chic",
    styleLabel: "Parisian Chic",
    src: "/fashion-looks/bag/tote_leather.jpg",
    description: "Structured calfskin leather tote",
  },
  {
    id: "bag-2",
    name: "Urban Crossbody",
    style: "style_urban_chic",
    styleLabel: "Urban Chic",
    src: "/fashion-looks/bag/crossbody.jpg",
    description: "Compact street fashion saddle bag",
  },
  {
    id: "bag-3",
    name: "Mediterranean Mini Purse",
    style: "style_mediterranean_chic",
    styleLabel: "Mediterranean",
    src: "/fashion-looks/bag/mini_purse.jpg",
    description: "Woven leather evening mini clutch",
  },
  {
    id: "bag-4",
    name: "Art Deco Shoulder Bag",
    style: "style_art_deco_style",
    styleLabel: "Art Deco",
    src: "/fashion-looks/bag/structured.jpg",
    description: "Gold chain geometric silhouette",
  },
];

// C. Shoes Looks
const SHOES_LOOKS = [
  {
    id: "shoes-1",
    name: "White Leather Sneakers",
    src: "/fashion-looks/shoes/white_sneakers.jpg",
    description: "Clean minimalist low-top sneakers",
  },
  {
    id: "shoes-2",
    name: "Classic Penny Loafers",
    src: "/fashion-looks/shoes/loafers.jpg",
    description: "Polished Italian leather loafers",
  },
  {
    id: "shoes-3",
    name: "Evening Stiletto Heels",
    src: "/fashion-looks/shoes/heels.jpg",
    description: "Pointed toe formal black stiletto",
  },
  {
    id: "shoes-4",
    name: "Chelsea Leather Boots",
    src: "/fashion-looks/shoes/boots.jpg",
    description: "Sleek ankle boot with elastic gusset",
  },
];

// D. Hat Looks
const HAT_LOOKS = [
  {
    id: "hat-1",
    name: "Classic Wool Fedora",
    style: "style_urban_fashion",
    styleLabel: "Urban Fashion",
    src: "/fashion-looks/hat/fedora.jpg",
    description: "Structured wide brim with grosgrain band",
  },
  {
    id: "hat-2",
    name: "Streetwear Baseball Cap",
    style: "style_sporty_casual",
    styleLabel: "Sporty Casual",
    src: "/fashion-looks/hat/cap.jpg",
    description: "Adjustable 6-panel athletic cotton cap",
  },
  {
    id: "hat-3",
    name: "Canvas Bucket Hat",
    style: "style_vacation_casual",
    styleLabel: "Vacation Casual",
    src: "/fashion-looks/hat/bucket.jpg",
    description: "Summer relaxed fit wide brim hat",
  },
  {
    id: "hat-4",
    name: "Cozy Knit Beanie",
    style: "style_warm_cozy",
    styleLabel: "Warm & Cozy",
    src: "/fashion-looks/hat/beanie.jpg",
    description: "Chunky ribbed wool winter cuff beanie",
  },
];

// Dropdown Options
interface DropdownOption {
  value: string;
  label: string;
}

const BAG_STYLE_OPTIONS: DropdownOption[] = [
  { value: "style_parisian_chic", label: "Parisian Chic" },
  { value: "style_urban_chic", label: "Urban Chic" },
  { value: "style_mediterranean_chic", label: "Mediterranean" },
  { value: "style_art_deco_style", label: "Art Deco Style" },
  { value: "random", label: "Dynamic / Random" },
];

const HAT_STYLE_OPTIONS: DropdownOption[] = [
  { value: "style_urban_fashion", label: "Urban Fashion" },
  { value: "style_sporty_casual", label: "Sporty Casual" },
  { value: "style_vacation_casual", label: "Vacation Casual" },
  { value: "style_warm_cozy", label: "Warm & Cozy" },
  { value: "style_bohemian", label: "Bohemian" },
  { value: "random", label: "Dynamic / Random" },
];

// Styled Custom Dropdown Component
function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "Select style...",
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-bold text-zinc-900 transition-all cursor-pointer shadow-2xs",
          isOpen
            ? "border-[#FF5500] ring-2 ring-[#FF5500]/25 shadow-orange-500/10"
            : "border-orange-200/90 hover:border-orange-300 hover:bg-orange-50/20"
        )}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-[#FF5500]"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-2xl border border-orange-200/90 bg-white/95 p-1.5 shadow-xl shadow-orange-950/10 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-0.5 max-h-56 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent]">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer text-left",
                    isSelected
                      ? "bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50/20 text-[#FF5500] font-bold"
                      : "text-zinc-700 hover:bg-orange-50/60 hover:text-zinc-900"
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-[#FF5500] stroke-[2.5] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FashionStudioPage() {
  const { user, credits, setCredits } = useAuth();

  // 1. Tool Selection
  const [selectedTool, setSelectedTool] = useState<FashionToolId>("clothes");

  // 2. Source Model Image State - Upload Photo is FIRST
  const [sourceTab, setSourceTab] = useState<"upload" | "test">("upload");
  const [selectedSource, setSelectedSource] = useState<string>(
    "/fashion-samples/source/fullbody_01.jpg"
  );
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Dynamic Look States
  // A. Clothes State
  const [selectedClothesLook, setSelectedClothesLook] = useState<string>(
    "/fashion-looks/clothes/dress_full.jpg"
  );
  const [garmentCategory, setGarmentCategory] = useState<
    "full_body" | "upper_body" | "lower_body" | "outer" | "auto"
  >("full_body");
  const [changeShoes, setChangeShoes] = useState<boolean>(true);

  // B. Bag State
  const [selectedBagLook, setSelectedBagLook] = useState<string>(
    "/fashion-looks/bag/tote_leather.jpg"
  );
  const [bagGender, setBagGender] = useState<"female" | "male">("female");
  const [bagStyle, setBagStyle] = useState<string>("style_parisian_chic");

  // C. Shoes State
  const [selectedShoesLook, setSelectedShoesLook] = useState<string>(
    "/fashion-looks/shoes/white_sneakers.jpg"
  );

  // D. Hat State
  const [selectedHatLook, setSelectedHatLook] = useState<string>(
    "/fashion-looks/hat/fedora.jpg"
  );
  const [hatGender, setHatGender] = useState<"female" | "male">("female");
  const [hatStyle, setHatStyle] = useState<string>("style_urban_fashion");

  // Custom Item Upload Preview
  const [customRefPreview, setCustomRefPreview] = useState<string | null>(null);
  const customRefInputRef = useRef<HTMLInputElement>(null);

  // 4. Generation & Result State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"result" | "split" | "original">("result");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Reference & state to synchronize left options height with Live Studio Canvas
  const canvasCardRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (!canvasCardRef.current) return;

    const updateHeight = () => {
      if (canvasCardRef.current) {
        setCanvasHeight(canvasCardRef.current.getBoundingClientRect().height);
      }
    };

    updateHeight();

    const ro = new ResizeObserver(() => {
      updateHeight();
    });

    ro.observe(canvasCardRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [hasGenerated, isGenerating, viewMode]);

  // Active Tool Object
  const currentTool =
    FASHION_TOOLS.find((t) => t.id === selectedTool) || FASHION_TOOLS[0];

  // Effective Source Image
  const activeSourceImage =
    sourceTab === "upload" && uploadedPreview ? uploadedPreview : selectedSource;

  // Active Reference Image
  const getActiveRefImage = () => {
    if (customRefPreview) return customRefPreview;
    if (selectedTool === "clothes") return selectedClothesLook;
    if (selectedTool === "bag") return selectedBagLook;
    if (selectedTool === "shoes") return selectedShoesLook;
    if (selectedTool === "hat") return selectedHatLook;
    return selectedClothesLook;
  };

  // Split Slider Dragging
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  useEffect(() => {
    if (!isDraggingSlider) return;

    const onMouseMove = (e: MouseEvent) => {
      handleSliderMove(e.clientX);
    };
    const onMouseUp = () => {
      setIsDraggingSlider(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDraggingSlider]);

  // Handle Source File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPreview(reader.result as string);
        setSourceTab("upload");
        setHasGenerated(false);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Drag & Drop Source
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPreview(reader.result as string);
        setSourceTab("upload");
        setHasGenerated(false);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Custom Item Upload
  const handleCustomRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomRefPreview(reader.result as string);
        setHasGenerated(false);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct File Download Handler (downloads directly to user disk)
  const handleDownloadResult = async () => {
    if (!generatedImageUrl) return;
    try {
      setIsDownloading(true);
      const filename = `beautyaura-fashion-${selectedTool}-${Date.now()}.jpg`;
      const response = await fetch(generatedImageUrl);
      if (!response.ok) throw new Error("Network fetch failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (err) {
      console.warn("Direct blob download error, attempting canvas fallback:", err);
      try {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = `beautyaura-fashion-${selectedTool}-${Date.now()}.jpg`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(blobUrl);
                }, 1000);
              }
            }, "image/jpeg", 0.98);
          }
        };
        img.src = generatedImageUrl;
      } catch {
        window.open(generatedImageUrl, "_blank");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Run Real AI Fashion Generation Workflow
  const handleGenerate = async () => {
    setErrorMessage(null);

    // Check credits
    if (credits < 5) {
      setErrorMessage(
        "You do not have enough credits (5 credits required). Please refill your credits in Billing."
      );
      return;
    }

    setIsGenerating(true);
    setGenerationStep("Initializing Fashion AI Engine...");

    if (typeof window !== "undefined" && window.innerWidth < 1024 && canvasCardRef.current) {
      canvasCardRef.current.scrollIntoView({ behavior: "smooth" });
    }

    try {
      // Step A: Prepare Look Payload based on selected tool
      let lookData: any = {};
      const activeRef = getActiveRefImage();

      if (selectedTool === "clothes") {
        const itemObj = CLOTHES_LOOKS.find((l) => l.src === selectedClothesLook);
        lookData = {
          refImageUrl: activeRef,
          garmentCategory: garmentCategory,
          changeShoes: changeShoes,
          lookName: customRefPreview
            ? "Custom Garment Inspiration"
            : itemObj?.name || "Silk Evening Gown",
        };
      } else if (selectedTool === "bag") {
        const bagObj = BAG_LOOKS.find((b) => b.src === selectedBagLook);
        lookData = {
          refImageUrl: activeRef,
          gender: bagGender,
          style: bagStyle,
          lookName: customRefPreview
            ? "Custom Designer Bag"
            : bagObj?.name || "Parisian Leather Tote",
        };
      } else if (selectedTool === "shoes") {
        const shoeObj = SHOES_LOOKS.find((s) => s.src === selectedShoesLook);
        lookData = {
          refImageUrl: activeRef,
          lookName: customRefPreview
            ? "Custom Footwear Fitting"
            : shoeObj?.name || "White Leather Sneakers",
        };
      } else if (selectedTool === "hat") {
        const hatObj = HAT_LOOKS.find((h) => h.src === selectedHatLook);
        lookData = {
          refImageUrl: activeRef,
          gender: hatGender,
          style: hatStyle,
          lookName: customRefPreview
            ? "Custom Headwear Fitting"
            : hatObj?.name || "Classic Wool Fedora",
        };
      }

      setGenerationStep("Synthesizing body posture & garment physics...");

      const userId = user?.id || "guest-user";

      // Step B: Call backend Fashion API route
      const res = await fetch("/api/fashion/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          toolId: selectedTool,
          sourceImageUrl: activeSourceImage,
          lookData,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Fashion generation request failed.");
      }

      setGenerationStep("Finalizing 4K studio render...");

      // Step C: Update state with permanent URL
      setGeneratedImageUrl(data.resultUrl || data.youcamUrl);
      if (typeof data.remainingCredits === "number") {
        setCredits(data.remainingCredits);
      }

      setHasGenerated(true);
      setViewMode("result");
    } catch (err: any) {
      console.error("Fashion Studio Generation error:", err);
      setErrorMessage(err.message || "Failed to generate fitting. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  // Reset to initial state
  const handleReset = () => {
    setHasGenerated(false);
    setGeneratedImageUrl("");
    setViewMode("result");
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6 pb-2">
      {/* Studio Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <Shirt className="h-3.5 w-3.5" />
            <span>Virtual Fitting Room</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            Fashion &amp; Virtual Try-On
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Drape couture garments, designer bags, shoes &amp; hats with hyper-realistic fabric physics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/80 px-3.5 py-1 text-xs font-bold text-zinc-800">
            <Zap className="h-3.5 w-3.5 text-[#FF5500] fill-current" />
            <span>5 Credits / fitting</span>
          </div>
          <div className="text-xs font-bold text-zinc-500">
            Balance: <span className="text-zinc-900 font-black">{credits}</span>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs font-semibold text-rose-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          {credits < 5 && (
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1 font-bold text-white hover:bg-rose-700 transition"
            >
              <span>Refill</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}

      {/* Main Two-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* =========================================================================
            LEFT COLUMN: Controls & Customization (Scrollable Options 1, 2, 3)
           ========================================================================= */}
        <div
          style={isDesktop && canvasHeight ? { maxHeight: `${canvasHeight}px` } : undefined}
          className="order-1 lg:order-none lg:col-span-5 xl:col-span-5 space-y-5 lg:overflow-y-auto lg:pr-2.5 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-stone-100/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-200/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5500]/70 transition-colors"
        >
          {/* 1. CHOOSE & CUSTOMIZE: 4 Selectable Fashion AI Tool Cards */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  1
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Choose Fashion AI Tool
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#FF5500]">
                4 Features
              </span>
            </div>

            {/* Selectable Tool Cards Grid */}
            <div className="space-y-2.5">
              {FASHION_TOOLS.map((tool) => {
                const isActive = selectedTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      setSelectedTool(tool.id);
                      setCustomRefPreview(null);
                      setHasGenerated(false);
                      setErrorMessage(null);
                    }}
                    className={cn(
                      "w-full group relative flex items-center gap-3.5 rounded-2xl p-3 text-left transition-all duration-200 border cursor-pointer",
                      isActive
                        ? "bg-gradient-to-r from-orange-50 via-amber-50/50 to-white border-[#FF5500] ring-2 ring-[#FF5500]/25 shadow-md shadow-orange-500/10"
                        : "bg-stone-50/60 border-orange-100 hover:border-orange-200 hover:bg-orange-50/40"
                    )}
                  >
                    {/* Tool Thumbnail Image */}
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-orange-200/70 bg-stone-100 shadow-2xs">
                      <Image
                        src={tool.image}
                        alt={tool.title}
                        fill
                        sizes="56px"
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Tool Info */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-xs font-black text-zinc-900">
                          {tool.title}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider shrink-0",
                            isActive
                              ? "bg-[#FF5500] text-white"
                              : "bg-orange-100 text-orange-700"
                          )}
                        >
                          {tool.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate font-medium">
                        {tool.tagline}
                      </p>
                    </div>

                    {/* Active Check Indicator */}
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all",
                        isActive
                          ? "bg-[#FF5500] text-white shadow-xs"
                          : "border border-zinc-200 text-transparent group-hover:border-orange-300"
                      )}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SOURCE IMAGE SECTION */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  2
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Source Model Photo
                </h3>
              </div>
              <span className="text-[11px] font-medium text-zinc-400">
                Full body or portrait
              </span>
            </div>

            {/* Toggle: Upload Photo is FIRST, Sample Models is SECOND */}
            <div className="flex rounded-xl bg-stone-100/80 p-1 border border-orange-100/60">
              <button
                type="button"
                onClick={() => setSourceTab("upload")}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer text-center",
                  sourceTab === "upload"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                Upload Photo
              </button>
              <button
                type="button"
                onClick={() => setSourceTab("test")}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer text-center",
                  sourceTab === "test"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                Sample Models (4)
              </button>
            </div>

            {/* Tab 1: Upload Image Zone (First) */}
            {sourceTab === "upload" && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200/90 bg-stone-50/60 p-6 text-center hover:border-orange-400 hover:bg-orange-50/30 transition cursor-pointer"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-[#FF5500] mb-2.5 shadow-2xs">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-zinc-900">
                  Click to browse or drag and drop
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Full body or portrait &bull; PNG, JPG, WebP
                </p>
              </div>
            )}

            {/* Tab 2: Sample Models Grid */}
            {sourceTab === "test" && (
              <div className="grid grid-cols-4 gap-2">
                {FASHION_MODELS.map((model) => {
                  const isSelected = selectedSource === model.src && !uploadedPreview;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setSelectedSource(model.src);
                        setUploadedPreview(null);
                        setHasGenerated(false);
                        setErrorMessage(null);
                      }}
                      className="group flex flex-col items-center text-center cursor-pointer transition-all"
                      title={model.name}
                    >
                      <div
                        className={cn(
                          "relative aspect-[3/4] w-full overflow-hidden rounded-xl border bg-stone-100 transition-all shadow-xs",
                          isSelected
                            ? "border-[#FF5500] ring-2 ring-[#FF5500] shadow-sm scale-102"
                            : "border-orange-100 hover:border-orange-300 opacity-90 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={model.src}
                          alt={model.name}
                          fill
                          sizes="90px"
                          className="object-cover object-top"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-2xs">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <span
                        className={cn(
                          "mt-1 text-[11px] font-bold truncate transition-colors",
                          isSelected
                            ? "text-[#FF5500]"
                            : "text-zinc-600 group-hover:text-zinc-900"
                        )}
                      >
                        {model.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected Image Preview Pill */}
            <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-stone-50/80 p-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-orange-200 bg-white">
                  <Image
                    src={activeSourceImage}
                    alt="Selected Model"
                    fill
                    sizes="48px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-zinc-900 truncate">
                    {sourceTab === "upload" && uploadedPreview
                      ? "Uploaded Custom Photo"
                      : "Selected Model (" +
                        (FASHION_MODELS.find((m) => m.src === selectedSource)?.name || "Amara") +
                        ")"}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    Model Silhouette Detected
                  </span>
                </div>
              </div>

              {sourceTab === "upload" && uploadedPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setUploadedPreview(null);
                    setSelectedSource("/fashion-samples/source/fullbody_01.jpg");
                  }}
                  className="text-xs font-bold text-zinc-400 hover:text-rose-600 transition px-2 py-1 cursor-pointer shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 3. CHOOSE LOOK SECTION (Dynamic per Selected Tool) */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  3
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Choose {currentTool.title.replace("AI ", "").replace(" Virtual Try-On", "")}
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#FF5500]">
                {selectedTool === "clothes"
                  ? "Garments & Fits"
                  : selectedTool === "bag"
                  ? "Designer Totes & Clutches"
                  : selectedTool === "shoes"
                  ? "Footwear Lineup"
                  : "Headwear Styles"}
              </span>
            </div>

            {/* A. DYNAMIC OPTIONS FOR: AI Clothes Virtual Try-On */}
            {selectedTool === "clothes" && (
              <div className="space-y-4">
                {/* Garment Category Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span>Garment Category</span>
                    <span className="text-[10px] text-zinc-400">Fitting Scope</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-stone-100/80 p-1 border border-orange-100/60">
                    {[
                      { id: "full_body", label: "Full Body" },
                      { id: "upper_body", label: "Upper Body" },
                      { id: "lower_body", label: "Lower Body" },
                      { id: "outer", label: "Outerwear" },
                      { id: "auto", label: "Auto Detect" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setGarmentCategory(cat.id as any)}
                        className={cn(
                          "rounded-lg py-1.5 text-[11px] font-bold transition cursor-pointer text-center",
                          garmentCategory === cat.id
                            ? "bg-white text-zinc-900 shadow-2xs"
                            : "text-zinc-500 hover:text-zinc-900"
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reference Looks Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span>Curated Garment Looks</span>
                    <span className="text-[10px] text-[#FF5500]">4 Outfits</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {CLOTHES_LOOKS.map((look) => {
                      const isSelected =
                        selectedClothesLook === look.src && !customRefPreview;
                      return (
                        <button
                          key={look.id}
                          type="button"
                          onClick={() => {
                            setSelectedClothesLook(look.src);
                            setGarmentCategory(look.category as any);
                            setCustomRefPreview(null);
                            setHasGenerated(false);
                            setErrorMessage(null);
                          }}
                          className={cn(
                            "group relative flex flex-col overflow-hidden rounded-2xl border p-2 text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-[#FF5500] ring-2 ring-[#FF5500]/25 bg-orange-50/50 shadow-xs"
                              : "border-orange-100 bg-stone-50/60 hover:border-orange-200"
                          )}
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white mb-2">
                            <Image
                              src={look.src}
                              alt={look.name}
                              fill
                              sizes="140px"
                              className="object-cover object-center transition-transform group-hover:scale-105"
                            />
                            <span className="absolute bottom-1 left-1 rounded-full bg-black/75 px-1.5 py-0.2 text-[8px] font-bold text-white">
                              {look.categoryLabel}
                            </span>
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-xs">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-zinc-900 truncate">
                            {look.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 truncate">
                            {look.styleTone}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footwear swap toggle */}
                <div className="flex items-center justify-between rounded-xl border border-orange-100 bg-stone-50/70 p-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-900">
                      Match Footwear To Outfit
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Replaces shoes when reference outfit includes shoes
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChangeShoes(!changeShoes)}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                      changeShoes ? "bg-[#FF5500]" : "bg-zinc-200"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                        changeShoes ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* B. DYNAMIC OPTIONS FOR: AI Bag Virtual Try-On */}
            {selectedTool === "bag" && (
              <div className="space-y-4">
                {/* Gender & Style Selectors */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Model Gender</label>
                    <div className="flex rounded-xl bg-stone-100 p-1">
                      {(["female", "male"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setBagGender(g)}
                          className={cn(
                            "flex-1 rounded-lg py-1 text-xs font-bold capitalize transition cursor-pointer text-center",
                            bagGender === g
                              ? "bg-white text-zinc-900 shadow-2xs"
                              : "text-zinc-500 hover:text-zinc-900"
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Fashion Style</label>
                    <CustomDropdown
                      value={bagStyle}
                      onChange={setBagStyle}
                      options={BAG_STYLE_OPTIONS}
                    />
                  </div>
                </div>

                {/* Reference Bags Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span>Designer Handbag Catalog</span>
                    <span className="text-[10px] text-[#FF5500]">4 Luxury Totes</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {BAG_LOOKS.map((bag) => {
                      const isSelected =
                        selectedBagLook === bag.src && !customRefPreview;
                      return (
                        <button
                          key={bag.id}
                          type="button"
                          onClick={() => {
                            setSelectedBagLook(bag.src);
                            setBagStyle(bag.style);
                            setCustomRefPreview(null);
                            setHasGenerated(false);
                            setErrorMessage(null);
                          }}
                          className={cn(
                            "group relative flex flex-col overflow-hidden rounded-2xl border p-2 text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-[#FF5500] ring-2 ring-[#FF5500]/25 bg-orange-50/50 shadow-xs"
                              : "border-orange-100 bg-stone-50/60 hover:border-orange-200"
                          )}
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white mb-2">
                            <Image
                              src={bag.src}
                              alt={bag.name}
                              fill
                              sizes="140px"
                              className="object-contain p-2 transition-transform group-hover:scale-105"
                            />
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-xs">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-zinc-900 truncate">
                            {bag.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 truncate">
                            {bag.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* C. DYNAMIC OPTIONS FOR: AI Shoes Virtual Try-On */}
            {selectedTool === "shoes" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span>Designer Footwear Catalog</span>
                    <span className="text-[10px] text-[#FF5500]">4 Styles</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SHOES_LOOKS.map((shoe) => {
                      const isSelected =
                        selectedShoesLook === shoe.src && !customRefPreview;
                      return (
                        <button
                          key={shoe.id}
                          type="button"
                          onClick={() => {
                            setSelectedShoesLook(shoe.src);
                            setCustomRefPreview(null);
                            setHasGenerated(false);
                            setErrorMessage(null);
                          }}
                          className={cn(
                            "group relative flex flex-col overflow-hidden rounded-2xl border p-2 text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-[#FF5500] ring-2 ring-[#FF5500]/25 bg-orange-50/50 shadow-xs"
                              : "border-orange-100 bg-stone-50/60 hover:border-orange-200"
                          )}
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white mb-2">
                            <Image
                              src={shoe.src}
                              alt={shoe.name}
                              fill
                              sizes="140px"
                              className="object-contain p-2 transition-transform group-hover:scale-105"
                            />
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-xs">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-zinc-900 truncate">
                            {shoe.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 truncate">
                            {shoe.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* D. DYNAMIC OPTIONS FOR: AI Hat Virtual Try-On */}
            {selectedTool === "hat" && (
              <div className="space-y-4">
                {/* Gender & Style Selectors */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Model Gender</label>
                    <div className="flex rounded-xl bg-stone-100 p-1">
                      {(["female", "male"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setHatGender(g)}
                          className={cn(
                            "flex-1 rounded-lg py-1 text-xs font-bold capitalize transition cursor-pointer text-center",
                            hatGender === g
                              ? "bg-white text-zinc-900 shadow-2xs"
                              : "text-zinc-500 hover:text-zinc-900"
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Aesthetic Style</label>
                    <CustomDropdown
                      value={hatStyle}
                      onChange={setHatStyle}
                      options={HAT_STYLE_OPTIONS}
                    />
                  </div>
                </div>

                {/* Reference Hats Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span>Headwear Catalog</span>
                    <span className="text-[10px] text-[#FF5500]">4 Silhouettes</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {HAT_LOOKS.map((hat) => {
                      const isSelected =
                        selectedHatLook === hat.src && !customRefPreview;
                      return (
                        <button
                          key={hat.id}
                          type="button"
                          onClick={() => {
                            setSelectedHatLook(hat.src);
                            setHatStyle(hat.style);
                            setCustomRefPreview(null);
                            setHasGenerated(false);
                            setErrorMessage(null);
                          }}
                          className={cn(
                            "group relative flex flex-col overflow-hidden rounded-2xl border p-2 text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-[#FF5500] ring-2 ring-[#FF5500]/25 bg-orange-50/50 shadow-xs"
                              : "border-orange-100 bg-stone-50/60 hover:border-orange-200"
                          )}
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white mb-2">
                            <Image
                              src={hat.src}
                              alt={hat.name}
                              fill
                              sizes="140px"
                              className="object-contain p-2 transition-transform group-hover:scale-105"
                            />
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-xs">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-zinc-900 truncate">
                            {hat.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 truncate">
                            {hat.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Upload Custom Item / Garment Inspiration */}
            <div className="pt-2 border-t border-orange-100/80">
              <input
                ref={customRefInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleCustomRefChange}
              />
              {customRefPreview ? (
                <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50/60 p-2">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={customRefPreview}
                      alt="Custom Item"
                      className="h-10 w-10 rounded-lg object-contain bg-white border border-orange-200"
                    />
                    <div className="text-xs font-bold text-zinc-900">
                      Custom Item Selected
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomRefPreview(null)}
                    className="text-xs font-semibold text-zinc-400 hover:text-rose-600 px-2 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => customRefInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-orange-200 py-2.5 text-xs font-bold text-zinc-700 hover:border-orange-400 hover:bg-orange-50/50 transition cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5 text-[#FF5500]" />
                  <span>
                    Upload Custom {currentTool.title.replace("AI ", "").replace(" Virtual Try-On", "")} Item
                  </span>
                </button>
              )}
            </div>

            {/* Feature Info Banner */}
            <div className="flex items-start gap-1.5 rounded-xl bg-orange-50/50 p-2.5 text-[11px] text-zinc-500">
              <Info className="h-3.5 w-3.5 shrink-0 text-[#FF5500] mt-0.5" />
              <span>
                Fashion AI dynamically matches clothing folds, accessory gravity, and shadow textures to the subject&apos;s silhouette.
              </span>
            </div>

            {/* Primary Generation CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 hover:shadow-orange-500/35 transition cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{generationStep || `Synthesizing ${currentTool.title}...`}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Fitting (5 Credits)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Generated Result / Studio Viewport
           ========================================================================= */}
        <div className="order-2 lg:order-none lg:col-span-7 xl:col-span-7 flex flex-col space-y-4 lg:sticky lg:top-24">
          <div
            ref={canvasCardRef}
            className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-white p-4 sm:p-5 shadow-lg flex flex-col justify-between min-h-[580px] sm:min-h-[660px]"
          >
            {/* Viewport Top Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100/80 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                  {currentTool.title}
                </span>
                <span className="text-xs font-bold text-zinc-800 hidden sm:inline">
                  {hasGenerated ? "Ready for Export" : "Live Studio Canvas"}
                </span>
              </div>

              {/* View Mode Switcher (When result has generated) */}
              {hasGenerated ? (
                <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-stone-50/80 p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("result")}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer",
                      viewMode === "result"
                        ? "bg-[#FF5500] text-white shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    )}
                  >
                    Result
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("split")}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer",
                      viewMode === "split"
                        ? "bg-[#FF5500] text-white shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    )}
                  >
                    <Columns2 className="h-3 w-3" />
                    <span>Compare</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("original")}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer",
                      viewMode === "original"
                        ? "bg-[#FF5500] text-white shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    )}
                  >
                    Original
                  </button>
                </div>
              ) : (
                <div className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  <span>4K Lossless Rendering Engine</span>
                </div>
              )}
            </div>

            {/* Viewport Main Display Canvas */}
            <div className="relative my-4 flex-1 flex items-center justify-center min-h-[460px] sm:min-h-[520px] rounded-2xl bg-gradient-to-b from-stone-50 to-orange-50/20 border border-orange-100 overflow-hidden">
              {/* CASE 1: Generating Loading State */}
              {isGenerating && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xs p-6 space-y-4">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#FF5500] to-[#FFA033] text-white shadow-xl shadow-orange-500/30">
                    <Shirt className="h-9 w-9 animate-bounce" />
                    <div className="absolute inset-0 rounded-3xl border-2 border-orange-300 animate-ping" />
                  </div>
                  <div className="text-center space-y-1 max-w-sm">
                    <h4 className="text-base font-extrabold text-zinc-900">
                      Generating Fitting...
                    </h4>
                    <p className="text-xs text-zinc-600 font-medium animate-pulse">
                      {generationStep || "Synthesizing fabric physics, lighting & shadow contours..."}
                    </p>
                  </div>
                  <div className="w-56 h-1.5 bg-orange-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] animate-pulse w-3/4 rounded-full" />
                  </div>
                  <span className="text-[10px] text-zinc-400">
                    Deducting 5 credits &bull; Saving to Studio Cloud Library
                  </span>
                </div>
              )}

              {/* CASE 2: Generated Result Visible */}
              {hasGenerated && generatedImageUrl ? (
                <>
                  {/* Mode: Result Only */}
                  {viewMode === "result" && (
                    <div className="relative h-full w-full flex items-center justify-center p-2">
                      <div className="relative h-full w-full max-h-[560px] aspect-[4/5] sm:aspect-[3/4] mx-auto overflow-hidden rounded-2xl shadow-md border border-orange-200/70 bg-zinc-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={generatedImageUrl}
                          alt="AI Generated Fashion Result"
                          className="h-full w-full object-contain"
                        />
                        <div className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span>4K UHD Enhanced</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode: Original Only */}
                  {viewMode === "original" && (
                    <div className="relative h-full w-full flex items-center justify-center p-2">
                      <div className="relative h-full w-full max-h-[560px] aspect-[4/5] sm:aspect-[3/4] mx-auto overflow-hidden rounded-2xl shadow-md border border-orange-200/70 bg-zinc-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeSourceImage}
                          alt="Original Model"
                          className="h-full w-full object-contain"
                        />
                        <div className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                          Original Photo
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode: Interactive Split Compare Slider */}
                  {viewMode === "split" && (
                    <div className="relative h-full w-full flex items-center justify-center p-2">
                      <div
                        ref={sliderContainerRef}
                        onMouseDown={(e) => {
                          setIsDraggingSlider(true);
                          handleSliderMove(e.clientX);
                        }}
                        onMouseMove={(e) => {
                          if (isDraggingSlider || e.buttons === 1) {
                            handleSliderMove(e.clientX);
                          }
                        }}
                        onMouseUp={() => setIsDraggingSlider(false)}
                        onTouchStart={(e) => {
                          setIsDraggingSlider(true);
                          handleSliderMove(e.touches[0].clientX);
                        }}
                        onTouchMove={(e) => {
                          handleSliderMove(e.touches[0].clientX);
                        }}
                        onTouchEnd={() => setIsDraggingSlider(false)}
                        className="relative h-full w-full max-h-[560px] aspect-[4/5] sm:aspect-[3/4] mx-auto overflow-hidden rounded-2xl select-none cursor-ew-resize border border-orange-200/70 shadow-md bg-zinc-950"
                      >
                        {/* Layer 1: After Image (Full background) */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={generatedImageUrl}
                          alt="After Fitting"
                          className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
                        />

                        {/* Layer 2: Before Image (Exact same position, clipped from right) */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeSourceImage}
                          alt="Before Fitting"
                          className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
                          style={{
                            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                            WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                          }}
                        />

                        {/* Draggable Divider Line & Handle */}
                        <div
                          className="absolute inset-y-0 w-0.5 bg-white shadow-2xl z-20 pointer-events-none"
                          style={{ left: `${sliderPosition}%` }}
                        >
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xl border-2 border-orange-400 text-[#FF5500]">
                            <Columns2 className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs z-20 pointer-events-none">
                          Before
                        </div>
                        <div className="absolute top-3 right-3 rounded-full bg-[#FF5500]/95 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs z-20 pointer-events-none shadow-xs">
                          After
                        </div>

                        {/* Drag helper guide */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-0.5 text-[10px] font-semibold text-white/80 backdrop-blur-xs z-20 pointer-events-none">
                          Drag slider to compare Before &amp; After
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* CASE 3: Pre-generation State (Show Source Model Ready) */
                <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />

                  <div className="relative z-10 flex flex-col items-center space-y-4 max-w-sm">
                    <div className="relative h-64 w-48 sm:h-72 sm:w-56 overflow-hidden rounded-2xl border-2 border-orange-200/80 bg-white shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeSourceImage}
                        alt="Model Preview"
                        className="h-full w-full object-cover object-top"
                      />
                      <div className="absolute bottom-2 inset-x-2 rounded-xl bg-black/70 py-1 px-2 text-center text-[10px] font-bold text-white backdrop-blur-xs">
                        Model Silhouette Ready
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-zinc-900">
                        Ready for Virtual Fitting
                      </h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Click <span className="font-bold text-[#FF5500]">Generate Fitting</span> on the left to render your makeover (5 Credits).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 transition cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Render {currentTool.title.replace("AI ", "")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Viewport Bottom Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100/80 pt-3.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-500">
                  Export Spec: 4K UHD Lossless Quality
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {hasGenerated ? (
                  <>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500] transition cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>New Fitting</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadResult}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-orange-500/25 hover:opacity-95 transition cursor-pointer disabled:opacity-60"
                    >
                      {isDownloading ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      <span>{isDownloading ? "Downloading..." : "Download 4K Result"}</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-orange-500/25 hover:opacity-95 transition cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Quick Preview</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
