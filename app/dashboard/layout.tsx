"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Default credit balance of 5 credits (as in registration state)
  const [creditsRemaining, setCreditsRemaining] = useState(5);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900 antialiased flex">
      {/* 1. Sidebar with App Logo & Name, Navigation Options, AI Tools, Remaining Credits & User Profile */}
      <DashboardSidebar
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        creditsRemaining={creditsRemaining}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex flex-1 flex-col lg:pl-72 xl:pl-80 min-w-0">
        {/* Top Header / Navigation Bar with user profile avatar on the right */}
        <DashboardHeader
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          creditsRemaining={creditsRemaining}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
