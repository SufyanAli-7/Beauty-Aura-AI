const STRIPE_SECRET_KEY = "";

async function main() {
  console.log("Fetching active subscriptions from Stripe API...");

  const res = await fetch("https://api.stripe.com/v1/subscriptions?limit=10&status=active", {
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
    },
  });

  const data = await res.json();
  console.log("Total active subscriptions found:", data.data?.length);

  for (const sub of data.data || []) {
    console.log(`- Sub ID: ${sub.id}, Customer: ${sub.customer}, Created: ${new Date(sub.created * 1000).toISOString()}, Status: ${sub.status}`);
    for (const item of sub.items?.data || []) {
      console.log(`    Plan: ${item.price?.nickname || item.plan?.id || item.price?.id}, Amount: ${item.price?.unit_amount}`);
    }
  }

  // Cancel the 2 older subscriptions, leaving only the newest one
  const sorted = (data.data || []).sort((a, b) => b.created - a.created);
  if (sorted.length > 1) {
    console.log("\nLeaving newest subscription active:", sorted[0].id);
    for (let i = 1; i < sorted.length; i++) {
      const oldSub = sorted[i];
      console.log(`Canceling older duplicate subscription: ${oldSub.id}...`);
      const cancelRes = await fetch(`https://api.stripe.com/v1/subscriptions/${oldSub.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        },
      });
      const cancelData = await cancelRes.json();
      console.log(`Canceled status: ${cancelData.status}`);
    }
  }
}

main().catch(console.error);

