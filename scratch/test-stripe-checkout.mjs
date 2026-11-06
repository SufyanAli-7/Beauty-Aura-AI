import { createClient } from "@insforge/sdk";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const admin = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.INSFORGE_API_KEY || process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

async function main() {
  console.log("Testing fulfill_subscription_payment RPC function...");

  const { data: users } = await admin.database
    .from("users")
    .select("id, email, credits, plan")
    .limit(1);

  const user = users[0];
  console.log("Current user state:", user);

  // Test calling fulfill_subscription_payment RPC
  const { data: rpcResult, error: rpcErr } = await admin.database.rpc("fulfill_subscription_payment", {
    p_user_id: user.id,
    p_plan: "basic",
    p_stripe_session_id: "test_session_" + Date.now(),
    p_amount: "$9.99",
    p_credits: 450,
  });

  if (rpcErr) {
    console.error("RPC Error:", rpcErr);
  } else {
    console.log("RPC Success:", rpcResult);
  }

  // Check user state after RPC
  const { data: updatedUser } = await admin.database
    .from("users")
    .select("id, email, credits, plan, subscription_status")
    .eq("id", user.id)
    .single();

  console.log("Updated user state:", updatedUser);

  // Check billing_transactions
  const { data: txs } = await admin.database
    .from("billing_transactions")
    .select("*")
    .eq("user_id", user.id);

  console.log("Billing transactions count:", txs?.length);
}

main().catch(console.error);
