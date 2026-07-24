// Kingsway — KingsHour operations (PRD §4.6, §5.4).
import "server-only";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import type {
  AttendanceStatus,
  KingsHourSession,
  Member,
  PublicImageAspect,
  PublicSessionStatus,
  Registration,
  SessionStatus,
  Topic,
  TopicPillar,
} from "@/lib/supabase/types";

export interface SessionInput {
  topicId: string | null;
  date: string;
  description?: string;
  facilitator?: string;
  meetLink?: string;
  resources?: string[];
  status?: SessionStatus;
  slug?: string;
  publicStatus?: PublicSessionStatus;
  publicTitle?: string;
  publicSummary?: string;
  publicBody?: string;
  publicImageUrl?: string;
  publicImageAlt?: string;
  publicImageAspect?: PublicImageAspect;
}

export interface TopicInput {
  title: string;
  pillar: TopicPillar;
  purpose?: string;
}

export interface SessionSummary extends KingsHourSession {
  topic: Topic | null;
  registrationCount: number;
  attendedCount: number;
}

export interface SessionRegistration extends Registration {
  member: Pick<Member, "id" | "first_name" | "email" | "country"> | null;
}

export interface SessionDetail extends SessionSummary {
  registrations: SessionRegistration[];
}

export type PublicSession = Pick<
  KingsHourSession,
  | "id"
  | "date"
  | "description"
  | "facilitator"
  | "slug"
  | "public_title"
  | "public_summary"
  | "public_body"
  | "public_image_url"
  | "public_image_alt"
  | "public_image_aspect"
> & {
  topic: Pick<Topic, "title" | "pillar" | "purpose"> | null;
};

export type RegistrationCheck =
  | { status: "registered"; memberId: string; firstName: string }
  | { status: "needs_census"; existingIncomplete: boolean; email: string; sessionId: string };

export async function createSession(input: SessionInput): Promise<KingsHourSession> {
  const db = requiredDb();
  const payload = sessionPayload(input);
  const { data, error } = await db.from("kingshour_sessions").insert(payload).select("*").single();
  if (error) throw error;
  return data as KingsHourSession;
}

export async function updateSession(
  id: string,
  input: SessionInput,
): Promise<KingsHourSession> {
  const db = requiredDb();
  const payload = sessionPayload(input);
  const { data, error } = await db
    .from("kingshour_sessions")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as KingsHourSession;
}

export async function listSessions(): Promise<SessionSummary[]> {
  const db = requiredDb();
  const sessionsResult = await queryWithContext(
    "KingsHour sessions",
    db.from("kingshour_sessions").select("*").order("date", { ascending: false }).limit(500),
  );
  const topicsResult = await queryWithContext("topics", db.from("topics").select("*").limit(1000));
  const registrationsResult = await queryWithContext(
    "registrations",
    db.from("registrations").select("session_id,attendance_status").limit(10000),
  );
  if (sessionsResult.error) throw sessionsResult.error;
  if (topicsResult.error) throw topicsResult.error;
  if (registrationsResult.error) throw registrationsResult.error;

  const topics = (topicsResult.data ?? []) as Topic[];
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  const counts = new Map<string, { registrations: number; attended: number }>();
  for (const registration of registrationsResult.data ?? []) {
    const current = counts.get(registration.session_id) ?? { registrations: 0, attended: 0 };
    current.registrations += 1;
    if (registration.attendance_status === "attended") current.attended += 1;
    counts.set(registration.session_id, current);
  }

  return ((sessionsResult.data ?? []) as KingsHourSession[]).map((session) => ({
    ...session,
    topic: session.topic_id ? topicById.get(session.topic_id) ?? null : null,
    registrationCount: counts.get(session.id)?.registrations ?? 0,
    attendedCount: counts.get(session.id)?.attended ?? 0,
  }));
}

