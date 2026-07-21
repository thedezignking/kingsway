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

/**
 * One recognizable human sender across every Kingsway email. The address defaults to the
 * established hello@ mailbox; deployment can override it without changing the display name.
 */
const configuredFrom =
  process.env.KINGSWAY_EMAIL_FROM_ADDRESS ||
  "hello@thedezignking.com";
const configuredAddress = configuredFrom.match(/<([^>]+)>/)?.[1] || configuredFrom;
export const EMAIL_FROM = `Divine from Kingsway <${configuredAddress.trim()}>`;
export const EMAIL_REPLY_TO =
  process.env.KINGSWAY_EMAIL_REPLY_TO?.trim() || "learn@thedezignking.com";
