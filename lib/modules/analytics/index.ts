// Kingsway — analytics module (PRD §5.1, §5.3). Aggregates census + member data so admins read
// answers, not raw responses. Returns null/empty when Supabase isn't configured (keyless scaffold).
import "server-only";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import { getQuestion } from "@/lib/census/questions";
import { nextKingsHour } from "@/lib/kingshour/schedule";

export interface Ranked {
  label: string;
  count: number;
}

export interface Insights {
  configured: boolean;
  topStruggles: Ranked[]; //     from `obstacles`
  topNeeds: Ranked[]; //         from `need_most`
  mostRequestedTopics: Ranked[]; // from `topics`
  fastestGrowingCountry: string | null;
  mostActiveAgeBand: string | null;
}

/** Turn a stored option value into its human label using the canonical question bank. */
function labelFor(questionId: string, value: string): string {
  const opt = getQuestion(questionId)?.options?.find((o) => o.value === value);
  return opt?.label ?? value;
}

function rank(counts: Map<string, number>, limit = 5): Ranked[] {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export async function getInsights(): Promise<Insights> {
  const empty: Insights = {
    configured: false,
    topStruggles: [],
    topNeeds: [],
    mostRequestedTopics: [],
    fastestGrowingCountry: null,
    mostActiveAgeBand: null,
  };
  const db = createServiceSupabaseOrNull();
  if (!db) return empty;

  const [{ data: responses }, { data: members }] = await Promise.all([
    db.from("census_responses").select("question_id,response"),
    db.from("members").select("country,age_range"),
  ]);

  const struggles = new Map<string, number>();
  const needs = new Map<string, number>();
  const topics = new Map<string, number>();

  for (const r of responses ?? []) {
    const qid = r.question_id as string;
    const val = r.response as unknown;
    if (qid === "obstacles" && Array.isArray(val)) {
      for (const v of val) bump(struggles, labelFor("obstacles", String(v)));
    } else if (qid === "topics" && Array.isArray(val)) {
      for (const v of val) bump(topics, labelFor("topics", String(v)));
    } else if (qid === "need_most" && typeof val === "string") {
      bump(needs, labelFor("need_most", val));
    }
  }

  const countries = new Map<string, number>();
  const ages = new Map<string, number>();
  for (const m of members ?? []) {
    if (m.country) bump(countries, m.country as string);
    if (m.age_range) bump(ages, m.age_range as string);
  }

  return {
    configured: true,
    topStruggles: rank(struggles),
    topNeeds: rank(needs),
    mostRequestedTopics: rank(topics),
    fastestGrowingCountry: rank(countries, 1)[0]?.label ?? null,
    mostActiveAgeBand: rank(ages, 1)[0]?.label ?? null,
  };
}

export interface OverviewStats {
  configured: boolean;
  totalKings: number;
  joinedThisWeek: number;
  censusCompletionRate: number; // 0–100
  daysToKingsHour: number;
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const db = createServiceSupabaseOrNull();
  const base: OverviewStats = {
    configured: false,
    totalKings: 0,
    joinedThisWeek: 0,
    censusCompletionRate: 0,
    daysToKingsHour: 0,
  };
  if (!db) return base;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [total, kings, thisWeek] = await Promise.all([
    db.from("members").select("id", { count: "exact", head: true }),
    db.from("members").select("id", { count: "exact", head: true }).eq("status", "king"),
    db.from("members").select("id", { count: "exact", head: true }).gte("join_date", weekAgo),
  ]);

  const totalCount = total.count ?? 0;
  const kingCount = kings.count ?? 0;

  return {
    configured: true,
    totalKings: kingCount,
    joinedThisWeek: thisWeek.count ?? 0,
    censusCompletionRate: totalCount ? Math.round((kingCount / totalCount) * 100) : 0,
    daysToKingsHour: daysUntilNextKingsHour(),
  };
}

function daysUntilNextKingsHour(): number {
  const ms = nextKingsHour().getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}
