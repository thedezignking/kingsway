// Kingsway — auth module (admin only; PRD §5).
// V1: single Super Admin. Role system designed so Community Lead / Moderator /
// Content Manager / Operations can be added later without redesign.
import { notImplemented } from "@/lib/modules/notImplemented";

export type AdminRole =
  | "super_admin"
  | "community_lead"
  | "moderator"
  | "content_manager"
  | "operations";

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

/** Returns the current admin from the request session, or null if unauthenticated. */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  // TODO(auth): read Supabase session via createServerSupabase(); map to AdminUser.
  return notImplemented("auth.getCurrentAdmin");
}

/** Coarse permission check; refine per-role when more roles are added. */
export function can(_role: AdminRole, _action: string): boolean {
  // TODO(auth): real capability matrix. Super Admin can do everything in V1.
  return notImplemented("auth.can");
}
