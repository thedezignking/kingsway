"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  ADMIN_FLOW_COOKIE,
  ADMIN_NEXT_COOKIE,
  getAdminAccessState,
  getCurrentAdmin,
  safeAdminDestination,
} from "@/lib/modules/auth";

export type LoginState = { error: string | null };
export type PasswordResetState = { error: string | null; sent: boolean };

export async function signIn(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const destination = safeAdminDestination(String(formData.get("next") ?? ""));
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "The email or password is incorrect." };

  const admin = await getCurrentAdmin();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for Kingsway Admin." };
  }

  const access = await getAdminAccessState();
  if (access.status === "needs_enrollment") {
    redirect(`/admin/mfa/enroll?next=${encodeURIComponent(destination)}`);
  }
  if (access.status === "needs_challenge") {
    redirect(`/admin/mfa/verify?next=${encodeURIComponent(destination)}`);
  }
  redirect(destination);
}

export async function requestPasswordReset(
  _previous: PasswordResetState,
  formData: FormData,
): Promise<PasswordResetState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const destination = safeAdminDestination(String(formData.get("next") ?? ""));
  if (!email) return { error: "Enter your approved admin email.", sent: false };

  const requestOrigin = headers().get("origin");
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const origin = requestOrigin || configuredOrigin || "http://localhost:3000";
  const callback = `${origin}/admin/auth/callback`;

  const cookieStore = cookies();
  const secure = origin.startsWith("https://");
  cookieStore.set(ADMIN_NEXT_COOKIE, destination, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: 15 * 60,
    path: "/admin",
  });
  cookieStore.set(ADMIN_FLOW_COOKIE, "password-reset", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge: 15 * 60,
    path: "/admin",
  });

  const { error } = await createServerSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: callback,
  });
  if (error) {
    console.error("Admin password setup email failed", {
      name: error.name,
      message: error.message,
    });
    return { error: "We could not send the password setup email. Try again shortly.", sent: false };
  }

  // Generic by design: do not reveal which email addresses are approved administrators.
  return { error: null, sent: true };
}

export async function signOut(): Promise<void> {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
