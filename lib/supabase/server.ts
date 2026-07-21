// Kingsway — server-side Supabase clients.
//   * createServerSupabase(): request-scoped, cookie-aware — used for admin auth (PRD §5).
//   * createServiceSupabase(): service-role, bypasses RLS — used by API route handlers
//     that write members/census/etc. on behalf of the (accountless) public. NEVER import
//     this into client components.
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "@/lib/env";

/** Request-scoped client that reads/writes the auth cookie (for admin sessions). */
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore; middleware refreshes sessions.
          }
        },
      },
    },
  );
}

/** Elevated client (service role). Server-only. Bypasses RLS — use with care. */
export function createServiceSupabase() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/**
 * Like createServiceSupabase(), but returns null instead of throwing when env is missing.
 * Lets pages/routes degrade gracefully (render an empty/"connect Supabase" state) during the
 * keyless scaffold phase rather than crashing.
 */
export function createServiceSupabaseOrNull() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }
  return createServiceSupabase();
}
