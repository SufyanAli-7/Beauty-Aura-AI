import { createClient } from "@insforge/sdk";

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

/**
 * Server-only admin client with privileged access for backend API routes.
 */
export function getInsforgeAdmin() {
  if (typeof window !== "undefined") {
    throw new Error("Admin client cannot be called from the browser.");
  }
  return createClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
    anonKey: process.env.INSFORGE_API_KEY || process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
  });
}
