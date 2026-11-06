import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { accessToken } = body;

    const response = NextResponse.json({ success: true });
    const isProd = process.env.NODE_ENV === "production";
    const maxAge = 60 * 60 * 24 * 7; // 7 days

    if (accessToken && typeof accessToken === "string") {
      response.cookies.set("insforge_access_token", accessToken, {
        path: "/",
        maxAge,
        sameSite: "lax",
        secure: isProd,
        httpOnly: false,
      });
    }

    response.cookies.set("insforge_has_session", "true", {
      path: "/",
      maxAge,
      sameSite: "lax",
      secure: isProd,
      httpOnly: false,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to set session cookies" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    const isProd = process.env.NODE_ENV === "production";

    response.cookies.set("insforge_access_token", "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure: isProd,
      httpOnly: false,
    });

    response.cookies.set("insforge_has_session", "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure: isProd,
      httpOnly: false,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to clear session cookies" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const hasToken = req.cookies.has("insforge_access_token");
  const hasSession = req.cookies.has("insforge_has_session");
  return NextResponse.json({
    authenticated: Boolean(hasToken || hasSession),
  });
}

