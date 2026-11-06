import { createClient } from "@insforge/sdk";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const admin = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.INSFORGE_API_KEY || process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

const USER_ID = "a054d383-fca5-4209-853e-8f3567057853";

async function main() {
  console.log("Cleaning up billing_transactions for user:", USER_ID);

  // 1. Delete previous duplicate transactions
  await admin.database
    .from("billing_transactions")
    .delete()
    .eq("user_id", USER_ID);

  // 2. Insert the 3 accurate purchases with both session and invoice IDs
  const txs = [
    {
      user_id: USER_ID,
      plan: "basic",
      amount: "$9.99",
      currency: "usd",
      credits_allotted: 450,
      status: "completed",
      stripe_session_id: "cs_test_a1LLObc6lRhAGv9xV5g7YmQb8CBaBp3WlnA0nOmFsJEfzkk3siGfPM2cJR",
      stripe_invoice_id: "in_1UYm5nGStzBzliwj7HCdIBt8",
      created_at: "2026-11-06T12:18:07Z",
    },
    {
      user_id: USER_ID,
      plan: "pro",
      amount: "$24.99",
      currency: "usd",
      credits_allotted: 1000,
      status: "completed",
      stripe_session_id: "cs_test_a1TX0mAynWFn1lKRoDaVUaZSoi7FedN1UYUYij3P5vYR6RHr6xkRk6uhzR",
      stripe_invoice_id: "in_1UYm7EGStzBzliwjoOdlBkYT",
      created_at: "2026-11-06T12:19:36Z",
    },
    {
      user_id: USER_ID,
      plan: "basic",
      amount: "$9.99",
      currency: "usd",
      credits_allotted: 450,
      status: "completed",
      stripe_session_id: "cs_test_a16E72paMSTadnpv0bFtDST5HclQPMi8jn3Msp6Endm2jNa5v70fGc1XKb",
      stripe_invoice_id: "in_1UYmOoGStzBzliwj6pMIU5y2",
      created_at: "2026-11-06T12:37:46Z",
    },
  ];

  const { error: insErr } = await admin.database
    .from("billing_transactions")
    .insert(txs);

  if (insErr) {
    console.error("Failed to insert cleaned transactions:", insErr);
  } else {
    console.log("Successfully inserted 3 cleaned transactions.");
  }

  // 3. Update user to active Basic Plan with 1950 credits
  const { error: userErr } = await admin.database
    .from("users")
    .update({
      plan: "basic",
      subscription_status: "active",
      credits: 1950,
      stripe_customer_id: "cus_VZvxI6PueQKfll",
      stripe_subscription_id: "sub_1UYmOpGStzBzliwjxxvab3xJ",
      plan_period_end: "2026-12-06T17:37:42Z",
    })
    .eq("id", USER_ID);

  if (userErr) {
    console.error("Failed to update user:", userErr);
  } else {
    console.log("Successfully updated user to active Basic plan with 1950 credits.");
  }
}

main().catch(console.error);

