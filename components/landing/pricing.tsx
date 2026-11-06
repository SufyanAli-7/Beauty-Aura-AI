"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap, Flame, Crown, ShieldCheck, Clock, CreditCard } from "lucide-react";

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="relative py-20 sm:py-28 bg-[#FFFBF7]">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[600px] overflow-hidden -z-10 opacity-50">
        <div className="h-full w-full rounded-full bg-orange-100/60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/90 px-3.5 py-1 text-xs font-semibold text-[#FF5500]">
            <Sparkles className="h-3.5 w-3.5" />
            Plans and pricing
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Transparent pricing for all.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            Choose the plan that fits your creative needs. Upgrade anytime with recurring monthly billing and cancel anytime with 1 click.
          </p>

          {/* Billing Toggle (Monthly / Yearly) */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center rounded-full border border-orange-200 bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all border-0 border-none outline-none ring-0 cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#FF5500] text-white shadow-md shadow-orange-500/25"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition-all border-0 border-none outline-none ring-0 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-[#FF5500] text-white shadow-md shadow-orange-500/25"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <span>Yearly</span>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-[#FF5500]">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 items-stretch gap-6 xl:gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Card 1: Free Creator */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-orange-200/80 bg-white p-6 sm:p-7 xl:p-8 shadow-lg shadow-orange-900/5 transition-transform hover:-translate-y-1.5 duration-300">
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5500]">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#FF5500] uppercase tracking-wider">
                FREE TIER
              </span>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold text-zinc-900">
                Free Creator <span className="block text-zinc-500 text-sm font-medium">Starter Access</span>
              </h3>

              <div className="mt-5 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                    $0
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap">
                    / forever
                  </span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-[#FF5500] whitespace-nowrap">
                    <Zap className="h-3.5 w-3.5 fill-current shrink-0" />
                    <span>50 Free Credits</span>
                  </span>
                </div>
              </div>

              {/* Feature list */}
              <ul className="mt-8 space-y-3.5 border-t border-zinc-100 pt-6">
                {[
                  "50 Complimentary AI Credits on signup",
                  "Full access to all 5 AI Studios",
                  "Real-time Before / After split comparisons",
                  "Standard 1080p resolution exports",
                  "Community support & tutorial library",
                  "Interactive canvas & style selector",
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-700">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/sign-up"
                className="w-full flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-stone-900 to-zinc-800 hover:from-black hover:to-zinc-900 text-xs font-bold text-white shadow-md transition-all cursor-pointer border-0 border-none outline-none ring-0 focus:outline-none"
              >
                Get Started for Free
              </Link>
            </div>
          </div>

          {/* Card 2: Basic Plan (Featured Solid Orange Card - Center) */}
          <div className="relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#FF5500] via-[#FF6600] to-[#FF771C] p-6 sm:p-7 xl:p-8 text-white shadow-2xl shadow-orange-600/30 lg:-translate-y-4 lg:py-10 transition-transform hover:-translate-y-5 duration-300">
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                <Flame className="h-5 w-5 fill-white" />
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#FF5500] uppercase tracking-wider shadow-sm">
                MOST POPULAR
              </span>
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-bold text-white">
                Basic Plan <span className="block text-orange-100 text-sm font-medium">Daily Creator Studio</span>
              </h3>

              <div className="mt-5 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {billingCycle === "monthly" ? "$9.99" : "$95.90"}
                  </span>
                  <div className="flex flex-col text-[11px] leading-tight font-semibold">
                    <span className="text-orange-200 line-through">
                      {billingCycle === "monthly" ? "$19" : "$190"}
                    </span>
                    <span className="text-orange-100 whitespace-nowrap">
                      {billingCycle === "monthly" ? "/ month" : "/ year"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white shadow-xs whitespace-nowrap">
                    <Zap className="h-3.5 w-3.5 fill-white shrink-0" />
                    <span>450 Credits / mo</span>
                  </span>
                </div>
              </div>

              {/* Feature list */}
              <ul className="mt-8 space-y-3.5 border-t border-white/20 pt-6">
                {[
                  "450 AI Generation Credits every month",
                  "Ultra-HD 4K lossless downloads & exports",
                  "Fast-track priority GPU cloud queue",
                  "Commercial usage rights for social media & ads",
                  "Access to all AI Hairstyles, Makeup & Virtual Try-On",
                  "Automatic monthly credit renewal & rollover",
                  "Cancel or update payment anytime in 1 click",
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-white font-medium">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#FF5500] mt-0.5 shadow-xs">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/sign-up?plan=basic"
                className="w-full flex h-12 items-center justify-center rounded-full bg-white text-xs font-bold text-[#FF5500] shadow-lg shadow-black/10 hover:bg-orange-50 transition-colors cursor-pointer border-0 border-none outline-none ring-0 focus:outline-none"
              >
                Subscribe to Basic
              </Link>
            </div>
          </div>

          {/* Card 3: Pro Plan */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-orange-200/80 bg-white p-6 sm:p-7 xl:p-8 shadow-lg shadow-orange-900/5 transition-transform hover:-translate-y-1.5 duration-300">
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5500]">
                <Crown className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#FF5500] uppercase tracking-wider">
                PRO POWER
              </span>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold text-zinc-900">
                Pro Plan <span className="block text-zinc-500 text-sm font-medium">Agency &amp; Brand Power</span>
              </h3>

              <div className="mt-5 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                    {billingCycle === "monthly" ? "$24.99" : "$239.90"}
                  </span>
                  <div className="flex flex-col text-[11px] leading-tight font-semibold">
                    <span className="text-zinc-400 line-through">
                      {billingCycle === "monthly" ? "$49" : "$490"}
                    </span>
                    <span className="text-zinc-500 whitespace-nowrap">
                      {billingCycle === "monthly" ? "/ month" : "/ year"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-[#FF5500] whitespace-nowrap">
                    <Zap className="h-3.5 w-3.5 fill-current shrink-0" />
                    <span>1,000 Credits / mo</span>
                  </span>
                </div>
              </div>

              {/* Feature list */}
              <ul className="mt-8 space-y-3.5 border-t border-zinc-100 pt-6">
                {[
                  "1,000 AI Generation Credits every month",
                  "Maximum VIP Dedicated GPU cloud priority",
                  "Full commercial license & white-label ready",
                  "Batch AI virtual try-on processing",
                  "Direct access to all future beta & pro studio models",
                  "Priority 24/7 dedicated creator support",
                  "Stripe Customer Billing Portal & tax invoices",
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-700">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/sign-up?plan=pro"
                className="w-full flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] hover:from-[#E64C00] hover:to-[#FF6A00] text-xs font-bold text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer border-0 border-none outline-none ring-0 focus:outline-none"
              >
                Subscribe to Pro
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges under pricing */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 rounded-full border border-orange-200/80 bg-white px-4 py-2 text-xs font-medium text-zinc-700 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#FF5500]" />
            Results in seconds
          </div>

          <div className="flex items-center gap-2 rounded-full border border-orange-200/80 bg-white px-4 py-2 text-xs font-medium text-zinc-700 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#FF5500]" />
            Cancel anytime in 1 click
          </div>

          <div className="flex items-center gap-2 rounded-full border border-orange-200/80 bg-white px-4 py-2 text-xs font-medium text-zinc-700 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#FF5500]" />
            Encrypted &amp; Secured by Stripe
          </div>
        </div>
      </div>
    </section>
  );
}
