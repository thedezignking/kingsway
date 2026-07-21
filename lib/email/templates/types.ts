// Kingsway — email template contract (PRD §4.4).
// Copy is authored separately in Kingsway's member-facing voice (warm, calm, a
// thoughtful letter — never a campaign). These templates carry STRUCTURE only:
// one purpose, one clear next step. Do not ship the placeholder copy as-is.

export interface RenderedEmail {
  subject: string;
  html: string;
  /** Plain-text alternative for accessibility and resilient delivery. */
  text?: string;
  /** Optional .ics attachment (KingsHour invitation). */
  ics?: string;
}

/** Shared data available to most templates. */
export interface BaseEmailData {
  firstName: string;
  appUrl: string;
}
