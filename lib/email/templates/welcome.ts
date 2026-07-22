// Welcome email — auto, on census completion (PRD §4.4 #1).
// A personal note from Divine: substantial in voice, restrained in email-client-safe structure.
import type { BaseEmailData, RenderedEmail } from "./types";
import { BRAND_LINE_DISPLAY } from "@/lib/brand";

const INK = "#17152E";
const BRASS = "#BC7C33";
const PORCELAIN = "#FCFCFA";
const LINE = "#E7E5DE";
const MUTED = "#686579";

export function welcomeEmail(data: BaseEmailData): RenderedEmail {
  const firstName = firstToken(data.firstName) || "King";
  const safeName = escapeHtml(firstName);
  const appRoot = data.appUrl.replace(/\/$/, "");
  const welcomeUrl = `${appRoot}/welcome`;
  const crownUrl = `${appRoot}/brand/crown`;

  return {
    subject: `${firstName}, welcome to Kingsway`,
    text: `Hey ${firstName},

There are thousands of people online, thousands of things to consume, and thousands of ways to do almost anything.

In all of that noise, I'm glad you've decided to do it the King’s way.

Welcome, King.

Kingsway is a community of builders—people making something and becoming someone through the process.

Once a month, on the last Sunday, we gather online for KingsHour. We talk honestly about the work, the person doing it, and what the month has really looked like. Then everyone goes back to building.

There is no feed to keep up with and no noisy group chat. We'll email you when something matters: the next KingsHour topic, the link, and what follows.

See what happens next: ${welcomeUrl}

I'm glad you're here.

Divine
Founder, Kingsway

P.S. You can reply and tell me what you're building. I read every reply.`,
    html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:${PORCELAIN};color:${INK};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">You are officially a King. Here is what happens next.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PORCELAIN};border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:40px 18px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border-collapse:collapse;">
            <tr>
              <td style="padding:0 0 24px;border-bottom:1px solid ${LINE};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                        <tr>
                          <td width="32" height="24" align="center" valign="middle" style="width:32px;height:24px;">
                            <img src="${escapeHtml(crownUrl)}" width="32" height="24" alt="" style="display:block;width:32px;height:24px;border:0;" />
                          </td>
                          <td style="padding-left:10px;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:600;letter-spacing:-0.2px;color:${INK};">Kingsway</td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" style="font-family:'Courier New',monospace;font-size:10px;line-height:1.3;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">
                      Last Sunday<br>Every month
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:48px 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.75;color:${INK};">
                <p style="margin:0 0 24px;">Hey ${safeName},</p>
                <p style="margin:0 0 24px;">There are thousands of people online, thousands of things to consume, and thousands of ways to do almost anything.</p>
                <p style="margin:0 0 32px;">In all of that noise, I'm glad you've decided to do it <span style="color:${BRASS};">the King’s way.</span></p>
                <h1 style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:36px;line-height:1.12;font-weight:600;letter-spacing:-0.8px;color:${INK};">Welcome, King.</h1>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 36px;border-collapse:collapse;border-left:2px dotted ${BRASS};">
                  <tr>
                    <td style="padding:0 0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.75;color:${INK};">
                      <p style="margin:0 0 20px;">Kingsway is a community of builders—people making something and becoming someone through the process.</p>
                      <p style="margin:0 0 20px;">Once a month, on the last Sunday, we gather online for <strong>KingsHour</strong>. We talk honestly about the work, the person doing it, and what the month has really looked like. Then everyone goes back to building.</p>
                      <p style="margin:0;">There is no feed to keep up with and no noisy group chat. We'll email you when something matters: the next KingsHour topic, the link, and what follows.</p>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td bgcolor="${BRASS}" style="border-radius:999px;">
                      <a href="${escapeHtml(welcomeUrl)}" style="display:inline-block;padding:13px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1;color:#FFFFFF;text-decoration:none;border-radius:999px;">See what happens next</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:36px 0 0;">I'm glad you're here.</p>
                <p style="margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:600;line-height:1.5;">Divine<br><span style="font-size:13px;font-weight:400;color:${MUTED};">Founder, Kingsway</span></p>
                <p style="margin:30px 0 0;padding-top:24px;border-top:1px solid ${LINE};font-size:14px;line-height:1.7;color:${MUTED};">P.S. You can reply and tell me what you're building. I read every reply.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0 0;border-top:1px solid ${LINE};font-family:'Courier New',monospace;font-size:10px;line-height:1.6;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">
                ${BRAND_LINE_DISPLAY}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

function firstToken(value: string): string {
  return value.trim().split(/\s+/)[0] ?? "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
      character
    ] as string,
  );
}
