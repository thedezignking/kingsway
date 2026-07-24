// Kingsway — client-side census draft persistence (resumability, PRD §4.2 #5).
// Same-device resume via localStorage: instant, no round-trip per keystroke. Server persistence
// (once email is known) is what makes partial records visible to admins and dedupes by email.
"use client";

export interface CensusDraft {
  answers: Record<string, unknown>;
  screenIndex: number;
  memberId?: string;
  pendingSessionId?: string;
  updatedAt: number;
}

const KEY = "kingsway_census_v1";

export function loadDraft(): CensusDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CensusDraft;
  } catch {
    return null;
  }
}

export function saveDraft(draft: CensusDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...draft, updatedAt: Date.now() }));
  } catch {
    // Storage full or blocked — resume degrades gracefully; the census still works in-session.
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

// The King's first name persists past the (cleared) draft so /welcome can greet them by name.
const NAME_KEY = "kingsway_king_name";

export function saveKingName(name?: string): void {
  if (typeof window === "undefined" || !name) return;
  try {
    window.localStorage.setItem(NAME_KEY, name);
  } catch {
    // ignore
  }
}

export function loadKingName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(NAME_KEY);
  } catch {
    return null;
  }
}

const PENDING_KINGSHOUR_KEY = "kingsway_pending_kingshour";

export interface PendingKingsHour {
  sessionId: string;
  slug?: string;
  email?: string;
  source?: string;
}

export function savePendingKingsHour(value: PendingKingsHour): void {
  if (typeof window === "undefined" || !value.sessionId) return;
  try {
    window.sessionStorage.setItem(PENDING_KINGSHOUR_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function loadPendingKingsHour(): PendingKingsHour | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PENDING_KINGSHOUR_KEY);
    return raw ? (JSON.parse(raw) as PendingKingsHour) : null;
  } catch {
    return null;
  }
}

export function clearPendingKingsHour(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(PENDING_KINGSHOUR_KEY);
  } catch {
    // ignore
  }
}
