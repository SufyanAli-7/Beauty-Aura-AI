"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderKanban,
  Download,
  Trash2,
  Plus,
  Sparkles,
  ExternalLink,
  Layers,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { insforge } from "@/lib/insforge";

interface TransformationItem {
  id: string;
  tool_id: string;
  tool_name: string;
  source_image_url: string;
  result_image_url: string;
  look_name?: string;
  created_at: string;
  credits_deducted: number;
}

const ITEMS_PER_PAGE = 16;

// Relative time formatter (e.g. "Just now", "5 min ago", "1h ago", "1d ago")
function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInSeconds / 3600);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInSeconds / 86400);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    return `${Math.floor(diffInDays / 365)}y ago`;
  } catch {
    return "Recently";
  }
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [transformations, setTransformations] = useState<TransformationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (item: TransformationItem) => {
    try {
      setDownloadingId(item.id);
      const filename = `beautyaura-${item.tool_id}-${item.id.slice(0, 8)}.jpg`;
      const response = await fetch(item.result_image_url);
      if (!response.ok) throw new Error("Fetch failed");
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
    } catch {
      window.open(item.result_image_url, "_blank");
    } finally {
      setDownloadingId(null);
    }
  };

  // Fetch transformations from database
  useEffect(() => {
    async function loadTransformations() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await insforge.database
          .from("transformations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setTransformations(data as TransformationItem[]);
        }
      } catch (err) {
        console.error("Error loading transformations:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTransformations();
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    try {
      await insforge.database.from("transformations").delete().eq("id", id);
      setTransformations((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete transformation:", err);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const filteredTransformations =
    filter === "all"
      ? transformations
      : transformations.filter((t) => {
          if (filter === "beauty") {
            return (
              t.tool_id === "transfer" ||
              t.tool_id === "try-on" ||
              t.tool_id === "eye-color" ||
              t.tool_id.startsWith("beauty")
            );
          }
          return t.tool_id.startsWith(filter) || t.tool_id === filter;
        });

  // Pagination calculation: 16 cards per page
  const totalPages = Math.ceil(filteredTransformations.length / ITEMS_PER_PAGE) || 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredTransformations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
            My Transformations
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Saved renders stored securely in your Studio Cloud Library.
          </p>
        </div>

        <Link
          href="/dashboard/beauty"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Makeover</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Items" },
            { id: "beauty", label: "Beauty Studio" },
            { id: "fashion", label: "Fashion Try-On" },
            { id: "hair-beard", label: "Hair & Beard" },
            { id: "skin-face", label: "Skin & Face" },
            { id: "extras", label: "AI Extras" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
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
          Showing {filteredTransformations.length} {filteredTransformations.length === 1 ? "transformation" : "transformations"}
        </span>
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-300 border-t-[#FF5500]" />
        </div>
      ) : filteredTransformations.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-orange-200/90 bg-white/70 p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100/80 text-[#FF5500] shadow-2xs mb-4">
            <Sparkles className="h-7 w-7" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
            No transformations saved yet
          </h3>
          <p className="mt-1.5 max-w-md mx-auto text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Head over to Beauty AI Studio to run your first virtual makeup try-on, transfer, or contact lens simulation.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/dashboard/beauty"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Open Beauty AI Studio</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Transformations Grid (16 items per page) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-orange-100 bg-white p-3 shadow-xs hover:border-orange-300 hover:shadow-lg transition-all duration-300"
              >
                {/* Image Thumbnail */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-950 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.result_image_url}
                    alt={item.tool_name}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-zinc-800">
                    {item.tool_name}
                  </div>

                  {/* Bottom-right: Relative generation time with frosted glass badge */}
                  <div className="absolute bottom-2 right-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[10px] font-semibold text-white/95 flex items-center gap-1.5 shadow-lg shadow-black/25">
                    <Clock className="h-2.5 w-2.5 text-orange-400" />
                    <span>{formatTimeAgo(item.created_at)}</span>
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-900 truncate">
                    {item.look_name || item.tool_name}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <span>-5 Credits</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between border-t border-orange-100/70 pt-2.5">
                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      disabled={downloadingId === item.id}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] hover:underline cursor-pointer disabled:opacity-50"
                    >
                      {downloadingId === item.id ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Download className="h-3 w-3" />
                      )}
                      <span>{downloadingId === item.id ? "Saving..." : "Download"}</span>
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-orange-100/80 pt-6">
              <span className="text-xs font-semibold text-zinc-500">
                Showing <span className="font-bold text-zinc-800">{startIndex + 1}</span>–
                <span className="font-bold text-zinc-800">
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredTransformations.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-zinc-800">{filteredTransformations.length}</span> transformations
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={validPage === 1}
                  className="inline-flex items-center gap-1 rounded-xl border border-orange-200/80 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-2xs hover:bg-orange-50 hover:text-[#FF5500] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      totalPages > 7 &&
                      pageNum !== 1 &&
                      pageNum !== totalPages &&
                      Math.abs(pageNum - validPage) > 1
                    ) {
                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return (
                          <span key={pageNum} className="px-1 text-xs text-zinc-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`h-8 w-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                          validPage === pageNum
                            ? "bg-[#FF5500] text-white shadow-xs"
                            : "border border-orange-100 bg-white text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={validPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-xl border border-orange-200/80 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-2xs hover:bg-orange-50 hover:text-[#FF5500] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
