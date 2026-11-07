"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/landing/logo";
import { CoolLoader } from "@/components/ui/cool-loader";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, sendResetPasswordEmail, exchangeResetPasswordToken, resetPassword } = useAuth();

  // URL query parameters from magic link / redirects
  const urlToken = searchParams.get("token") || "";
  const insforgeStatus = searchParams.get("insforge_status");
  const insforgeError = searchParams.get("insforge_error");
  const queryEmail = searchParams.get("email") || "";

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // Determine initial mode:
  // If a magic link token is present and valid, direct token mode
  // Otherwise, code + email mode
  const [token, setToken] = useState<string>(urlToken);
  const [email, setEmail] = useState<string>(queryEmail);
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    insforgeStatus === "error" ? insforgeError || "This password reset link has expired or is invalid." : null
  );

  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if search params change
  useEffect(() => {
    if (urlToken) setToken(urlToken);
    if (queryEmail) setEmail(queryEmail);
    if (insforgeStatus === "error") {
      setErrorMessage(insforgeError || "This password reset link has expired or is invalid.");
    }
  }, [urlToken, queryEmail, insforgeStatus, insforgeError]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Resend code handler (in case token is missing or expired)
  const handleResend = async () => {
    if (!email.trim() || resendCooldown > 0 || isLoading) return;
    setErrorMessage(null);
    setResendNotice(null);
    setIsLoading(true);

    try {
      const { error } = await sendResetPasswordEmail(email.trim());
      if (error) {
        setErrorMessage(error.message || "Failed to resend recovery code.");
      } else {
        setResendCooldown(60);
        setResendNotice("A fresh 6-digit recovery code has been sent to your email.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while resending code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both fields.");
      return;
    }

    setIsLoading(true);
    try {
      let activeOtpToken = token;

      // If we don't have a direct token from email link, exchange code first
      if (!activeOtpToken) {
        const cleanEmail = email.trim();
        const cleanCode = code.trim();

        if (!cleanEmail) {
          setErrorMessage("Please enter your registered email address.");
          setIsLoading(false);
          return;
        }

        if (cleanCode.length < 6) {
          setErrorMessage("Please enter the complete 6-digit recovery code.");
          setIsLoading(false);
          return;
        }

        const { data: exchangeData, error: exchangeError } = await exchangeResetPasswordToken(cleanEmail, cleanCode);
        if (exchangeError) {
          setErrorMessage(exchangeError.message || "Invalid or expired recovery code. Please try again.");
          setIsLoading(false);
          return;
        }

        if (!exchangeData?.token) {
          setErrorMessage("Unable to verify reset code. Please request a new code.");
          setIsLoading(false);
          return;
        }

        activeOtpToken = exchangeData.token;
      }

      // Reset password using the verified token
      const { error: resetError } = await resetPassword(newPassword, activeOtpToken);
      if (resetError) {
        setErrorMessage(resetError.message || "Failed to reset password. The link or code may have expired.");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      redirectTimerRef.current = setTimeout(() => {
        router.push("/sign-in");
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while resetting password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FFFDFB] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-orange-400/10 via-amber-200/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-200/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Brand Nav */}
      <div className="relative mx-auto w-full max-w-md flex justify-center mb-6">
        <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
          <Logo />
        </Link>
      </div>

      <div className="relative mx-auto w-full max-w-md">
        {/* Background offset sketchbook wireframes */}
        <div className="absolute inset-0 rounded-3xl border border-amber-300/60 rotate-[2.5deg] translate-x-[8px] translate-y-[-6px] pointer-events-none transition-transform" />
        <div className="absolute inset-0 rounded-3xl border border-orange-200/70 rotate-[-2deg] translate-x-[-6px] translate-y-[8px] pointer-events-none transition-transform" />

        {/* Main Card */}
        <div className="relative rounded-3xl border border-orange-100 bg-white/95 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-orange-950/5">
          {/* Header */}
          <div className="text-center">
            <span className="font-script text-3xl font-bold text-[#FF5500]">
              {isSuccess ? "Success" : "Secure Recovery"}
            </span>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
              {isSuccess ? "Password Reset Complete" : "Choose New Password"}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              {isSuccess
                ? "Your password has been successfully updated. Directing you to sign in..."
                : token
                ? "Your reset link has been verified. Enter your new password below."
                : "Enter your recovery code and set your new account password."}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-700 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <div className="flex-1">
                <div>{errorMessage}</div>
                {insforgeStatus === "error" && (
                  <Link
                    href="/forgot-password"
                    className="mt-2 inline-block font-semibold text-[#FF5500] hover:underline"
                  >
                    Request a new recovery link &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Resend Notice */}
          {resendNotice && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-800 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{resendNotice}</span>
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* If no token in URL, prompt for email and 6-digit code */}
              {!token && (
                <>
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        className="block w-full rounded-2xl border border-zinc-200 bg-orange-50/20 pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF5500] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* 6-Digit OTP Code */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-zinc-700">6-Digit Recovery Code</label>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={!email.trim() || resendCooldown > 0 || isLoading}
                        className="text-[11px] font-semibold text-[#FF5500] hover:underline disabled:text-zinc-400 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
                      >
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                      </button>
                    </div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        required
                        autoComplete="one-time-code"
                        className="block w-full tracking-[0.3em] font-mono font-bold rounded-2xl border border-zinc-200 bg-orange-50/20 pl-10 pr-4 py-2.5 text-base text-zinc-900 placeholder:text-zinc-300 focus:border-[#FF5500] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-center"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* New Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-700">New Password</label>
                  <span className="text-[11px] text-zinc-400">Min. 6 characters</span>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="block w-full rounded-2xl border border-zinc-200 bg-orange-50/20 pl-10 pr-10 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF5500] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="block w-full rounded-2xl border border-zinc-200 bg-orange-50/20 pl-10 pr-10 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF5500] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || newPassword.length < 6 || (!token && (code.length < 6 || !email.trim()))}
                className="w-full flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] hover:from-[#E64C00] hover:to-[#FF6A00] text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all cursor-pointer border-0 border-none outline-none ring-0 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Reset Password &amp; Continue</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success confirmation */
            <div className="mt-6 text-center space-y-5 animate-in fade-in duration-300">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-600/10">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Your password was updated!</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Redirecting you to the sign-in page in a moment...
                </p>
              </div>
              <Link
                href="/sign-in"
                className="w-full flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] hover:from-[#E64C00] hover:to-[#FF6A00] text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all"
              >
                <span>Sign in now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Footer Card Navigation */}
          {!isSuccess && (
            <div className="mt-8 border-t border-orange-100 pt-5 text-center flex items-center justify-between text-xs text-zinc-600">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-1 font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign in
              </Link>
              <Link
                href="/forgot-password"
                className="font-bold text-[#FF5500] hover:text-[#E64C00] hover:underline transition-colors"
              >
                Request new code
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDFB]">
          <CoolLoader size="lg" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

