// Kingsway — King's Census canonical question bank (PRD §4.2, V1)
// One entry = one screen. `id` is stable and versioned; response storage keys on it.
// `asksFor` describes what to collect — NOT the on-screen wording (authored separately
// in Kingsway's voice, PRD §4.2 note). This is data; the engine (next pass) reads it.
//
// Version this file's CENSUS_VERSION when the question set changes so history stays intact.

import {
  CENSUS_VERSION,
  type CensusChapter,
  type CensusQuestion,
} from "./types";

export { CENSUS_VERSION };

// ---------------------------------------------------------------------------
// Chapters (progress is chapter-level: "Chapter 3 of 6"). PRD §4.2.
// ---------------------------------------------------------------------------
export const CENSUS_CHAPTERS: CensusChapter[] = [
  { index: 1, name: "About You", hasIntro: true, introIntent: "Set an honest, conversational tone." },
  { index: 2, name: "Your Current Reality", hasIntro: true, introIntent: "Frame 'where you are today'." },
  { index: 3, name: "Your Future", hasIntro: true, introIntent: "Frame 'where you're going'." },
  { index: 4, name: "Growth", hasIntro: true, introIntent: "Frame facing obstacles honestly." },
  { index: 5, name: "Kingsway", hasIntro: true, introIntent: "Frame 'help us shape Kingsway'; reuse first name." },
  { index: 6, name: "Welcome Home", hasIntro: false, introIntent: undefined }, // payoff — lands fast, no intro
];

