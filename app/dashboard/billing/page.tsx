"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  Zap,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Receipt,
  Download,
  ExternalLink,
  Loader2,
  Check,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Crown,
  Flame,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { insforge } from "@/lib/insforge";
import { CoolLoader } from "@/components/ui/cool-loader";

// Stripe Price IDs in InSForge test environment
const STRIPE_PRICES = {
  basic: "price_1UYlACGStzBzliwjjlyNVT1a", // $9.99/mo (450 credits)
  pro: "price_1UYlAiGStzBzliwj6mr56dFh",   // $24.99/mo (1,000 credits)
};

interface Transaction {
  id: string;
  plan: string;
  amount: string;
  currency: string;
  credits_allotted: number;
  status: string;
  created_at: string;
  stripe_session_id?: string;
  stripe_invoice_id?: string;
}

function BillingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, credits, refreshCredits, refreshUser } = useAuth();

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [canceledBanner, setCanceledBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const currentPlan = (profile?.plan || "free").toLowerCase();

  // 1. Fetch user billing status and transaction history
  const fetchBillingHistory = useCallback(async () => {
    if (!user?.id) return;
    try {
      setTransactionsLoading(true);
      const res = await fetch(`/api/billing/sync?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.transactions) {
          setTransactions(data.transactions);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch billing history:", e);
    } finally {
      setTransactionsLoading(false);
    }
  }, [user?.id]);

  // 2. Handle Stripe Checkout Return (success or cancel)
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const sessionId = searchParams.get("session_id");
    const planParam = searchParams.get("plan");

    if (canceled) {
      setCanceledBanner(true);
      window.history.replaceState({}, "", "/dashboard/billing");
      return;
    }

    if (success && user?.id) {
      const targetPlan = planParam || "basic";
      setSuccessBanner(targetPlan);

      setSyncing(true);
      fetch("/api/billing/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId || null,
          plan: targetPlan,
          userId: user.id,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.success) {
            await refreshCredits();
            await refreshUser();
            await fetchBillingHistory();
          }
        })
        .catch((err) => {
          console.error("Auto-sync error after Stripe redirect:", err);
        })
        .finally(() => {
          setSyncing(false);
          window.history.replaceState({}, "", "/dashboard/billing");
        });
    }
  }, [searchParams, user?.id, refreshCredits, refreshUser, fetchBillingHistory]);

  useEffect(() => {
    if (user?.id) {
      void fetchBillingHistory();
    }
  }, [user?.id, fetchBillingHistory]);

  // 3. Initiate Stripe Checkout Subscription
  const handleSubscribe = async (planKey: "basic" | "pro") => {
    if (!user?.id) {
      router.push("/sign-in?redirect=/dashboard/billing");
      return;
    }

    const priceId = STRIPE_PRICES[planKey];
    if (!priceId) return;

    setLoadingPlan(planKey);
    setErrorMessage(null);

    try {
      const origin = window.location.origin;
      const idempotencyKey = `user:${user.id}:${planKey}:${Date.now()}`;

      const { data, error } = await insforge.payments.stripe.createCheckoutSession("test", {
        mode: "subscription",
        lineItems: [{ priceId, quantity: 1 }],
        successUrl: `${origin}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}&success=true&plan=${planKey}`,
        cancelUrl: `${origin}/dashboard/billing?canceled=true`,
        subject: { type: "user", id: user.id },
        customerEmail: user.email || undefined,
        metadata: {
          plan: planKey,
          user_id: user.id,
        },
        idempotencyKey,
      });

      if (error) {
        console.error("Stripe Checkout Error:", error);
        setErrorMessage(
          error.message || "Failed to initialize Stripe checkout session. Please try again."
        );
        setLoadingPlan(null);
        return;
      }

      if (data?.checkoutSession?.url) {
        window.location.assign(data.checkoutSession.url);
      } else {
        throw new Error("Stripe checkout URL was not returned.");
      }
    } catch (err: any) {
      console.error("Subscription initiation failed:", err);
      setErrorMessage(err.message || "Failed to connect to Stripe checkout. Please try again.");
      setLoadingPlan(null);
    }
  };

  // 4. Open Stripe Customer Portal
  const handleOpenCustomerPortal = async () => {
    if (!user?.id) return;

    if (currentPlan === "free" && !profile?.stripe_customer_id) {
      setErrorMessage(
        "You are currently on the Free Creator plan. Upgrade to the Basic or Pro plan to access subscription management, automated invoices, and payment method settings."
      );
      return;
    }

    setPortalLoading(true);
    setErrorMessage(null);

    try {
      const origin = window.location.origin;
      const { data, error } = await insforge.payments.stripe.createCustomerPortalSession("test", {
        subject: { type: "user", id: user.id },
        returnUrl: `${origin}/dashboard/billing`,
      });

      if (error) {
        console.error("Customer Portal Error:", error);
        if ((error as any).statusCode === 404 || error.message?.includes("not found")) {
          setErrorMessage(
            "No active Stripe subscription or customer record found yet. Please subscribe to a paid plan first to manage billing details."
          );
        } else {
          setErrorMessage(error.message || "Could not open Stripe Billing Portal.");
        }
        setPortalLoading(false);
        return;
      }

      if (data?.customerPortalSession?.url) {
        window.location.assign(data.customerPortalSession.url);
      } else {
        throw new Error("Stripe Customer Portal URL was not returned.");
      }
    } catch (err: any) {
      console.error("Customer portal redirect error:", err);
      setErrorMessage(
        err.message || "Unable to open Stripe Customer Portal. Please try again shortly."
      );
      setPortalLoading(false);
    }
  };

  const scrollToInvoices = () => {
    const el = document.getElementById("invoices-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Stripe Payments &amp; Subscriptions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">
            Billing &amp; Subscription Plans
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Upgrade your studio tier, refill AI generation credits, and manage your Stripe subscription.
          </p>
        </div>

        {/* Top Header Stripe Portal CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleOpenCustomerPortal}
            disabled={portalLoading}
            className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-zinc-800 shadow-2xs hover:bg-orange-50/80 hover:border-orange-300 transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
            title="Manage payment method, view invoices, or cancel subscription"
          >
            {portalLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#FF5500] shrink-0" />
            ) : (
              <ExternalLink className="h-4 w-4 text-[#FF5500] shrink-0" />
            )}
            <span className="whitespace-nowrap">Manage Stripe Portal</span>
          </button>
        </div>
      </div>

      {/* 2. Success / Canceled / Error Alerts */}
      {successBanner && (
        <div className="relative overflow-hidden rounded-3xl border border-emerald-300/80 bg-gradient-to-r from-emerald-50 via-teal-50/80 to-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
              <Check className="h-5 w-5 stroke-[3]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-emerald-950">
                  Payment Succeeded! Welcome to the {successBanner === "pro" ? "Pro Plan" : "Basic Plan"}
                </h4>
                {syncing && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Allocating Credits...
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-800/90 mt-1">
                Your monthly subscription has been activated via Stripe.{" "}
                <span className="font-bold">
                  {successBanner === "pro" ? "+1,000 credits" : "+450 credits"}
                </span>{" "}
                have been added to your studio balance.
              </p>
            </div>
            <button
              onClick={() => setSuccessBanner(null)}
              className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {canceledBanner && (
        <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-amber-50/60 p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-900 font-medium">
                Stripe checkout was canceled. No charges were made to your payment method. You can choose a plan whenever you are ready.
              </p>
            </div>
            <button
              onClick={() => setCanceledBanner(false)}
              className="text-amber-700 hover:text-amber-950 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="relative overflow-hidden rounded-3xl border border-rose-200 bg-rose-50/80 p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <p className="text-xs text-rose-900 font-medium">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-700 hover:text-rose-950 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 3. Current User Credits & Active Tier Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-gradient-to-br from-orange-50 via-amber-50/60 to-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5 min-w-0">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5500] to-[#FFA033] text-white shadow-md shadow-orange-500/25">
              <Zap className="h-7 w-7 sm:h-8 sm:w-8 fill-current" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 whitespace-nowrap">
                  Available Studio Balance
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live &amp; Ready
                </span>
              </div>

              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                  {credits}
                </span>
                <span className="text-sm font-bold text-[#FF5500]">
                  Credits Available
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-zinc-500">
                <span className="whitespace-nowrap">
                  Current Subscription:{" "}
                  <strong className="text-zinc-900 font-extrabold capitalize">
                    {currentPlan} Plan
                  </strong>
                </span>
                <span>•</span>
                <span className="whitespace-nowrap">Each AI generation consumes 5 credits</span>
                {profile?.plan_period_end && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-zinc-600 whitespace-nowrap">
                      <Clock className="h-3 w-3 text-orange-500 shrink-0" />
                      Renews: {new Date(profile.plan_period_end).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: strictly on 1 line with whitespace-nowrap shrink-0 */}
          <div className="flex flex-row items-center gap-2.5 sm:gap-3 shrink-0 self-start lg:self-auto">
            <button
              type="button"
              onClick={scrollToInvoices}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-orange-200/90 px-4 py-2.5 text-xs sm:text-sm font-bold text-zinc-800 shadow-2xs hover:bg-orange-50 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              <Receipt className="h-4 w-4 text-[#FF5500] shrink-0" />
              <span className="whitespace-nowrap">Billing History</span>
            </button>

            {currentPlan === "free" ? (
              <a
                href="#subscription-plans"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:opacity-95 transition whitespace-nowrap shrink-0"
              >
                <Sparkles className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Upgrade Plan</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={handleOpenCustomerPortal}
                disabled={portalLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:opacity-95 transition cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Manage via Stripe</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Three Subscription Plans Grid (Landing Page Style & Hierarchy) */}
      <div id="subscription-plans" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5500]">
              <Crown className="h-3.5 w-3.5" />
              <span>Monthly Recurring Memberships</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 mt-1">
              Select Your Studio Tier
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Powered by Stripe. Recurring monthly billing, automatic credit allocation, and cancel anytime in 1 click.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/50 px-3.5 py-1.5 text-xs font-bold text-zinc-700 shrink-0 self-start sm:self-auto">
            <ShieldCheck className="h-4 w-4 text-[#FF5500]" />
            <span>256-Bit SSL Encrypted by Stripe</span>
          </div>
        </div>

        {/* 3 Pricing Cards Grid matching Landing Page Structure */}
        <div className="grid grid-cols-1 items-stretch gap-6 xl:gap-8 lg:grid-cols-3 max-w-6xl mx-auto pt-2">
          {/* CARD 1: Free Creator */}
          <div
            className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 sm:p-7 xl:p-8 shadow-lg shadow-orange-900/5 transition-transform hover:-translate-y-1.5 duration-300 ${
              currentPlan === "free"
                ? "border-emerald-500 ring-2 ring-emerald-500/80 shadow-emerald-500/10"
                : "border-orange-200/80"
            }`}
          >
            {/* Top Badge Row */}
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5500]">
                <Sparkles className="h-5 w-5" />
              </div>
              {currentPlan === "free" ? (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  YOUR ACTIVE PLAN
                </span>
              ) : (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#FF5500] uppercase tracking-wider">
                  FREE TIER
                </span>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold text-zinc-900">
                Free Creator{" "}
                <span className="block text-zinc-500 text-sm font-medium">
                  Starter Exploration
                </span>
              </h3>

              <div className="mt-5 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">$0</span>
                  <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap">/ forever</span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-[#FF5500] whitespace-nowrap">
                    <Zap className="h-3.5 w-3.5 fill-current shrink-0" />
                    <span>50 Free Credits</span>
                  </span>
                </div>
              </div>

              {/* Feature list with Landing-page style circular dark checkmarks */}
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
              {currentPlan === "free" ? (
                <button
                  type="button"
                  disabled
                  className="w-full flex h-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold cursor-default gap-1.5"
                >
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Current Active Tier</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenCustomerPortal}
                  disabled={portalLoading}
                  className="w-full flex h-11 items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-zinc-700 text-xs font-bold transition-all cursor-pointer border-0 outline-none"
                >
                  <span>Downgrade via Stripe</span>
                </button>
              )}
            </div>
          </div>

          {/* CARD 2: Basic Plan (Featured Solid Orange Card - Center, Landing Page Masterpiece) */}
          <div
            className={`relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#FF5500] via-[#FF6600] to-[#FF771C] p-6 sm:p-7 xl:p-8 text-white shadow-2xl shadow-orange-600/30 lg:-translate-y-4 lg:py-10 transition-transform hover:-translate-y-5 duration-300 ${
              currentPlan === "basic" ? "ring-4 ring-white/80" : ""
            }`}
          >
            {/* Top Badge Row */}
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                <Flame className="h-5 w-5 fill-white" />
              </div>
              {currentPlan === "basic" ? (
                <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 uppercase tracking-wider shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  YOUR ACTIVE PLAN
                </span>
              ) : (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#FF5500] uppercase tracking-wider shadow-sm">
                  MOST POPULAR
                </span>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-bold text-white">
                Basic Plan{" "}
                <span className="block text-orange-100 text-sm font-medium">
                  Daily Creator Studio
                </span>
              </h3>

              <div className="mt-5 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">$9.99</span>
                  <div className="flex flex-col text-[11px] leading-tight font-semibold">
                    <span className="text-orange-200 line-through">$19</span>
                    <span className="text-orange-100 whitespace-nowrap">/ month</span>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white shadow-xs whitespace-nowrap">
                    <Zap className="h-3.5 w-3.5 fill-white shrink-0" />
                    <span>450 Credits / mo</span>
                  </span>
                </div>
              </div>

              {/* Feature list with White circular checkmarks */}
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
              {currentPlan === "basic" ? (
                <button
                  type="button"
                  disabled
                  className="w-full flex h-12 items-center justify-center rounded-full bg-white/95 text-xs font-bold text-emerald-700 shadow-md cursor-default gap-1.5"
                >
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Current Active Tier</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubscribe("basic")}
                  disabled={loadingPlan !== null}
                  className="w-full flex h-12 items-center justify-center rounded-full bg-white text-xs font-bold text-[#FF5500] shadow-lg shadow-black/10 hover:bg-orange-50 transition-colors cursor-pointer disabled:opacity-50 gap-1.5"
                >
                  {loadingPlan === "basic" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[#FF5500]" />
                      <span>Connecting Stripe...</span>
                    </>
                  ) : (
                    <>
                      <span>{currentPlan === "pro" ? "Switch to Basic" : "Subscribe to Basic"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* CARD 3: Pro Plan */}
          <div
            className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 sm:p-7 xl:p-8 shadow-lg shadow-orange-900/5 transition-transform hover:-translate-y-1.5 duration-300 ${
              currentPlan === "pro"
                ? "border-emerald-500 ring-2 ring-emerald-500/80 shadow-emerald-500/10"
                : "border-orange-200/80"
            }`}
          >
            {/* Top Badge Row */}
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF5500]">
                <Crown className="h-5 w-5" />
              </div>
              {currentPlan === "pro" ? (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  YOUR ACTIVE PLAN
                </span>
              ) : (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#FF5500] uppercase tracking-wider">
                  PRO POWER
                </span>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold text-zinc-900">
                Pro Plan{" "}
                <span className="block text-zinc-500 text-sm font-medium">
                  Agency &amp; Brand Power
                </span>
              </h3>

              <div className="mt-5 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">$24.99</span>
                  <div className="flex flex-col text-[11px] leading-tight font-semibold">
                    <span className="text-zinc-400 line-through">$49</span>
                    <span className="text-zinc-500 whitespace-nowrap">/ month</span>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-[#FF5500] whitespace-nowrap">
                    <Zap className="h-3.5 w-3.5 fill-current shrink-0" />
                    <span>1,000 Credits / mo</span>
                  </span>
                </div>
              </div>

              {/* Feature list with Landing-page style circular dark checkmarks */}
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
              {currentPlan === "pro" ? (
                <button
                  type="button"
                  disabled
                  className="w-full flex h-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold cursor-default gap-1.5"
                >
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Current Active Tier</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubscribe("pro")}
                  disabled={loadingPlan !== null}
                  className="w-full flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] hover:from-[#E64C00] hover:to-[#FF6A00] text-xs font-bold text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50 gap-1.5"
                >
                  {loadingPlan === "pro" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Connecting Stripe...</span>
                    </>
                  ) : (
                    <>
                      <span>Upgrade to Pro</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Invoices & Transaction History (Fully Mobile Responsive Dual View) */}
      <div id="invoices-section" className="space-y-4 pt-6 border-t border-orange-100/80 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-[#FF5500]" />
            <h3 className="text-base sm:text-lg font-black text-zinc-900">
              Invoices &amp; Payment History
            </h3>
          </div>
          <button
            type="button"
            onClick={fetchBillingHistory}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-[#FF5500] transition self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#FF5500]" />
            <span>Refresh History</span>
          </button>
        </div>

        {/* MOBILE VIEW: Stacked Responsive Cards (< md) */}
        <div className="block md:hidden space-y-3">
          {transactionsLoading ? (
            <div className="rounded-2xl border border-orange-100 bg-white p-6 text-center text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#FF5500] mb-2" />
              <span className="text-xs">Loading billing history...</span>
            </div>
          ) : transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-2xl border border-orange-100 bg-white p-4 shadow-2xs space-y-3"
              >
                {/* Header: Date + Status */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-medium">
                    {new Date(tx.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold capitalize">
                    {tx.status || "completed"}
                  </span>
                </div>

                {/* Plan + Price */}
                <div className="flex items-center justify-between border-t border-orange-50 pt-2.5">
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 capitalize">
                      {tx.plan} Subscription
                    </h4>
                    <span className="text-xs font-bold text-[#FF5500]">
                      +{tx.credits_allotted} Credits Allotted
                    </span>
                  </div>
                  <span className="text-base font-black text-zinc-900">
                    {tx.amount || (tx.plan === "pro" ? "$24.99" : "$9.99")}
                  </span>
                </div>

                {/* Download PDF Action */}
                <div className="border-t border-orange-50 pt-2.5">
                  <button
                    type="button"
                    onClick={handleOpenCustomerPortal}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-orange-200/90 bg-orange-50/50 py-2 text-xs font-bold text-[#FF5500] hover:bg-orange-100/70 transition cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Stripe PDF Receipt</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-orange-100 bg-white p-6 text-center text-xs text-zinc-400">
              No transactions yet. Free account bonuses and Stripe subscription payments will be listed here.
            </div>
          )}
        </div>

        {/* DESKTOP / TABLET VIEW: Full Data Table with Horizontal Scroll (>= md) */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-xs">
              <thead className="bg-stone-50/70 border-b border-orange-100/70 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Plan / Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Credits Allotted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt / Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100/60 font-medium text-zinc-700">
                {transactionsLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#FF5500] mb-1" />
                      <span>Loading billing history...</span>
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-orange-50/40 transition">
                      <td className="py-3.5 px-4 text-zinc-500 whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-zinc-900 capitalize whitespace-nowrap">
                        {tx.plan} Subscription
                      </td>
                      <td className="py-3.5 px-4 font-black text-zinc-900 whitespace-nowrap">
                        {tx.amount || (tx.plan === "pro" ? "$24.99" : "$9.99")}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#FF5500] whitespace-nowrap">
                        +{tx.credits_allotted} Credits
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold capitalize">
                          {tx.status || "completed"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={handleOpenCustomerPortal}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5500] hover:underline cursor-pointer"
                          title="Download Stripe PDF receipt"
                        >
                          <Download className="h-3 w-3" />
                          <span>Stripe PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 px-4 text-center text-zinc-400">
                      No transactions yet. Free account bonuses and Stripe subscription payments will be listed here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. Frequently Asked Questions */}
      <div className="space-y-4 pt-6 border-t border-orange-100/80">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#FF5500]" />
          <h3 className="text-base font-black text-zinc-900">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-2xs space-y-1.5">
            <h5 className="text-xs font-bold text-zinc-900">
              How do monthly subscription credits work?
            </h5>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Upon subscribing to Basic (450 credits) or Pro (1,000 credits), credits are added to your balance immediately. They automatically renew every month on your billing date.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-2xs space-y-1.5">
            <h5 className="text-xs font-bold text-zinc-900">
              Can I cancel or change my plan anytime?
            </h5>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time using the Stripe Customer Portal with just one click. No questions asked.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-2xs space-y-1.5">
            <h5 className="text-xs font-bold text-zinc-900">
              How much does each AI makeover cost?
            </h5>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Each AI makeover generation (virtual try-on, smile enhancement, hairstyle transfer, object removal, or body contouring) costs 5 credits.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-2xs space-y-1.5">
            <h5 className="text-xs font-bold text-zinc-900">
              Is payment processing secure?
            </h5>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Yes. All transactions are securely processed directly by Stripe with 256-bit SSL encryption. We never see or store your payment card numbers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 w-full items-center justify-center">
          <CoolLoader size="lg" />
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}
