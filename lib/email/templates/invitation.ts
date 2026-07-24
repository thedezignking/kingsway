// KingsHour Invitation — before each session. Includes .ics calendar invite.
import type { BaseEmailData, RenderedEmail } from "./types";

export interface InvitationData extends BaseEmailData {
  topicTitle: string;
  date: Date;
  meetLink: string | null;
  sessionId: string;
  ics: string;
}

export function invitationEmail(data: InvitationData): RenderedEmail {
  const date = data.date.toLocaleString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    subject: `KingsHour: ${data.topicTitle}`,
    html: `
      <p>Hey ${data.firstName},</p>
      <p>The next KingsHour is set for <strong>${date}</strong>.</p>
      <p>This one is about <strong>${data.topicTitle}</strong>.</p>
      <p>If you are coming, confirm your place here:</p>
      <p><a href="${data.appUrl}/rsvp/${data.sessionId}">Register for KingsHour</a></p>
      <p>We will keep it simple: one honest conversation, then everyone goes back to building.</p>`,
    text: `Hey ${data.firstName},\n\nThe next KingsHour is set for ${date}.\n\nTopic: ${data.topicTitle}\n\nRegister: ${data.appUrl}/rsvp/${data.sessionId}`,
    ics: data.ics,
  };
}
