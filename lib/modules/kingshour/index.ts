// Kingsway — KingsHour module (PRD §4.6, §5.4). Session lifecycle + RSVP + attendance.
import { notImplemented } from "@/lib/modules/notImplemented";
import type {
  KingsHourSession,
  AttendanceStatus,
} from "@/lib/supabase/types";

export interface SessionInput {
  topicId: string | null;
  date: string;
  description?: string;
  facilitator?: string;
  meetLink?: string; //     created manually, pasted in (PRD §4.6)
  resources?: string[];
}

export async function createSession(_input: SessionInput): Promise<KingsHourSession> {
  return notImplemented("kingshour.createSession");
}

export async function listSessions(): Promise<KingsHourSession[]> {
  return notImplemented("kingshour.listSessions");
}

export async function getSession(_id: string): Promise<KingsHourSession | null> {
  return notImplemented("kingshour.getSession");
}

/** One-click RSVP for /rsvp/[sessionId] (PRD §4.6 — V1 minimal RSVP). */
export async function rsvp(_sessionId: string, _memberId: string): Promise<void> {
  return notImplemented("kingshour.rsvp");
}

/** Admin marks attendance per member per session (PRD §4.6). */
export async function markAttendance(
  _sessionId: string,
  _memberId: string,
  _status: AttendanceStatus,
): Promise<void> {
  return notImplemented("kingshour.markAttendance");
}
