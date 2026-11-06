"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { insforge } from "@/lib/insforge";
import { syncAuthCookies } from "@/lib/auth-cookies";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  credits?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  credits: number;
  loading: boolean;
  setCredits: (newCredits: number) => void;
  refreshCredits: () => Promise<number>;
  signInWithEmail: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ data?: any; error?: any }>;
  verifyEmailOtp: (email: string, otp: string, name?: string) => Promise<{ data?: any; error?: any }>;
  resendVerification: (email: string) => Promise<{ data?: any; error?: any }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  credits: 50,
  loading: true,
  setCredits: () => {},
  refreshCredits: async () => 50,
  signInWithEmail: async () => ({ error: new Error("AuthContext not initialized") }),
  signUpWithEmail: async () => ({ error: new Error("AuthContext not initialized") }),
  verifyEmailOtp: async () => ({ error: new Error("AuthContext not initialized") }),
  resendVerification: async () => ({ error: new Error("AuthContext not initialized") }),
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
});

/**
 * Ensures user information is saved in public.users table in InsForge database.
 * Assigns 50 free credits to new users upon signup.
 */
export async function syncUserToDatabase(
  user: { id: string; email?: string | null; name?: string | null; profile?: any },
  fallbackName?: string
): Promise<UserProfile | null> {
  if (!user || !user.id) return null;

  try {
    const displayName =
      user.name ||
      user.profile?.name ||
      user.profile?.full_name ||
      fallbackName ||
      (user.email ? user.email.split("@")[0] : "") ||
      "Beauty Creator";

    const avatarUrl =
      user.profile?.avatar_url ||
      user.profile?.picture ||
      "";

    // 1. Check if user already exists
    const { data: existingUser } = await insforge.database
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (existingUser) {
      // If credits or name needs update
      let updates: any = {};
      if (!existingUser.name && displayName) {
        updates.name = displayName;
      }
      if (existingUser.credits == null) {
        updates.credits = 50;
      }
      if (avatarUrl && !existingUser.avatar_url) {
        updates.avatar_url = avatarUrl;
      }

      if (Object.keys(updates).length > 0) {
        const { data: updated } = await insforge.database
          .from("users")
          .update(updates)
          .eq("id", user.id)
          .select()
          .maybeSingle();
        return updated || existingUser;
      }
      return existingUser;
    }

    // 2. Insert new user into public.users with 50 default credits
    const { data: inserted, error: insertErr } = await insforge.database
      .from("users")
      .insert([
        {
          id: user.id,
          email: user.email || "",
          name: displayName,
          avatar_url: avatarUrl,
          credits: 50,
        },
      ])
      .select()
      .maybeSingle();

    if (insertErr) {
      console.warn("User insert notice (handled by DB trigger or concurrent sync):", insertErr.message);
      // Re-query in case DB trigger inserted first
      const { data: rechecked } = await insforge.database
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      return rechecked;
    }

    return inserted;
  } catch (err) {
    console.error("Failed to sync user to database:", err);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [credits, setCreditsState] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(true);

  const setCredits = useCallback((newCredits: number) => {
    setCreditsState(newCredits);
    setProfile((prev) => (prev ? { ...prev, credits: newCredits } : null));
  }, []);

  const refreshCredits = useCallback(async (): Promise<number> => {
    if (!user?.id) return credits;
    try {
      const res = await fetch(`/api/user/credits?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data.credits === "number") {
          setCredits(data.credits);
          return data.credits;
        }
      }
    } catch (e) {
      console.warn("Failed to refresh credits:", e);
    }
    return credits;
  }, [user?.id, credits, setCredits]);

  // Hydrate user from current session
  const hydrateAuth = useCallback(async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error || !data?.user) {
        setUser(null);
        setProfile(null);
        setCreditsState(50);
        syncAuthCookies(null, null);
      } else {
        setUser(data.user);
        const token = (insforge.auth as any)?.tokenManager?.getAccessToken?.() || null;
        syncAuthCookies(token, data.user.id);
        // Sync & fetch user profile from public.users table
        const userProfile = await syncUserToDatabase(data.user);
        setProfile(userProfile);
        if (userProfile?.credits != null) {
          setCreditsState(userProfile.credits);
        }
      }
    } catch (e) {
      console.error("Auth hydration error:", e);
      setUser(null);
      setProfile(null);
      setCreditsState(50);
      syncAuthCookies(null, null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (cancelled) return;
      await hydrateAuth();
    }

    void init();

    // Subscribe to auth state changes
    const unsubscribe = insforge.auth.onAuthStateChange(async () => {
      if (!cancelled) {
        await hydrateAuth();
      }
    });

    return () => {
      cancelled = true;
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [hydrateAuth]);

  // Sign In with Email & Password
  const signInWithEmail = async (email: string, password: string) => {
    const res = await insforge.auth.signInWithPassword({
      email,
      password,
    });

    if (res.data?.user) {
      setUser(res.data.user);
      syncAuthCookies(res.data.accessToken || null, res.data.user.id);
      const userProfile = await syncUserToDatabase(res.data.user);
      setProfile(userProfile);
      if (userProfile?.credits != null) {
        setCreditsState(userProfile.credits);
      }
    }

    return res;
  };

  // Sign Up with Email, Password & Name
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const res = await insforge.auth.signUp({
      email,
      password,
      name,
      redirectTo: `${origin}/sign-in`,
    });

    if (res.data?.user && !res.data?.requireEmailVerification) {
      setUser(res.data.user);
      syncAuthCookies(res.data.accessToken || null, res.data.user.id);
      const userProfile = await syncUserToDatabase(res.data.user, name);
      setProfile(userProfile);
      setCreditsState(50);
    }

    return res;
  };

  // Verify Email OTP Code
  const verifyEmailOtp = async (email: string, otp: string, name?: string) => {
    const res = await insforge.auth.verifyEmail({
      email,
      otp,
    });

    if (res.data?.user) {
      setUser(res.data.user);
      syncAuthCookies(res.data.accessToken || null, res.data.user.id);
      const userProfile = await syncUserToDatabase(res.data.user, name);
      setProfile(userProfile);
      setCreditsState(50);
    }

    return res;
  };

  // Resend verification email
  const resendVerification = async (email: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    return insforge.auth.resendVerificationEmail({
      email,
      redirectTo: `${origin}/sign-in`,
    });
  };

  // Google OAuth Sign In
  const signInWithGoogle = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    await insforge.auth.signInWithOAuth("google", {
      redirectTo: `${origin}/auth/callback`,
      additionalParams: { prompt: "select_account" },
    });
  };

  // Sign Out
  const signOut = async () => {
    try {
      await insforge.auth.signOut();
    } finally {
      syncAuthCookies(null, null);
      setUser(null);
      setProfile(null);
      setCreditsState(50);
    }
  };

  const refreshUser = async () => {
    await hydrateAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        credits,
        loading,
        setCredits,
        refreshCredits,
        signInWithEmail,
        signUpWithEmail,
        verifyEmailOtp,
        resendVerification,
        signInWithGoogle,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
