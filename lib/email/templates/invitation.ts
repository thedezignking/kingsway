// KingsHour Invitation — before each session (PRD §4.4 #2).
// Date, time, theme, expectations, preparation. Includes .ics calendar invite.
// TODO(copy): author final wording in Kingsway's voice. Placeholder only.
import type { BaseEmailData, RenderedEmail } from "./types";

export interface InvitationData extends BaseEmailData {
  topicTitle: string;
  date: Date;
  meetLink: string | null;
  sessionId: string;
  ics: string; // built via lib/email/ics.ts
}

export function invitationEmail(data: InvitationData): RenderedEmail {
  return {
    subject: `PLACEHOLDER — You're invited: KingsHour (${data.topicTitle})`,
    html: `<!-- TODO(copy): theme, date/time, what to expect, how to prepare, RSVP CTA. -->
      <p>Placeholder invitation for ${data.firstName}.</p>
      <p><a href="${data.appUrl}/rsvp/${data.sessionId}">RSVP</a></p>`,
    ics: data.ics,
  };
}
