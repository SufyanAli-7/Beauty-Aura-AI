async function runTests() {
  const baseUrl = "http://localhost:3000";
  console.log("Testing Route Protection on:", baseUrl);

  const tests = [
    // Unauthenticated tests
    {
      name: "1. Unauthenticated /dashboard -> Should redirect to /sign-in?redirect=/dashboard",
      url: `${baseUrl}/dashboard`,
      cookies: "",
      expectedStatus: 307,
      expectedLocationStartsWith: "http://localhost:3000/sign-in?redirect=%2Fdashboard",
    },
    {
      name: "2. Unauthenticated /dashboard/beauty -> Should redirect to /sign-in?redirect=/dashboard/beauty",
      url: `${baseUrl}/dashboard/beauty`,
      cookies: "",
      expectedStatus: 307,
      expectedLocationStartsWith: "http://localhost:3000/sign-in?redirect=%2Fdashboard%2Fbeauty",
    },
    {
      name: "3. Unauthenticated /login -> Should redirect to /sign-in",
      url: `${baseUrl}/login`,
      cookies: "",
      expectedStatus: 307,
      expectedLocationStartsWith: "http://localhost:3000/sign-in",
    },
    {
      name: "4. Unauthenticated /register -> Should redirect to /sign-up",
      url: `${baseUrl}/register`,
      cookies: "",
      expectedStatus: 307,
      expectedLocationStartsWith: "http://localhost:3000/sign-up",
    },
    {
      name: "5. Unauthenticated /sign-in -> Should be accessible (200)",
      url: `${baseUrl}/sign-in`,
      cookies: "",
      expectedStatus: 200,
    },
    {
      name: "6. Unauthenticated /sign-up -> Should be accessible (200)",
      url: `${baseUrl}/sign-up`,
      cookies: "",
      expectedStatus: 200,
    },
    // Authenticated tests
    {
      name: "7. Authenticated /sign-in -> Should redirect to /dashboard",
      url: `${baseUrl}/sign-in`,
      cookies: "insforge_has_session=true",
      expectedStatus: 307,
      expectedLocationStartsWith: "http://localhost:3000/dashboard",
    },
    {
      name: "8. Authenticated /sign-up -> Should redirect to /dashboard",
      url: `${baseUrl}/sign-up`,
      cookies: "insforge_has_session=true",
      expectedStatus: 307,
      expectedLocationStartsWith: "http://localhost:3000/dashboard",
    },
    {
      name: "9. Authenticated /login -> Should redirect to /dashboard",
      url: `${baseUrl}/login`,
      cookies: "insforge_has_session=true",
      expectedStatus: 307,
      expectedLocationStartsWith: "http://localhost:3000/dashboard",
    },
    {
      name: "10. Authenticated /register -> Should redirect to /dashboard",
      url: `${baseUrl}/register`,
      cookies: "insforge_has_session=true",
      expectedStatus: 307,
      expectedLocationStartsWith: "http://localhost:3000/dashboard",
    },
    {
      name: "11. Authenticated /dashboard -> Should be accessible (200)",
      url: `${baseUrl}/dashboard`,
      cookies: "insforge_has_session=true",
      expectedStatus: 200,
    },
  ];

  let passed = 0;
  for (const t of tests) {
    try {
      const res = await fetch(t.url, {
        method: "GET",
        headers: t.cookies ? { Cookie: t.cookies } : {},
        redirect: "manual",
      });

      const location = res.headers.get("location") || "";
      const status = res.status;

      let ok = status === t.expectedStatus;
      if (t.expectedLocationStartsWith) {
        const fullLocation = location.startsWith("http") ? location : `${baseUrl}${location}`;
        if (!fullLocation.startsWith(t.expectedLocationStartsWith)) {
          ok = false;
        }
      }

      if (ok) {
        console.log(`[PASS] ${t.name} (Status: ${status}, Location: ${location || "none"})`);
        passed++;
      } else {
        console.error(`[FAIL] ${t.name}`);
        console.error(`       Expected status: ${t.expectedStatus}, got: ${status}`);
        if (t.expectedLocationStartsWith) {
          console.error(`       Expected location starts with: ${t.expectedLocationStartsWith}`);
          console.error(`       Actual location: ${location}`);
        }
      }
    } catch (err) {
      console.error(`[ERROR] ${t.name}:`, err.message);
    }
  }

  console.log(`\nResults: ${passed}/${tests.length} tests passed.`);
  if (passed === tests.length) {
    console.log("ALL ROUTE PROTECTION TESTS PASSED SUCCESSFULLY!");
  } else {
    process.exit(1);
  }
}

runTests();
