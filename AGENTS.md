<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 🚨 MANDATORY AGENT PROTOCOL: SESSION PERSISTENCE
> **CRITICAL RULE FOR ALL CODING AGENTS:**
> At the end of **every turn and session**, the agent **MUST** update this `AGENTS.md` file with:
> 1. Any newly created, modified, or removed files.
> 2. Newly added database tables, columns, RLS policies, or backend changes.
> 3. New environment variables, dependencies, or CLI procedures.
> 4. An entry in the **Change Log** below.
> 
> *Do NOT perform full-codebase exploratory scans on subsequent sessions if this file already provides the current context.* Read `AGENTS.md` first.

---

<!-- INSFORGE:START -->
## InsForge Backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) providing managed Postgres, authentication, storage, edge functions, realtime, and an AI model gateway.

- **Project Name:** `aI-virtual-try-on`
- **Project ID:** `c3b7f0a5-3f2d-41bc-b8ca-374ee69b6572`
- **App Key:** `m5294326`
- **Region:** `ap-southeast`
- **OSS Host / API Base:** `https://m5294326.ap-southeast.insforge.app`
- **CLI Commands:** Always use `npx -y @insforge/cli <command>` (do not rely on global binaries).
- **Credentials:**
  - Client app reads from `.env.local` (`NEXT_PUBLIC_INSFORGE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`).
  - CLI reads `.insforge/project.json`.
  - Admin API key (`ik_...`) is server-only. Never expose in public env or client bundles.

### Installed InsForge Skills
Agent skills are linked in `.agents/skills` and `~/.gemini/config/skills`:
- `insforge`: App code with `@insforge/sdk` (Database CRUD, auth, storage uploads, AI gateway, payments).
- `insforge-cli`: Infrastructure management (migrations, RLS policies, storage buckets, functions, secrets, cron jobs).
- `insforge-debug`: Diagnostics, log inspections, auth/RLS troubleshooting, and security audits.
- `insforge-integrations`: External auth providers (Clerk, Auth0, Better Auth) and payment facilitators.
- `find-skills`: Discovering additional agent skills on demand.

### Current Backend State
- **Database:** Postgres (0 tables configured yet).
- **Storage:** S3-compatible object storage (0 buckets configured yet).
- **Auth:** OAuth (Google, GitHub) + Email/Password verification enabled.
- **Functions:** 0 edge functions deployed yet.

