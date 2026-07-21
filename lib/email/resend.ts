// Kingsway — Resend client (transactional email, open tracking, .ics attachments).
// PRD §4.4: every important thing exists in email; one purpose per email; log every send.
import { Resend } from "resend";
import { requireEnv, hasEnv } from "@/lib/env";

let client: Resend | null = null;

export function getResend(): Resend {
  if (!client) client = new Resend(requireEnv("RESEND_API_KEY"));
  return client;
}

/** True when email can actually be sent — lets callers no-op gracefully in scaffold. */
export function emailConfigured(): boolean {
  return hasEnv("RESEND_API_KEY");
}

/** Default From identity (consistent across all templates, PRD §4.4). */
export const EMAIL_FROM =
  process.env.KINGSWAY_EMAIL_FROM || "Kingsway <hello@kingsway.example>";
