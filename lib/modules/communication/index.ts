// Kingsway — communication module (PRD §4.4, §5.5). Sends email via Resend and logs every send to
// the member's timeline (communications). Automation is trigger-based; admin sends are segmented.
import "server-only";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import {
  getResend,
  emailConfigured,
  EMAIL_FROM,
  EMAIL_REPLY_TO,
} from "@/lib/email/resend";
import { welcomeEmail } from "@/lib/email/templates";

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

/**
 * Welcome email on census completion (PRD §4.4 #1). Fetches the member, renders + sends via Resend
 * (if configured), and logs the send. If email isn't configured, no-ops gracefully.
 */
export async function sendWelcome(memberId: string): Promise<void> {
  const db = createServiceSupabaseOrNull();
  if (!db || !emailConfigured()) return;

  const { data: member } = await db
    .from("members")
    .select("first_name,email")
    .eq("id", memberId)
    .single();
  if (!member?.email) return;

  const rendered = welcomeEmail({ firstName: member.first_name, appUrl: appUrl() });

  // Claim the one allowed welcome communication before contacting Resend. The partial unique index
  // makes this atomic across refreshes, retries, multiple tabs, and concurrent server requests.
  const { data: claim, error: claimError } = await db
    .from("communications")
    .insert({
      member_id: memberId,
      type: "welcome",
      subject: rendered.subject,
      provider_id: null,
      sent_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (claimError?.code === "23505") return; // already welcomed
  if (claimError || !claim) throw claimError ?? new Error("Welcome delivery claim failed");

  try {
    const { data, error } = await getResend().emails.send(
      {
        from: EMAIL_FROM,
        replyTo: EMAIL_REPLY_TO,
        to: member.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      },
      { idempotencyKey: `welcome/${memberId}` },
    );
    if (error || !data?.id) {
      throw error ?? new Error("Resend did not return a message id");
    }

    await db.from("communications").update({ provider_id: data.id }).eq("id", claim.id);
  } catch (error) {
    // Release only failed claims so a later controlled completion retry can try delivery again.
    await db.from("communications").delete().eq("id", claim.id).is("provider_id", null);
    console.error("Welcome email send failed", error);
  }
}

// ---- Admin segmented sends (wired in the Email-page pass) ----------------------------------
export async function sendToSegment(): Promise<{ recipientCount: number }> {
  // TODO(email page): resolve segment -> render -> send -> log per recipient.
  throw new Error("Not implemented: communication.sendToSegment");
}

export async function resolveSegment(): Promise<string[]> {
  throw new Error("Not implemented: communication.resolveSegment");
}
