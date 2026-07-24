import "server-only";
import { EMAIL_FROM, EMAIL_REPLY_TO, emailConfigured, getResend } from "@/lib/email/resend";
import type { RenderedEmail } from "@/lib/email/templates";

export interface MailSendInput {
  to: string;
  rendered: RenderedEmail;
  idempotencyKey?: string;
}

export interface MailSendResult {
  provider: "resend";
  id: string;
}

export function mailConfigured(): boolean {
  return emailConfigured();
}

export async function sendMail(input: MailSendInput): Promise<MailSendResult> {
  if (!emailConfigured()) throw new Error("Email is not configured");

  const attachments = input.rendered.ics
    ? [
        {
          filename: "kingshour.ics",
          content: Buffer.from(input.rendered.ics).toString("base64"),
          contentType: "text/calendar; charset=utf-8",
        },
      ]
    : undefined;

  const { data, error } = await getResend().emails.send(
    {
      from: EMAIL_FROM,
      replyTo: EMAIL_REPLY_TO,
      to: input.to,
      subject: input.rendered.subject,
      html: input.rendered.html,
      text: input.rendered.text,
      attachments,
    },
    input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
  );

  if (error || !data?.id) throw error ?? new Error("Email provider did not return a message id");
  return { provider: "resend", id: data.id };
}
