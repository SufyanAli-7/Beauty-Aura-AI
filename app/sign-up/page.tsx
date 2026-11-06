"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, syncUserToDatabase } from "@/lib/auth-context";
import { Logo } from "@/components/landing/logo";
import { CoolLoader } from "@/components/ui/cool-loader";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  ShieldCheck,
  Loader2,
} from "lucide-react";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, signUpWithEmail, signInWithGoogle, verifyEmailOtp, resendVerification } = useAuth();

  const redirectParam = searchParams.get("redirect");
  const targetDestination = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";

  // Step 1: Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 2: Verification OTP state
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset all state on mount and unmount to prevent state retention across client-side navigations
  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setOtpCode("");
    setIsSuccess(false);
    setIsVerificationStep(false);
    setErrorMessage(null);
    setIsLoading(false);
    setIsVerifyingOtp(false);
    setResendCooldown(0);
    setResendSuccess(false);

    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      setIsSuccess(false);
      setIsVerificationStep(false);
      setName("");
      setEmail("");
      setPassword("");
      setOtpCode("");
    };
  }, []);

  // If user is already logged in (and not during newly completed signup animation), redirect to dashboard
  useEffect(() => {
    if (!loading && user && !isSuccess) {
      router.replace(targetDestination);
    }
  }, [user, loading, isSuccess, router, targetDestination]);

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signUpWithEmail(email.trim(), password, name.trim());

      if (error) {
        setErrorMessage(error.message || "Failed to create account. Please try again.");
        return;
      }

      // Check if email verification is required by InSForge backend
      if (data?.requireEmailVerification) {
        setIsVerificationStep(true);
      } else if (data?.user) {
        // User created and signed in immediately
        await syncUserToDatabase(data.user, name.trim());
        setIsSuccess(true);
        redirectTimerRef.current = setTimeout(() => {
          setIsSuccess(false);
          setIsVerificationStep(false);
          setName("");
          setEmail("");
          setPassword("");
          router.push(targetDestination);
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during account creation.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth Sign In
  const handleGoogleSignUp = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google Sign-In failed:", err);
      setErrorMessage(err.message || "Failed to initiate Google registration.");
      setIsGoogleLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otpCode.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const { data, error } = await verifyEmailOtp(email.trim(), otpCode.trim(), name.trim());

      if (error) {
        setErrorMessage(error.message || "Invalid or expired verification code.");
        return;
      }

      if (data?.user) {
        // Save user details into public.users in InSForge database
        await syncUserToDatabase(data.user, name.trim());
        setIsSuccess(true);
        redirectTimerRef.current = setTimeout(() => {
          setIsSuccess(false);
          setIsVerificationStep(false);
          setName("");
          setEmail("");
          setPassword("");
          setOtpCode("");
          router.push(targetDestination);
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Resend OTP Code
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    try {
      setErrorMessage(null);
      await resendVerification(email.trim());
      setResendSuccess(true);
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend code.");
    }
  };

  // Prevent flash of form if user is already authenticated
  if (!loading && user && !isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFFDFB]">
        <CoolLoader size="lg" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FFFDFB] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-orange-400/10 via-amber-200/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-200/10 rounded-full blur-2xl pointer-events-none" />

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
              Start Your Makeover
            </span>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Get instant access to AI Virtual Try-On, Hairstyles &amp; Creative Studio.
            </p>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="mt-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-orange-50 border border-orange-200 text-center animate-in zoom-in-95 duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Account Created &amp; Verified!</h3>
              <p className="mt-1 text-xs text-zinc-600">
                Saving your studio profile in the database and redirecting...
              </p>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && !isSuccess && (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-700 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Resend success notice */}
          {resendSuccess && !isSuccess && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-800 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>A fresh verification code was sent to your inbox.</span>
            </div>
          )}

          {!isSuccess && !isVerificationStep && (
            <div className="mt-6 space-y-6">
              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading || isLoading}
                className="group relative flex w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 shadow-xs hover:bg-orange-50/50 hover:border-orange-300 hover:text-zinc-900 transition-all cursor-pointer disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-[#FF5500]" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign up with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-orange-100" />
                <span className="absolute bg-white px-3 text-xs uppercase tracking-wider text-zinc-400 font-medium">
                  or register with email
                </span>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} autoComplete="off" className="space-y-4">
                {/* Name field */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Full name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sophia Taylor"
                      required
                      autoComplete="name"
                      className="block w-full rounded-2xl border border-zinc-200 bg-orange-50/20 pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF5500] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Email field */}
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
                      placeholder="sophia@example.com"
                      required
                      autoComplete="email"
                      className="block w-full rounded-2xl border border-zinc-200 bg-orange-50/20 pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF5500] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-zinc-700">Password</label>
                    <span className="text-[11px] text-zinc-400">Min. 6 characters</span>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] hover:from-[#E64C00] hover:to-[#FF6A00] text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all cursor-pointer border-0 border-none outline-none ring-0 disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: OTP Verification Mode */}
          {!isSuccess && isVerificationStep && (
            <form onSubmit={handleVerifyOtp} autoComplete="off" className="mt-6 space-y-5 animate-in fade-in duration-300">
              <div className="rounded-2xl border border-orange-200 bg-orange-50/80 p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-[#FF5500] mb-2">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900">Verification Code Sent</h3>
                <p className="mt-1 text-xs text-zinc-600">
                  We sent a 6-digit confirmation code to:
                  <br />
                  <strong className="text-zinc-900 text-sm">{email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  required
                  autoFocus
                  autoComplete="one-time-code"
                  className="block w-full text-center tracking-[0.4em] font-mono text-2xl font-bold rounded-2xl border border-zinc-200 bg-orange-50/20 py-3 text-zinc-900 placeholder:text-zinc-300 focus:border-[#FF5500] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp || otpCode.length < 6}
                className="w-full flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] hover:from-[#E64C00] hover:to-[#FF6A00] text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all cursor-pointer border-0 border-none outline-none ring-0 disabled:opacity-60"
              >
                {isVerifyingOtp ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Verify &amp; Launch Studio</span>
                    <Sparkles className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setIsVerificationStep(false)}
                  className="text-zinc-500 hover:text-zinc-800 cursor-pointer"
                >
                  ← Edit email
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                  className="flex items-center gap-1 font-semibold text-[#FF5500] hover:text-[#E64C00] cursor-pointer disabled:text-zinc-400"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer Card Navigation */}
          <div className="mt-8 border-t border-orange-100 pt-5 text-center">
            <p className="text-xs text-zinc-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-bold text-[#FF5500] hover:text-[#E64C00] hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDFB]">
          <CoolLoader size="lg" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
