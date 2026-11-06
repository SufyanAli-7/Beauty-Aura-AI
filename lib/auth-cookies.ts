export const AUTH_ACCESS_TOKEN_COOKIE = "insforge_access_token";
export const AUTH_SESSION_COOKIE = "insforge_has_session";

/**
 * Synchronizes authentication cookies on the client and notifies the server-side session route.
 * When logged in: sets insforge_access_token and insforge_has_session cookies (7-day expiration).
 * When logged out: clears both cookies immediately.
 */
export function syncAuthCookies(accessToken: string | null, userId?: string | null) {
  if (typeof document === "undefined") return;

  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const secure = isHttps ? "; Secure" : "";

  if (accessToken || userId) {
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    if (accessToken) {
      document.cookie = `${AUTH_ACCESS_TOKEN_COOKIE}=${encodeURIComponent(
        accessToken
      )}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
    }
    document.cookie = `${AUTH_SESSION_COOKIE}=true; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;

    // Sync to server route in background so HTTP Set-Cookie is also registered
    try {
      fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, userId }),
      }).catch(() => {});
    } catch {}
  } else {
    document.cookie = `${AUTH_ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax${secure}`;
    document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax${secure}`;

    try {
      fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    } catch {}
  }
}

