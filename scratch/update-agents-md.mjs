import fs from "fs";

let content = fs.readFileSync("AGENTS.md", "utf8");

const entry = `### [2026-11-06] - Billing UX Polish: Fixed Pricing Overflow, Single-Line Button & Mobile Responsive Invoices
- **Fixed Pricing Card Horizontal Overflow (\`app/dashboard/billing/page.tsx\` & \`components/landing/pricing.tsx\`):**
  - **Root Cause:** In the 3-column grid (\`lg:grid-cols-3\`), the large price $9.99, strikethrough discount $19, cycle text / Per Month, and credit badge 450 Credits/mo with \`ml-auto\` were all forced into a single flex row. Inside a ~220px card content container, this caused the credit pill to overflow and bleed outside the right card border.
  - **Fix:** Redesigned the pricing block into a clean, luxury 2-level stacked format:
    - Top level: Large price (\`text-4xl xl:text-5xl font-black\`), optional strikethrough discount, and cycle (\`/ month\`).
    - Dedicated badge row: Credit badge pill (\`450 Credits every month\`, \`1,000 Credits every month\`, \`50 Free Credits\`) with \`Zap\` icon displayed directly underneath.
    - Adjusted grid gaps to \`gap-6 xl:gap-8\` and card padding to \`p-6 sm:p-7 xl:p-8\`, guaranteeing zero horizontal overflow across all screen widths.
- **Billing History Button Fixed to Single Line (\`app/dashboard/billing/page.tsx\`):**
  - Added \`whitespace-nowrap shrink-0\` to the "Billing History" button, icon, and text span.
  - Placed action buttons inside \`flex flex-row items-center gap-2.5 sm:gap-3 shrink-0\`, preventing text wrap and truncation across all screen sizes.
  - Linked button smoothly to \`#invoices-section\` so clicking it navigates directly to the user's transaction history.
- **Mobile Responsive Invoices & Payment History (\`app/dashboard/billing/page.tsx\`):**
  - Designed dual-responsive layout:
    - **Mobile View (\`block md:hidden\`)**: Sleek stacked luxury transaction cards for smartphones showing date, status badge ("completed"), plan title, credit allotment pill ("+450 Credits"), price, and full-width "Download Stripe PDF Receipt" button.
    - **Desktop View (\`hidden md:block\`)**: Full table wrapped inside \`overflow-x-auto\` with \`min-w-[620px]\` preventing layout breakage or squashing on smaller screens.
- **Updated Studio Tier Cards to Match Landing Page Aesthetic (\`app/dashboard/billing/page.tsx\` & \`components/landing/pricing.tsx\`):**
  - Updated \`components/landing/pricing.tsx\` with official real plans and prices:
    - Free Creator: $0/forever, 50 complimentary credits on signup, full access to 5 AI studios.
    - Basic Plan: $9.99/mo (or $95.90/yr), 450 credits/mo, center featured solid radiant orange gradient card (\`bg-gradient-to-b from-[#FF5500] via-[#FF6600] to-[#FF771C]\`).
    - Pro Plan: $24.99/mo (or $239.90/yr), 1,000 credits/mo, VIP GPU priority, commercial license.
  - Synced \`app/dashboard/billing/page.tsx\` cards to use the exact same landing page luxury design.
- **Verification:**
  - TypeScript check (\`npx tsc --noEmit\`): 0 errors.
  - Turbopack production build (\`npm run build\`): Compiled successfully in 10.2s across all 23 routes with 0 errors.

`;

const marker = "## Recent Session Change Log";
if (content.includes(marker)) {
  const index = content.indexOf(marker) + marker.length;
  content = content.slice(0, index) + "\n\n" + entry + content.slice(index);
  fs.writeFileSync("AGENTS.md", content, "utf8");
  console.log("AGENTS.md updated successfully!");
} else {
  console.error("Marker not found in AGENTS.md");
}

