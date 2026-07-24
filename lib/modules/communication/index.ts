// Kingsway — communication module (PRD §4.4, §5.5). Sends email via Resend and logs every send to
// the member's timeline (communications). Automation is trigger-based; admin sends are segmented.
import "server-only";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import { mailConfigured, sendMail } from "@/lib/email/provider";
import { buildIcs } from "@/lib/email/ics";
import {
  followUpEmail,
  invitationEmail,
  reminderEmail,
  updateEmail,
  welcomeEmail,
  type RenderedEmail,
} from "@/lib/email/templates";
import type { CommunicationType, KingsHourSession, Member, Registration, Topic } from "@/lib/supabase/types";

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

export type LifecycleEmailType = "invitation" | "reminder" | "follow_up";

export interface EmailBudget {
  dailyCap: number;
  reserve: number;
  usedToday: number;
  bulkRemaining: number;
  queued: number;
}

export interface SendSummary {
  recipientCount: number;
  sentCount: number;
  queuedCount: number;
  failedCount: number;
  budget: EmailBudget;
}

/**
 * Welcome email on census completion (PRD §4.4 #1). Fetches the member, renders + sends via Resend
 * (if configured), and logs the send. If email isn't configured, no-ops gracefully.
 */
export async function sendWelcome(memberId: string): Promise<void> {
  const db = createServiceSupabaseOrNull();
  if (!db || !mailConfigured()) return;

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
    const delivery = await sendMail({
      to: member.email,
      rendered,
      idempotencyKey: `welcome/${memberId}`,
    });

    await db.from("communications").update({ provider_id: delivery.id }).eq("id", claim.id);
  } catch (error) {
    // Release only failed claims so a later controlled completion retry can try delivery again.
    await db.from("communications").delete().eq("id", claim.id).is("provider_id", null);
    console.error("Welcome email send failed", error);
  }
}

