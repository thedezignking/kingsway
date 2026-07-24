// Kingsway — operational analytics (PRD §5.1, §5.3, §5.6).
// These are decision-support reads over first-party Kingsway data, not engagement theatre.
import "server-only";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import { getQuestion } from "@/lib/census/questions";
import { nextKingsHour } from "@/lib/kingshour/schedule";
import type { AttendanceStatus, MemberStatus, SessionStatus } from "@/lib/supabase/types";

export interface Ranked {
  label: string;
  count: number;
}

export interface DistributionItem extends Ranked {
  share: number;
}

export interface AttentionItem {
  label: string;
  detail: string;
  count: number;
  href: string;
  tone: "attention" | "neutral";
}

export interface OverviewStats {
  configured: boolean;
  totalKings: number;
  joinedThisWeek: number;
  censusCompletionRate: number;
  daysToKingsHour: number;
  attendanceRate: number | null;
  lastEmailAt: string | null;
  topGoal: string | null;
  biggestStruggle: string | null;
  attention: AttentionItem[];
  ageDistribution: DistributionItem[];
  countryDistribution: DistributionItem[];
  occupationDistribution: DistributionItem[];
  topicDistribution: DistributionItem[];
  monthlySignups: DistributionItem[];
}

interface MemberRow {
  id: string;
  status: MemberStatus;
  join_date: string;
  country: string | null;
  age_range: string | null;
}

interface ResponseRow {
  member_id: string;
  question_id: string;
  response: unknown;
}

interface RegistrationRow {
  member_id: string;
  session_id: string;
  attendance_status: AttendanceStatus;
  follow_up_completed: boolean;
}

interface SessionRow {
  id: string;
  date: string;
  meet_link: string | null;
  status: SessionStatus;
}