// ---------------------------------------------------------------------------
// Question bank. Chapter 6 has no questions (celebration only).
// ---------------------------------------------------------------------------
export const CENSUS_QUESTIONS: CensusQuestion[] = [
  // ---- Chapter 1 — About You ----------------------------------------------
  { id: "first_name", chapter: 1, input: "text", asksFor: "What to call them (single field)", required: true, autoAdvance: false, note: "greetings extract the first name only (first token)" },
  { id: "email", chapter: 1, input: "email", asksFor: "Email address", required: true, autoAdvance: false, note: "validate format" },
  {
    id: "age_range", chapter: 1, input: "chip_single", asksFor: "Age range", required: true, autoAdvance: true, proposed: true,
    options: [
      { value: "under_18", label: "Under 18" },
      { value: "18_20", label: "18–20" },
      { value: "21_24", label: "21–24" },
      { value: "25_29", label: "25–29" },
      { value: "30_34", label: "30–34" },
      { value: "35_plus", label: "35+" },
    ],
  },
  { id: "location", chapter: 1, input: "location", asksFor: "Country + state/city", required: true, autoAdvance: false, note: "searchable country select; state/city field appears under it on the SAME screen once a country is picked. Country also seeds the phone dial code. Stored as { country, state_city }." },
  { id: "phone", chapter: 1, input: "tel", asksFor: "WhatsApp number", required: true, autoAdvance: false, note: "dial code seeded from location.country, editable; store E.164" },
  { id: "birthday", chapter: 1, input: "calendar", asksFor: "Birthday (optional)", required: false, autoAdvance: false, deferred: true, note: "DEFERRED FEATURE — month+day only, never full DOB. Do not wire automation to it." },

  // ---- Chapter 2 — Your Current Reality -----------------------------------
  {
    id: "season", chapter: 2, input: "chip_single", asksFor: "Current life phase (life-phase category)", required: true, autoAdvance: true, ackTrigger: true,
    options: [
      { value: "student", label: "Student" },
      { value: "founder", label: "Founder" },
      { value: "freelancer", label: "Freelancer" },
      { value: "creator", label: "Creator" },
      { value: "employee", label: "Employee" },
      { value: "something_else", label: "Something else" },
    ],
  },
  { id: "occupation", chapter: 2, input: "text", asksFor: "Specific role/day-to-day (distinct from season)", required: true, autoAdvance: false, note: "e.g. 'final-year CS student', 'solo SaaS founder'" },
  {
    id: "income_current", chapter: 2, input: "radio", asksFor: "Current monthly income", required: true, autoAdvance: true, note: "screen should feel reassuring/non-judgmental (copy TBD)",
    options: [
      { value: "none", label: "No income yet" },
      { value: "under_100", label: "Under $100" },
      { value: "100_300", label: "$100–300" },
      { value: "300_700", label: "$300–700" },
      { value: "700_1500", label: "$700–1,500" },
      { value: "1500_3000", label: "$1,500–3,000" },
      { value: "3000_plus", label: "$3,000+" },
    ],
  },
  {
    id: "priorities", chapter: 2, input: "chip_multi", asksFor: "Main focus this month (up to 3)", required: true, autoAdvance: false, maxSelect: 3, proposed: true,
    options: [
      { value: "learning_skill", label: "Learning a skill" },
      { value: "shipping_product", label: "Shipping a product" },
      { value: "getting_clients", label: "Getting clients" },
      { value: "money", label: "Money" },
      { value: "consistency", label: "Consistency" },
      { value: "health", label: "Health" },
      { value: "faith", label: "Faith" },
      { value: "relationships", label: "Relationships" },
    ],
  },

  // ---- Chapter 3 — Your Future --------------------------------------------
  { id: "biggest_goal", chapter: 3, input: "text", asksFor: "Biggest goal this year", required: true, autoAdvance: false },
  {
    id: "income_desired", chapter: 3, input: "radio", asksFor: "Desired monthly income in 12 months", required: true, autoAdvance: true, ackTrigger: true, note: "ack on ambitious pick",
    options: [
      { value: "first_100", label: "First $100" },
      { value: "100_300", label: "$100–300" },
      { value: "300_700", label: "$300–700" },
      { value: "700_1500", label: "$700–1,500" },
      { value: "1500_3000", label: "$1,500–3,000" },
      { value: "3000_5000", label: "$3,000–5,000" },
      { value: "5000_plus", label: "$5,000+" },
    ],
  },
  { id: "confidence", chapter: 3, input: "scale", asksFor: "Confidence in reaching the goal", required: true, autoAdvance: true, note: "store 1–10; never surfaced back to the King as a score" },

  // ---- Chapter 4 — Growth -------------------------------------------------
  {
    id: "obstacles", chapter: 4, input: "chip_multi", asksFor: "Biggest obstacles (up to 3) + optional 'other' text", required: true, autoAdvance: false, maxSelect: 3, proposed: true, ackTrigger: true, note: "ack on a named obstacle; allow optional 'other' free text",
    options: [
      { value: "consistency", label: "Consistency" },
      { value: "focus", label: "Focus" },
      { value: "money", label: "Money" },
      { value: "time", label: "Time" },
      { value: "skills", label: "Skills" },
      { value: "confidence", label: "Confidence" },
      { value: "support", label: "Support" },
      { value: "direction", label: "Direction" },
    ],
  },
  {
    id: "need_most", chapter: 4, input: "radio", asksFor: "What they need most from Kingsway", required: true, autoAdvance: true, proposed: true,
    options: [
      { value: "clarity", label: "Clarity" },
      { value: "accountability", label: "Accountability" },
      { value: "community", label: "Community" },
      { value: "skills", label: "Skills" },
      { value: "encouragement", label: "Encouragement" },
      { value: "direction", label: "Direction" },
    ],
  },

  // ---- Chapter 5 — Kingsway -----------------------------------------------
  {
    id: "topics", chapter: 5, input: "chip_multi", asksFor: "Topics they want to grow in (up to 5)", required: true, autoAdvance: false, maxSelect: 5,
    options: [
      { value: "faith", label: "Faith" },
      { value: "business", label: "Business" },
      { value: "money", label: "Money" },
      { value: "career", label: "Career" },
      { value: "leadership", label: "Leadership" },
      { value: "discipline", label: "Discipline" },
      { value: "purpose", label: "Purpose" },
      { value: "health", label: "Health" },
      { value: "relationships", label: "Relationships" },
    ],
  },
  {
    id: "meeting_time", chapter: 5, input: "radio", asksFor: "Preferred KingsHour time", required: true, autoAdvance: true, proposed: true,
    options: [
      { value: "weekend_morning", label: "Weekend morning" },
      { value: "weekend_afternoon", label: "Weekend afternoon" },
      { value: "weekend_evening", label: "Weekend evening" },
      { value: "weekday_evening", label: "Weekday evening" },
    ],
  },
  {
    id: "email_prefs", chapter: 5, input: "radio", asksFor: "Email frequency preference", required: true, autoAdvance: true, proposed: true,
    options: [
      { value: "everything", label: "Everything" },
      { value: "only_kingshour", label: "Only KingsHour" },
      { value: "minimal", label: "Minimal" },
    ],
  },
  {
    id: "how_found", chapter: 5, input: "radio", asksFor: "How they found Kingsway", required: true, autoAdvance: true,
    options: [
      { value: "divine_invited", label: "Divine invited me" },
      { value: "shared", label: "Someone shared it with me" },
      { value: "whatsapp_status", label: "WhatsApp Status" },
      { value: "social_media", label: "Social media" },
      { value: "search", label: "Search" },
      { value: "other", label: "Other" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers (used by the engine + admin; keep logic here, not duplicated).
// ---------------------------------------------------------------------------
export const questionsByChapter = (chapter: number): CensusQuestion[] =>
  CENSUS_QUESTIONS.filter((q) => q.chapter === chapter);

export const getQuestion = (id: string): CensusQuestion | undefined =>
  CENSUS_QUESTIONS.find((q) => q.id === id);

/** Total answerable screens (excludes chapter intros and the ch.6 celebration). */
export const TOTAL_QUESTIONS = CENSUS_QUESTIONS.length;
