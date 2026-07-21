// Kingsway admin authorization (PRD §5). Supabase Auth proves identity; admin_users grants access;
// AAL2 proves that the administrator completed a TOTP challenge for this session.
import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/supabase/types";

export type { AdminRole } from "@/lib/supabase/types";

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

export type AdminAccessState =
  | { status: "anonymous" }
  | { status: "forbidden" }
  | { status: "needs_enrollment"; admin: AdminUser }
  | { status: "needs_challenge"; admin: AdminUser }
  | { status: "ready"; admin: AdminUser };

export type AdminAction =
  | "view_dashboard"
  | "manage_kings"
  | "manage_sessions"
  | "send_email"
  | "manage_admins";

const CAPABILITIES: Record<AdminRole, readonly AdminAction[]> = {
  super_admin: [
    "view_dashboard",
    "manage_kings",
    "manage_sessions",
    "send_email",
    "manage_admins",
  ],
  community_lead: ["view_dashboard", "manage_kings", "manage_sessions", "send_email"],
  moderator: ["view_dashboard", "manage_kings"],
  content_manager: ["view_dashboard", "manage_sessions", "send_email"],
  operations: ["view_dashboard", "manage_kings", "manage_sessions"],
};

const ADMIN_ROLES: readonly AdminRole[] = [
  "super_admin",
  "community_lead",
  "moderator",
  "content_manager",
  "operations",
];

/**
 * Returns an active, explicitly approved admin. `app_metadata` is set only with Supabase's service
 * role, and `getUser()` revalidates it against Auth on every protected server request.
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || user.app_metadata.kingsway_admin_active !== true) return null;
  const role = user.app_metadata.kingsway_admin_role as AdminRole | undefined;
  if (!role || !ADMIN_ROLES.includes(role)) return null;

  return {
    id: user.id,
    email: user.email,
    role,
  };
}

/** One server-side decision for pages and API routes. Never rely on middleware alone. */
export async function getAdminAccessState(): Promise<AdminAccessState> {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "anonymous" };

  const admin = await getCurrentAdmin();
  if (!admin) return { status: "forbidden" };

  const [{ data: assurance }, { data: factors }] = await Promise.all([
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    supabase.auth.mfa.listFactors(),
  ]);

  const hasVerifiedTotp = factors?.totp.some((factor) => factor.status === "verified") ?? false;
  if (!hasVerifiedTotp) return { status: "needs_enrollment", admin };
  if (assurance?.currentLevel !== "aal2") return { status: "needs_challenge", admin };
  return { status: "ready", admin };
}

/** Coarse capability matrix. Super Admin has every capability in V1. */
export function can(role: AdminRole, action: AdminAction): boolean {
  return CAPABILITIES[role].includes(action);
}

/** Prevent open redirects through the login/MFA `next` parameter. */
export function safeAdminDestination(value: string | null | undefined): string {
  if (!value || !value.startsWith("/admin") || value.startsWith("//")) return "/admin";
  if (/^\/admin\/(login|mfa|unauthorized)(\/|\?|$)/.test(value)) return "/admin";
  return value;
}
