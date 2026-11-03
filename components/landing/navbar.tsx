"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, LogIn } from "lucide-react";
import { Logo } from "./logo";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-100/60 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - BeautyAura.ai */}
        <Link href="/" className="group flex items-center">
          <Logo />
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

        {/* Right CTA Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Log in Button */}
          <Link
            href="#pricing"
            className="group flex items-center gap-2 rounded-full border border-orange-200/90 bg-orange-50/80 px-4 py-2 text-xs font-semibold text-[#FF5500] transition hover:bg-orange-100 hover:border-orange-300 cursor-pointer"
          >
            <LogIn className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            <span>Log in</span>
          </Link>

          {/* Get Started Button - Clean, flush, zero white outline / border */}
          <Link
            href="#features"
            className="group inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] hover:from-[#E64C00] hover:to-[#FF6A00] px-5 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer border-0 border-none outline-none ring-0 focus:outline-none"
          >
            <span>Get Started</span>
            <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile/Tablet menu button */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Mobile "Try Free" Button */}
          <Link
            href="#features"
            className="rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] hover:from-[#E64C00] hover:to-[#FF6A00] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition cursor-pointer border-0 border-none outline-none ring-0 focus:outline-none"
          >
            Try Free
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-700 hover:bg-orange-50 hover:text-[#FF5500] focus:outline-none cursor-pointer"
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

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex h-11 items-center justify-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 text-sm font-semibold text-[#FF5500]"
              >
                <LogIn className="h-4 w-4" />
                <span>Log in</span>
              </Link>

              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex h-11 items-center justify-center gap-1.5 rounded-full bg-[#FF5500] text-sm font-semibold text-white hover:bg-[#E64C00] shadow-md shadow-orange-500/25 border-0 outline-none ring-0"
              >
                <span>Get Started Free</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
