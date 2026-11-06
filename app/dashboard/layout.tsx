"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/landing/logo";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, credits } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Route protection: Block unauthenticated access and redirect to sign-in
  useEffect(() => {
    if (!loading && !user) {
      const redirectTarget = pathname || "/dashboard";
      router.replace(`/sign-in?redirect=${encodeURIComponent(redirectTarget)}`);
    }
  }, [loading, user, router, pathname]);

  // Loading state while verifying authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-orange-400/20 blur-md animate-pulse" />
            <Logo />
          </div>
          <div className="flex items-center gap-2.5 text-stone-600 text-sm font-semibold tracking-wide">
            <Loader2 className="w-4 h-4 animate-spin text-[#FF5500]" />
            <span>Verifying Studio Credentials...</span>
          </div>
        </div>
      </div>
    );
  }

  // Prevent any flash of dashboard UI if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 antialiased flex">
      {/* 1. Sidebar with App Logo & Name, Navigation Options, AI Tools, Remaining Credits & User Profile */}
      <DashboardSidebar
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        creditsRemaining={credits}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex flex-1 flex-col lg:pl-72 xl:pl-80 min-w-0">
        {/* Top Header / Navigation Bar with user profile avatar on the right */}
        <DashboardHeader
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          creditsRemaining={credits}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
