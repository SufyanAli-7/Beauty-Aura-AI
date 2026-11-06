"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/landing/logo";
import {
  Sparkles,
  ArrowLeft,
  Home,
  LayoutDashboard,
  Shirt,
  Scissors,
  Smile,
  Wand2,
  Compass,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const studioLinks = [
    {
      title: "Beauty & Makeup",
      href: "/dashboard/beauty",
      icon: Sparkles,
      color: "text-rose-500 bg-rose-50 border-rose-200/80",
    },
    {
      title: "Fashion Try-On",
      href: "/dashboard/fashion",
      icon: Shirt,
      color: "text-amber-500 bg-amber-50 border-amber-200/80",
    },
    {
      title: "Hair & Beard",
      href: "/dashboard/hair-beard",
      icon: Scissors,
      color: "text-orange-500 bg-orange-50 border-orange-200/80",
    },
    {
      title: "Skin & Body",
      href: "/dashboard/skin-face",
      icon: Smile,
      color: "text-emerald-500 bg-emerald-50 border-emerald-200/80",
    },
    {
      title: "AI Extras",
      href: "/dashboard/extras",
      icon: Wand2,
      color: "text-purple-500 bg-purple-50 border-purple-200/80",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#FAF7F2] text-zinc-900 selection:bg-[#FF5500] selection:text-white overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#FF5500]/15 via-amber-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-12 left-10 w-80 h-80 bg-amber-100/30 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="transition-transform hover:scale-[1.02]">
          <Logo size="md" />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/90 bg-white/90 px-4 py-2 text-xs font-semibold text-zinc-800 shadow-xs backdrop-blur-md transition hover:bg-orange-50 hover:border-orange-300"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-[#FF5500]" />
          <span>Go to Studio</span>
        </Link>
      </header>

      {/* Main 404 Hero Showcase */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative w-full max-w-2xl text-center">
          {/* Signature Offset Wireframe Background Decorations */}
          <div className="absolute inset-0 rounded-3xl border border-amber-300/60 rotate-[2.5deg] translate-x-[8px] translate-y-[-6px] pointer-events-none" />
          <div className="absolute inset-0 rounded-3xl border border-orange-200/70 rotate-[-2deg] translate-x-[-6px] translate-y-[8px] pointer-events-none" />

          {/* Central Luxury Frosted Card */}
          <div className="relative rounded-3xl border border-orange-100/90 bg-white/95 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-orange-950/5">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/90 px-3.5 py-1 text-xs font-semibold text-zinc-700 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#FF5500] animate-ping" />
              <Compass className="h-3.5 w-3.5 text-[#FF5500]" />
              <span>404 Error • Page Not Found</span>
            </div>

            {/* Radiant Big 404 Visual */}
            <div className="relative my-4 select-none">
              <span className="text-8xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] via-[#FF7A1A] to-amber-500 drop-shadow-sm">
                404
              </span>
              <div className="absolute -top-2 right-1/4 sm:right-1/3">
                <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 leading-snug">
              Lost in the Creative Studio?
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-lg mx-auto">
              The page you are looking for doesn&apos;t exist, was moved, or is
              currently undergoing an AI makeover. Let&apos;s get you back to creating.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] hover:from-[#E64C00] hover:to-[#FF6A00] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Return to Studio</span>
              </Link>

              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-orange-200/90 bg-stone-50/80 hover:bg-orange-50 px-5 text-sm font-semibold text-zinc-800 transition hover:border-orange-300"
              >
                <Home className="h-4 w-4 text-[#FF5500]" />
                <span>Homepage</span>
              </Link>

              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 px-4 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </button>
            </div>

            {/* Quick AI Studios Directory */}
            <div className="mt-10 pt-8 border-t border-orange-100/80">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Or jump directly to an AI Studio
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {studioLinks.map((studio) => {
                  const Icon = studio.icon;
                  return (
                    <Link
                      key={studio.href}
                      href={studio.href}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200/80 bg-stone-50/70 hover:bg-white hover:border-orange-300 hover:shadow-xs px-3 py-1.5 text-xs font-medium text-zinc-700 transition"
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-md border ${studio.color}`}
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      <span>{studio.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-4 py-6 text-center text-xs text-zinc-400">
        <p>© 2026 BeautyAura.ai. All rights reserved.</p>
      </footer>
    </div>
  );
}
