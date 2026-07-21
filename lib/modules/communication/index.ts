// Kingsway — communication module (PRD §4.4, §5.5). Sends email via Resend and logs every send to
// the member's timeline (communications). Automation is trigger-based; admin sends are segmented.
import "server-only";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import { getResend, emailConfigured, EMAIL_FROM } from "@/lib/email/resend";
import { welcomeEmail } from "@/lib/email/templates";
import type { CommunicationType } from "@/lib/supabase/types";

function appUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

  if (process.env.NODE_ENV === "production" && (!configured || configured.includes("localhost"))) {
    if (vercelHost) return `https://${vercelHost.replace(/^https?:\/\//, "")}`;
  }

  return configured || "http://localhost:3000";
}

/** Audience segments for admin sends (PRD §5.5). */
export type Segment =
  | { kind: "everyone" }
  | { kind: "season"; value: string }
  | { kind: "country"; value: string }
  | { kind: "interest"; value: string }
  | { kind: "joined_this_month" }
  | { kind: "missed_last_kingshour" }
  | { kind: "custom"; memberIds: string[] };

/** Log a send to the member's timeline. Best-effort; never throws to the caller. */
async function logCommunication(
  memberId: string,
  type: CommunicationType,
  subject: string,
  providerId: string | null,
) {
  const db = createServiceSupabaseOrNull();
  if (!db) return;
  await db.from("communications").insert({
    member_id: memberId,
    type,
    subject,
    provider_id: providerId,
    sent_at: new Date().toISOString(),
  });
}

/**
 * Welcome email on census completion (PRD §4.4 #1). Fetches the member, renders + sends via Resend
 * (if configured), and logs the send. If email isn't configured, no-ops gracefully.
 */
export async function sendWelcome(memberId: string): Promise<void> {
  const db = createServiceSupabaseOrNull();
  if (!db) return;

  const { data: member } = await db
    .from("members")
    .select("first_name,email")
    .eq("id", memberId)
    .single();
  if (!member?.email) return;

  const rendered = welcomeEmail({ firstName: member.first_name, appUrl: appUrl() });

  let providerId: string | null = null;
  if (emailConfigured()) {
    try {
      const { data, error } = await getResend().emails.send({
        from: EMAIL_FROM,
        to: member.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      });
      if (error) {
        console.error("Welcome email rejected by Resend", {
          name: error.name,
          message: error.message,
        });
      }
      providerId = data?.id ?? null;
    } catch (error) {
      console.error("Welcome email send failed", error);
      // Delivery failed — still record intent so admin can see/retry. providerId stays null.
    }
  }
  await logCommunication(memberId, "welcome", rendered.subject, providerId);
}

// ---- Admin segmented sends (wired in the Email-page pass) ----------------------------------
export async function sendToSegment(): Promise<{ recipientCount: number }> {
  // TODO(email page): resolve segment -> render -> send -> log per recipient.
  throw new Error("Not implemented: communication.sendToSegment");
}

export async function resolveSegment(): Promise<string[]> {
  throw new Error("Not implemented: communication.resolveSegment");
}
