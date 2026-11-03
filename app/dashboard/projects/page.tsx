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

export default function ProjectsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
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

  const filteredTransformations =
    filter === "all"
      ? transformations
      : transformations.filter((t) => t.tool_id === filter);

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
            { id: "transfer", label: "Makeup Transfer" },
            { id: "try-on", label: "Makeup Try-On" },
            { id: "eye-color", label: "Eye Color" },
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
          Showing {filteredTransformations.length} transformations
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredTransformations.map((item) => (
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
                <div className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-white">
                  4K UHD
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
      )}
    </div>
  );
}