// ---- Admin segmented sends (wired in the Email-page pass) ----------------------------------
export async function getEmailBudget(): Promise<EmailBudget> {
  const db = createServiceSupabaseOrNull();
  const dailyCap = numberFromEnv("KINGSWAY_EMAIL_DAILY_CAP", 100);
  const reserve = numberFromEnv("KINGSWAY_EMAIL_DAILY_RESERVE", 20);
  if (!db) {
    return { dailyCap, reserve, usedToday: 0, bulkRemaining: Math.max(0, dailyCap - reserve), queued: 0 };
  }

  const since = startOfTodayIso();
  const [{ count: sentCount }, { count: queuedCount }] = await Promise.all([
    db
      .from("communications")
      .select("id", { count: "exact", head: true })
      .gte("sent_at", since),
    db
      .from("email_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "queued"),
  ]);
  const usedToday = sentCount ?? 0;
  return {
    dailyCap,
    reserve,
    usedToday,
    bulkRemaining: Math.max(0, dailyCap - reserve - usedToday),
    queued: queuedCount ?? 0,
  };
}

export async function previewSessionEmail(
  sessionId: string,
  type: LifecycleEmailType,
): Promise<{ recipientCount: number; budget: EmailBudget }> {
  const recipients = await resolveSessionRecipients(sessionId, type);
  return { recipientCount: recipients.length, budget: await getEmailBudget() };
}

export async function sendSessionEmail(
  sessionId: string,
  type: LifecycleEmailType,
): Promise<SendSummary> {
  const db = createServiceSupabaseOrNull();
  if (!db) throw new Error("Supabase is not configured");

  const recipients = await resolveSessionRecipients(sessionId, type);
  const budget = await getEmailBudget();
  let remaining = budget.bulkRemaining;
  let sentCount = 0;
  let queuedCount = 0;
  let failedCount = 0;

  for (const recipient of recipients) {
    const rendered = renderLifecycleEmail(type, recipient);
    const idempotencyKey = `${type}/${sessionId}/${recipient.member.id}`;
    if (remaining <= 0 || !mailConfigured()) {
      await queueEmail(recipient, type, rendered, idempotencyKey, "queued");
      queuedCount += 1;
      continue;
    }

    try {
      const delivery = await sendMail({
        to: recipient.member.email,
        rendered,
        idempotencyKey,
      });
      await db.from("communications").insert({
        member_id: recipient.member.id,
        session_id: sessionId,
        type,
        subject: rendered.subject,
        provider_id: delivery.id,
        sent_at: new Date().toISOString(),
      });
      if (type === "follow_up") {
        await db
          .from("registrations")
          .update({ follow_up_completed: true })
          .eq("session_id", sessionId)
          .eq("member_id", recipient.member.id);
      }
      sentCount += 1;
      remaining -= 1;
    } catch (error) {
      failedCount += 1;
      await queueEmail(
        recipient,
        type,
        rendered,
        idempotencyKey,
        "failed",
        error instanceof Error ? error.message : "Send failed",
      );
    }
  }

  return {
    recipientCount: recipients.length,
    sentCount,
    queuedCount,
    failedCount,
    budget: await getEmailBudget(),
  };
}

export async function sendToSegment(input?: {
  subject?: string;
  body?: string;
  segment?: Segment;
}): Promise<SendSummary> {
  const db = createServiceSupabaseOrNull();
  if (!db) throw new Error("Supabase is not configured");
  const memberIds = await resolveSegment(input?.segment ?? { kind: "everyone" });
  const members = await fetchMembers(memberIds);
  const budget = await getEmailBudget();
  let remaining = budget.bulkRemaining;
  let sentCount = 0;
  let queuedCount = 0;
  let failedCount = 0;

  for (const member of members) {
    const rendered = updateEmail({
      firstName: member.first_name,
      subject: input?.subject || "A Kingsway update",
      bodyHtml: input?.body || "<p>A short Kingsway update.</p>",
    });
    const idempotencyKey = `update/${Date.now()}/${member.id}`;
    if (remaining <= 0 || !mailConfigured()) {
      await queueEmail({ member, session: null }, "update", rendered, idempotencyKey, "queued");
      queuedCount += 1;
      continue;
    }
    try {
      const delivery = await sendMail({ to: member.email, rendered, idempotencyKey });
      await db.from("communications").insert({
        member_id: member.id,
        type: "update",
        subject: rendered.subject,
        provider_id: delivery.id,
        sent_at: new Date().toISOString(),
      });
      sentCount += 1;
      remaining -= 1;
    } catch (error) {
      failedCount += 1;
      await queueEmail(
        { member, session: null },
        "update",
        rendered,
        idempotencyKey,
        "failed",
        error instanceof Error ? error.message : "Send failed",
      );
    }
  }

  return { recipientCount: members.length, sentCount, queuedCount, failedCount, budget: await getEmailBudget() };
}

export async function resolveSegment(segment: Segment): Promise<string[]> {
  const db = createServiceSupabaseOrNull();
  if (!db) return [];
  if (segment.kind === "custom") return segment.memberIds;
  const { data, error } = await db.from("members").select("id").eq("status", "king").limit(5000);
  if (error) throw error;
  return ((data ?? []) as Pick<Member, "id">[]).map((member) => member.id);
}

interface SessionRecipient {
  member: Pick<Member, "id" | "first_name" | "email">;
  session: KingsHourSession;
  topic: Topic | null;
  registrations: Registration[];
}

interface QueueRecipient {
  member: Pick<Member, "id" | "first_name" | "email">;
  session: Pick<KingsHourSession, "id"> | null;
}

async function resolveSessionRecipients(
  sessionId: string,
  type: LifecycleEmailType,
): Promise<SessionRecipient[]> {
  const db = createServiceSupabaseOrNull();
  if (!db) throw new Error("Supabase is not configured");

  const { data: session, error: sessionError } = await db
    .from("kingshour_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();
  if (sessionError) throw sessionError;
  if (!session) throw new Error("Session not found");
  const typedSession = session as KingsHourSession;

  const topicResult = typedSession.topic_id
    ? await db.from("topics").select("*").eq("id", typedSession.topic_id).maybeSingle()
    : { data: null, error: null };
  if (topicResult.error) throw topicResult.error;

  const registrationResult = await db
    .from("registrations")
    .select("*")
    .eq("session_id", sessionId);
  if (registrationResult.error) throw registrationResult.error;
  const registrations = (registrationResult.data ?? []) as Registration[];

  let memberIds: string[];
  if (type === "invitation") {
    memberIds = await resolveSegment({ kind: "everyone" });
  } else if (type === "follow_up") {
    memberIds = registrations
      .filter((registration) => registration.attendance_status === "attended")
      .map((registration) => registration.member_id);
  } else {
    memberIds = registrations.map((registration) => registration.member_id);
  }

  const members = await fetchMembers([...new Set(memberIds)]);
  return members.map((member) => ({
    member,
    session: typedSession,
    topic: (topicResult.data as Topic | null) ?? null,
    registrations,
  }));
}

async function fetchMembers(memberIds: string[]) {
  const db = createServiceSupabaseOrNull();
  if (!db || memberIds.length === 0) return [];
  const { data, error } = await db
    .from("members")
    .select("id,first_name,email")
    .in("id", memberIds)
    .eq("status", "king")
    .limit(5000);
  if (error) throw error;
  return (data ?? []) as Pick<Member, "id" | "first_name" | "email">[];
}

function renderLifecycleEmail(type: LifecycleEmailType, recipient: SessionRecipient): RenderedEmail {
  const topicTitle = recipient.topic?.title ?? recipient.session.public_title ?? "KingsHour";
  const sessionUrl = `${appUrl()}/kingshour/${recipient.session.slug ?? recipient.session.id}`;
  if (type === "invitation") {
    const start = new Date(recipient.session.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return invitationEmail({
      firstName: recipient.member.first_name,
      appUrl: appUrl(),
      topicTitle,
      date: start,
      meetLink: recipient.session.meet_link,
      sessionId: recipient.session.id,
      ics: buildIcs({
        uid: `kingshour-${recipient.session.id}@kingsway`,
        title: topicTitle,
        description: `KingsHour. Register or review details: ${sessionUrl}`,
        start,
        end,
        location: recipient.session.meet_link ?? sessionUrl,
        url: sessionUrl,
      }),
    });
  }
  if (type === "reminder") {
    return reminderEmail({
      firstName: recipient.member.first_name,
      appUrl: appUrl(),
      topicTitle,
      date: new Date(recipient.session.date),
      meetLink: recipient.session.meet_link,
    });
  }
  return followUpEmail({
    firstName: recipient.member.first_name,
    appUrl: appUrl(),
    topicTitle,
    nextSessionDate: null,
    resources: recipient.session.resources ?? [],
  });
}

async function queueEmail(
  recipient: QueueRecipient,
  type: CommunicationType,
  rendered: RenderedEmail,
  idempotencyKey: string,
  status: "queued" | "failed",
  error?: string,
) {
  const db = createServiceSupabaseOrNull();
  if (!db) return;
  await db.from("email_queue").insert({
    member_id: recipient.member.id,
    session_id: recipient.session?.id ?? null,
    type,
    recipient_email: recipient.member.email,
    subject: rendered.subject,
    html: rendered.html,
    text_body: rendered.text,
    idempotency_key: idempotencyKey,
    status,
    error: error ?? null,
  });
}

function startOfTodayIso() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function numberFromEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}
