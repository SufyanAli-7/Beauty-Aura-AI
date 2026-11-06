"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { insforge } from "@/lib/insforge";
import { syncUserToDatabase } from "@/lib/auth-context";
import { syncAuthCookies } from "@/lib/auth-cookies";
import { CoolLoader } from "@/components/ui/cool-loader";
import { Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/landing/logo";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function handleAuth() {
      try {
        const code = searchParams.get("insforge_code");
        const oauthError = searchParams.get("error") || searchParams.get("insforge_error");

        if (oauthError) {
          setError(decodeURIComponent(oauthError));
          return;
        }

        if (code) {
          try {
            await insforge.auth.exchangeOAuthCode(code);
          } catch (exchangeErr: any) {
            console.warn("OAuth exchange note:", exchangeErr?.message);
          }
        }

        // Fetch authenticated user
        const { data, error: userError } = await insforge.auth.getCurrentUser();
        if (userError || !data?.user) {
          throw new Error(userError?.message || "Failed to retrieve your signed-in session.");
        }

        // Sync auth cookies for server and middleware route protection
        const token = (insforge.auth as any)?.tokenManager?.getAccessToken?.() || null;
        syncAuthCookies(token, data.user.id);

        // Save user details into public.users in InSForge database
        await syncUserToDatabase(data.user);

        if (active) {
          const redirectParam = searchParams.get("redirect");
          const target = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";
          router.replace(target);
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        if (active) {
          setError(err.message || "An unexpected error occurred during sign in.");
        }
      }
    }

    handleAuth();

    return () => {
      active = false;
    };
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFFDFB]">
        <div className="relative w-full max-w-md">
          {/* Wireframe offset decorations */}
          <div className="absolute inset-0 rounded-3xl border border-red-300/60 rotate-[2deg] translate-x-[6px] translate-y-[-6px] pointer-events-none" />
          <div className="relative rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-zinc-900">Authentication Failed</h2>
            <p className="mt-2 text-sm text-zinc-600">{error}</p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/sign-in"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-6 text-sm font-semibold text-white shadow-md shadow-orange-500/20"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFFDFB]">
      <div className="relative w-full max-w-md">
        {/* Wireframe offset decorations */}
        <div className="absolute inset-0 rounded-3xl border border-amber-300/60 rotate-[2.5deg] translate-x-[6px] translate-y-[-6px] pointer-events-none" />
        <div className="absolute inset-0 rounded-3xl border border-orange-200/70 rotate-[-2deg] translate-x-[-6px] translate-y-[6px] pointer-events-none" />

        <div className="relative rounded-3xl border border-orange-100 bg-white/95 backdrop-blur-xl p-8 sm:p-10 text-center shadow-2xl">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            {/* Spinning glowing gradient ring */}
            <div className="absolute inset-0 animate-spin rounded-full border-3 border-transparent border-t-[#FF5500] border-r-amber-400" />
            <Sparkles className="h-7 w-7 text-[#FF5500] animate-pulse" />
          </div>

          <h2 className="mt-6 text-xl font-bold text-zinc-900">Finalizing Your Sign-In</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Syncing your BeautyAura profile and opening your creative studio...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDFB]">
          <CoolLoader size="lg" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}

