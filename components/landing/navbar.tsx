"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowUpRight, Shirt, Scissors, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onOpenQuickTry?: () => void;
}

export function Navbar({ onOpenQuickTry }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-100/60 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5500] via-[#FF6A00] to-[#FFA133] shadow-md shadow-orange-500/25 transition-transform group-hover:scale-105">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-[#FF5500] transition-colors">
              GlamMorph<span className="text-[#FF5500]">.ai</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              AI Fashion & Beauty Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-4 lg:gap-7 xl:gap-8 lg:flex">
          <Link
            href="#hero"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-[#FF5500]"
          >
            Home
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-[#FF5500]"
          >
            Features
          </Link>
          <Link
            href="#virtual-try-on"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-[#FF5500]"
          >
            Virtual Try-On
          </Link>
          <Link
            href="#services"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-[#FF5500]"
          >
            Services
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-[#FF5500]"
          >
            Reviews
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-[#FF5500]"
          >
            Pricing
          </Link>
        </nav>

        {/* Right CTA Button */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={onOpenQuickTry}
            className="group flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 px-3.5 py-2 text-xs font-semibold text-[#FF5500] transition hover:bg-orange-100 hover:border-orange-300"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[#FF5500] animate-pulse" />
            5 Free Credits
          </button>

          <Button
            onClick={onOpenQuickTry}
            className="group h-10 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:from-[#E64C00] hover:to-[#FF6A00] hover:shadow-orange-500/30 transition-all cursor-pointer"
          >
            Get Started
            <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>

        {/* Mobile/Tablet menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <Button
            onClick={onOpenQuickTry}
            size="sm"
            className="rounded-full bg-[#FF5500] text-xs font-semibold text-white shadow-sm hover:bg-[#E64C00]"
          >
            Try Free
          </Button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-orange-100 bg-white/98 px-6 pt-3 pb-6 lg:hidden shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            <Link
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-zinc-800 hover:bg-orange-50 hover:text-[#FF5500]"
            >
              Home
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-zinc-800 hover:bg-orange-50 hover:text-[#FF5500]"
            >
              Features
            </Link>
            <Link
              href="#virtual-try-on"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-zinc-800 hover:bg-orange-50 hover:text-[#FF5500]"
            >
              Virtual Try-On
            </Link>
            <Link
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-zinc-800 hover:bg-orange-50 hover:text-[#FF5500]"
            >
              Services
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-zinc-800 hover:bg-orange-50 hover:text-[#FF5500]"
            >
              Pricing
            </Link>

            <div className="pt-2">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuickTry?.();
                }}
                className="w-full h-11 rounded-full bg-[#FF5500] text-sm font-semibold text-white hover:bg-[#E64C00] shadow-md shadow-orange-500/25"
              >
                Get Started Free
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
