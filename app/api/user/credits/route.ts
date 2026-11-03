import { NextRequest, NextResponse } from "next/server";
import { getInsforgeAdmin } from "@/lib/insforge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    const admin = getInsforgeAdmin();
    const { data: user, error } = await admin.database
      .from("users")
      .select("credits")
      .eq("id", userId)
      .maybeSingle();

    if (error || !user) {
      return NextResponse.json({ success: true, credits: 50 });
    }

    return NextResponse.json({
      success: true,
      credits: user.credits ?? 50,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
