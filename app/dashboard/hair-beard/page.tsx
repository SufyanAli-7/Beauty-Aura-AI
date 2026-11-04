"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Scissors,
  Palette,
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
  Crown,
  ChevronDown,
  ShieldCheck,
  Camera,
  Activity,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

// 1. Tool Options
export type HairBeardToolId = "color" | "hairstyle" | "frizziness" | "beard";

interface HairBeardTool {
  id: HairBeardToolId;
  title: string;
  tagline: string;
  badge: string;
  image: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const HAIR_BEARD_TOOLS: HairBeardTool[] = [
  {
    id: "color",
    title: "AI Hair Color Virtual Try-On",
    tagline: "Salon hair dyes & ombre blends",
    badge: "Color Lab",
    image: "/ai-photo-editing-images/hair-color-try-on.png",
    description: "Experiment with 20 salon color presets and custom dual-tone ombre gradients with strand-level shine control.",
    icon: Palette,
  },
  {
    id: "hairstyle",
    title: "AI Hairstyle Virtual Try-On",
    tagline: "80+ cuts: bobs, fades, curls & bangs",
    badge: "80+ Styles",
    image: "/ai-photo-editing-images/hairstyle.jpg",
    description: "Try curated women's and men's cuts including blunt bobs, wolf cuts, curly fades, textured crops, and braids.",
    icon: Scissors,
  },
  {
    id: "frizziness",
    title: "AI Hair Frizziness Detection",
    tagline: "180° multi-angle trichology scan",
    badge: "Trichology AI",
    image: "/ai-photo-editing-images/hair-frizziness-detect.jpg",
    description: "Scan hair texture, flyaway density, and cuticle alignment with 4-level frizz grading and salon care regimens.",
    icon: Sparkles,
  },
  {
    id: "beard",
    title: "AI Beard Style Generator",
    tagline: "15 barber cuts: stubble, goatees & full",
    badge: "Barber 3D",
    image: "/ai-photo-editing-images/beard-try-on.jpg",
    description: "Simulate precision facial hair grooming: circle beards, van dykes, lumberjack bandholz, and clean shaves.",
    icon: Crown,
  },
];

// 2. Sample Portrait Models
interface PortraitModel {
  id: string;
  name: string;
  src: string;
  gender: "female" | "male";
  hint: string;
}

const SAMPLE_PORTRAITS: PortraitModel[] = [
  { id: "boy1", name: "Lucas", src: "/normal-headshot/boy1.png", gender: "male", hint: "Ideal for Beard & Men's Cuts" },
  { id: "girl1", name: "Elena", src: "/normal-headshot/girl1.png", gender: "female", hint: "Straight Long Hair" },
  { id: "girl2", name: "Sophia", src: "/normal-headshot/girl2.png", gender: "female", hint: "Wavy Brunette" },
  { id: "girl3", name: "Amara", src: "/normal-headshot/girl3.png", gender: "female", hint: "Curly Volume" },
  { id: "girl4", name: "Mia", src: "/normal-headshot/girl4.png", gender: "female", hint: "Auburn Mid-Length" },
];

// 3. Hair Color Presets
const FULL_COLOR_PRESETS = [
  { name: "Jet Black", hex: "#0D0D0D", tone: "Deep Obsidian" },
  { name: "Chocolate Brown", hex: "#3B2219", tone: "Rich Cocoa" },
  { name: "Honey Blonde", hex: "#D4AF37", tone: "Warm Amber" },
  { name: "Platinum Blonde", hex: "#E8E5DD", tone: "Ice Luminous" },
  { name: "Ash Gray", hex: "#7D8082", tone: "Smoky Titanium" },
  { name: "Rose Gold", hex: "#B76E79", tone: "Blush Metallic" },
  { name: "Burgundy", hex: "#6A1A24", tone: "Deep Crimson" },
  { name: "Copper Red", hex: "#B85433", tone: "Fiery Auburn" },
  { name: "Lavender", hex: "#9F86C0", tone: "Pastel Violet" },
  { name: "Teal Blue", hex: "#1D7874", tone: "Ocean Marine" },
];

const OMBRE_COLOR_PRESETS = [
  { name: "Dark Brown/Caramel Blonde", top: "#2B170E", bottom: "#DDB356" },
  { name: "Jet Black/Silver Gray", top: "#0A0A0A", bottom: "#A0A5A8" },
  { name: "Ash Brown/Lavender", top: "#4A3B32", bottom: "#9F86C0" },
  { name: "Rose Gold/Peach Blonde", top: "#B76E79", bottom: "#F3C5A8" },
  { name: "Burgundy/Magenta Pink", top: "#6A1A24", bottom: "#D63384" },
  { name: "Deep Blue/Teal Green", top: "#1B2A4A", bottom: "#2A9D8F" },
  { name: "Plum Purple/Pastel Lilac", top: "#4A154B", bottom: "#C8B6FF" },
  { name: "Copper Red/Golden Blonde", top: "#B85433", bottom: "#E6C280" },
  { name: "Dark Gray/Ice Blonde", top: "#404040", bottom: "#E8E5DD" },
  { name: "Midnight Blue/Denim Blue", top: "#121A2A", bottom: "#4682B4" },
];

// 4. Official YouCam Hair Style Templates (Retrieved from AI-Hair-Style-Virtual-Try-On-Templates)
interface HairStyleTemplate {
  id: string;
  title: string;
  thumb: string;
  category: "Female" | "Male" | "All";
  keepColorDefault: boolean;
}

const OFFICIAL_HAIRSTYLE_TEMPLATES: HairStyleTemplate[] = [
  // Female Cuts
  {
    id: "female_blunt_bob",
    title: "Blunt Bob",
    thumb: "https://cdn.perfectcorp.com/cms/9bc19ca5-2e6d-4816-8dc3-a6a1daf6593d/1781145851280/file.jpg",
    category: "Female",
    keepColorDefault: true,
  },
  {
    id: "female_sleek_middle_part",
    title: "Sleek Middle Part",
    thumb: "https://cdn.perfectcorp.com/cms/658e8776-fdd0-4d78-8f35-1bbe27e902d4/1780543845278/file.jpg",
    category: "Female",
    keepColorDefault: true,
  },
  {
    id: "female_s_wave_brunette",
    title: "S-Wave Brunette",
    thumb: "https://cdn.perfectcorp.com/cms/8074cf6e-9299-4b2e-a10a-19849c5be4c2/1780540769370/file.jpg",
    category: "Female",
    keepColorDefault: false,
  },
  {
    id: "female_bouncy_curls",
    title: "Bouncy Curls",
    thumb: "https://cdn.perfectcorp.com/cms/f0f7cd99-88ef-4c4c-925d-b327649c6bcd/1780543784410/file.png",
    category: "Female",
    keepColorDefault: true,
  },
  {
    id: "female_brunette_wolf_cut",
    title: "Brunette Wolf Cut",
    thumb: "https://cdn.perfectcorp.com/cms/cce45445-cbef-4105-b91b-c82d94918214/1778750321675/file.jpg",
    category: "Female",
    keepColorDefault: true,
  },
  {
    id: "female_dark_c_curl_layers",
    title: "Dark C-Curl Layers",
    thumb: "https://cdn.perfectcorp.com/cms/c0678f27-af7f-4f1b-902a-cbb22be12a0f/1778825368023/file.jpg",
    category: "Female",
    keepColorDefault: true,
  },
  {
    id: "female_loose_crimped_waves",
    title: "Loose Crimped Waves",
    thumb: "https://cdn.perfectcorp.com/cms/b6d441a7-7cc4-4387-aebb-d2dbb7ffee8b/1781110796167/file.jpg",
    category: "Female",
    keepColorDefault: true,
  },
  {
    id: "female_messy_bun",
    title: "Messy Bun",
    thumb: "https://cdn.perfectcorp.com/cms/af5db364-8a4b-4447-978c-f4579592f1f7/1770170840959/file.jpg",
    category: "Female",
    keepColorDefault: true,
  },
  {
    id: "female_modern_wavy_lob",
    title: "Modern Wavy Lob",
    thumb: "https://cdn.perfectcorp.com/cms/6f5ed48c-541f-4a22-b967-b3f77f50fb68/1773991575084/file.jpg",
    category: "Female",
    keepColorDefault: true,
  },
  {
    id: "female_pixie_pink",
    title: "Pixie Pink",
    thumb: "https://cdn.perfectcorp.com/cms/99c1677e-21df-4a2e-9833-b8a620bc47e2/1770170809981/file.jpg",
    category: "Female",
    keepColorDefault: false,
  },
  {
    id: "female_two_braids",
    title: "Two Braids",
    thumb: "https://cdn.perfectcorp.com/cms/174d25bc-b623-4a33-8069-ba6a1b97851f/1781079933103/file.jpg",
    category: "Female",
    keepColorDefault: true,
  },
  {
    id: "female_buzz_cut",
    title: "Female Buzz Cut",
    thumb: "https://cdn.perfectcorp.com/cms/c9ecae17-d0ee-45fc-b0d7-f7575d672454/1781145545980/file.jpg",
    category: "Female",
    keepColorDefault: true,
  },
  // Male Cuts
  {
    id: "male_short_curly",
    title: "Short Curly",
    thumb: "https://cdn.perfectcorp.com/cms/47633eff-2086-4791-b454-825aa6f9e160/1780481384535/file.jpg",
    category: "Male",
    keepColorDefault: false,
  },
  {
    id: "male_gray_taper_fade",
    title: "Gray Taper Fade",
    thumb: "https://cdn.perfectcorp.com/cms/02a90e43-398a-4eda-b0bc-e9595d75430f/1778825209411/file.jpg",
    category: "Male",
    keepColorDefault: false,
  },
  {
    id: "male_textured_crop",
    title: "Textured Crop",
    thumb: "https://cdn.perfectcorp.com/cms/430a5763-f41c-4ea6-a9c8-7c64b9b3b942/1778665908784/file.jpg",
    category: "Male",
    keepColorDefault: false,
  },
  {
    id: "male_textured_comma",
    title: "Textured Comma",
    thumb: "https://cdn.perfectcorp.com/cms/ceea0fd7-a766-4d39-a067-625f4638954c/1778825131587/file.jpg",
    category: "Male",
    keepColorDefault: true,
  },
  {
    id: "male_afro",
    title: "Afro Cut",
    thumb: "https://cdn.perfectcorp.com/cms/59db293e-2053-4c7a-90a1-70781e8b7949/1778750239189/file.jpg",
    category: "Male",
    keepColorDefault: true,
  },
  {
    id: "male_wavy_undercut",
    title: "Wavy Undercut",
    thumb: "https://cdn.perfectcorp.com/cms/f9bb06a7-fd1b-42ae-938d-275f3fde65cc/1770112938420/file.jpg",
    category: "Male",
    keepColorDefault: true,
  },
  {
    id: "male_tousled_cut",
    title: "Tousled Cut",
    thumb: "https://cdn.perfectcorp.com/cms/e7912a84-747b-4ac2-93db-cf26179d319c/1773989170905/file.jpg",
    category: "Male",
    keepColorDefault: true,
  },
  {
    id: "all_crewcut",
    title: "Clean Crewcut",
    thumb: "https://cdn.perfectcorp.com/cms/9771949d-a29c-4ae8-8e0a-aea5d83b28b6/1774947461596/file.jpg",
    category: "Male",
    keepColorDefault: false,
  },
  {
    id: "all_side_swept_undercut",
    title: "Side-Swept Undercut",
    thumb: "https://cdn.perfectcorp.com/cms/b7554bb7-a51e-413c-89c3-e36e71df51bc/1770086982870/file.jpg",
    category: "Male",
    keepColorDefault: true,
  },
  {
    id: "all_dreadlocks",
    title: "Dreadlocks",
    thumb: "https://cdn.perfectcorp.com/cms/ee789d47-c009-4bde-b585-5cb76dc02576/1774603196507/file.jpg",
    category: "Male",
    keepColorDefault: true,
  },
  {
    id: "male_bald",
    title: "Clean Shaven Head",
    thumb: "https://cdn.perfectcorp.com/cms/e4955b95-f99a-46fa-9931-8ed5927959d0/1770199528708/file.jpg",
    category: "Male",
    keepColorDefault: false,
  },
];

// 5. Official YouCam Beard Templates (Retrieved from AI-Beard-Style-Generator-Templates)
interface BeardTemplate {
  id: string;
  title: string;
  thumb: string;
  tag: string;
}

const OFFICIAL_BEARD_TEMPLATES: BeardTemplate[] = [
  {
    id: "all_circle",
    title: "Circle Beard",
    thumb: "https://cdn.perfectcorp.com/cms/cebea27e-3876-4ebb-b6a9-1009746be4d7/1755772319217/file.jpg",
    tag: "Sharp Classic",
  },
  {
    id: "all_anchor",
    title: "Anchor Beard",
    thumb: "https://cdn.perfectcorp.com/cms/ac9d09c6-4b84-42b9-84dd-be319a6da647/1755772099731/file.jpg",
    tag: "Sculpted Jaw",
  },
  {
    id: "all_shaved",
    title: "Clean Shaved",
    thumb: "https://cdn.perfectcorp.com/cms/050a7b4b-75b6-4dd0-86a7-f92f9930cc14/1755772313419/file.jpg",
    tag: "Zero Stubble",
  },
  {
    id: "all_mustache",
    title: "Classic Mustache",
    thumb: "https://cdn.perfectcorp.com/cms/98f845f6-ece3-463b-84ba-58c434220bcd/1755772326766/file.jpg",
    tag: "Refined",
  },
  {
    id: "all_garibaldi",
    title: "Garibaldi",
    thumb: "https://cdn.perfectcorp.com/cms/90240313-e538-4d65-b1b4-ff4347137bea/1755772331886/file.jpg",
    tag: "Full Rounded",
  },
  {
    id: "all_ducktail",
    title: "Ducktail Beard",
    thumb: "https://cdn.perfectcorp.com/cms/bac26c6f-abf4-4c14-a87c-75014d25f8bb/1755772339484/file.jpg",
    tag: "Tapered Point",
  },
  {
    id: "all_bandholz",
    title: "Bandholz",
    thumb: "https://cdn.perfectcorp.com/cms/c55ff78f-1ea8-4dbc-95b5-12b50aa51abe/1755772374262/file.jpg",
    tag: "Epic Beard",
  },
  {
    id: "all_long_bandholz",
    title: "Long Bandholz",
    thumb: "https://cdn.perfectcorp.com/cms/36586efa-9c1d-4ebe-bae0-c2614eab112a/1755772347152/file.jpg",
    tag: "Lumberjack Length",
  },
  {
    id: "all_soul_patch",
    title: "Soul Patch",
    thumb: "https://cdn.perfectcorp.com/cms/c28d298d-3a27-470b-870b-e8f54f22226c/1755772353989/file.jpg",
    tag: "Under-Lip Accent",
  },
  {
    id: "all_chin_curtain",
    title: "Chin Curtain",
    thumb: "https://cdn.perfectcorp.com/cms/d77a521f-cf45-4044-8265-17d2b7dfbf24/1755772382591/file.jpg",
    tag: "Jawline Contour",
  },
  {
    id: "all_walrus",
    title: "Walrus Mustache",
    thumb: "https://cdn.perfectcorp.com/cms/5f746baa-cc96-40b4-9405-3418c75cf35a/1755772361167/file.jpg",
    tag: "Heavy Droop",
  },
  {
    id: "all_mutton_chops",
    title: "Mutton Chops",
    thumb: "https://cdn.perfectcorp.com/cms/6810d121-e831-4e7f-910e-dc616b775168/1755772407818/file.jpg",
    tag: "Vintage Sideburns",
  },
  {
    id: "all_french_fork",
    title: "French Fork",
    thumb: "https://cdn.perfectcorp.com/cms/9dda641d-7144-45c1-bf22-9948cbeae72a/1755772396550/file.jpg",
    tag: "Split Dual Tip",
  },
  {
    id: "all_goatee",
    title: "Goatee",
    thumb: "https://cdn.perfectcorp.com/cms/434f4f5a-d2cf-450d-ad39-dedeea6a846a/1755772390559/file.jpg",
    tag: "Clean Chin",
  },
  {
    id: "all_horse_shoe",
    title: "Horseshoe",
    thumb: "https://cdn.perfectcorp.com/cms/018c03a7-cfb8-4c2d-9f78-a5057eed06ec/1755772452455/file.jpg",
    tag: "Biker Vertical",
  },
];

export default function HairBeardStudioPage() {
  const { credits, refreshCredits } = useAuth();

  // 1. Tool Selection State
  const [selectedTool, setSelectedTool] = useState<HairBeardToolId>("color");

  // 2. Source Image State
  const [sourceType, setSourceType] = useState<"upload" | "sample">("upload");
  const [selectedSample, setSelectedSample] = useState<string>("/normal-headshot/girl1.png");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Multi-angle state for Hair Frizziness Detection (front, right profile, left profile)
  const [frizzFrontImage, setFrizzFrontImage] = useState<string | null>(null);
  const [frizzRightImage, setFrizzRightImage] = useState<string | null>(null);
  const [frizzLeftImage, setFrizzLeftImage] = useState<string | null>(null);

  // 3. Dynamic Look Controls State
  // Hair Color
  const [colorMode, setColorMode] = useState<"preset" | "custom">("preset");
  const [colorCategory, setColorCategory] = useState<"full" | "ombre">("full");
  const [selectedPresetColor, setSelectedPresetColor] = useState<string>("Jet Black");
  const [customPattern, setCustomPattern] = useState<"full" | "ombre">("full");
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>("#3A2012");
  const [customSecondaryColor, setCustomSecondaryColor] = useState<string>("#B8860B");
  const [colorIntensity, setColorIntensity] = useState<number>(75);
  const [shineIntensity, setShineIntensity] = useState<number>(60);
  const [blendStrength, setBlendStrength] = useState<number>(50);

  // Hairstyle
  const [hairCategoryFilter, setHairCategoryFilter] = useState<"All" | "Female" | "Male">("All");
  const [selectedHairstyleId, setSelectedHairstyleId] = useState<string>("female_blunt_bob");
  const [keepNaturalColor, setKeepNaturalColor] = useState<boolean>(true);

  // Beard Style
  const [selectedBeardId, setSelectedBeardId] = useState<string>("all_circle");

  // Hair Frizziness
  const [frizzSensitivity, setFrizzSensitivity] = useState<"standard" | "high">("standard");

  // 4. Studio Generation & Canvas State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"result" | "split" | "original">("result");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Height sync refs
  const leftColRef = useRef<HTMLDivElement>(null);
  const canvasCardRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState<number | undefined>(undefined);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const currentTool = HAIR_BEARD_TOOLS.find((t) => t.id === selectedTool) || HAIR_BEARD_TOOLS[0];
  const activeSourceImage = sourceType === "upload" && uploadedImage ? uploadedImage : selectedSample;

  // Window resize & height synchronization observer
  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    const canvasEl = canvasCardRef.current;
    if (!canvasEl) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.height > 0) {
          setCanvasHeight(entry.contentRect.height);
        }
      }
    });

    resizeObserver.observe(canvasEl);
    return () => {
      window.removeEventListener("resize", checkIsDesktop);
      resizeObserver.disconnect();
    };
  }, []);

  // When switching to Beard, auto-select Lucas if currently on sample images
  const handleSelectTool = (toolId: HairBeardToolId) => {
    setSelectedTool(toolId);
    setHasGenerated(false);
    setErrorMessage(null);
    if (toolId === "beard" && sourceType === "sample" && selectedSample !== "/normal-headshot/boy1.png") {
      setSelectedSample("/normal-headshot/boy1.png");
    }
  };

  // Upload handler for primary portrait
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        setErrorMessage("File exceeds 12MB. Please upload a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setSourceType("upload");
        setHasGenerated(false);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Multi-angle file upload handler for Frizziness Detection
  const handleAngleUpload = (angle: "front" | "right" | "left", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (angle === "front") setFrizzFrontImage(dataUrl);
        if (angle === "right") setFrizzRightImage(dataUrl);
        if (angle === "left") setFrizzLeftImage(dataUrl);
        setHasGenerated(false);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Slider dragging logic
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDraggingSlider(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      }
    };

    if (isDraggingSlider) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("mousemove", handleGlobalMouseMove);
    }
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isDraggingSlider]);

  // Primary Generation Action
  const handleGenerate = async () => {
    setErrorMessage(null);
    setIsGenerating(true);
    setGenerationProgress(12);

    // Smooth progress simulation
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 94) {
          clearInterval(interval);
          return 94;
        }
        return prev + 14;
      });
    }, 1200);

    // Scroll to canvas viewport on mobile
    if (!isDesktop && canvasCardRef.current) {
      canvasCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    try {
      let lookDataPayload: any = {};

      if (selectedTool === "color") {
        if (colorMode === "preset") {
          lookDataPayload = {
            mode: "preset",
            preset: selectedPresetColor,
            lookName: `Hair Color - ${selectedPresetColor}`,
          };
        } else {
          lookDataPayload = {
            mode: "custom",
            pattern: customPattern,
            primaryColor: customPrimaryColor,
            secondaryColor: customSecondaryColor,
            colorIntensity,
            shineIntensity,
            blendStrength,
            lookName: `Custom ${customPattern === "ombre" ? "Ombre" : "Full"} Tint`,
          };
        }
      } else if (selectedTool === "hairstyle") {
        const tpl = OFFICIAL_HAIRSTYLE_TEMPLATES.find((t) => t.id === selectedHairstyleId);
        lookDataPayload = {
          templateId: selectedHairstyleId,
          keepColor: keepNaturalColor,
          lookName: `Hairstyle - ${tpl?.title || selectedHairstyleId}`,
        };
      } else if (selectedTool === "beard") {
        const tpl = OFFICIAL_BEARD_TEMPLATES.find((t) => t.id === selectedBeardId);
        lookDataPayload = {
          templateId: selectedBeardId,
          lookName: `Beard - ${tpl?.title || selectedBeardId}`,
        };
      } else if (selectedTool === "frizziness") {
        lookDataPayload = {
          sensitivity: frizzSensitivity,
          lookName: "180° Hair Frizz Diagnostic Scan",
        };
      }

      const res = await fetch("/api/hair-beard/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "active-user",
          toolId: selectedTool,
          sourceImageUrl: activeSourceImage,
          multiAngleUrls: {
            front: frizzFrontImage || activeSourceImage,
            right: frizzRightImage || activeSourceImage,
            left: frizzLeftImage || activeSourceImage,
          },
          lookData: lookDataPayload,
        }),
      });

      clearInterval(interval);
      setGenerationProgress(100);

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Generation failed. Please try again.");
      }

      setGeneratedImageUrl(json.resultUrl || json.youcamUrl);
      if (json.analysisData) {
        setAnalysisData(json.analysisData);
      }
      setHasGenerated(true);
      setViewMode("result");
      refreshCredits();
    } catch (err: any) {
      console.error("Hair & Beard Generation Error:", err);
      setErrorMessage(err.message || "Failed to generate transformation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Programmatic direct download
  const handleDownloadResult = async () => {
    if (!generatedImageUrl) return;
    setIsDownloading(true);
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `beautyaura-hair-beard-${selectedTool}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      window.open(generatedImageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setHasGenerated(false);
    setGeneratedImageUrl(null);
    setAnalysisData(null);
    setErrorMessage(null);
  };

  // Filtered hairstyles
  const filteredHairstyles = OFFICIAL_HAIRSTYLE_TEMPLATES.filter((tpl) => {
    if (hairCategoryFilter === "All") return true;
    return tpl.category === hairCategoryFilter;
  });

  return (
    <div className="space-y-6 pb-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <Scissors className="h-3.5 w-3.5" />
            <span>AI Barber &amp; Hair Color Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            Hair &amp; Beard Studio
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Simulate salon hair colors, trending cuts, full beard styles &amp; 180° hair frizz diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/80 px-3.5 py-1 text-xs font-bold text-zinc-800">
            <Zap className="h-3.5 w-3.5 text-[#FF5500] fill-current" />
            <span>5 Credits / render</span>
          </div>
          <div className="text-xs font-bold text-zinc-500">
            Balance: <span className="text-zinc-900 font-black">{credits !== null ? credits : "..."}</span>
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
          {credits !== null && credits < 5 && (
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

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            LEFT COLUMN: Studio Controls & Customization
           ========================================================================= */}
        <div
          ref={leftColRef}
          style={{
            maxHeight: isDesktop && canvasHeight ? `${canvasHeight}px` : undefined,
          }}
          className={cn(
            "order-1 lg:order-none lg:col-span-5 xl:col-span-5 space-y-5",
            isDesktop &&
              "lg:overflow-y-auto lg:pr-2.5 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-stone-100/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-200/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5500]/70 transition-colors"
          )}
        >
          {/* STEP 1: Choose Tool */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  1
                </span>
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                  Choose Hair &amp; Beard Tool
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#FF5500]">4 Features</span>
            </div>

            <div className="space-y-2.5">
              {HAIR_BEARD_TOOLS.map((tool) => {
                const isActive = selectedTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleSelectTool(tool.id)}
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

                    {/* Tool Information */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div>
                        <span
                          className={cn(
                            "inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider mb-1",
                            isActive
                              ? "bg-[#FF5500] text-white shadow-2xs"
                              : "bg-orange-100 text-orange-700"
                          )}
                        >
                          {tool.badge}
                        </span>
                      </div>
                      <span className="text-xs font-black text-zinc-900 leading-snug">
                        {tool.title}
                      </span>
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

          {/* STEP 2: Source Portrait Image */}
          <div className="rounded-3xl border border-orange-100 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  2
                </span>
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                  Source Portrait
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-zinc-400">
                Frontal or Profile View
              </span>
            </div>

            {/* Tab Switcher: Upload Photo First */}
            <div className="flex rounded-xl bg-stone-100/80 p-1">
              <button
                type="button"
                onClick={() => setSourceType("upload")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5",
                  sourceType === "upload"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900"
                )}
              >
                <Upload className="h-3 w-3 text-[#FF5500]" />
                <span>Upload Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceType("sample")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5",
                  sourceType === "sample"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900"
                )}
              >
                <Sparkles className="h-3 w-3 text-[#FF5500]" />
                <span>Sample Portraits ({SAMPLE_PORTRAITS.length})</span>
              </button>
            </div>

            {/* TAB CONTENT: Upload */}
            {sourceType === "upload" && (
              <div className="space-y-3">
                {uploadedImage ? (
                  <div className="relative rounded-2xl border-2 border-orange-200 overflow-hidden bg-stone-900/5 p-2 flex items-center gap-3">
                    <div className="relative h-20 w-16 rounded-xl overflow-hidden shrink-0 border border-orange-200/80">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate">Custom Portrait Uploaded</p>
                      <p className="text-[11px] text-zinc-500">Ready for neural styling</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedImage(null)}
                      className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200/90 bg-orange-50/20 p-5 hover:bg-orange-50/50 transition cursor-pointer text-center">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-[#FF5500] mb-2 shadow-2xs">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-zinc-800">
                      Drag &amp; drop or click to upload portrait
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      Clear selfie or front photo • JPG, PNG, WEBP up to 12MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Specific Multi-Angle slots if Frizziness Detection is selected */}
                {selectedTool === "frizziness" && (
                  <div className="rounded-2xl border border-orange-200/80 bg-orange-50/30 p-3 space-y-2.5">
                    <div className="flex items-start gap-2">
                      <Camera className="h-4 w-4 text-[#FF5500] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-extrabold text-zinc-900 block">
                          180° Multi-Angle Photo Calibration
                        </span>
                        <p className="text-[11px] text-zinc-600 leading-relaxed mt-0.5">
                          Hair Frizz Analyzer requires 3 camera angles for follicle depth scan: Front (<span className="font-bold text-[#FF5500]">&lt;10°</span>), Right Profile (<span className="font-bold text-[#FF5500]">&gt;15°</span>), Left Profile (<span className="font-bold text-[#FF5500]">&gt;15°</span>).
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {/* Front Angle Slot */}
                      <label className="relative flex flex-col items-center justify-center p-2 rounded-xl border border-orange-200/80 bg-white hover:bg-orange-50/40 transition cursor-pointer text-center min-h-[75px]">
                        {frizzFrontImage ? (
                          <div className="relative h-12 w-full rounded overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={frizzFrontImage} alt="Front" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <>
                            <span className="text-[10px] font-bold text-zinc-800">Front (0°)</span>
                            <span className="text-[9px] text-[#FF5500]">Upload</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAngleUpload("front", e)}
                          className="hidden"
                        />
                      </label>

                      {/* Right Angle Slot */}
                      <label className="relative flex flex-col items-center justify-center p-2 rounded-xl border border-orange-200/80 bg-white hover:bg-orange-50/40 transition cursor-pointer text-center min-h-[75px]">
                        {frizzRightImage ? (
                          <div className="relative h-12 w-full rounded overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={frizzRightImage} alt="Right" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <>
                            <span className="text-[10px] font-bold text-zinc-800">Right (&gt;15°)</span>
                            <span className="text-[9px] text-[#FF5500]">Upload</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAngleUpload("right", e)}
                          className="hidden"
                        />
                      </label>

                      {/* Left Angle Slot */}
                      <label className="relative flex flex-col items-center justify-center p-2 rounded-xl border border-orange-200/80 bg-white hover:bg-orange-50/40 transition cursor-pointer text-center min-h-[75px]">
                        {frizzLeftImage ? (
                          <div className="relative h-12 w-full rounded overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={frizzLeftImage} alt="Left" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <>
                            <span className="text-[10px] font-bold text-zinc-800">Left (&gt;15°)</span>
                            <span className="text-[9px] text-[#FF5500]">Upload</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAngleUpload("left", e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Sample Portraits */}
            {sourceType === "sample" && (
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2">
                  {SAMPLE_PORTRAITS.map((portrait) => {
                    const isSelected = selectedSample === portrait.src;
                    return (
                      <button
                        key={portrait.id}
                        type="button"
                        onClick={() => {
                          setSelectedSample(portrait.src);
                          setHasGenerated(false);
                          setErrorMessage(null);
                        }}
                        className={cn(
                          "group flex flex-col items-center text-center cursor-pointer transition-all",
                          isSelected ? "scale-102" : "opacity-85 hover:opacity-100"
                        )}
                      >
                        <div
                          className={cn(
                            "relative aspect-[3/4] w-full overflow-hidden rounded-xl border-2 transition-all shadow-xs",
                            isSelected
                              ? "border-[#FF5500] ring-2 ring-[#FF5500]/30 shadow-md"
                              : "border-orange-100/90 group-hover:border-orange-300"
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={portrait.src}
                            alt={portrait.name}
                            className="h-full w-full object-cover object-center"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 rounded-full bg-[#FF5500] p-0.5 text-white">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-zinc-800 mt-1 truncate w-full">
                          {portrait.name}
                        </span>
                        <span className="text-[9px] text-zinc-400 capitalize">
                          {portrait.gender}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedTool === "beard" && selectedSample !== "/normal-headshot/boy1.png" && (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200/80 p-2.5 text-[11px] text-amber-900">
                    <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>
                      Tip: Select model <span className="font-bold">Lucas</span> or upload a male portrait for optimal beard fitting simulation.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 3: Choose Look / Customization (Dynamic per Tool) */}
          <div className="rounded-3xl border border-orange-100 bg-white p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-black text-white">
                  3
                </span>
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                  {selectedTool === "color" && "Color Palette & Shine"}
                  {selectedTool === "hairstyle" && "Curated Haircut Catalog"}
                  {selectedTool === "beard" && "Barber Beard Styles"}
                  {selectedTool === "frizziness" && "Diagnostic Scan Settings"}
                </h3>
              </div>
            </div>

            {/* A. TOOL 1: AI Hair Color Virtual Try-On */}
            {selectedTool === "color" && (
              <div className="space-y-4">
                {/* Mode Switcher: Preset vs Custom */}
                <div className="flex rounded-xl bg-stone-100/80 p-1">
                  <button
                    type="button"
                    onClick={() => setColorMode("preset")}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer",
                      colorMode === "preset"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    )}
                  >
                    Salon Presets (20)
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorMode("custom")}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer",
                      colorMode === "custom"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    )}
                  >
                    Custom Color Lab
                  </button>
                </div>

                {colorMode === "preset" ? (
                  <div className="space-y-3">
                    {/* Category Switcher: Full vs Ombre */}
                    <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                      <span className="text-xs font-bold text-zinc-700">Dye Coverage:</span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setColorCategory("full")}
                          className={cn(
                            "px-2.5 py-1 text-[11px] font-bold rounded-full transition cursor-pointer",
                            colorCategory === "full"
                              ? "bg-[#FF5500] text-white"
                              : "bg-orange-50 text-zinc-700 hover:bg-orange-100"
                          )}
                        >
                          Full Tone (10)
                        </button>
                        <button
                          type="button"
                          onClick={() => setColorCategory("ombre")}
                          className={cn(
                            "px-2.5 py-1 text-[11px] font-bold rounded-full transition cursor-pointer",
                            colorCategory === "ombre"
                              ? "bg-[#FF5500] text-white"
                              : "bg-orange-50 text-zinc-700 hover:bg-orange-100"
                          )}
                        >
                          Ombre Dual (10)
                        </button>
                      </div>
                    </div>

                    {/* Presets Grid */}
                    {colorCategory === "full" ? (
                      <div className="grid grid-cols-2 gap-2">
                        {FULL_COLOR_PRESETS.map((preset) => {
                          const isSelected = selectedPresetColor === preset.name;
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setSelectedPresetColor(preset.name);
                                setHasGenerated(false);
                              }}
                              className={cn(
                                "flex items-center gap-2.5 p-2 rounded-xl border text-left transition cursor-pointer",
                                isSelected
                                  ? "bg-orange-50/70 border-[#FF5500] ring-1 ring-[#FF5500]"
                                  : "border-orange-100 hover:border-orange-200 bg-white"
                              )}
                            >
                              <span
                                className="h-6 w-6 rounded-full border border-white shadow-xs shrink-0"
                                style={{ backgroundColor: preset.hex }}
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-extrabold text-zinc-900 block truncate">
                                  {preset.name}
                                </span>
                                <span className="text-[10px] text-zinc-400 block truncate">
                                  {preset.tone}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {OMBRE_COLOR_PRESETS.map((preset) => {
                          const isSelected = selectedPresetColor === preset.name;
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setSelectedPresetColor(preset.name);
                                setHasGenerated(false);
                              }}
                              className={cn(
                                "flex items-center gap-3 p-2.5 rounded-xl border text-left transition cursor-pointer",
                                isSelected
                                  ? "bg-orange-50/70 border-[#FF5500] ring-1 ring-[#FF5500]"
                                  : "border-orange-100 hover:border-orange-200 bg-white"
                              )}
                            >
                              <div
                                className="h-6 w-10 rounded-lg shadow-xs shrink-0 border border-white"
                                style={{
                                  background: `linear-gradient(to right, ${preset.top}, ${preset.bottom})`,
                                }}
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-extrabold text-zinc-900 block truncate">
                                  {preset.name}
                                </span>
                              </div>
                              {isSelected && <CheckCircle2 className="h-4 w-4 text-[#FF5500] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Custom Color Lab Controls */
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                      <span className="text-xs font-bold text-zinc-700">Dye Pattern Mode:</span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCustomPattern("full")}
                          className={cn(
                            "px-2.5 py-1 text-[11px] font-bold rounded-full transition cursor-pointer",
                            customPattern === "full"
                              ? "bg-[#FF5500] text-white"
                              : "bg-orange-50 text-zinc-700"
                          )}
                        >
                          Full Coverage
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomPattern("ombre")}
                          className={cn(
                            "px-2.5 py-1 text-[11px] font-bold rounded-full transition cursor-pointer",
                            customPattern === "ombre"
                              ? "bg-[#FF5500] text-white"
                              : "bg-orange-50 text-zinc-700"
                          )}
                        >
                          Ombre Fade
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-zinc-700 block mb-1">
                          {customPattern === "ombre" ? "Top Root Color" : "Base Dye Color"}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customPrimaryColor}
                            onChange={(e) => setCustomPrimaryColor(e.target.value)}
                            className="h-8 w-10 rounded-lg border border-orange-200 cursor-pointer p-0.5"
                          />
                          <span className="font-mono text-xs text-zinc-700 font-bold uppercase">
                            {customPrimaryColor}
                          </span>
                        </div>
                      </div>

                      {customPattern === "ombre" && (
                        <div>
                          <label className="text-[11px] font-bold text-zinc-700 block mb-1">
                            Bottom Tip Color
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={customSecondaryColor}
                              onChange={(e) => setCustomSecondaryColor(e.target.value)}
                              className="h-8 w-10 rounded-lg border border-orange-200 cursor-pointer p-0.5"
                            />
                            <span className="font-mono text-xs text-zinc-700 font-bold uppercase">
                              {customSecondaryColor}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sliders: Intensity & Shine */}
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-zinc-700">
                          <span>Pigment Saturation</span>
                          <span className="text-[#FF5500] font-mono">{colorIntensity}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={colorIntensity}
                          onChange={(e) => setColorIntensity(Number(e.target.value))}
                          className="w-full accent-[#FF5500] cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-zinc-700">
                          <span>Strand Gloss &amp; Sheen</span>
                          <span className="text-[#FF5500] font-mono">{shineIntensity}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={shineIntensity}
                          onChange={(e) => setShineIntensity(Number(e.target.value))}
                          className="w-full accent-[#FF5500] cursor-pointer"
                        />
                      </div>

                      {customPattern === "ombre" && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-zinc-700">
                            <span>Gradient Blend Transition</span>
                            <span className="text-[#FF5500] font-mono">{blendStrength}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="90"
                            value={blendStrength}
                            onChange={(e) => setBlendStrength(Number(e.target.value))}
                            className="w-full accent-[#FF5500] cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* B. TOOL 2: AI Hairstyle Virtual Try-On */}
            {selectedTool === "hairstyle" && (
              <div className="space-y-3.5">
                {/* Haircut Category Filter */}
                <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                  <span className="text-xs font-bold text-zinc-700">Filter Cuts:</span>
                  <div className="flex gap-1">
                    {(["All", "Female", "Male"] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setHairCategoryFilter(cat)}
                        className={cn(
                          "px-2.5 py-1 text-[11px] font-bold rounded-full transition cursor-pointer",
                          hairCategoryFilter === cat
                            ? "bg-[#FF5500] text-white"
                            : "bg-orange-50 text-zinc-700 hover:bg-orange-100"
                        )}
                      >
                        {cat === "All" ? "All (24)" : cat === "Female" ? "Women (12)" : "Men (12)"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Natural Color Toggle */}
                <div className="flex items-center justify-between rounded-xl bg-orange-50/50 p-2.5 border border-orange-200/80">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-[#FF5500]" />
                    <span className="text-xs font-bold text-zinc-800">
                      Preserve Natural Hair Color
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setKeepNaturalColor(!keepNaturalColor)}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
                      keepNaturalColor ? "bg-[#FF5500]" : "bg-stone-300"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5",
                        keepNaturalColor ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>

                {/* Hairstyle Templates Grid */}
                <div className="grid grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-orange-200/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5500]/70">
                  {filteredHairstyles.map((style) => {
                    const isSelected = selectedHairstyleId === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          setSelectedHairstyleId(style.id);
                          setHasGenerated(false);
                        }}
                        className={cn(
                          "group flex flex-col items-center text-center p-1.5 rounded-xl border transition cursor-pointer",
                          isSelected
                            ? "border-[#FF5500] bg-orange-50/70 ring-1 ring-[#FF5500]"
                            : "border-orange-100 hover:border-orange-200 bg-white"
                        )}
                      >
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-stone-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={style.thumb}
                            alt={style.title}
                            className="h-full w-full object-cover object-center group-hover:scale-105 transition"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 rounded-full bg-[#FF5500] p-0.5 text-white">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-900 mt-1 truncate w-full">
                          {style.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* C. TOOL 3: AI Beard Style Generator */}
            {selectedTool === "beard" && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700">
                    Official Barber Templates ({OFFICIAL_BEARD_TEMPLATES.length}):
                  </span>
                  <span className="text-[11px] font-semibold text-[#FF5500]">
                    Neural Jawline Fit
                  </span>
                </div>

                {/* Beard Templates Grid */}
                <div className="grid grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-orange-200/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5500]/70">
                  {OFFICIAL_BEARD_TEMPLATES.map((beard) => {
                    const isSelected = selectedBeardId === beard.id;
                    return (
                      <button
                        key={beard.id}
                        type="button"
                        onClick={() => {
                          setSelectedBeardId(beard.id);
                          setHasGenerated(false);
                        }}
                        className={cn(
                          "group flex flex-col items-center text-center p-1.5 rounded-xl border transition cursor-pointer",
                          isSelected
                            ? "border-[#FF5500] bg-orange-50/70 ring-1 ring-[#FF5500]"
                            : "border-orange-100 hover:border-orange-200 bg-white"
                        )}
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-stone-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={beard.thumb}
                            alt={beard.title}
                            className="h-full w-full object-cover object-center group-hover:scale-105 transition"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 rounded-full bg-[#FF5500] p-0.5 text-white">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-900 mt-1 truncate w-full">
                          {beard.title}
                        </span>
                        <span className="text-[9px] text-zinc-400 truncate w-full">
                          {beard.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* D. TOOL 4: AI Hair Frizziness Detection */}
            {selectedTool === "frizziness" && (
              <div className="space-y-3.5">
                <div className="rounded-2xl border border-orange-200/80 bg-orange-50/40 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#FF5500]" />
                    <span className="text-xs font-bold text-zinc-900">
                      Trichology Frizz Grading Engine
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Evaluates strand disorder, flyaway frequency, and cuticle lifting into 4 clinical tiers: Smooth, Slightly Frizzy, Moderately Frizzy, and Extremely Frizzy.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-700">Diagnostic Sensitivity:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFrizzSensitivity("standard")}
                      className={cn(
                        "p-2 rounded-xl border text-left transition cursor-pointer",
                        frizzSensitivity === "standard"
                          ? "bg-orange-50 border-[#FF5500] ring-1 ring-[#FF5500]"
                          : "border-orange-100 bg-white"
                      )}
                    >
                      <span className="text-xs font-bold text-zinc-900 block">Standard Scan</span>
                      <span className="text-[10px] text-zinc-400">Strand surface flyaways</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrizzSensitivity("high")}
                      className={cn(
                        "p-2 rounded-xl border text-left transition cursor-pointer",
                        frizzSensitivity === "high"
                          ? "bg-orange-50 border-[#FF5500] ring-1 ring-[#FF5500]"
                          : "border-orange-100 bg-white"
                      )}
                    >
                      <span className="text-xs font-bold text-zinc-900 block">Deep Cuticle Scan</span>
                      <span className="text-[10px] text-zinc-400">Micro-porosity &amp; humidity</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-orange-100 bg-stone-50 p-2.5 text-[11px] text-zinc-500 space-y-1">
                  <span className="font-bold text-zinc-700 block">Trichology Diagnostic Specs:</span>
                  <p>• Requires 3 distinct views for full 180° strand depth modeling.</p>
                  <p>• Output provides personalized defrizz salon product prescriptions.</p>
                </div>
              </div>
            )}

            {/* Error Message Display */}
            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs text-red-700 font-medium">
                  {errorMessage}
                </div>
              </div>
            )}

            {/* Primary Action Button (Single unbroken line) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] py-3.5 px-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 hover:shadow-orange-500/35 transition cursor-pointer disabled:opacity-50 whitespace-nowrap overflow-hidden"
              >
                {isGenerating ? (
                  <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
                    <span>
                      {selectedTool === "frizziness"
                        ? "Analyzing Cuticles & Frizz..."
                        : "Generating Transformation..."}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <Zap className="h-4 w-4 shrink-0 fill-current" />
                    <span>
                      {selectedTool === "frizziness"
                        ? "Run Frizz Diagnostic (5 Credits)"
                        : "Generate Hair & Beard (5 Credits)"}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Live Studio Canvas / Generated Output
           ========================================================================= */}
        <div className="order-2 lg:order-none lg:col-span-7 xl:col-span-7 space-y-4">
          <div
            ref={canvasCardRef}
            className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-white p-4 shadow-lg space-y-4"
          >
            {/* Viewport Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100/80 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                  {currentTool.title}
                </span>
                <span className="text-xs font-bold text-zinc-800 hidden sm:inline">
                  {hasGenerated ? "Ready for Export" : "Live Studio Canvas"}
                </span>
              </div>

              {/* View Mode Switcher (When result ready) */}
              {hasGenerated && selectedTool !== "frizziness" && (
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
              )}
            </div>

            {/* Viewport Center Area */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/11] min-h-[360px] sm:min-h-[400px] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-stone-50/80 to-stone-100/60 p-2 sm:p-4 transition-all border border-orange-100">
              {/* CASE 1: Generating Loading State - Minimal & Clean */}
              {isGenerating ? (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-6 overflow-hidden">
                  <div className="relative flex flex-col items-center text-center max-w-xs w-full space-y-3.5">
                    {/* Sleek Minimal Spinner */}
                    <div className="relative flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full border-2 border-orange-100 border-t-[#FF5500] animate-spin" />
                      <Sparkles className="absolute h-4 w-4 text-[#FF5500] animate-pulse" />
                    </div>

                    {/* Clean Minimal Text */}
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-zinc-900">
                        Styling {currentTool.title}...
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Synthesizing hair follicles ({generationProgress}%)
                      </p>
                    </div>

                    {/* Clean Minimal Progress Bar */}
                    <div className="h-1.5 w-full max-w-[180px] rounded-full bg-orange-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] transition-all duration-300 ease-out"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : hasGenerated ? (
                /* CASE 2: Output View */
                selectedTool === "frizziness" ? (
                  /* Frizziness Trichology Diagnostic Output Card */
                  <div className="w-full max-w-xl mx-auto space-y-4 p-2 sm:p-4 text-left">
                    <div className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-orange-100 pb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5500]">
                            Diagnostic Assessment
                          </span>
                          <h4 className="text-lg font-black text-zinc-900 mt-0.5">
                            Hair Frizz Analysis Report
                          </h4>
                        </div>
                        <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-800">
                          {analysisData?.frizz_level?.replace("_", " ").toUpperCase() || "MODERATELY FRIZZY"}
                        </div>
                      </div>

                      {/* Score Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-center">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase block">Frizz Index</span>
                          <span className="text-2xl font-black text-[#FF5500]">
                            {analysisData?.frizz_score || 68}
                          </span>
                          <span className="text-[9px] text-zinc-400 block mt-0.5">Scale 0 - 100</span>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-center">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase block">Smoothness</span>
                          <span className="text-2xl font-black text-emerald-600">
                            {analysisData?.smoothness_index || 42}%
                          </span>
                          <span className="text-[9px] text-zinc-400 block mt-0.5">Cuticle Alignment</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-center">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase block">Flyaways</span>
                          <span className="text-sm font-extrabold text-zinc-800 mt-1 block">
                            {analysisData?.flyaway_density || "Moderate"}
                          </span>
                          <span className="text-[9px] text-zinc-400 block mt-0.5">Strand Lift</span>
                        </div>
                      </div>

                      {/* Cuticle Details */}
                      <div className="rounded-xl border border-orange-100 bg-stone-50 p-3 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Cuticle Status:</span>
                          <span className="font-bold text-zinc-800">{analysisData?.cuticle_condition || "Partially Lifted"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Humidity Resistance:</span>
                          <span className="font-bold text-zinc-800">{analysisData?.humidity_resistance || "Low Shield"}</span>
                        </div>
                      </div>

                      {/* Recommended Care Products */}
                      <div className="space-y-2 pt-1">
                        <span className="text-xs font-black text-zinc-900 block">
                          Tailored Anti-Frizz Prescriptions:
                        </span>
                        <div className="space-y-1.5">
                          {(analysisData?.recommendations || [
                            "Keratin Infused Smoothing Serum",
                            "Sulfate-Free Moisture Bond Shampoo",
                            "Thermal Heat Defense Shield (450°F Protection)",
                          ]).map((rec: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-zinc-700">
                              <ShieldCheck className="h-3.5 w-3.5 text-[#FF5500] shrink-0" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Image Output for Color, Cut, and Beard */
                  <>
                    {viewMode === "result" && (
                      <div className="relative h-full w-full flex items-center justify-center p-2">
                        <div className="relative h-full w-full max-h-[560px] aspect-[4/5] sm:aspect-[3/4] mx-auto overflow-hidden rounded-2xl shadow-xl border border-orange-200/70 bg-zinc-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={generatedImageUrl || ""}
                            alt="Generated Output"
                            className="h-full w-full object-contain"
                          />
                          <div className="absolute top-3 right-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span>4K UHD Enhanced</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {viewMode === "original" && (
                      <div className="relative h-full w-full flex items-center justify-center p-2">
                        <div className="relative h-full w-full max-h-[560px] aspect-[4/5] sm:aspect-[3/4] mx-auto overflow-hidden rounded-2xl shadow-md border border-orange-200/70 bg-zinc-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={activeSourceImage}
                            alt="Original Portrait"
                            className="h-full w-full object-contain"
                          />
                          <div className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                            Original Photo
                          </div>
                        </div>
                      </div>
                    )}

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
                          {/* Layer 1: After Image */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={generatedImageUrl || ""}
                            alt="After AI"
                            className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
                          />

                          {/* Layer 2: Before Image */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={activeSourceImage}
                            alt="Before AI"
                            className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
                            style={{
                              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                              WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                            }}
                          />

                          {/* Divider Line & Handle */}
                          <div
                            className="absolute inset-y-0 w-0.5 bg-white shadow-2xl z-20 pointer-events-none"
                            style={{ left: `${sliderPosition}%` }}
                          >
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xl border-2 border-orange-400 text-[#FF5500]">
                              <Columns2 className="h-4 w-4" />
                            </div>
                          </div>

                          <div className="absolute top-3 left-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs z-20 pointer-events-none">
                            Before
                          </div>
                          <div className="absolute top-3 right-3 rounded-full bg-[#FF5500]/95 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-xs z-20 pointer-events-none shadow-xs">
                            After
                          </div>

                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-0.5 text-[10px] font-semibold text-white/80 backdrop-blur-xs z-20 pointer-events-none">
                            Drag slider to compare Before &amp; After
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )
              ) : (
                /* CASE 3: Pre-generation State */
                <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative h-56 w-44 sm:h-64 sm:w-52 overflow-hidden rounded-2xl border-2 border-orange-200/80 bg-white shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeSourceImage}
                        alt="Source Preview"
                        className="h-full w-full object-cover object-center"
                      />
                      <div className="absolute bottom-2 inset-x-2 rounded-xl bg-black/70 py-1 px-2 text-center text-[10px] font-bold text-white backdrop-blur-xs">
                        Source Portrait Ready
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Viewport Bottom Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100/80 pt-3.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-500">
                  Export Spec: 4K UHD Lossless Quality
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasGenerated && (
                  <>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500] transition cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>New Style</span>
                    </button>

                    {selectedTool !== "frizziness" && (
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
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
