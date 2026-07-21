// KingsHour Follow-Up — after each session (PRD §4.4 #4).
// Key insights, reflection questions, practical actions, resources, next month's date.
// TODO(copy): author final wording in Kingsway's voice. Placeholder only.
import type { BaseEmailData, RenderedEmail } from "./types";

export interface FollowUpData extends BaseEmailData {
  topicTitle: string;
  nextSessionDate: Date | null;
  resources: string[];
}

export function followUpEmail(data: FollowUpData): RenderedEmail {
  return {
    subject: "PLACEHOLDER — After KingsHour: your reflections",
    html: `<!-- TODO(copy): key insights, reflection questions, practical actions,
      resources, next month's date. -->
      <p>Placeholder follow-up for ${data.firstName}: ${data.topicTitle}.</p>`,
  };
}
