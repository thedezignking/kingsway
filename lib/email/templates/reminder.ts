// KingsHour Reminder — short, closer to the event (PRD §4.4 #3).
// TODO(copy): author final wording in Kingsway's voice. Placeholder only.
import type { BaseEmailData, RenderedEmail } from "./types";

export interface ReminderData extends BaseEmailData {
  topicTitle: string;
  date: Date;
  meetLink: string | null;
}

export function reminderEmail(data: ReminderData): RenderedEmail {
  return {
    subject: "PLACEHOLDER — KingsHour is almost here",
    html: `<!-- TODO(copy): short, calm nudge with join link/time. One next step. -->
      <p>Placeholder reminder for ${data.firstName}: ${data.topicTitle}.</p>`,
  };
}
