// KingsHour Reminder — short, closer to the event.
import type { BaseEmailData, RenderedEmail } from "./types";

export interface ReminderData extends BaseEmailData {
  topicTitle: string;
  date: Date;
  meetLink: string | null;
}

export function reminderEmail(data: ReminderData): RenderedEmail {
  const date = data.date.toLocaleString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    subject: "KingsHour is almost here",
    html: `
      <p>Hey ${data.firstName},</p>
      <p>A quiet reminder: KingsHour is ${date}.</p>
      <p>Topic: <strong>${data.topicTitle}</strong>.</p>
      ${data.meetLink ? `<p>Join link: <a href="${data.meetLink}">${data.meetLink}</a></p>` : ""}
      <p>Bring the real month with you.</p>`,
    text: `Hey ${data.firstName},\n\nKingsHour is ${date}.\n\nTopic: ${data.topicTitle}\n${data.meetLink ? `\nJoin link: ${data.meetLink}\n` : ""}\nBring the real month with you.`,
  };
}
