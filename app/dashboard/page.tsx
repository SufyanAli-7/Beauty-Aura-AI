"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Zap,
  Smile,
  Wand2,
  Shirt,
  Scissors,
  Layers,
  ArrowRight,
  Upload,
  Plus,
  Clock,
  CheckCircle2,
  Download,
  Star,
  Sliders,
  FolderKanban,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user, profile } = useAuth();

  const displayName =
    profile?.name ||
    user?.profile?.name ||
    user?.email?.split("@")[0] ||
    "Beauty Creator";

  const aiStudios = [
    {
      title: "AI Skin & Face Analysis",
      description: "Clinical-grade skin scoring, acne detection, tone mapping & age time travel.",
      href: "/dashboard/skin-face",
      image: "/ai-photo-editing-images/ai-skin-analaysis.webp",
      icon: Smile,
      badge: "Clinical AI",
      toolsCount: "4 Tools",
      gradient: "from-amber-500/10 to-orange-500/5",
    },
    {
      title: "Beauty & Makeup Transfer",
      description: "Extract lipstick, eyeshadow & blush from any look and transfer instantly.",
      href: "/dashboard/beauty",
      image: "/ai-photo-editing-images/ai-makeup-transfer.jpg",
      icon: Wand2,
      badge: "Viral Trend",
      toolsCount: "6 Tools",
      gradient: "from-pink-500/10 to-orange-500/5",
    },
    {
      title: "Fashion & Virtual Try-On",
      description: "Fit luxury dresses, blazers, shoes and designer handbags to your body silhouette.",
      href: "/dashboard/fashion",
      image: "/ai-photo-editing-images/ai-virtual-cloth-try-on.webp",
      icon: Shirt,
      badge: "High Demand",
      toolsCount: "5 Tools",
      gradient: "from-orange-500/10 to-amber-500/5",
    },
    {
      title: "Hair & Beard Salon",
      description: "Preview 40+ hairstyles, realistic hair dyes, beard shaping & density restoration.",
      href: "/dashboard/hair-beard",
      image: "/ai-photo-editing-images/hairstyle.jpg",
      icon: Scissors,
      badge: "Realistic",
      toolsCount: "4 Tools",
      gradient: "from-emerald-500/10 to-orange-500/5",
    },
    {
      title: "AI Extras & Studio Retouch",
      description: "Magic eraser, 4K enhancer, studio relighting, background change & color grading.",
      href: "/dashboard/extras",
      image: "/ai-photo-editing-images/photo-enhance.jpg",
      icon: Layers,
      badge: "Essential",
      toolsCount: "7 Tools",
      gradient: "from-purple-500/10 to-orange-500/5",
    },
  ];

  // Currently no transformations (empty state active)
  const recentProjects: Array<{
    title: string;
    category: string;
    date: string;
    image: string;
    status: string;
  }> = [];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Banner Card with Signature Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-white p-6 sm:p-8 shadow-sm">
        {/* Soft background ambient blur circles */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-gradient-to-br from-[#FF5500]/15 to-[#FFA033]/15 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-amber-400/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/80 bg-white/90 px-3 py-1 shadow-2xs">
              <span className="font-script text-base font-bold text-[#FF5500]">
                Welcome Back
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF5500]" />
              <span className="text-xs font-semibold text-zinc-700">
                Studio Workspace Ready
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-900">
              Hello, <span className="text-[#FF5500]">{displayName}</span> 👋
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-medium">
              Transform portraits, try on couture fashion, analyze skin health, and craft
              studio-grade aesthetics in seconds with your AI studio suite.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard/fashion"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 transition cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Start Try-On</span>
            </Link>

            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/90 px-4 py-2.5 text-xs sm:text-sm font-bold text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500] hover:border-orange-300 transition"
            >
              <Zap className="h-4 w-4 text-[#FF5500] fill-[#FF5500]" />
              <span>5 Credits Left</span>
            </Link>
          </div>
        </div>

        {/* Studio Quick Stats */}
        <div className="relative z-10 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-orange-100/80 pt-6">
          <div className="rounded-2xl border border-orange-100/70 bg-white/80 p-3.5 shadow-2xs backdrop-blur-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Remaining Credits
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-zinc-900">5</span>
              <span className="text-xs font-semibold text-emerald-600">Active</span>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100/70 bg-white/80 p-3.5 shadow-2xs backdrop-blur-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              AI Tools
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-zinc-900">5</span>
              <span className="text-xs font-semibold text-[#FF5500]">Studios</span>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100/70 bg-white/80 p-3.5 shadow-2xs backdrop-blur-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              My Projects
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-zinc-900">0</span>
              <span className="text-xs font-semibold text-zinc-500">Saved</span>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100/70 bg-white/80 p-3.5 shadow-2xs backdrop-blur-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Render Quality
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-zinc-900">4K Ultra</span>
              <span className="text-xs font-semibold text-amber-600">HD</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Tools Hub Grid (The 5 Main Categories) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Tools Workspace</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900">
              Choose an AI Creative Studio
            </h3>
          </div>
          <span className="text-xs font-semibold text-zinc-500">
            Select any engine to begin instant photo editing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiStudios.map((studio) => {
            const Icon = studio.icon;
            return (
              <Link
                key={studio.title}
                href={studio.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10"
              >
                {/* Image Preview with Signature Sketch Wireframe Border */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-100 mb-4">
                  <Image
                    src={studio.image}
                    alt={studio.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-zinc-800 shadow-xs">
                      {studio.badge}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white">
                      {studio.toolsCount}
                    </span>
                  </div>

                  {/* Bottom category title on image */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-2 text-white">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5500] text-white shadow-xs">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-black truncate drop-shadow-xs">
                      {studio.title}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {studio.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-orange-100/70 pt-3">
                    <span className="text-xs font-bold text-[#FF5500] group-hover:underline flex items-center gap-1">
                      Open Studio
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-400">
                      1 Credit / render
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Recent Projects / History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <FolderKanban className="h-3.5 w-3.5 text-[#FF5500]" />
              <span>Workspace Gallery</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-zinc-900">
              Recent Transformations
            </h3>
          </div>

          <span className="text-xs font-semibold text-zinc-400">
            0 Transformations
          </span>
        </div>

        {recentProjects.length === 0 ? (
          /* Empty State View */
          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-orange-200/90 bg-white/70 p-8 sm:p-12 text-center shadow-xs backdrop-blur-xs transition hover:border-orange-300">
            {/* Subtle warm ambient circles */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-orange-400/10 blur-2xl" />
            <div className="pointer-events-none absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-amber-400/10 blur-2xl" />

            <div className="relative z-10 max-w-md mx-auto space-y-4">
              {/* Illustrated Icon Badge */}
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 border border-orange-200 shadow-sm">
                <FolderKanban className="h-9 w-9 text-[#FF5500]" />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xs border border-orange-200">
                  <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-1.5">
                <h4 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight">
                  No transformations yet
                </h4>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  Your gallery is empty right now. Pick an AI Studio above to create your first virtual fitting, skin analysis, or portrait makeover.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/dashboard/fashion"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:opacity-95 hover:shadow-orange-500/35 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>Create First Transformation</span>
                </Link>

                <Link
                  href="/dashboard/templates"
                  className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500] hover:border-orange-300 transition cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
                  <span>Browse Templates</span>
                </Link>
              </div>

              {/* Quick Inspiration Links */}
              <div className="pt-4 border-t border-orange-100/70 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-400">
                <span className="font-semibold text-zinc-500">Popular to try:</span>
                <Link
                  href="/dashboard/fashion"
                  className="rounded-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-2.5 py-1 transition"
                >
                  👗 Virtual Try-On
                </Link>
                <Link
                  href="/dashboard/skin-face"
                  className="rounded-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-2.5 py-1 transition"
                >
                  ✨ Skin Analysis
                </Link>
                <Link
                  href="/dashboard/beauty"
                  className="rounded-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-2.5 py-1 transition"
                >
                  💄 Makeup Transfer
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProjects.map((project, idx) => (
              <div
                key={idx}
                className="group overflow-hidden rounded-2xl border border-orange-100 bg-white p-3 shadow-xs hover:border-orange-200 hover:shadow-md transition"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100 mb-2.5">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="25vw"
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 rounded-full bg-emerald-500/90 text-white text-[9px] font-bold px-2 py-0.5 backdrop-blur-xs flex items-center gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    <span>{project.status}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-900 truncate">
                    {project.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>{project.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {project.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

