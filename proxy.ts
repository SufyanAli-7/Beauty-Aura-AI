import { NextResponse, type NextRequest } from "next/server";

/**
 * Checks if a JWT access token has not yet expired.
 */
function isTokenValid(token?: string): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && typeof payload.exp === "number") {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    }
    return true;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get("insforge_access_token")?.value;
  const hasSessionCookie = request.cookies.get("insforge_has_session")?.value === "true";
  const refreshToken = request.cookies.get("insforge_refresh_token")?.value;

  // Validate active session:
  // A user is authenticated if they have a non-expired access token, a refresh token,
  // or an active 7-day session cookie (in which case the client SDK refreshes the access token).
  const hasValidAccessToken = accessToken ? isTokenValid(accessToken) : false;
  const isAuthenticated = Boolean(
    hasValidAccessToken ||
    hasSessionCookie ||
    refreshToken
  );

  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAuthRoute =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  // 1. Handling URL aliases: /login and /register
  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    const redirectUrl = new URL("/sign-in", request.url);
    if (search) redirectUrl.search = search;
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/register") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    const redirectUrl = new URL("/sign-up", request.url);
    if (search) redirectUrl.search = search;
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Protect /dashboard and all /dashboard/* routes:
  // When user is NOT logged in, block access and redirect to /sign-in
  if (isDashboardRoute) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // 3. Protect auth routes (/sign-in, /sign-up):
  // When user IS already logged in, redirect to /dashboard
  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
