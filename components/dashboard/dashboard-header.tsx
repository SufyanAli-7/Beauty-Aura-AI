"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Zap,
  Plus,
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
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
    if (pathname.includes("/dashboard/skin-face")) return "AI Skin & Face Analysis";
    if (pathname.includes("/dashboard/beauty")) return "Beauty & Makeup Studio";
    if (pathname.includes("/dashboard/fashion")) return "Fashion & Virtual Try-On";
    if (pathname.includes("/dashboard/hair-beard")) return "Hair & Beard Salon";
    if (pathname.includes("/dashboard/extras")) return "AI Extras & Studio Tools";
    if (pathname.includes("/dashboard/projects")) return "My Projects";
    if (pathname.includes("/dashboard/templates")) return "Style Templates";
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

      {/* Center: Search Bar (Hidden on small mobile) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <label htmlFor="dashboard-search" className="sr-only">
            Search AI tools, styles, looks
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            id="dashboard-search"
            name="search"
            type="text"
            aria-label="Search AI tools, styles, looks"
            placeholder="Search AI tools, styles, looks..."
            className="w-full rounded-full border border-orange-200/80 bg-stone-50/70 py-1.5 pl-10 pr-12 text-xs font-medium text-zinc-800 placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="hidden sm:inline-block rounded border border-orange-200/70 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Side: Credits, Quick Action, Notifications, Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
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

        {/* Quick Transformation Action Button */}
        <Link
          href="/dashboard/skin-face"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-orange-500/25 hover:opacity-95 hover:shadow-orange-500/40 transition-all duration-200"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>New Transformation</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-orange-100 bg-white text-zinc-600 hover:border-orange-200 hover:bg-orange-50 hover:text-[#FF5500] transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FF5500] ring-2 ring-white" />
          </button>

          {/* Notifications Flyout */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-orange-100 bg-white p-4 shadow-xl ring-1 ring-black/5 z-50">
              <div className="flex items-center justify-between border-b border-orange-100 pb-2.5">
                <span className="text-xs font-bold text-zinc-900">Notifications</span>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                  2 New
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                <div className="flex items-start gap-2.5 rounded-xl bg-orange-50/60 p-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Welcome to BeautyAura Studio!</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Explore our 5 new AI beauty and fashion engines.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl bg-stone-50 p-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Credits Refreshed</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      You have 5 complimentary free transformations available.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

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
