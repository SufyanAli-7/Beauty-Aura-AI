import { NextRequest, NextResponse } from "next/server";
import { getInsforgeAdmin } from "@/lib/insforge";

const STRIPE_SECRET_KEY =
  process.env.STRIPE_TEST_SECRET_KEY ||
  "";

/**
 * Sync endpoint to verify checkout completion, allot credits immediately upon return,
 * cancel any older concurrent subscriptions in Stripe, and return user billing state.
 */
export async function POST(req: NextRequest) {
  try {
    const admin = getInsforgeAdmin();
    const body = await req.json();
    const { sessionId, plan, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: userId" },
        { status: 400 }
      );
    }

    // Determine plan specifics
    const targetPlan = plan === "pro" ? "pro" : "basic";
    const creditsToAdd = targetPlan === "pro" ? 1000 : 450;
    const amountStr = targetPlan === "pro" ? "$24.99" : "$9.99";

    // 1. Fetch current user from database to inspect existing subscription
    const { data: existingUser } = await admin.database
      .from("users")
      .select("id, stripe_subscription_id, plan, subscription_status")
      .eq("id", userId)
      .maybeSingle();

    // 2. If sessionId provided, look up checkout session details from payments.stripe_checkout_sessions
    let customerId: string | null = null;
    let subscriptionId: string | null = null;
    let invoiceId: string | null = null;

    if (sessionId) {
      const { data: sessionRow } = await admin.database
        .from("payments.stripe_checkout_sessions" as any)
        .select("*")
        .eq("checkout_session_id", sessionId)
        .maybeSingle();

      if (sessionRow) {
        customerId = sessionRow.customer_id || null;
        subscriptionId = sessionRow.subscription_id || null;
        invoiceId = sessionRow.raw?.invoice || null;
      }
    }

    // 3. Prevent duplicate subscriptions: If user had an older active subscription in Stripe, cancel it
    if (
      existingUser?.stripe_subscription_id &&
      subscriptionId &&
      existingUser.stripe_subscription_id !== subscriptionId
    ) {
      try {
        console.log(
          `Canceling previous Stripe subscription ${existingUser.stripe_subscription_id} after upgrade to ${subscriptionId}...`
        );
        const cancelRes = await fetch(
          `https://api.stripe.com/v1/subscriptions/${existingUser.stripe_subscription_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            },
          }
        );
        const cancelData = await cancelRes.json();
        console.log(`Previous Stripe subscription canceled status: ${cancelData.status}`);
      } catch (cancelErr) {
        console.warn("Failed to cancel previous Stripe subscription:", cancelErr);
      }
    }

    // 4. Call idempotent fulfillment RPC function with BOTH session_id and invoice_id
    const { data: fulfillmentResult, error: rpcError } = await admin.database.rpc(
      "fulfill_subscription_payment",
      {
        p_user_id: userId,
        p_plan: targetPlan,
        p_stripe_session_id: sessionId || null,
        p_stripe_invoice_id: invoiceId || null,
        p_stripe_customer_id: customerId,
        p_stripe_subscription_id: subscriptionId,
        p_amount: amountStr,
        p_credits: creditsToAdd,
      }
    );

    if (rpcError) {
      console.error("Fulfillment RPC error:", rpcError);
      return NextResponse.json(
        { success: false, error: rpcError.message },
        { status: 500 }
      );
    }

    // 5. Fetch latest user state
    const { data: updatedUser } = await admin.database
      .from("users")
      .select("id, email, credits, plan, subscription_status, plan_period_end, stripe_customer_id, stripe_subscription_id")
      .eq("id", userId)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      result: fulfillmentResult,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Billing sync POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync billing state" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const admin = getInsforgeAdmin();

    // 1. Fetch user subscription state
    const { data: user, error: userErr } = await admin.database
      .from("users")
      .select("id, email, name, credits, plan, subscription_status, stripe_customer_id, stripe_subscription_id, plan_period_end")
      .eq("id", userId)
      .maybeSingle();

    if (userErr || !user) {
      return NextResponse.json(
        { success: false, error: userErr?.message || "User not found" },
        { status: 404 }
      );
    }

    // 2. Fetch billing transaction history
    const { data: transactions } = await admin.database
      .from("billing_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        plan: user.plan || "free",
        subscription_status: user.subscription_status || "active",
        credits: user.credits ?? 50,
      },
      transactions: transactions || [],
    });
  } catch (error: any) {
    console.error("Billing sync GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch billing status" },
      { status: 500 }
    );
  }
}