### Key InsForge Code Patterns
- Database inserts take an array: `insforge.database.from('table').insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->

---

## Project Structure & Architecture

- **Framework:** Next.js 16.4.4 (App Router, Turbopack, React 19.3.0, TypeScript 5, Tailwind CSS v4).
- **UI Components:** shadcn UI (`@shadcn/react`, `@base-ui/react`, Lucide icons). Located in `components/ui/`.
- **SDK & Client:**
  - SDK: `@insforge/sdk`
  - Client instance: `lib/insforge.ts` (`export const insforge = createClient(...)`)
- **Key Files & Folders:**
  - `app/`: Next.js App Router (entry page `app/page.tsx`, layout `app/layout.tsx`, styles `app/globals.css`).
  - `components/landing/`: Modular landing page sections (`logo.tsx`, `navbar.tsx`, `hero.tsx`, `stats-banner.tsx`, `feature-intro.tsx`, `feature-card.tsx`, `feature-alternating.tsx`, `services-grid.tsx`, `testimonials.tsx`, `pricing.tsx`, `footer.tsx`).
  - `components/ui/`: Reusable UI components (accordion, button, card, dialog, input, etc.).
  - `hooks/`: React hooks (`use-mobile.ts`, `use-highlighted-code.ts`).
  - `lib/`: Helpers (`lib/utils.ts`, `lib/highlighter.tsx`, `lib/insforge.ts`).
  - `public/`: High-resolution assets (`ai-photo-editing-images/`, `fashion-looks/`, `normal-headshot/`, `eye-lens/`, `beauty-looks/`).
  - `.insforge/project.json`: InsForge CLI configuration.
  - `.env.local`: Local environment variables (`NEXT_PUBLIC_INSFORGE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`).
  - `.agents/skills/`: Project-level agent skills directory.

---

## Recent Session Change Log

### [2026-11-03] - Image Cropping & Aspect Ratio Optimization Across All Cards
- **Hero Showcase Slider Aspect Ratio:** Changed the main image container aspect ratio from `aspect-[16/10]` to `aspect-[1200/850]`, perfectly matching the 1.414 native aspect ratio of all showcase assets (`ai-makeup-transfer.jpg`, `photo-enhance.jpg`, `hairstyle.jpg`, `object-remove.jpg`, etc.). Eliminated all vertical head, chin, arrow, and label cropping.
- **Hero Floating Cards Landscape Optimization:** Replaced fixed height containers (`h-40`, `h-32`) with `aspect-[1200/850]` and `object-center`. Preview images (`object-remove.jpg`, `hairstyle.jpg`, `photo-colorize.jpg`, `photo-lightining.jpg`) now display the full before/after scene without slicing people in half or clipping the edges.
- **Feature Intro Age Progression Card:** Adjusted `aspect-4/3` to `aspect-[1148/646]` (exact 16:9) matching `ai-age.webp`. All age transition stages from young to old are now 100% visible without horizontal edge clipping.
- **Feature Alternating Cards:** Updated `feature-card.tsx` to `aspect-[1200/850]` and `object-cover object-center` to preserve complete dresses, body silhouettes, and retouching details without bottom clipping.

### [2026-11-03] - Navbar Width Alignment for Hero Floating Cards & Virtual Try-On Border Unification
- **Hero Floating Cards Navbar Alignment:** In [`components/landing/hero.tsx`](file:///c:/Users/user/Desktop/ai-virtual-try-on/components/landing/hero.tsx), removed all negative horizontal offsets (`-left-8`, `-right-8`, etc.) that were causing the floating preview cards to stretch past the page edges. Aligned all 4 floating cards strictly to `left-0 xl:left-2` (matching the Navbar Logo) and `right-0 xl:right-2` (matching the Navbar "Get Started" button) within the `max-w-7xl` container.
- **Wireframe & Border Unification (Virtual Try-On Style):**
  - Updated the **Main Hero Slider Card** in [`components/landing/hero.tsx`](file:///c:/Users/user/Desktop/ai-virtual-try-on/components/landing/hero.tsx) to use the exact signature wireframe styling of the Virtual Try-On card (`inset-0`, `border-amber-300/60 rotate-[3deg] translate-x-[8px] translate-y-[-6px]` and `border-orange-200/70 rotate-[-2deg] translate-x-[-6px] translate-y-[8px]`, with `border-orange-100 bg-white p-2.5 sm:p-3 shadow-xl`). This completely eliminates the awkward high-floating outer box that was sticking upwards toward the navbar.
  - Updated the **Feature Intro AI Age Card** in [`components/landing/feature-intro.tsx`](file:///c:/Users/user/Desktop/ai-virtual-try-on/components/landing/feature-intro.tsx) to also match the Virtual Try-On wireframe borders and container padding identically.

### [2026-11-03] - Mobile Navbar "Try Free" Button, Hero Preview Cards Spacing, and Feature Intro Showcase Image
- **Mobile Navbar Refactor:** In [`components/landing/navbar.tsx`](file:///c:/Users/user/Desktop/ai-virtual-try-on/components/landing/navbar.tsx), removed the crowded "Log in" and "Get Started" buttons from the mobile top bar. Replaced them with a single clean, high-visibility "Try Free" button alongside the mobile hamburger menu.
- **Hero Floating Cards Spacing:** In [`components/landing/hero.tsx`](file:///c:/Users/user/Desktop/ai-virtual-try-on/components/landing/hero.tsx), fixed spacing between the main showcase container and the bottom floating preview cards ("Colorize" and "Lighting"). Moved both bottom cards outward to `left-0 lg:-left-2 xl:-left-8` and `right-0 lg:-right-2 xl:-right-8` (matching the top cards' symmetric positioning) and lowered them to `-bottom-10`, creating ample breathing room and completely eliminating collision with the central card.
- **Feature Intro Visual Showcase:** In [`components/landing/feature-intro.tsx`](file:///c:/Users/user/Desktop/ai-virtual-try-on/components/landing/feature-intro.tsx), utilized the empty white space on web/desktop view by adding a visual showcase card featuring `/ai-photo-editing-images/ai-age.webp` with signature offset sketchbook wireframe borders and "Age Progression & Time Travel" badges. Configured to display exclusively on web view (`hidden lg:block`) and remain hidden on mobile screens.

### [2026-11-03] - Bottom Showcase Tool Strip Removal
- **Bottom Showcase Strip Removal:** Removed the bottom tool bar (`Active Tool: ...` and `Turn photos into fashion art with BeautyAura | Explore Studio >` pill) from [`components/landing/hero.tsx`](file:///c:/Users/user/Desktop/ai-virtual-try-on/components/landing/hero.tsx) as requested in `media_1793687686504_9548197d.png`. The showcase frame now cleanly highlights the image and style caption without visual clutter.

### [2026-11-03] - Hero Showcase Refactor, Upload Bar & Modal Removal, Multi-Category Single Image Integration
- **Upload Bar Component Removal:** Completely removed the `family_or_portrait_photo.png` upload pill component from the Hero section.
- **Quick-Try Modal Removal:** Completely deleted `components/landing/quick-try-modal.tsx` and removed all state, modal triggers, and callbacks across `app/page.tsx`, `navbar.tsx`, `hero.tsx`, `feature-intro.tsx`, `feature-card.tsx`, `feature-alternating.tsx`, `services-grid.tsx`, and `pricing.tsx`.
- **Hero Showcase Refactor (Single Image Showcase):**
  - Replaced the side-by-side 2-image comparison with a single high-definition showcase container framed with signature offset sketchbook wireframe borders.
  - Integrated all 10 user-specified images as interactive tabs with instant switching:
    1. 💄 Makeup Transfer (`/ai-photo-editing-images/ai-makeup-transfer.jpg`)
    2. ✨ Photo Enhance (`/ai-photo-editing-images/photo-enhance.jpg`)
    3. ✂️ Hairstyle Studio (`/ai-photo-editing-images/hairstyle.jpg`)
    4. 🎨 Photo Colorize (`/ai-photo-editing-images/photo-colorize.jpg`)
    5. 🪄 Object Erase (`/ai-photo-editing-images/object-remove.jpg`)
    6. 🌄 Background Change (`/ai-photo-editing-images/bg-change.jpg`)
    7. 🔲 Background Cutout (`/ai-photo-editing-images/bg-remove.jpg`)
    8. 🌈 Color Grading (`/ai-photo-editing-images/color-correction.jpg`)
    9. 💡 Studio Relighting (`/ai-photo-editing-images/photo-lightining.jpg`)
    10. 📸 Studio Generator (`/ai-photo-editing-images/ai-studio-generator.jpg`)
    - Added new categories: 👗 Virtual Try-On (`/ai-photo-editing-images/ai-virtual-cloth-try-on.webp`) and 🧔 Beard & Grooming (`/ai-photo-editing-images/beard-try-on.jpg`).
  - Added interactive arrow controls (`<` and `>`) to cycle through all showcase looks seamlessly.
  - Floating preview sketch cards updated with user assets (`hairstyle.jpg`, `photo-colorize.jpg`, `object-remove.jpg`, `photo-lightining.jpg`).
- **Build Verification:** Tested `npm run build` with zero TypeScript or Turbopack errors.

### [2026-11-03] - Nano Banana AI Generated Logo & Global Orange Button Border/Outline Removal
- **Nano Banana AI Generated Logo:**
  - Invoked the image-generator subagent (DeepMind Nano Banana image model) to generate an ultra-luxury, high-end commercial brand mark for `BeautyAura.ai`.
  - Saved `public/beauty-aura-logo.png` (luxury 3D satin ribbon monogram 'B' with glowing aura halo and central star radiance) and `public/beauty-aura-logo-minimal.png`.
  - Updated [`components/landing/logo.tsx`](file:///c:/Users/user/Desktop/ai-virtual-try-on/components/landing/logo.tsx) to integrate the new emblem with dark and light theme responsiveness.
- **Global Orange Button Outline & Border Removal:**
  - Audited and updated all orange buttons across the entire app (`border-0 border-none outline-none ring-0 focus:outline-none`).
  - Sections polished: Hero (upload wand button, category filter pills, Explore Studio link, central sync transform badge), Feature Intro ("Try Your First 5 Transformations Free"), Alternating Feature Cards ("Try this look free"), Pricing (Card 1, Card 2, Card 3 trial CTA buttons, billing toggle), Quick Try Modal ("Download High-Res" button, category switcher pills), and Footer (newsletter submit arrow button).
- **Build Verification:** Tested `npm run build` with 100% clean compilation and verified visually.

### [2026-11-03] - Rebranding to BeautyAura.ai, Professional Logo & Navbar Refinements
- **Rebranding:** Renamed application across all files, layout metadata, and copy from `GlamMorph` to **`BeautyAura.ai`** (`Fashion & Beauty Lab`).
- **Professional Logo Component:** Created [`components/landing/logo.tsx`](file:///c:/Users/user/Desktop/ai-virtual-try-on/components/landing/logo.tsx) featuring a custom luxury radiant aura monogram emblem (`#FF4500` - `#FFA033` gradient) with concentric aura rings, intertwined petals, and a central diamond star radiance.
- **Navbar Button Cleanup:**
  - Removed all white borders, outlines, rings, and padding clips from the "Get Started" button (`border-0 border-none outline-none ring-0`) for a flush, seamless finish.
  - Replaced the "5 Free Credits" badge button with a dedicated **"Log in"** button with login icon (`LogIn`).
  - Updated both desktop navigation and responsive mobile/tablet drawer menus.
