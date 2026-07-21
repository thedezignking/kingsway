// Kingsway — members module (PRD §5.2). One Member = one record; everything links here.
import "server-only";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import type { Member, CensusResponse, Communication } from "@/lib/supabase/types";

export interface MemberFilter {
  query?: string; // name / country
}

/** List Kings (most recent first). Returns [] when Supabase isn't configured. */
export async function listMembers(filter?: MemberFilter): Promise<Member[]> {
  const db = createServiceSupabaseOrNull();
  if (!db) return [];
  let q = db.from("members").select("*").order("join_date", { ascending: false }).limit(500);
  if (filter?.query) {
    const term = `%${filter.query}%`;
    q = q.or(`first_name.ilike.${term},email.ilike.${term},country.ilike.${term}`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Member[];
}

export interface MemberProfile {
  member: Member;
  responses: CensusResponse[];
  communications: Communication[];
}

/** Full profile: member + census responses + communication timeline. Null if not found/no keys. */
export async function getMemberProfile(id: string): Promise<MemberProfile | null> {
  const db = createServiceSupabaseOrNull();
  if (!db) return null;
  const { data: member } = await db.from("members").select("*").eq("id", id).single();
  if (!member) return null;
  const [{ data: responses }, { data: communications }] = await Promise.all([
    db.from("census_responses").select("*").eq("member_id", id),
    db.from("communications").select("*").eq("member_id", id).order("sent_at", { ascending: false }),
  ]);
  return {
    member: member as Member,
    responses: (responses ?? []) as CensusResponse[],
    communications: (communications ?? []) as Communication[],
  };
}
