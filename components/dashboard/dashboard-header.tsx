"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Sparkles,
  Zap,
  CreditCard,
  User,
  LogOut,
  ChevronDown,
  FolderKanban,
  Sliders,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface DashboardHeaderProps {
  onMobileMenuToggle: () => void;
  creditsRemaining?: number;
}

export function DashboardHeader({
  onMobileMenuToggle,
  creditsRemaining = 5,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName =
    profile?.name ||
    user?.profile?.name ||
    user?.email?.split("@")[0] ||
    "Beauty Creator";

  const userEmail = profile?.email || user?.email || "creator@beautyaura.ai";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  // Get readable page title based on pathname
  const getPageTitle = () => {
    if (pathname.includes("/dashboard/skin-face")) return "AI Skin, Face & Body Studio";
    if (pathname.includes("/dashboard/beauty")) return "Beauty & Makeup Studio";
    if (pathname.includes("/dashboard/fashion")) return "Fashion & Virtual Try-On";
    if (pathname.includes("/dashboard/hair-beard")) return "Hair & Beard Salon";
    if (pathname.includes("/dashboard/extras")) return "AI Extras & Studio Tools";
    if (pathname.includes("/dashboard/projects")) return "My Projects";
    if (pathname.includes("/dashboard/billing")) return "Billing & Credits";
    return "Dashboard Studio";
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-orange-100/80 bg-white/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Title / Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200/70 text-zinc-600 hover:bg-orange-50 hover:text-[#FF5500] transition lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page Title & Breadcrumb */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 hidden sm:inline">
              BeautyAura
            </span>
            <span className="text-zinc-300 hidden sm:inline">/</span>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-zinc-900">
              {getPageTitle()}
            </h1>
          </div>
        </div>
      </div>

      {/* Right Side: Credits & Profile Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Credits Badge */}
        <Link
          href="/dashboard/billing"
          className="group flex items-center gap-1.5 rounded-full border border-orange-200/90 bg-gradient-to-r from-orange-50 to-amber-50/70 px-3 py-1.5 text-xs font-bold text-zinc-800 hover:border-orange-300 hover:bg-orange-100/70 transition shadow-2xs"
          title="Remaining Credits"
        >
          <Zap className="h-3.5 w-3.5 text-[#FF5500] fill-[#FF5500] transition-transform group-hover:scale-110" />
          <span className="text-zinc-900 font-extrabold">{creditsRemaining}</span>
          <span className="hidden sm:inline text-zinc-500 font-medium">Credits</span>
        </Link>

        {/* User Profile Avatar on Right Side */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-full p-0.5 border border-orange-200/80 hover:border-orange-300 focus:outline-none transition cursor-pointer"
            aria-label="User profile menu"
          >
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="h-8 w-8 rounded-full object-cover border border-orange-200"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF5500] to-[#FFA033] text-xs font-extrabold text-white shadow-xs">
                {initial}
              </div>
            )}
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400 hidden sm:block mr-1" />
          </button>

          {/* User Profile Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-orange-100 bg-white p-2 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Overview */}
              <div className="flex items-center gap-3 p-3 border-b border-orange-100/70 bg-gradient-to-br from-orange-50/50 to-transparent rounded-t-xl">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-10 w-10 rounded-full object-cover border-2 border-orange-200 shrink-0"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF5500] to-[#FFA033] text-sm font-bold text-white shadow-xs">
                    {initial}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-zinc-900 truncate">
                    {displayName}
                  </span>
                  <span className="text-[11px] text-zinc-400 truncate">
                    {userEmail}
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.2 text-[9px] font-bold text-orange-700">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      Free Plan
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-1.5">
                <Link
                  href="/dashboard"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500] transition"
                >
                  <User className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Dashboard Home</span>
                </Link>

                <Link
                  href="/dashboard/projects"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500] transition"
                >
                  <FolderKanban className="h-3.5 w-3.5 text-zinc-400" />
                  <span>My Saved Projects</span>
                </Link>

                <Link
                  href="/dashboard/billing"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Billing &amp; Credits</span>
                  </div>
                  <span className="rounded-full bg-orange-100 px-1.5 py-0.2 text-[10px] font-bold text-orange-700">
                    {creditsRemaining} left
                  </span>
                </Link>

                <Link
                  href="/"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500] transition"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Landing Page</span>
                </Link>
              </div>

              {/* Sign Out */}
              <div className="border-t border-orange-100/70 pt-1.5">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