export async function getSession(id: string): Promise<SessionDetail | null> {
  const db = requiredDb();
  const { data: session, error: sessionError } = await db
    .from("kingshour_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (sessionError) throw sessionError;
  if (!session) return null;

  const [{ data: topic, error: topicError }, { data: registrationRows, error: registrationError }] =
    await Promise.all([
      session.topic_id
        ? db.from("topics").select("*").eq("id", session.topic_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      db
        .from("registrations")
        .select("*")
        .eq("session_id", id)
        .order("created_at", { ascending: true }),
    ]);
  if (topicError) throw topicError;
  if (registrationError) throw registrationError;

  const registrations = (registrationRows ?? []) as Registration[];
  const memberIds = registrations.map((registration) => registration.member_id);
  const membersResult = memberIds.length
    ? await db.from("members").select("id,first_name,email,country").in("id", memberIds)
    : { data: [], error: null };
  if (membersResult.error) throw membersResult.error;
  const members = (membersResult.data ?? []) as Pick<
    Member,
    "id" | "first_name" | "email" | "country"
  >[];
  const memberById = new Map(members.map((member) => [member.id, member]));

  return {
    ...(session as KingsHourSession),
    topic: (topic as Topic | null) ?? null,
    registrationCount: registrations.length,
    attendedCount: registrations.filter(
      (registration) => registration.attendance_status === "attended",
    ).length,
    registrations: registrations.map((registration) => ({
      ...registration,
      member: memberById.get(registration.member_id) ?? null,
    })),
  };
}

export async function getPublicSessionBySlug(slug: string): Promise<PublicSession | null> {
  const db = createServiceSupabaseOrNull();
  if (!db) return null;
  const { data: session, error } = await db
    .from("kingshour_sessions")
    .select("*")
    .eq("slug", slug)
    .eq("public_status", "published")
    .maybeSingle();
  if (error) throw error;
  if (!session) return null;

  const typedSession = session as KingsHourSession;
  const topicResult = typedSession.topic_id
    ? await db.from("topics").select("title,pillar,purpose").eq("id", typedSession.topic_id).maybeSingle()
    : { data: null, error: null };
  if (topicResult.error) throw topicResult.error;

  return {
    id: typedSession.id,
    date: typedSession.date,
    description: typedSession.description,
    facilitator: typedSession.facilitator,
    slug: typedSession.slug,
    public_title: typedSession.public_title,
    public_summary: typedSession.public_summary,
    public_body: typedSession.public_body,
    public_image_url: typedSession.public_image_url,
    public_image_alt: typedSession.public_image_alt,
    public_image_aspect: typedSession.public_image_aspect,
    topic: (topicResult.data as PublicSession["topic"]) ?? null,
  };
}

export async function listTopics(): Promise<Topic[]> {
  const db = requiredDb();
  const { data, error } = await db
    .from("topics")
    .select("*")
    .neq("status", "archived")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw error;
  return (data ?? []) as Topic[];
}

export async function createTopic(input: TopicInput): Promise<Topic> {
  const db = requiredDb();
  const title = input.title.trim();
  if (title.length < 3 || title.length > 140) throw new Error("Topic title must be 3–140 characters");
  const { data, error } = await db
    .from("topics")
    .insert({
      title,
      pillar: input.pillar,
      purpose: clean(input.purpose),
      status: "active",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Topic;
}

/** One-click RSVP write used by the signed public RSVP flow. */
export async function rsvp(
  sessionId: string,
  memberId: string,
  options: { source?: string; sourceDetail?: string } = {},
): Promise<void> {
  const db = requiredDb();
  const { error } = await db.from("registrations").upsert(
    {
      session_id: sessionId,
      member_id: memberId,
      registration_status: "registered",
      source: clean(options.source),
      source_detail: clean(options.sourceDetail),
    },
    { onConflict: "member_id,session_id" },
  );
  if (error) throw error;
}

export async function registerByEmail(
  sessionId: string,
  email: string,
  options: { source?: string; sourceDetail?: string } = {},
): Promise<RegistrationCheck> {
  const db = requiredDb();
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Enter a valid email address");
  }

  const { data: member, error } = await db
    .from("members")
    .select("id,first_name,email,status")
    .eq("email", normalizedEmail)
    .maybeSingle();
  if (error) throw error;

  if (member?.status === "king") {
    await rsvp(sessionId, member.id, options);
    return { status: "registered", memberId: member.id, firstName: member.first_name };
  }

  return {
    status: "needs_census",
    existingIncomplete: member?.status === "incomplete",
    email: normalizedEmail,
    sessionId,
  };
}

export async function markAttendance(
  sessionId: string,
  memberId: string,
  status: AttendanceStatus,
): Promise<void> {
  const db = requiredDb();
  if (!(["unknown", "attended", "no_show"] as AttendanceStatus[]).includes(status)) {
    throw new Error("Invalid attendance status");
  }
  const { data, error } = await db
    .from("registrations")
    .update({ attendance_status: status })
    .eq("session_id", sessionId)
    .eq("member_id", memberId)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Registration not found");
}

function sessionPayload(input: SessionInput) {
  const date = new Date(input.date);
  if (Number.isNaN(date.getTime())) throw new Error("Enter a valid session date and time");
  const meetLink = clean(input.meetLink);
  if (meetLink && !/^https:\/\/(meet\.google\.com|calendar\.google\.com)\//i.test(meetLink)) {
    throw new Error("Use a valid Google Meet link");
  }

  return {
    topic_id: input.topicId || null,
    date: date.toISOString(),
    description: clean(input.description),
    facilitator: clean(input.facilitator),
    meet_link: meetLink,
    resources: (input.resources ?? []).map((resource) => resource.trim()).filter(Boolean),
    status: input.status ?? "upcoming",
    slug: cleanSlug(input.slug),
    public_status: input.publicStatus ?? "draft",
    public_title: clean(input.publicTitle),
    public_summary: clean(input.publicSummary),
    public_body: clean(input.publicBody),
    public_image_url: clean(input.publicImageUrl),
    public_image_alt: clean(input.publicImageAlt),
    public_image_aspect: input.publicImageAspect === "4:5" ? "4:5" : "1:1",
  };
}

function requiredDb() {
  const db = createServiceSupabaseOrNull();
  if (!db) throw new Error("Supabase is not configured");
  return db;
}

function clean(value: string | undefined): string | null {
  return value?.trim() || null;
}

function cleanSlug(value: string | undefined): string | null {
  const slug = value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return slug || null;
}

async function queryWithContext<T>(label: string, query: PromiseLike<T>): Promise<T> {
  try {
    return await query;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} could not load: ${message}`);
  }
}
