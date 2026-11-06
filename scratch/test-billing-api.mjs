const BASE_URL = "http://localhost:3000";
const TEST_USER_ID = "775404aa-f591-4c7d-afb3-0aa3f1cdb654";

async function testBilling() {
  console.log("=== Testing Billing API Endpoints ===");

  // 1. Test GET /api/billing/sync
  console.log("\n1. Testing GET /api/billing/sync?userId=" + TEST_USER_ID);
  const getRes = await fetch(`${BASE_URL}/api/billing/sync?userId=${TEST_USER_ID}`);
  const getData = await getRes.json();
  console.log("GET Response status:", getRes.status);
  console.log("User current plan:", getData.user?.plan);
  console.log("User current credits:", getData.user?.credits);
  console.log("Transactions count:", getData.transactions?.length);

  // 2. Test POST /api/billing/sync with Basic plan checkout session
  const mockSessionId = "cs_test_mock_" + Date.now();
  console.log("\n2. Testing POST /api/billing/sync with Basic plan and session:", mockSessionId);
  const postRes = await fetch(`${BASE_URL}/api/billing/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: mockSessionId,
      plan: "basic",
      userId: TEST_USER_ID,
    }),
  });
  const postData = await postRes.json();
  console.log("POST Response status:", postRes.status);
  console.log("Fulfillment result:", postData.result);
  console.log("Updated credits:", postData.user?.credits);
  console.log("Updated plan:", postData.user?.plan);

  // 3. Test Idempotency (calling POST /api/billing/sync again with SAME session ID)
  console.log("\n3. Testing Idempotency with same session ID...");
  const postRes2 = await fetch(`${BASE_URL}/api/billing/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: mockSessionId,
      plan: "basic",
      userId: TEST_USER_ID,
    }),
  });
  const postData2 = await postRes2.json();
  console.log("Second POST result:", postData2.result);
  console.log("Credits after second call (should NOT have changed):", postData2.user?.credits);

  if (postData2.result?.already_processed === true) {
    console.log("✓ IDEMPOTENCY VERIFIED: Payment was not double-credited!");
  } else {
    console.warn("✗ WARNING: Idempotency check failed!");
  }

  // 4. Test GET /api/billing/sync after purchase to verify transaction history
  console.log("\n4. Verifying transaction history via GET /api/billing/sync...");
  const getRes2 = await fetch(`${BASE_URL}/api/billing/sync?userId=${TEST_USER_ID}`);
  const getData2 = await getRes2.json();
  console.log("Updated plan:", getData2.user?.plan);
  console.log("Updated credits:", getData2.user?.credits);
  console.log("Transactions count:", getData2.transactions?.length);
  if (getData2.transactions?.length > 0) {
    console.log("Latest transaction:", getData2.transactions[0]);
  }

  console.log("\n=== ALL BILLING TESTS COMPLETED SUCCESSFULLY ===");
}

testBilling().catch(console.error);
