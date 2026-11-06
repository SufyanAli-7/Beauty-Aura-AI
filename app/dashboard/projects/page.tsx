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
  Eye,
  X,
  Maximize2,
  Calendar,
  Zap,
  Play,
  Pause,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { insforge } from "@/lib/insforge";

interface TransformationItem {
  id: string;
  user_id?: string;
  tool_id: string;
  tool_name: string;
  source_image_url: string;
  result_image_url: string;
  storage_key?: string | null;
  look_name?: string;
  created_at: string;
  credits_deducted: number;
  settings?: {
    toolId?: string;
    toolName?: string;
    multiUrls?: string[];
    extraOutputs?: string[];
    analysisData?: {
      age?: number;
      age_min?: number;
      age_max?: number;
      agd_idx?: number;
      num_of_photos?: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
  initialStageIndex?: number;
  parentItem?: TransformationItem;
}

const ITEMS_PER_PAGE = 16;

function getStages(item: TransformationItem | null): string[] {
  if (!item) return [];
  if (Array.isArray(item.settings?.multiUrls) && item.settings.multiUrls.length > 0) {
    return item.settings.multiUrls;
  }
  if (Array.isArray(item.settings?.extraOutputs) && item.settings.extraOutputs.length > 0) {
    return item.settings.extraOutputs;
  }
  return item.result_image_url ? [item.result_image_url] : [];
}

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

function getStudioLink(toolId: string): string {
  if (toolId.startsWith("fashion")) return "/dashboard/fashion";
  if (toolId.startsWith("hair-beard")) return "/dashboard/hair-beard";
  if (toolId.startsWith("skin-face")) return "/dashboard/skin-face";
  if (toolId.startsWith("extras")) return "/dashboard/extras";
  return "/dashboard/beauty";
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [transformations, setTransformations] = useState<TransformationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Modal preview state
  const [selectedItem, setSelectedItem] = useState<TransformationItem | null>(null);
  const [modalView, setModalView] = useState<"result" | "source">("result");
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const [isPlayingTimeLapse, setIsPlayingTimeLapse] = useState<boolean>(false);
  const [downloadingAll, setDownloadingAll] = useState<boolean>(false);
  const [showAllStagesInGrid, setShowAllStagesInGrid] = useState<boolean>(false);

  // Keyboard Escape & Arrow Left/Right listener to navigate stages & close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
        setIsPlayingTimeLapse(false);
      } else if (e.key === "ArrowLeft" && selectedItem) {
        const stages = getStages(selectedItem);
        if (stages.length > 1) {
          setIsPlayingTimeLapse(false);
          setModalView("result");
          setSelectedStageIndex((prev) => (prev > 0 ? prev - 1 : stages.length - 1));
        }
      } else if (e.key === "ArrowRight" && selectedItem) {
        const stages = getStages(selectedItem);
        if (stages.length > 1) {
          setIsPlayingTimeLapse(false);
          setModalView("result");
          setSelectedStageIndex((prev) => (prev < stages.length - 1 ? prev + 1 : 0));
        }
      }
    };
    if (selectedItem) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedItem]);

  // Time-lapse auto-play effect
  useEffect(() => {
    if (!isPlayingTimeLapse || !selectedItem) return;
    const stages = getStages(selectedItem);
    if (stages.length <= 1) {
      setIsPlayingTimeLapse(false);
      return;
    }

    const timer = setInterval(() => {
      setSelectedStageIndex((prev) => (prev + 1) % stages.length);
    }, 450);

    return () => clearInterval(timer);
  }, [isPlayingTimeLapse, selectedItem]);

  const handleDownload = async (
    item: TransformationItem,
    customUrl?: string,
    customFilename?: string
  ) => {
    const url = customUrl || item.result_image_url;
    const downloadKey = customUrl ? `${item.id}-${url}` : item.id;
    try {
      setDownloadingId(downloadKey);
      const filename =
        customFilename || `beautyaura-${item.tool_id}-${item.id.slice(0, 8)}.jpg`;
      const response = await fetch(url);
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
      window.open(url, "_blank");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAllStages = async (
    item: TransformationItem,
    stages: string[]
  ) => {
    try {
      setDownloadingAll(true);
      for (let i = 0; i < stages.length; i++) {
        const url = stages[i];
        const filename = `beautyaura-${item.tool_id}-stage-${i + 1}-${item.id.slice(0, 6)}.jpg`;
        try {
          const res = await fetch(url);
          if (res.ok) {
            const blob = await res.blob();
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
          }
        } catch {
          window.open(url, "_blank");
        }
        await new Promise((r) => setTimeout(r, 350));
      }
    } finally {
      setDownloadingAll(false);
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
      const realId = id.includes("-stage-") ? id.split("-stage-")[0] : id;
      await insforge.database.from("transformations").delete().eq("id", realId);
      setTransformations((prev) => prev.filter((item) => item.id !== realId));
      if (selectedItem?.id === id || selectedItem?.id === realId) {
        setSelectedItem(null);
        setIsPlayingTimeLapse(false);
      }
    } catch (err) {
      console.error("Failed to delete transformation:", err);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const baseFiltered =
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

  // If showAllStagesInGrid is enabled, expand transformations with multiUrls into separate cards
  const filteredTransformations = React.useMemo(() => {
    if (!showAllStagesInGrid) return baseFiltered;

    const expanded: TransformationItem[] = [];
    for (const item of baseFiltered) {
      const stages = getStages(item);
      if (stages.length > 1) {
        stages.forEach((stageUrl, idx) => {
          expanded.push({
            ...item,
            id: `${item.id}-stage-${idx + 1}`,
            result_image_url: stageUrl,
            look_name: `${item.look_name || item.tool_name} (Stage ${idx + 1} of ${stages.length})`,
            initialStageIndex: idx,
            parentItem: item,
          });
        });
      } else {
        expanded.push(item);
      }
    }
    return expanded;
  }, [baseFiltered, showAllStagesInGrid]);

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

        <div className="flex items-center gap-3">
          {/* Toggle to explode multi-stage projects into individual cards */}
          <button
            type="button"
            onClick={() => {
              setShowAllStagesInGrid((prev) => !prev);
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
              showAllStagesInGrid
                ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                : "bg-white border-orange-200 text-zinc-700 hover:bg-orange-50"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{showAllStagesInGrid ? "Showing All Stages" : "Show All Stages"}</span>
          </button>

          <span className="text-xs font-bold text-zinc-400">
            Showing {filteredTransformations.length}{" "}
            {filteredTransformations.length === 1 ? "transformation" : "transformations"}
          </span>
        </div>
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
            {paginatedItems.map((item) => {
              const itemStages = getStages(item);
              const isMultiStage = itemStages.length > 1;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    const itemToOpen = item.parentItem || item;
                    setSelectedItem(itemToOpen);
                    setModalView("result");
                    setSelectedStageIndex(item.initialStageIndex ?? 0);
                    setIsPlayingTimeLapse(false);
                  }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-orange-100 bg-white p-3 shadow-xs hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {/* Image Thumbnail */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-950 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.result_image_url}
                      alt={item.tool_name}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Hover Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <div className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-zinc-900 shadow-lg flex items-center gap-1.5 backdrop-blur-xs transform translate-y-1 group-hover:translate-y-0 transition-transform">
                        <Eye className="h-3.5 w-3.5 text-[#FF5500]" />
                        <span>View Modal</span>
                      </div>
                    </div>

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
                    <h4 className="text-xs font-bold text-zinc-900 truncate group-hover:text-[#FF5500] transition-colors">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item);
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="p-1 text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* Modal Preview Dialog */}
      {selectedItem && (() => {
        const modalStages = getStages(selectedItem);
        const modalHasMultipleStages = modalStages.length > 1;
        const currentStageUrl =
          modalHasMultipleStages && modalStages[selectedStageIndex]
            ? modalStages[selectedStageIndex]
            : selectedItem.result_image_url;

        const activeDisplayUrl =
          modalView === "result"
            ? currentStageUrl
            : selectedItem.source_image_url || currentStageUrl;

        return (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => {
              setSelectedItem(null);
              setIsPlayingTimeLapse(false);
            }}
          >
            <div
              className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-orange-100 flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: Image Viewport */}
              <div className="relative flex-1 bg-zinc-950 flex items-center justify-center min-h-[340px] md:min-h-[520px] max-h-[50vh] md:max-h-[88vh] p-4 select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeDisplayUrl}
                  alt={selectedItem.tool_name}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-lg transition-all duration-200"
                />

                {/* Left & Right Stage Navigation Arrows */}
                {modalHasMultipleStages && modalView === "result" && (
                  <>
                    <button
                      type="button"
                      title="Previous Stage (ArrowLeft)"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlayingTimeLapse(false);
                        setSelectedStageIndex((prev) =>
                          prev > 0 ? prev - 1 : modalStages.length - 1
                        );
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 hover:bg-[#FF5500] hover:border-transparent transition-all cursor-pointer shadow-lg"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      title="Next Stage (ArrowRight)"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlayingTimeLapse(false);
                        setSelectedStageIndex((prev) =>
                          prev < modalStages.length - 1 ? prev + 1 : 0
                        );
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 hover:bg-[#FF5500] hover:border-transparent transition-all cursor-pointer shadow-lg"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* View Switcher: Transformed vs Original if source image exists */}
                {selectedItem.source_image_url && (
                  <div className="absolute top-4 left-4 z-10 flex items-center rounded-full bg-black/60 p-1 backdrop-blur-md border border-white/20">
                    <button
                      type="button"
                      onClick={() => setModalView("result")}
                      className={`rounded-full px-3 py-1 text-[11px] font-bold transition cursor-pointer ${
                        modalView === "result"
                          ? "bg-[#FF5500] text-white shadow-xs"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {modalHasMultipleStages
                        ? `Stage ${selectedStageIndex + 1}`
                        : "Transformed"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalView("source")}
                      className={`rounded-full px-3 py-1 text-[11px] font-bold transition cursor-pointer ${
                        modalView === "source"
                          ? "bg-[#FF5500] text-white shadow-xs"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      Original
                    </button>
                  </div>
                )}

                {/* Top Right: Time-Lapse Play/Pause & View Full Resolution */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  {modalHasMultipleStages && modalView === "result" && (
                    <button
                      type="button"
                      onClick={() => setIsPlayingTimeLapse((prev) => !prev)}
                      title={isPlayingTimeLapse ? "Pause Time-Lapse" : "Play Aging Time-Lapse"}
                      className={`rounded-full p-2 text-white backdrop-blur-md border transition cursor-pointer ${
                        isPlayingTimeLapse
                          ? "bg-[#FF5500] border-transparent shadow-md ring-2 ring-orange-300"
                          : "bg-black/60 border-white/20 hover:bg-black/80"
                      }`}
                    >
                      {isPlayingTimeLapse ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 fill-white" />
                      )}
                    </button>
                  )}

                  <a
                    href={currentStageUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Open high-res in new tab"
                    className="rounded-full bg-black/60 p-2 text-white/90 backdrop-blur-md border border-white/20 hover:bg-black/80 hover:text-white transition cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* Bottom badges on image */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                  <div className="rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-xs font-semibold text-white/95 flex items-center gap-1.5 shadow-md">
                    <Clock className="h-3 w-3 text-orange-400" />
                    <span>{formatTimeAgo(selectedItem.created_at)}</span>
                  </div>

                  {modalHasMultipleStages && modalView === "result" && (
                    <div className="rounded-full bg-[#FF5500]/90 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
                      <Sparkles className="h-3 w-3" />
                      <span>
                        Stage {selectedStageIndex + 1} of {modalStages.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Info & Actions Sidebar */}
              <div className="w-full md:w-96 lg:w-[420px] flex flex-col justify-between p-6 bg-white overflow-y-auto max-h-[45vh] md:max-h-[88vh] [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-stone-100/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-200/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5500]/70 transition-colors">
                <div className="space-y-4">
                  {/* Header with Close */}
                  <div className="flex items-start justify-between gap-3 border-b border-orange-100 pb-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-[#FF5500]">
                        {selectedItem.tool_name}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-zinc-900 leading-snug">
                        {selectedItem.look_name || selectedItem.tool_name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      title="Close"
                      onClick={() => {
                        setSelectedItem(null);
                        setIsPlayingTimeLapse(false);
                      }}
                      className="rounded-full p-1.5 text-zinc-400 hover:bg-orange-50 hover:text-zinc-700 transition cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Details List */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                      <span className="text-zinc-500">Tool</span>
                      <span className="font-bold text-zinc-800">{selectedItem.tool_name}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                      <span className="text-zinc-500">Created Date</span>
                      <span className="font-bold text-zinc-800">
                        {new Date(selectedItem.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                      <span className="text-zinc-500">Exact Time</span>
                      <span className="font-bold text-zinc-800">
                        {new Date(selectedItem.created_at).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                      <span className="text-zinc-500">Credits Deducted</span>
                      <span className="font-bold text-[#FF5500]">-5 Credits</span>
                    </div>

                    {selectedItem.settings?.analysisData?.age_min && (
                      <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                        <span className="text-zinc-500">Age Simulation Range</span>
                        <span className="font-bold text-zinc-800">
                          {selectedItem.settings.analysisData.age_min} →{" "}
                          {selectedItem.settings.analysisData.age_max ?? 70} years
                        </span>
                      </div>
                    )}

                    {selectedItem.source_image_url && (
                      <div className="pt-1">
                        <span className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
                          Original Source Photo
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedItem.source_image_url}
                          alt="Source"
                          onClick={() => setModalView("source")}
                          className={`h-14 w-14 object-cover rounded-xl border-2 cursor-pointer transition ${
                            modalView === "source"
                              ? "border-[#FF5500] ring-2 ring-orange-200"
                              : "border-zinc-200 hover:border-orange-300"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Chronological Stages 4x4 Grid matching the Studio UI */}
                  {modalHasMultipleStages && (
                    <div className="space-y-2 pt-2 border-t border-orange-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5 text-[#FF5500]" />
                          <span className="text-xs font-black text-zinc-900">
                            Chronological Stages ({modalStages.length})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsPlayingTimeLapse((prev) => !prev)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] hover:underline cursor-pointer"
                        >
                          {isPlayingTimeLapse ? (
                            <>
                              <Pause className="h-3 w-3" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 fill-[#FF5500]" />
                              <span>Play Time-Lapse</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto p-1.5 bg-stone-50/80 rounded-2xl border border-stone-200/80 [scrollbar-width:thin] [scrollbar-color:#fed7aa_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-stone-100/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-200/90 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5500]/70 transition-colors">
                        {modalStages.map((stageUrl, idx) => {
                          const isSelected =
                            selectedStageIndex === idx && modalView === "result";

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setIsPlayingTimeLapse(false);
                                setSelectedStageIndex(idx);
                                setModalView("result");
                              }}
                              className={`group relative aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                                isSelected
                                  ? "border-[#FF5500] ring-2 ring-orange-400 shadow-md scale-[1.02]"
                                  : "border-stone-200 hover:border-orange-300 opacity-80 hover:opacity-100 hover:scale-[1.01]"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={stageUrl}
                                alt={`Stage ${idx + 1}`}
                                className="h-full w-full object-cover"
                              />
                              <div
                                className={`absolute bottom-0 inset-x-0 py-0.5 text-center text-[9px] font-black transition-colors ${
                                  isSelected
                                    ? "bg-[#FF5500] text-white"
                                    : "bg-black/75 text-white/90"
                                }`}
                              >
                                Stage {idx + 1}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-orange-100 mt-4">
                  {/* Download Active Stage */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        selectedItem,
                        currentStageUrl,
                        `beautyaura-${selectedItem.tool_id}-${modalHasMultipleStages ? `stage-${selectedStageIndex + 1}-` : ""}${selectedItem.id.slice(0, 8)}.jpg`
                      )
                    }
                    disabled={downloadingId === selectedItem.id || Boolean(downloadingId)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:opacity-95 transition cursor-pointer disabled:opacity-50"
                  >
                    {downloadingId ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    <span>
                      {downloadingId
                        ? "Saving..."
                        : modalHasMultipleStages
                        ? `Download Stage ${selectedStageIndex + 1}`
                        : "Download High-Res"}
                    </span>
                  </button>

                  {/* Download All Stages Button */}
                  {modalHasMultipleStages && (
                    <button
                      type="button"
                      onClick={() => handleDownloadAllStages(selectedItem, modalStages)}
                      disabled={downloadingAll}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#FF5500] py-2 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                    >
                      {downloadingAll ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Layers className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {downloadingAll
                          ? "Saving All Stages..."
                          : `Download All ${modalStages.length} Stages`}
                      </span>
                    </button>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Link
                      href={getStudioLink(selectedItem.tool_id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] hover:underline"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Open in Studio</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(selectedItem.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
