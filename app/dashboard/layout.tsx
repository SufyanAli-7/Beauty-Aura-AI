"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useAuth } from "@/lib/auth-context";
import { CoolLoader } from "@/components/ui/cool-loader";

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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 antialiased flex relative">
      {/* Fullscreen Cool Loader Overlay while verifying auth or redirecting (zero text) */}
      {(loading || !user) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF7F2] select-none">
          <CoolLoader size="lg" />
        </div>
      )}

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

        {/* Dynamic Route Content - Always rendered to avoid instant segment drop */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
