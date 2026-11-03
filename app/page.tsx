import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { StatsBanner } from "@/components/landing/stats-banner";
import { FeatureIntro } from "@/components/landing/feature-intro";
import { FeatureAlternating } from "@/components/landing/feature-alternating";
import { ServicesGrid } from "@/components/landing/services-grid";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 selection:bg-[#FF5500] selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Orange Stats Banner */}
        <StatsBanner />

        {/* 5 Free Transformations Intro */}
        <FeatureIntro />

        {/* Alternating Feature Showcase with signature offset wireframe cards */}
        <FeatureAlternating />

        {/* Our Services Section */}
        <ServicesGrid />

        {/* Testimonials ("What Our Community Says") */}
        <Testimonials />

        {/* Transparent Pricing Section */}
        <Pricing />
      </main>

      {/* Espresso / Dark Brown Footer */}
      <Footer />
    </div>
  );
}
