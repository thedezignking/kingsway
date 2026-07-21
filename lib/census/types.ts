// Kingsway — King's Census type definitions (PRD §4.2)
// The question bank in ./questions.ts is the single canonical source consumed by
// both the census engine and the admin. Never duplicate the question list.

/** Input variants map 1:1 to QuestionScreen renderer variants (PRD §7). */
export type CensusInputType =
  | "text" //           short free text
  | "long_text" //      multi-line typing screen (kept earned — few of these)
  | "email" //          validated email
  | "tel" //            phone with dial-code prefix, stored E.164
  | "country_select" // searchable country list -> auto-advance
  | "location" //       country select + state/city on one screen -> Next; value { country, state_city }
  | "chip_single" //    single-select chips  -> auto-advance
  | "radio" //          single-select radio  -> auto-advance
  | "chip_multi" //     multi-select chips   -> Next button
  | "scale" //          tap-one labeled scale (replaces the boring slider) -> auto-advance
  | "slider" //         numeric slider (legacy; prefer `scale`)
  | "toggle" //         boolean opt-in
  | "calendar"; //      month + day picker (birthday, deferred use)

export interface CensusOption {
  /** Stable value stored in the response. */
  value: string;
  /** Human label (final copy authored separately in Kingsway's voice). */
  label: string;
}

export interface CensusQuestion {
  /** Stable id — response storage keys on it (PRD §4.2). */
  id: string;
  /** Grouping for the chapter-level progress indicator (1..6). */
  chapter: number;
  input: CensusInputType;
  /** What to collect — NOT on-screen copy (authored separately, PRD §4.2 note). */
  asksFor: string;
  options?: CensusOption[];
  required: boolean;
  /** Single-selects auto-advance; multi/text/slider keep a Next button (PRD §4.2 #1). */
  autoAdvance: boolean;
  /** Max selections for multi-select (e.g. priorities up to 3, topics up to 5). */
  maxSelect?: number;
  /** Option set was *(proposed)* in the blueprint — confirm before build (PRD §4.2). */
  proposed?: boolean;
  /** Collected in V1 but not used until a later feature ships (PRD §4.2). */
  deferred?: boolean;
  /** A high-signal answer that may trigger a capped micro-acknowledgment (PRD §4.2 #3). */
  ackTrigger?: boolean;
  /** Free-form config note carried from the PRD for the engine implementer. */
  note?: string;
}

/** Chapter-level metadata for progress + intro screens (PRD §4.2). */
export interface CensusChapter {
  index: number;
  /** Internal name; framed as identity/becoming in UI copy (authored separately). */
  name: string;
  /** Chapters 1–5 open with a reflective intro; chapter 6 has none (PRD §4.2 #2). */
  hasIntro: boolean;
  /** Intent of the intro statement (copy TBD, PRD §4.2 "Chapter intros"). */
  introIntent?: string;
}

export const CENSUS_VERSION = 1;