/** What needs attention today, plus the small set of distributions used on Overview. */
export async function getOverviewStats(): Promise<OverviewStats> {
  const empty: OverviewStats = {
    configured: false,
    totalKings: 0,
    joinedThisWeek: 0,
    censusCompletionRate: 0,
    daysToKingsHour: daysUntilNextKingsHour(),
    attendanceRate: null,
    lastEmailAt: null,
    topGoal: null,
    biggestStruggle: null,
    attention: [],
    ageDistribution: [],
    countryDistribution: [],
    occupationDistribution: [],
    topicDistribution: [],
    monthlySignups: [],
  };
  const db = createServiceSupabaseOrNull();
  if (!db) return empty;

  const [membersResult, responsesResult, registrationsResult, sessionsResult, communicationResult] =
    await Promise.all([
      db.from("members").select("id,status,join_date,country,age_range").limit(5000),
      db
        .from("census_responses")
        .select("member_id,question_id,response")
        .in("question_id", ["biggest_goal", "obstacles", "occupation", "topics"])
        .limit(20000),
      db
        .from("registrations")
        .select("member_id,session_id,attendance_status,follow_up_completed")
        .limit(10000),
      db.from("kingshour_sessions").select("id,date,meet_link,status").limit(500),
      db.from("communications").select("sent_at").order("sent_at", { ascending: false }).limit(1),
    ]);

  for (const result of [
    membersResult,
    responsesResult,
    registrationsResult,
    sessionsResult,
    communicationResult,
  ]) {
    if (result.error) throw result.error;
  }

  const members = (membersResult.data ?? []) as MemberRow[];
  const responses = (responsesResult.data ?? []) as ResponseRow[];
  const registrations = (registrationsResult.data ?? []) as RegistrationRow[];
  const sessions = (sessionsResult.data ?? []) as SessionRow[];
  const totalKings = members.filter((member) => member.status === "king").length;
  const completedAttendance = registrations.filter(
    (registration) => registration.attendance_status !== "unknown",
  );
  const attended = completedAttendance.filter(
    (registration) => registration.attendance_status === "attended",
  ).length;

  const ageCounts = countStrings(members.map((member) => member.age_range));
  const countryCounts = countStrings(members.map((member) => member.country));
  const occupations = responseValues(responses, "occupation");
  const topics = responseValues(responses, "topics", true).map((value) => labelFor("topics", value));
  const goals = rankResponses(responses, "biggest_goal");
  const struggles = rankResponses(responses, "obstacles", true, true);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionById = new Map(sessions.map((session) => [session.id, session]));
  const pendingFollowUps = registrations.filter((registration) => {
    const session = sessionById.get(registration.session_id);
    return (
      registration.attendance_status === "attended" &&
      !registration.follow_up_completed &&
      session?.status === "done"
    );
  }).length;
  const missingMeetLinks = sessions.filter(
    (session) => session.status !== "done" && !session.meet_link,
  ).length;
  const incomplete = members.filter((member) => member.status === "incomplete").length;

  const attention: AttentionItem[] = [];
  if (missingMeetLinks) {
    attention.push({
      label: "KingsHour link missing",
      detail: "Add the Google Meet link before invitations are scheduled.",
      count: missingMeetLinks,
      href: "/admin/kingshour",
      tone: "attention",
    });
  }
  if (pendingFollowUps) {
    attention.push({
      label: "Follow-up still open",
      detail: "Attended Kings are waiting for the session follow-up to be closed.",
      count: pendingFollowUps,
      href: "/admin/kingshour",
      tone: "attention",
    });
  }
  if (incomplete) {
    attention.push({
      label: "Incomplete Census records",
      detail: "Review where these Kings stopped before deciding whether to follow up.",
      count: incomplete,
      href: "/admin/kings?status=incomplete",
      tone: "neutral",
    });
  }

  return {
    configured: true,
    totalKings,
    joinedThisWeek: members.filter(
      (member) => member.status === "king" && Date.parse(member.join_date) >= weekAgo,
    ).length,
    censusCompletionRate: members.length ? Math.round((totalKings / members.length) * 100) : 0,
    daysToKingsHour: daysUntilNextKingsHour(),
    attendanceRate: completedAttendance.length
      ? Math.round((attended / completedAttendance.length) * 100)
      : null,
    lastEmailAt: communicationResult.data?.[0]?.sent_at ?? null,
    topGoal: goals[0]?.label ?? null,
    biggestStruggle: struggles[0]?.label ?? null,
    attention,
    ageDistribution: toDistribution(ageCounts, 6),
    countryDistribution: toDistribution(countryCounts, 6),
    occupationDistribution: toDistribution(countStrings(occupations), 6),
    topicDistribution: toDistribution(countStrings(topics), 6),
    monthlySignups: monthlyJoinDistribution(members),
  };
}

export interface Insights {
  configured: boolean;
  totalKings: number;
  topStruggles: Ranked[];
  topGoals: Ranked[];
  topNeeds: Ranked[];
  mostRequestedTopics: Ranked[];
  fastestGrowingCountry: string | null;
  fastestGrowingCountryDelta: number;
  mostRepresentedAgeBand: string | null;
}

/** Aggregated Census answers that can inform the next KingsHour topic. */
export async function getInsights(): Promise<Insights> {
  const empty: Insights = {
    configured: false,
    totalKings: 0,
    topStruggles: [],
    topGoals: [],
    topNeeds: [],
    mostRequestedTopics: [],
    fastestGrowingCountry: null,
    fastestGrowingCountryDelta: 0,
    mostRepresentedAgeBand: null,
  };
  const db = createServiceSupabaseOrNull();
  if (!db) return empty;

  const [{ data: responseRows, error: responseError }, { data: memberRows, error: memberError }] =
    await Promise.all([
      db
        .from("census_responses")
        .select("member_id,question_id,response")
        .in("question_id", ["obstacles", "biggest_goal", "need_most", "topics"])
        .limit(20000),
      db.from("members").select("id,status,country,age_range,join_date").limit(5000),
    ]);
  if (responseError) throw responseError;
  if (memberError) throw memberError;

  const responses = (responseRows ?? []) as ResponseRow[];
  const members = (memberRows ?? []) as MemberRow[];
  const countryMomentum = fastestGrowingCountry(members);

  return {
    configured: true,
    totalKings: members.filter((member) => member.status === "king").length,
    topStruggles: rankResponses(responses, "obstacles", true, true),
    topGoals: rankResponses(responses, "biggest_goal"),
    topNeeds: rankResponses(responses, "need_most", false, true),
    mostRequestedTopics: rankResponses(responses, "topics", true, true),
    fastestGrowingCountry: countryMomentum.label,
    fastestGrowingCountryDelta: countryMomentum.delta,
    mostRepresentedAgeBand: rankMap(countStrings(members.map((member) => member.age_range)), 1)[0]
      ?.label ?? null,
  };
}

