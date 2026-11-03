"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderKanban,
  Download,
  Share2,
  Trash2,
  Plus,
  Sparkles,
  Search,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Velvet Evening Gown Fitting",
      category: "fashion",
      categoryLabel: "Fashion",
      date: "Nov 3, 2026",
      image: "/fashion-looks/fashion-3.png",
      resolution: "4K UHD",
      size: "4.2 MB",
    },
    {
      id: 2,
      title: "Golden Hour Studio Relighting",
      category: "extras",
      categoryLabel: "AI Extras",
      date: "Nov 3, 2026",
      image: "/ai-photo-editing-images/photo-lightining.jpg",
      resolution: "4K UHD",
      size: "3.8 MB",
    },
    {
      id: 3,
      title: "Groomed Stubble & Lineup",
      category: "hair-beard",
      categoryLabel: "Hair & Beard",
      date: "Nov 2, 2026",
      image: "/ai-photo-editing-images/beard-try-on.jpg",
      resolution: "4K UHD",
      size: "3.5 MB",
    },
    {
      id: 4,
      title: "Paris Fashion Week Red Carpet Makeup",
      category: "beauty",
      categoryLabel: "Beauty",
      date: "Nov 1, 2026",
      image: "/ai-photo-editing-images/ai-makeup-try-on.jpg",
      resolution: "4K UHD",
      size: "4.6 MB",
    },
    {
      id: 5,
      title: "Dermatological Skin Analysis Scan",
      category: "skin-face",
      categoryLabel: "Skin & Face",
      date: "Oct 30, 2026",
      image: "/ai-photo-editing-images/ai-skin-analaysis.webp",
      resolution: "4K UHD",
      size: "2.9 MB",
    },
    {
      id: 6,
      title: "Emerald Contact Lens Optical Simulator",
      category: "beauty",
      categoryLabel: "Beauty",
      date: "Oct 28, 2026",
      image: "/ai-photo-editing-images/eye-color-try-on.webp",
      resolution: "4K UHD",
      size: "3.1 MB",
    },
    {
      id: 7,
      title: "Silk Blazer Fitting & Drape",
      category: "fashion",
      categoryLabel: "Fashion",
      date: "Oct 27, 2026",
      image: "/ai-photo-editing-images/ai-virtual-cloth-try-on.webp",
      resolution: "4K UHD",
      size: "4.9 MB",
    },
    {
      id: 8,
      title: "Vintage Monochrome Photo Colorize",
      category: "extras",
      categoryLabel: "AI Extras",
      date: "Oct 25, 2026",
      image: "/ai-photo-editing-images/photo-colorize.jpg",
      resolution: "4K UHD",
      size: "3.4 MB",
    },
  ];

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <FolderKanban className="h-3.5 w-3.5" />
            <span>Project Library</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            My Projects
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Access your saved transformations, high-resolution renders, and downloaded looks.
          </p>
        </div>

        <Link
          href="/dashboard/fashion"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Projects" },
            { id: "fashion", label: "Fashion" },
            { id: "beauty", label: "Beauty" },
            { id: "skin-face", label: "Skin & Face" },
            { id: "hair-beard", label: "Hair & Beard" },
            { id: "extras", label: "AI Extras" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                filter === tab.id
                  ? "bg-[#FF5500] text-white shadow-xs"
                  : "bg-white border border-orange-100 text-zinc-600 hover:bg-orange-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-zinc-400">
          Showing {filteredProjects.length} projects
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-orange-100 bg-white p-3 shadow-xs hover:border-orange-300 hover:shadow-lg transition-all duration-300"
          >
            {/* Image Thumbnail */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100 mb-3">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="25vw"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-zinc-800">
                {project.categoryLabel}
              </div>
              <div className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-white">
                {project.resolution}
              </div>
            </div>

            {/* Info & Actions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-900 truncate">
                {project.title}
              </h4>

              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>{project.date}</span>
                <span>{project.size}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-orange-100/70 pt-2.5">
                <a
                  href={project.image}
                  download
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] hover:underline"
                >
                  <Download className="h-3 w-3" />
                  <span>Download</span>
                </a>

                <div className="flex items-center gap-1.5 text-zinc-400">
                  <button
                    type="button"
                    title="Share"
                    className="p-1 hover:text-zinc-700 transition cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    className="p-1 hover:text-rose-600 transition cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

