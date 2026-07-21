// Kingsway — King's Census member-facing copy (first pass, "builders" voice per PRD).
//
// SEPARATION OF CONCERNS: the canonical question *data* (ids, inputs, options, flags) lives in
// questions.ts. This file holds the *words* shown on screen — kept apart exactly as PRD §4.2 asks
// ("copy is written separately in Kingsway's voice"). These strings are a solid first pass to make
// the loop real and runnable; refine tone later without touching the engine.
//
// Voice: warm, calm, thoughtful — a mentor and a trusted friend. Never hype, corporate, or guru.

export interface ChapterIntroCopy {
  title: string;
  body: string;
}

/**
 * Chapter intro statements (chapters 1–5; chapter 6 has none — it's the celebration).
 * These only *set the tone* for what's coming — a calm one-breath setup, not a question header.
 * First name is used sparingly (once, near the end), never the full name.
 */
export function chapterIntro(chapter: number, firstName?: string): ChapterIntroCopy | null {
  const name = firstName?.trim();
  switch (chapter) {
    case 1:
      return {
        title: "Let's start simple",
        body: "A few quick basics so we know who we're talking to. This part's easy.",
      };
    case 2:
      return {
        title: "Now, the honest part",
        body: "A little about where you actually are right now. No right answers, no judgement.",
      };
    case 3:
      return {
        title: "Let's look ahead",
        body: "Where you're headed matters more than how far you've come. Think out loud.",
      };
    case 4:
      return {
        title: "The real talk",
        body: "Every builder hits walls. Naming yours is how we help you get past them.",
      };
    case 5:
      return {
        title: name ? `Last stretch, ${name}` : "Last stretch",
        body: "A few things so KingsHour is shaped around real people — you.",
      };
    default:
      return null;
  }
}

/** On-screen question prompt per question id. */
export function questionPrompt(id: string): string {
  const prompts: Record<string, string> = {
    first_name: "What should we call you?",
    email: "What's the best email to reach you?",
    phone: "What's your WhatsApp number?",
    age_range: "How old are you?",
    location: "Where do you currently live?",
    birthday: "When's your birthday?",
    season: "Where are you in life right now?",
    occupation: "What do you actually do day to day?",
    income_current: "Roughly what are you earning each month right now?",
    priorities: "What's your main focus this month?",
    biggest_goal: "What's your biggest goal this year?",
    income_desired: "Where would you like your monthly income to be in 12 months?",
    confidence: "How confident are you that you'll get there?",
    obstacles: "What's most getting in your way?",
    need_most: "What do you need most from Kingsway?",
    topics: "What do you want to grow in?",
    meeting_time: "When's the best time for KingsHour?",
    email_prefs: "How much email would you like from us?",
    how_found: "How did you find Kingsway?",
  };
  return prompts[id] ?? id;
}

/** Sample placeholder text for free-text inputs (lowers "what do they want?" friction). */
export function questionPlaceholder(id: string): string | undefined {
  const placeholders: Record<string, string> = {
    first_name: "e.g. Divine",
    email: "you@example.com",
    phone: "801 234 5678",
    occupation: "e.g. final-year CS student, solo SaaS founder",
    biggest_goal: "e.g. Launch my product and reach my first 100 users",
  };
  return placeholders[id];
}

/** Optional helper line under a prompt (reassurance/instruction). */
export function questionHelper(id: string): string | null {
  const helpers: Record<string, string> = {
    income_current: "This stays private. We ask so we can meet you where you are — no judgement.",
    priorities: "Pick up to 3.",
    obstacles: "Pick up to 3.",
    topics: "Pick up to 5.",
    phone: "For KingsHour reminders only.",
    location: "Choose where you live now, not where you’re originally from.",
  };
  return helpers[id] ?? null;
}

export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
}

/** Slider configuration for slider-input questions. */
export function sliderConfig(id: string): SliderConfig {
  switch (id) {
    case "confidence":
      return { min: 1, max: 10, step: 1, minLabel: "Not yet", maxLabel: "Certain" };
    case "overwhelm":
      return { min: 1, max: 5, step: 1, minLabel: "Rarely", maxLabel: "Constantly" };
    default:
      return { min: 1, max: 10, step: 1, minLabel: "Low", maxLabel: "High" };
  }
}

/** Encouraging nudge shown at the midpoint and near the end (calm, non-pushy). */
export function nudge(placement: "midpoint" | "near_end", firstName?: string): string {
  const name = firstName?.trim();
  if (placement === "midpoint") {
    return name
      ? `You're doing great, ${name}. This is how we build Kingsway around real people.`
      : "You're doing great. This is how we build Kingsway around real people.";
  }
  return "Almost there — a few more and you're officially a King.";
}

/**
 * Capped micro-acknowledgment (PRD §4.2 #3): returns a short line for a FEW high-signal answers
 * only, or null. Triggers: season, an *ambitious* income_desired, and a named obstacle.
 */
export function acknowledgment(
  id: string,
  value: unknown,
  firstName?: string,
): string | null {
  const name = firstName?.trim();
  if (id === "season" && typeof value === "string") {
    return "Good to know where you're standing.";
  }
  if (id === "income_desired" && typeof value === "string") {
    const ambitious = value === "3000_5000" || value === "5000_plus";
    return ambitious ? "That's a real goal. We'll take it seriously." : null;
  }
  if (id === "obstacles" && Array.isArray(value) && value.length > 0) {
    return name ? `Naming it is the first step, ${name}.` : "Naming it is the first step.";
  }
  return null;
}

export interface CelebrationCopy {
  headline: string;
  lines: string[];
  calendarCta: string;
  emailNote: string;
}

/** Chapter 6 — Welcome Home. Lands on an emotional high, never "submitted". */
export function celebration(firstName?: string): CelebrationCopy {
  const name = firstName?.trim();
  return {
    headline: name ? `Welcome to Kingsway, ${name}.` : "Welcome to Kingsway.",
    lines: [
      "You're officially a King.",
      "KingsHour happens on the last Sunday of every month — we'll see you there.",
      "Check your email: your welcome note is on its way.",
    ],
    calendarCta: "Add the next KingsHour to your calendar",
    emailNote: "A welcome email has been sent.",
  };
}
