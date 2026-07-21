// Kingsway — King's Census screen sequence + validation (pure logic, no React).
// The engine renders this ordered list of screens one at a time. Kept pure so it's easy to reason
// about and could be unit-tested.

import { CENSUS_CHAPTERS, CENSUS_QUESTIONS } from "./questions";
import type { CensusQuestion } from "./types";

export type Screen =
  | { kind: "intro"; chapter: number }
  | { kind: "question"; question: CensusQuestion; chapter: number }
  | { kind: "interstitial"; placement: "midpoint" | "near_end"; chapter: number }
  | { kind: "celebration"; chapter: number };

/**
 * Build the full ordered screen list:
 *   ch1–5: [intro] + question screens, with a midpoint nudge after ch3 and a near-end nudge
 *   inside ch5; ch6: celebration only.
 * Progress stays chapter-level in the UI ("Chapter 3 of 6"); this is the per-screen flow.
 */
export function buildSequence(): Screen[] {
  const screens: Screen[] = [];
  for (const ch of CENSUS_CHAPTERS) {
    if (ch.index === 6) {
      screens.push({ kind: "celebration", chapter: 6 });
      continue;
    }
    if (ch.hasIntro) screens.push({ kind: "intro", chapter: ch.index });

    const questions = CENSUS_QUESTIONS.filter((q) => q.chapter === ch.index);
    questions.forEach((question, i) => {
      screens.push({ kind: "question", question, chapter: ch.index });
      // Near-end nudge: after the first question of chapter 5.
      if (ch.index === 5 && i === 0) {
        screens.push({ kind: "interstitial", placement: "near_end", chapter: 5 });
      }
    });

    // Midpoint nudge: right after chapter 3's questions.
    if (ch.index === 3) {
      screens.push({ kind: "interstitial", placement: "midpoint", chapter: 3 });
    }
  }
  return screens;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Lenient E.164-ish: optional +, 7–15 digits (spaces/dashes stripped by the caller).
const PHONE_RE = /^\+?\d{7,15}$/;

/** Whether a value counts as "answered" for advancing/required checks. */
export function isAnswered(question: CensusQuestion, value: unknown): boolean {
  if (value === undefined || value === null) return false;
  switch (question.input) {
    case "chip_multi":
      return Array.isArray(value) && value.length > 0;
    case "toggle":
      return typeof value === "boolean";
    case "slider":
    case "scale":
      return typeof value === "number";
    case "calendar":
      return (
        typeof value === "object" &&
        value !== null &&
        "month" in value &&
        "day" in value
      );
    case "location": {
      const o = value as { country?: string; state_city?: string } | null;
      return Boolean(o?.country && o?.state_city?.trim());
    }
    default:
      return typeof value === "string" && value.trim().length > 0;
  }
}

/**
 * Validate a value for a question. Returns an error string (gentle, never scolding) or null.
 * Required-but-empty is only an error when the user tries to advance — see the engine.
 */
export function validate(question: CensusQuestion, value: unknown): string | null {
  // Composite location: give specific guidance for each missing part.
  if (question.input === "location") {
    const o = (value as { country?: string; state_city?: string } | null) ?? {};
    if (!o.country) return "Pick your country to continue.";
    if (!o.state_city?.trim()) return "Add your state or city.";
    return null;
  }
  if (!isAnswered(question, value)) {
    return question.required ? "This one's needed to continue." : null;
  }
  if (question.input === "email" && typeof value === "string" && !EMAIL_RE.test(value.trim())) {
    return "That doesn't look like an email — mind checking it?";
  }
  if (question.input === "tel" && typeof value === "string") {
    const stripped = value.replace(/[\s-]/g, "");
    if (!PHONE_RE.test(stripped)) return "That number looks off — mind checking it?";
  }
  if (question.input === "chip_multi" && question.maxSelect && Array.isArray(value)) {
    if (value.length > question.maxSelect) {
      return `Pick up to ${question.maxSelect}.`;
    }
  }
  return null;
}

/** Count of answerable question screens (for a secondary percentage, if shown). */
export const TOTAL_ANSWERABLE = CENSUS_QUESTIONS.length;
