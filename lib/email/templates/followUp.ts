// KingsHour Follow-Up — after each session.
import type { BaseEmailData, RenderedEmail } from "./types";

export interface FollowUpData extends BaseEmailData {
  topicTitle: string;
  nextSessionDate: Date | null;
  resources: string[];
}

export function followUpEmail(data: FollowUpData): RenderedEmail {
  const resources = data.resources.length
    ? `<ul>${data.resources.map((resource) => `<li><a href="${resource}">${resource}</a></li>`).join("")}</ul>`
    : "";

  return {
    subject: "After KingsHour",
    html: `
      <p>Hey ${data.firstName},</p>
      <p>Thank you for showing up for KingsHour.</p>
      <p>This was the conversation: <strong>${data.topicTitle}</strong>.</p>
      <p>Keep one question close as you return to building: what did this month show you about the person doing the work?</p>
      ${resources}`,
    text: `Hey ${data.firstName},\n\nThank you for showing up for KingsHour.\n\nConversation: ${data.topicTitle}\n\nKeep one question close as you return to building: what did this month show you about the person doing the work?`,
  };
}
