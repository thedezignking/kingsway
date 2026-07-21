// Kingsway — database types.
// NOTE: This is a hand-written minimal shape mirroring supabase/migrations/0001_init.sql.
// Replace with generated types once a Supabase project exists:
//   npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts

export type MemberStatus = "king" | "incomplete";
export type CensusCompletionStatus = "in_progress" | "complete";
export type SessionStatus = "upcoming" | "live" | "done";
export type RegistrationStatus = "registered" | "cancelled";
export type AttendanceStatus = "unknown" | "attended" | "no_show";
export type CommunicationType =
  | "welcome"
  | "invitation"
  | "reminder"
  | "follow_up"
  | "update";
export type TopicPillar =
  | "foundation"
  | "career_skills"
  | "money"
  | "business"
  | "faith_character"
  | "relationships"
  | "mindset";
export type TopicStatus = "draft" | "active" | "archived";

export interface Member {
  id: string;
  first_name: string;
  email: string;
  phone: string | null;
  age_range: string | null;
  country: string | null;
  state_city: string | null;
  birthday_month: number | null;
  birthday_day: number | null;
  join_date: string;
  status: MemberStatus;
  last_activity: string;
}

export interface CensusResponse {
  id: string;
  member_id: string;
  question_id: string;
  question_version: number;
  response: unknown;
  completion_status: CensusCompletionStatus;
  submitted_at: string | null;
  updated_at: string;
}

export interface CensusProgress {
  member_id: string;
  current_screen: string | null;
  chapter: number | null;
  updated_at: string;
}

export interface Topic {
  id: string;
  pillar: TopicPillar;
  title: string;
  purpose: string | null;
  description: string | null;
  discussion_questions: string[] | null;
  reflection_prompts: string[] | null;
  assignment: string | null;
  status: TopicStatus;
  created_at: string;
}

export interface KingsHourSession {
  id: string;
  topic_id: string | null;
  date: string;
  description: string | null;
  facilitator: string | null;
  meet_link: string | null;
  resources: string[] | null;
  status: SessionStatus;
  created_at: string;
}

export interface Registration {
  id: string;
  member_id: string;
  session_id: string;
  registration_status: RegistrationStatus;
  attendance_status: AttendanceStatus;
  follow_up_completed: boolean;
  created_at: string;
}

export interface Communication {
  id: string;
  member_id: string;
  type: CommunicationType;
  session_id: string | null;
  subject: string | null;
  sent_at: string;
  opened: boolean;
  calendar_accepted: boolean;
  provider_id: string | null;
}
