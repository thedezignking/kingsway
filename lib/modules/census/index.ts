// Kingsway — census module (PRD §4.2). The core asset's server side.
// Upserts a Member (keyed by unique email), stores responses (keyed by member+question+version),
// tracks progress for resumability, and on completion promotes the Member to King and queues the
// Welcome email. All writes use the service-role client (bypasses RLS); V1 has no member accounts.
import "server-only";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import { sendWelcome } from "@/lib/modules/communication";
import { CENSUS_QUESTIONS, CENSUS_VERSION } from "@/lib/census/questions";

export { CENSUS_VERSION };

export interface SaveCensusInput {
  memberId?: string;
  version?: number;
  answers: Record<string, unknown>;
  currentScreen?: string;
  chapter?: number;
  completed?: boolean;
}

export interface CensusResult {
  memberId: string | null;
  persisted: boolean; // false when Supabase isn't configured (keyless scaffold)
}

const QUESTION_IDS = new Set(CENSUS_QUESTIONS.map((q) => q.id));

/** Map census answers onto Member columns. */
function memberFieldsFromAnswers(answers: Record<string, unknown>) {
  const birthday = answers.birthday as { month?: number; day?: number } | undefined;
  const location = answers.location as { country?: string; state_city?: string } | undefined;
  return {
    first_name: str(answers.first_name),
    email: str(answers.email)?.toLowerCase(),
    phone: str(answers.phone),
    age_range: str(answers.age_range),
    country: str(location?.country),
    state_city: str(location?.state_city),
    birthday_month: birthday?.month ?? null,
    birthday_day: birthday?.day ?? null,
  };
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/**
 * Persist progress. Creates/updates the Member (by email), upserts every answered response, and
 * records progress. Idempotent — safe to call on every screen advance.
 */
export async function saveCensus(input: SaveCensusInput): Promise<CensusResult> {
  const db = createServiceSupabaseOrNull();
  if (!db) return { memberId: null, persisted: false };

  const version = input.version ?? CENSUS_VERSION;
  const fields = memberFieldsFromAnswers(input.answers);
  if (!fields.email || !fields.first_name) {
    // Not enough to create a Member yet (need name + email, both in chapter 1).
    return { memberId: input.memberId ?? null, persisted: false };
  }

  const completed = input.completed === true;

  // Upsert the Member by unique email. Keep status 'incomplete' until completion.
  const { data: member, error: memberErr } = await db
    .from("members")
    .upsert(
      {
        ...fields,
        status: completed ? "king" : "incomplete",
        last_activity: new Date().toISOString(),
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();
  if (memberErr || !member) throw memberErr ?? new Error("Member upsert failed");
  const memberId = member.id as string;

  // Upsert answered responses.
  const now = new Date().toISOString();
  const rows = Object.entries(input.answers)
    .filter(([qid, val]) => QUESTION_IDS.has(qid) && val !== undefined && val !== null && val !== "")
    .map(([qid, val]) => ({
      member_id: memberId,
      question_id: qid,
      question_version: version,
      response: val,
      completion_status: completed ? "complete" : "in_progress",
      submitted_at: completed ? now : null,
      updated_at: now,
    }));
  if (rows.length) {
    const { error: respErr } = await db
      .from("census_responses")
      .upsert(rows, { onConflict: "member_id,question_id,question_version" });
    if (respErr) throw respErr;
  }

  // Track progress for resumability.
  await db.from("census_progress").upsert(
    {
      member_id: memberId,
      current_screen: input.currentScreen ?? null,
      chapter: input.chapter ?? null,
      updated_at: now,
    },
    { onConflict: "member_id" },
  );

  return { memberId, persisted: true };
}

/**
 * Finalize the census: persist everything as complete, promote to King, and send the Welcome email.
 */
export async function completeCensus(input: SaveCensusInput): Promise<CensusResult> {
  const result = await saveCensus({ ...input, completed: true });
  if (result.persisted && result.memberId) {
    await sendWelcome(result.memberId);
  }
  return result;
}
