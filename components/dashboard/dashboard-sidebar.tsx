"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Smile,
  Wand2,
  Shirt,
  Scissors,
  Layers,
  FolderKanban,
  LayoutTemplate,
  CreditCard,
  Sparkles,
  Zap,
  LogOut,
  ChevronRight,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  creditsRemaining?: number;
}

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
];

export const aiToolItems = [
  {
    name: "AI Skin & Face Analysis",
    href: "/dashboard/skin-face",
    icon: Smile,
    badge: "Popular",
    description: "Retouch, skin tone & age progression",
  },
  {
    name: "Beauty",
    href: "/dashboard/beauty",
    icon: Wand2,
    badge: "HD",
    description: "Makeup transfer, lips & glamour",
  },
  {
    name: "Fashion",
    href: "/dashboard/fashion",
    icon: Shirt,
    badge: "Trending",
    description: "Virtual clothing, shoes & bags",
  },
  {
    name: "Hair & Beard",
    href: "/dashboard/hair-beard",
    icon: Scissors,
    badge: null,
    description: "Hair styling, colors & beard grooming",
  },
  {
    name: "AI Extras",
    href: "/dashboard/extras",
    icon: Layers,
    badge: "New",
    description: "Object erase, cutout, colorize & headshots",
  },
];

export const secondaryItems = [
  {
    name: "My Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
    badge: null,
  },
  {
    name: "Templates",
    href: "/dashboard/templates",
    icon: LayoutTemplate,
    badge: null,
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    badge: null,
  },
];

export function DashboardSidebar({
  isMobileOpen = false,
  onMobileClose,
  creditsRemaining = 5,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  const displayName =
    profile?.name ||
    user?.profile?.name ||
    user?.email?.split("@")[0] ||
    "Beauty Creator";

  const userEmail = profile?.email || user?.email || "creator@beautyaura.ai";
  const initial = displayName.charAt(0).toUpperCase();

  const NavLink = ({
    item,
  }: {
    item: {
      name: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string | null;
      description?: string;
    };
  }) => {
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href);
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        onClick={onMobileClose}
        className={cn(
          "group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-amber-500/5 text-[#FF5500] font-semibold shadow-xs"
            : "text-zinc-600 hover:bg-orange-50/70 hover:text-zinc-900"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-1">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
              isActive
                ? "bg-gradient-to-br from-[#FF5500] to-[#FF7A1A] text-white shadow-xs shadow-orange-500/30"
                : "bg-orange-50 text-orange-600 group-hover:bg-orange-100/80 group-hover:text-[#FF5500]"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
          </div>
          <span className="truncate text-[13px] font-semibold">{item.name}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pl-1">
          {item.badge && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase transition-colors",
                isActive
                  ? "bg-orange-500 text-white"
                  : item.badge === "Trending" || item.badge === "Popular"
                  ? "bg-orange-100 text-orange-700 group-hover:bg-orange-200/80"
                  : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200"
              )}
            >
              {item.badge}
            </span>
          )}
          {isActive && (
            <div className="h-2 w-2 rounded-full bg-[#FF5500] shadow-xs" />
          )}
        </div>
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white backdrop-blur-md">
      {/* 1. Header with App Logo and App Name */}
      <div className="flex h-20 items-center border-b border-orange-100/80 px-5 shrink-0">
        <div className="flex w-full items-center justify-between">
          <Link
            href="/dashboard"
            onClick={onMobileClose}
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            {/* Logo Emblem */}
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white shadow-md shadow-orange-500/20 transition-transform group-hover:scale-105">
              <Image
                src="/beauty-aura-logo.png"
                alt="BeautyAura.ai Logo"
                fill
                sizes="40px"
                className="object-cover scale-110"
                priority
              />
            </div>

            {/* Brand Typography */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-zinc-900 group-hover:text-[#FF5500] transition-colors">
                  BeautyAura
                </span>
                <span className="rounded-md bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-1.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase shadow-2xs">
                  AI
                </span>
              </div>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Fashion &amp; Beauty Lab
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          {onMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200/60 text-zinc-500 hover:bg-orange-50 hover:text-zinc-800 lg:hidden cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Scrollable Navigation Options */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-5 scrollbar-thin scrollbar-thumb-orange-100">
        {/* Dashboard Option */}
        <div>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* AI Tools Section */}
        <div>
          <div className="mb-2 flex items-center justify-between px-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              <Sparkles className="h-3 w-3 text-[#FF5500]" />
              <span>AI Tools</span>
            </div>
            <span className="rounded-full bg-orange-50 px-2 py-0.2 text-[10px] font-bold text-[#FF5500] border border-orange-200/60">
              5 Studios
            </span>
          </div>

          <div className="space-y-1">
            {aiToolItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Workspace: My Projects, Templates, Billing */}
        <div>
          <div className="mb-2 px-3 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            Workspace
          </div>

          <div className="space-y-1">
            {secondaryItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom of the Sidebar: Remaining Credits, Name & Profile Avatar */}
      <div className="border-t border-orange-100/80 p-4 space-y-3 bg-gradient-to-b from-white/60 to-orange-50/30 shrink-0">
        {/* Remaining Credits Card */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50 via-amber-50/50 to-orange-100/50 p-3.5 shadow-2xs">
          {/* Subtle decorative glow */}
          <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-orange-400/10 blur-xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5500] text-white shadow-xs">
                <Zap className="h-3.5 w-3.5 fill-current" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Remaining Credits
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-zinc-900">
                    {creditsRemaining}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">
                    / 50 credits
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/billing"
              onClick={onMobileClose}
              className="inline-flex items-center gap-1 rounded-lg bg-white/90 border border-orange-200/80 px-2.5 py-1 text-xs font-bold text-[#FF5500] shadow-2xs hover:bg-[#FF5500] hover:text-white transition-all duration-200"
            >
              <span>Refill</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Credit meter progress bar */}
          <div className="mt-2.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-200/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(5, (creditsRemaining / 50) * 100))}%`,
                }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] font-medium text-zinc-500">
              <span>Free Plan Tier</span>
              <span>Renews monthly</span>
            </div>
          </div>
        </div>

        {/* User Profile Avatar & Name Row */}
        <div className="flex items-center justify-between rounded-xl border border-orange-100/80 bg-white p-2.5 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="h-9 w-9 rounded-full object-cover border-2 border-orange-200 shrink-0"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF5500] to-[#FFA033] text-sm font-bold text-white shadow-xs">
                {initial}
              </div>
            )}

            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-bold text-zinc-900">
                {displayName}
              </span>
              <span className="truncate text-[11px] font-medium text-zinc-400">
                {userEmail}
              </span>
            </div>
          </div>

          {/* Quick sign-out or exit button */}
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-zinc-400 hover:border-orange-200 hover:bg-orange-50 hover:text-[#FF5500] transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:w-72 xl:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 border-r border-orange-100/90 shadow-sm">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={onMobileClose}
          />
          {/* Slide-out Sidebar */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] h-full shadow-2xl transition-transform duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
