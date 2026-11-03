"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { StatsBanner } from "@/components/landing/stats-banner";
import { FeatureIntro } from "@/components/landing/feature-intro";
import { FeatureAlternating } from "@/components/landing/feature-alternating";
import { ServicesGrid } from "@/components/landing/services-grid";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";
import { QuickTryModal } from "@/components/landing/quick-try-modal";

export default function Home() {
  const [quickTryOpen, setQuickTryOpen] = useState(false);

  const handleOpenQuickTry = () => setQuickTryOpen(true);
  const handleCloseQuickTry = () => setQuickTryOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 selection:bg-[#FF5500] selection:text-white">
      {/* Top Navigation */}
      <Navbar onOpenQuickTry={handleOpenQuickTry} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenQuickTry={handleOpenQuickTry} />

        {/* Orange Stats Banner */}
        <StatsBanner />

        {/* 5 Free Transformations Intro */}
        <FeatureIntro onOpenQuickTry={handleOpenQuickTry} />

        {/* Alternating Feature Showcase with signature offset wireframe cards */}
        <FeatureAlternating onOpenQuickTry={handleOpenQuickTry} />

        {/* Our Services Section */}
        <ServicesGrid onOpenQuickTry={handleOpenQuickTry} />

        {/* Testimonials ("What Our Community Says") */}
        <Testimonials />

        {/* Transparent Pricing Section */}
        <Pricing onOpenQuickTry={handleOpenQuickTry} />
      </main>

      {/* Espresso / Dark Brown Footer */}
      <Footer />

      {/* Interactive AI Studio Quick Try Modal */}
      <QuickTryModal
        isOpen={quickTryOpen}
        onClose={handleCloseQuickTry}
      />
    </div>
  );
}
