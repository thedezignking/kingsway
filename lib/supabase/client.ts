// Kingsway — browser Supabase client (anon key).
// V1 has no member accounts; the browser client is used only where a public,
// RLS-guarded read is genuinely needed. Most writes go through server routes.
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireEnv } from "@/lib/env";

export function createClient() {
  return createBrowserClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}