/** Turn a stored option value into its human label using the canonical question bank. */
function labelFor(questionId: string, value: string): string {
  return getQuestion(questionId)?.options?.find((option) => option.value === value)?.label ?? value;
}

function responseValues(rows: ResponseRow[], questionId: string, flatten = false): string[] {
  return rows
    .filter((row) => row.question_id === questionId)
    .flatMap((row) => {
      if (flatten && Array.isArray(row.response)) return row.response.map(String);
      return typeof row.response === "string" ? [row.response] : [];
    })
    .map((value) => value.trim())
    .filter(Boolean);
}

function rankResponses(
  rows: ResponseRow[],
  questionId: string,
  flatten = false,
  mapLabels = false,
): Ranked[] {
  const display = new Map<string, string>();
  const counts = new Map<string, number>();
  for (const raw of responseValues(rows, questionId, flatten)) {
    const label = mapLabels ? labelFor(questionId, raw) : raw;
    const key = label.toLocaleLowerCase();
    display.set(key, label);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([key, count]) => ({ label: display.get(key) ?? key, count }));
}

function countStrings(values: Array<string | null | undefined>): Map<string, number> {
  const map = new Map<string, number>();
  for (const value of values) {
    const key = value?.trim();
    if (key) map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

function rankMap(counts: Map<string, number>, limit = 6): Ranked[] {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function toDistribution(counts: Map<string, number>, limit = 6): DistributionItem[] {
  const ranked = rankMap(counts, limit);
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  return ranked.map((item) => ({
    ...item,
    share: total ? Math.round((item.count / total) * 100) : 0,
  }));
}

function monthlyJoinDistribution(members: MemberRow[]): DistributionItem[] {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1));
    return {
      key: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleDateString("en", { month: "short" }),
      count: 0,
    };
  });
  const byKey = new Map(months.map((month) => [month.key, month]));
  for (const member of members) {
    const date = new Date(member.join_date);
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    const month = byKey.get(key);
    if (month) month.count += 1;
  }
  const max = Math.max(...months.map((month) => month.count), 1);
  return months.map(({ label, count }) => ({
    label,
    count,
    share: Math.round((count / max) * 100),
  }));
}

function fastestGrowingCountry(members: MemberRow[]): { label: string | null; delta: number } {
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const current = new Map<string, number>();
  const previous = new Map<string, number>();

  for (const member of members) {
    if (!member.country) continue;
    const joined = Date.parse(member.join_date);
    if (joined >= now - thirtyDays) bump(current, member.country);
    else if (joined >= now - 2 * thirtyDays) bump(previous, member.country);
  }

  const candidates = [...new Set([...current.keys(), ...previous.keys()])]
    .map((label) => ({ label, delta: (current.get(label) ?? 0) - (previous.get(label) ?? 0) }))
    .sort((a, b) => b.delta - a.delta || (current.get(b.label) ?? 0) - (current.get(a.label) ?? 0));
  return candidates[0] ?? { label: null, delta: 0 };
}

function daysUntilNextKingsHour(): number {
  const ms = nextKingsHour().getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}
