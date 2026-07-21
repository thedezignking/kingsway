"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { safeAdminDestination } from "@/lib/modules/auth";

export type LoginState = { error: string | null; sent: boolean };

export async function requestAdminLink(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const destination = safeAdminDestination(String(formData.get("next") ?? ""));
  if (!email) return { error: "Enter your approved admin email.", sent: false };

  const requestOrigin = headers().get("origin");
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const origin = requestOrigin || configuredOrigin || "http://localhost:3000";
  const callback = `${origin}/admin/auth/callback?next=${encodeURIComponent(destination)}`;

  const { error } = await createServerSupabase().auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: callback },
  });

  if (error) {
    console.error("Admin sign-in link request failed", { name: error.name, message: error.message });
    return { error: "We could not send a sign-in link. Try again in a moment.", sent: false };
  }

  // Keep the response generic: never reveal whether an address has admin access.
  return { error: null, sent: true };
}

export async function signOut(): Promise<void> {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
