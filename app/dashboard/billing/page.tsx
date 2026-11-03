"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Zap,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Receipt,
  Download,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function BillingPage() {
  const { user, profile } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const creditPacks = [
    {
      name: "Starter Pack",
      credits: 50,
      price: "$19",
      perCredit: "$0.38 / credit",
      badge: "One-Time",
      popular: false,
    },
    {
      name: "Creator Pack",
      credits: 200,
      price: "$49",
      perCredit: "$0.24 / credit",
      badge: "Best Value",
      popular: true,
    },
    {
      name: "Studio Pro Pack",
      credits: 600,
      price: "$119",
      perCredit: "$0.19 / credit",
      badge: "Bulk Savings",
      popular: false,
    },
  ];

  const plans = [
    {
      name: "Free Creator",
      price: "$0",
      cycle: "forever",
      description: "Ideal for testing AI tools and light personal edits.",
      current: true,
      features: [
        "5 Complimentary AI Transformations",
        "Standard 1080p Resolution",
        "Standard Processing Queue",
        "Access to all 5 AI Tool categories",
      ],
      cta: "Current Active Tier",
    },
    {
      name: "Pro Studio",
      price: billingCycle === "yearly" ? "$29" : "$39",
      cycle: "/ month",
      description: "For digital creators, models, stylists & beauty influencers.",
      current: false,
      popular: true,
      features: [
        "300 Monthly AI Credits (Rollover)",
        "4K Ultra-HD Lossless Export",
        "Priority VIP GPU Cloud Queue",
        "Custom Reference Face & Clothing Uploads",
        "Commercial Usage Rights",
        "No Watermarks",
      ],
      cta: "Upgrade to Pro Studio",
    },
    {
      name: "Agency & Enterprise",
      price: billingCycle === "yearly" ? "$89" : "$119",
      cycle: "/ month",
      description: "For fashion brands, e-commerce stores & photography agencies.",
      current: false,
      features: [
        "1,200 Monthly AI Credits",
        "8K Print-Ready Upscaling",
        "Batch Virtual Try-On API Access",
        "Dedicated Account Stylist",
        "White-label Client Delivery Links",
        "Custom Trained Aesthetic Models",
      ],
      cta: "Contact Enterprise",
    },
  ];

  const invoices = [
    {
      id: "INV-2026-001",
      date: "Nov 3, 2026",
      description: "Free Registration Bonus (5 Credits)",
      amount: "$0.00",
      status: "Settled",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Account &amp; Subscriptions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            Billing &amp; Credits Management
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage your transformation credits, subscription plans, and invoice history.
          </p>
        </div>
      </div>

      {/* 1. Current Credit Status Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-gradient-to-br from-orange-50 via-amber-50/60 to-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5500] to-[#FFA033] text-white shadow-md shadow-orange-500/25">
              <Zap className="h-7 w-7 fill-current" />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Available Studio Balance
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-zinc-900">
                  5 Credits
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  Active &amp; Ready
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Each transformation (Try-on, skin scan, makeup transfer, hair style) consumes 1 credit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#refill-packs"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 transition"
            >
              <Zap className="h-4 w-4" />
              <span>Purchase Extra Credits</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Top-Up Instant Credit Packs */}
      <div id="refill-packs" className="space-y-4">
        <div>
          <h3 className="text-lg font-black text-zinc-900">
            Instant Credit Top-Up Packs
          </h3>
          <p className="text-xs text-zinc-500">
            Never expire. Add on-demand credits to your account immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {creditPacks.map((pack) => (
            <div
              key={pack.name}
              className={`relative flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 ${
                pack.popular
                  ? "bg-white border-[#FF5500] shadow-md ring-2 ring-[#FF5500]/20"
                  : "bg-white border-orange-100 hover:border-orange-200 shadow-xs"
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                  {pack.badge}
                </div>
              )}

              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {pack.name}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-zinc-900">{pack.price}</span>
                  <span className="text-xs font-bold text-[#FF5500]">
                    {pack.credits} Credits
                  </span>
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  {pack.perCredit}
                </div>
              </div>

              <button
                type="button"
                className={`mt-5 w-full rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
                  pack.popular
                    ? "bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] text-white shadow-xs hover:opacity-95"
                    : "bg-orange-50 text-[#FF5500] hover:bg-orange-100"
                }`}
              >
                Top-Up {pack.credits} Credits
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Monthly / Yearly Membership Plans */}
      <div className="space-y-6 pt-4 border-t border-orange-100/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-zinc-900">
              Subscription Memberships
            </h3>
            <p className="text-xs text-zinc-500">
              Unlock unlimited priority GPU slots and high-definition commercial output.
            </p>
          </div>

          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex items-center rounded-full border border-orange-200 bg-white p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#FF5500] text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-[#FF5500] text-white"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <span>Yearly</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-3xl p-6 border transition-all duration-200 ${
                plan.popular
                  ? "bg-white border-[#FF5500] shadow-xl ring-2 ring-[#FF5500]/20"
                  : "bg-white border-orange-100 shadow-xs hover:border-orange-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 right-6 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FFA033] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-black text-zinc-900">{plan.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-zinc-900">
                    {plan.price}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">
                    {plan.cycle}
                  </span>
                </div>

                <div className="border-t border-orange-100/80 pt-4 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-2 text-xs text-zinc-600">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5500] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-orange-100/70">
                <button
                  type="button"
                  disabled={plan.current}
                  className={`w-full rounded-2xl py-3 text-xs sm:text-sm font-bold transition cursor-pointer ${
                    plan.current
                      ? "bg-stone-100 text-zinc-400 cursor-not-allowed"
                      : plan.popular
                      ? "bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] text-white shadow-md hover:opacity-95"
                      : "bg-stone-900 text-white hover:bg-zinc-800"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Invoices History Table */}
      <div className="space-y-4 pt-4 border-t border-orange-100/80">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-[#FF5500]" />
          <h3 className="text-base font-black text-zinc-900">Invoices &amp; Receipts</h3>
        </div>

        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/70 border-b border-orange-100/70 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Plan / Pack</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100/60 font-medium text-zinc-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-orange-50/40 transition">
                  <td className="py-3 px-4 font-bold text-zinc-900">{inv.id}</td>
                  <td className="py-3 px-4 text-zinc-500">{inv.date}</td>
                  <td className="py-3 px-4">{inv.description}</td>
                  <td className="py-3 px-4 font-bold text-zinc-900">{inv.amount}</td>
                  <td className="py-3 px-4">
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] hover:underline cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

