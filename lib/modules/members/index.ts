// Kingsway — members module (PRD §5.2). One King = one record; everything links here.
import "server-only";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import type {
  CensusProgress,
  CensusResponse,
  Communication,
  KingsHourSession,
  Member,
  MemberStatus,
  Registration,
  Topic,
} from "@/lib/supabase/types";

const PAGE_SIZE = 25;
const MAX_MEMBER_ROWS = 5000;
const LIST_RESPONSE_IDS = ["season", "occupation", "topics"] as const;

type ListResponseId = (typeof LIST_RESPONSE_IDS)[number];

interface ListResponse {
  member_id: string;
  question_id: ListResponseId;
  response: unknown;
}

export interface MemberFilter {
  query?: string;
  status?: MemberStatus | "all";
  country?: string;
  season?: string;
  interest?: string;
  page?: number;
  pageSize?: number;
}

export interface MemberListRow extends Member {
  season: string | null;
  occupation: string | null;
  interests: string[];
}

export interface MemberFilterOptions {
  countries: string[];
  seasons: string[];
  interests: string[];
}

export interface MemberListResult {
  members: MemberListRow[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  filters: MemberFilterOptions;
}

/**
 * Operational member index. V1 intentionally resolves the three Census-backed filters in the
 * service layer so the admin gets one coherent record without exposing service-role reads to the
 * browser. Pagination is applied after filtering; the hard cap is deliberately above V1 scale.
 */
export async function listMembers(filter: MemberFilter = {}): Promise<MemberListResult> {
  const empty: MemberListResult = {
    members: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: 1,
    filters: { countries: [], seasons: [], interests: [] },
  };
  const db = createServiceSupabaseOrNull();
  if (!db) return empty;

  const [{ data: memberRows, error: memberError }, { data: responseRows, error: responseError }] =
    await Promise.all([
      db
        .from("members")
        .select("*")
        .order("join_date", { ascending: false })
        .limit(MAX_MEMBER_ROWS),
      db
        .from("census_responses")
        .select("member_id,question_id,response")
        .in("question_id", [...LIST_RESPONSE_IDS])
        .limit(MAX_MEMBER_ROWS * LIST_RESPONSE_IDS.length),
    ]);

  if (memberError) throw memberError;
  if (responseError) throw responseError;

  const responses = new Map<string, Partial<Record<ListResponseId, unknown>>>();
  for (const row of (responseRows ?? []) as ListResponse[]) {
    const current = responses.get(row.member_id) ?? {};
    current[row.question_id] = row.response;
    responses.set(row.member_id, current);
  }

  const allMembers: MemberListRow[] = ((memberRows ?? []) as Member[]).map((member) => {
    const answers = responses.get(member.id) ?? {};
    return {
      ...member,
      season: asString(answers.season),
      occupation: asString(answers.occupation),
      interests: asStringArray(answers.topics),
    };
  });

  const options: MemberFilterOptions = {
    countries: uniqueSorted(allMembers.map((member) => member.country)),
    seasons: uniqueSorted(allMembers.map((member) => member.season)),
    interests: uniqueSorted(allMembers.flatMap((member) => member.interests)),
  };

  const query = filter.query?.trim().toLocaleLowerCase();
  const filtered = allMembers.filter((member) => {
    if (filter.status && filter.status !== "all" && member.status !== filter.status) return false;
    if (filter.country && member.country !== filter.country) return false;
    if (filter.season && member.season !== filter.season) return false;
    if (filter.interest && !member.interests.includes(filter.interest)) return false;
    if (!query) return true;

    return [
      member.first_name,
      member.email,
      member.country,
      member.state_city,
      member.season,
      member.occupation,
      ...member.interests,
    ].some((value) => value?.toLocaleLowerCase().includes(query));
  });

  const pageSize = Math.min(Math.max(1, filter.pageSize ?? PAGE_SIZE), MAX_MEMBER_ROWS);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(Math.max(1, filter.page ?? 1), pageCount);
  const start = (page - 1) * pageSize;

  return {
    members: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    pageCount,
    filters: options,
  };
}

export interface MemberRegistrationActivity extends Registration {
  session: KingsHourSession | null;
  topic: Pick<Topic, "id" | "title" | "pillar"> | null;
}

export interface MemberProfile {
  member: Member;
  responses: CensusResponse[];
  progress: CensusProgress | null;
  communications: Communication[];
  registrations: MemberRegistrationActivity[];
}

/** Full King record: identity, Census, progress, KingsHour history and communication timeline. */
export async function getMemberProfile(id: string): Promise<MemberProfile | null> {
  const db = createServiceSupabaseOrNull();
  if (!db) return null;

  const { data: member, error: memberError } = await db
    .from("members")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (memberError) throw memberError;
  if (!member) return null;

  const [responsesResult, communicationsResult, progressResult, registrationsResult] =
    await Promise.all([
      db
        .from("census_responses")
        .select("*")
        .eq("member_id", id)
        .order("updated_at", { ascending: true }),
      db
        .from("communications")
        .select("*")
        .eq("member_id", id)
        .order("sent_at", { ascending: false }),
      db.from("census_progress").select("*").eq("member_id", id).maybeSingle(),
      db
        .from("registrations")
        .select("*")
        .eq("member_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (responsesResult.error) throw responsesResult.error;
  if (communicationsResult.error) throw communicationsResult.error;
  if (progressResult.error) throw progressResult.error;
  if (registrationsResult.error) throw registrationsResult.error;

  const registrations = (registrationsResult.data ?? []) as Registration[];
  const sessionIds = [...new Set(registrations.map((registration) => registration.session_id))];
  const sessionsResult = sessionIds.length
    ? await db.from("kingshour_sessions").select("*").in("id", sessionIds)
    : { data: [], error: null };
  if (sessionsResult.error) throw sessionsResult.error;

  const sessions = (sessionsResult.data ?? []) as KingsHourSession[];
  const sessionById = new Map(sessions.map((session) => [session.id, session]));
  const topicIds = [
    ...new Set(sessions.map((session) => session.topic_id).filter((value): value is string => !!value)),
  ];
  const topicsResult = topicIds.length
    ? await db.from("topics").select("id,title,pillar").in("id", topicIds)
    : { data: [], error: null };
  if (topicsResult.error) throw topicsResult.error;

  const topics = (topicsResult.data ?? []) as Pick<Topic, "id" | "title" | "pillar">[];
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));

  return {
    member: member as Member,
    responses: (responsesResult.data ?? []) as CensusResponse[],
    progress: (progressResult.data as CensusProgress | null) ?? null,
    communications: (communicationsResult.data ?? []) as Communication[],
    registrations: registrations.map((registration) => {
      const session = sessionById.get(registration.session_id) ?? null;
      return {
        ...registration,
        session,
        topic: session?.topic_id ? topicById.get(session.topic_id) ?? null : null,
      };
    }),
  };
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map(String).map((item) => item.trim()).filter(Boolean)
    : [];
}

function uniqueSorted(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => !!value))].sort((a, b) =>
    a.localeCompare(b),
  );
}