- **Verification:** Successfully rebuilt with `npm run build` (zero errors) and verified in Chrome DevTools MCP.

### [2026-11-02] - AI Photo & Virtual Try-On Landing Page Implementation (/screenshot-to-code)
- **Screenshot-to-Code Recreation:** Recreated the high-fidelity landing page matching the provided UI mockup (Sketchify concept layout adapted to the user's AI Photo Editor & Virtual Try-On application).
- **Modular Component Architecture:**
  - `components/landing/navbar.tsx`: Header navigation, brand badge `GlamMorph.ai`, category links, credits pill, and responsive mobile/tablet drawer.
  - `components/landing/hero.tsx`: High-impact headline, subtitle, interactive pill upload bar, central Before/After showcase with rotating AI sync badge, and 4 floating cards with signature offset wireframe borders.
  - `components/landing/stats-banner.tsx`: Vibrant full-width orange stats strip (`50K+ Active Users`, `4.9 ★ Rating`, `1.2M+ Photos Transformed`).
  - `components/landing/feature-intro.tsx`: "Try your first 5 transformations Completely Free" banner with CTA buttons.
  - `components/landing/feature-card.tsx` & `feature-alternating.tsx`: 4 alternating feature blocks with watercolor brush script titles, badges, and offset wireframe layers:
    1. Virtual Try-On (`/ai-photo-editing-images/ai-virtual-cloth-try-on.webp`)
    2. Skin & Face AI (`/ai-photo-editing-images/ai-skin-analaysis.webp`)
    3. Hair & Beard Studio (`/ai-photo-editing-images/beard-try-on.jpg`)
    4. Glamour & Makeup Transfer (`/ai-photo-editing-images/ai-makeup-try-on.jpg`)
  - `components/landing/services-grid.tsx`: 4 soft cream service cards with custom gradient icons covering Virtual Wardrobe, Skin & Body Contouring, Hair & Beard Makeover, and Studio Retouch.
  - `components/landing/testimonials.tsx`: Community reviews with terracotta and dark espresso cards, quotation badges, avatars, and 5-star ratings.
  - `components/landing/pricing.tsx`: Transparent pricing section with monthly/yearly toggle, 3 plans (Basic $19/wk, Plus $1,199/yr elevated orange card, Advanced $89/mo), and trust badges.
  - `components/landing/footer.tsx`: Deep espresso brown `#1C0D06` footer with brand info, quick links, contact details, newsletter input, and copyright.
  - `components/landing/quick-try-modal.tsx`: Interactive preview modal allowing users to test before/after styles across categories and download results.
- **Styling & Fonts:** Integrated Google Font `Caveat` for artistic handwritten headings (`.font-script`), added custom brush watercolor accents, and verified full responsiveness across mobile (375px), tablet (768px), and desktop (1280px+).
- **Build Verification:** Tested and passed full production build (`npm run build`) with zero TypeScript or styling errors.

### [2026-11-02] - Initial InsForge Setup & Configuration
- **InsForge Skills:** Installed `insforge`, `insforge-cli`, `insforge-debug`, `insforge-integrations`, and `find-skills` via `npx -y @insforge/cli link`. Mounted junctions in `.agents/skills` and `~/.gemini/config/skills`.
- **CLI Verification:** Verified project context (`npx -y @insforge/cli current`) and inspected metadata (`npx -y @insforge/cli metadata`).
- **Client SDK & Env:** Installed `@insforge/sdk`, fetched public `ANON_KEY` via CLI secrets, created `.env.local`, and initialized `lib/insforge.ts`.
- **Build Check:** Ran `npm run build` to confirm Turbopack and TypeScript compile cleanly with zero errors.
- **Protocol:** Added mandatory `AGENTS.md` update protocol for all subsequent AI agent sessions.
