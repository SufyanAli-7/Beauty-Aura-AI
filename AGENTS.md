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
  - `components/ui/`: Reusable UI components (accordion, button, card, dialog, input, etc.).
  - `hooks/`: React hooks (`use-mobile.ts`, `use-highlighted-code.ts`).
  - `lib/`: Helpers (`lib/utils.ts`, `lib/highlighter.tsx`, `lib/insforge.ts`).
  - `.insforge/project.json`: InsForge CLI configuration.
  - `.env.local`: Local environment variables (`NEXT_PUBLIC_INSFORGE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`).
  - `.agents/skills/`: Project-level agent skills directory.

---

## Recent Session Change Log

### [2026-11-02] - Initial InsForge Setup & Configuration
- **InsForge Skills:** Installed `insforge`, `insforge-cli`, `insforge-debug`, `insforge-integrations`, and `find-skills` via `npx -y @insforge/cli link`. Mounted junctions in `.agents/skills` and `~/.gemini/config/skills`.
- **CLI Verification:** Verified project context (`npx -y @insforge/cli current`) and inspected metadata (`npx -y @insforge/cli metadata`).
- **Client SDK & Env:** Installed `@insforge/sdk`, fetched public `ANON_KEY` via CLI secrets, created `.env.local`, and initialized `lib/insforge.ts`.
- **Build Check:** Ran `npm run build` to confirm Turbopack and TypeScript compile cleanly with zero errors.
- **Protocol:** Added mandatory `AGENTS.md` update protocol for all subsequent AI agent sessions.
