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
  - `components/landing/`: Modular landing page sections (`logo.tsx`, `navbar.tsx`, `hero.tsx`, `stats-banner.tsx`, `feature-intro.tsx`, `feature-card.tsx`, `feature-alternating.tsx`, `services-grid.tsx`, `testimonials.tsx`, `pricing.tsx`, `footer.tsx`, `quick-try-modal.tsx`).
  - `components/ui/`: Reusable UI components (accordion, button, card, dialog, input, etc.).
  - `hooks/`: React hooks (`use-mobile.ts`, `use-highlighted-code.ts`).
  - `lib/`: Helpers (`lib/utils.ts`, `lib/highlighter.tsx`, `lib/insforge.ts`).
  - `public/`: High-resolution assets (`ai-photo-editing-images/`, `fashion-looks/`, `normal-headshot/`, `eye-lens/`, `beauty-looks/`).
  - `.insforge/project.json`: InsForge CLI configuration.
  - `.env.local`: Local environment variables (`NEXT_PUBLIC_INSFORGE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`).
  - `.agents/skills/`: Project-level agent skills directory.

---

## Recent Session Change Log

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
