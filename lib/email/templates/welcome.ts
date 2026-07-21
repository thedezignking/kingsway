// Welcome email — auto, on census completion (PRD §4.4 #1).
// A personal note from Divine, designed around Kingsway's monthly cadence.
import type { BaseEmailData, RenderedEmail } from "./types";
import { BRAND_LINE_DISPLAY } from "@/lib/brand";

const INK = "#17152E";
const BRASS = "#BC7C33";
const PORCELAIN = "#FCFCFA";
const SECONDARY = "#F6F5F1";
const LINE = "#E7E5DE";
const MUTED = "#686579";

export function welcomeEmail(data: BaseEmailData): RenderedEmail {
  const firstName = firstToken(data.firstName) || "King";
  const safeName = escapeHtml(firstName);
  const welcomeUrl = `${data.appUrl.replace(/\/$/, "")}/welcome`;

  return {
    subject: `${firstName}, welcome to Kingsway`,
    text: `${firstName},

There are thousands of people online, endless information to consume, and more ways than ever to do almost anything.

In all of that noise, I'm glad you've decided to do it the King’s way.

Welcome, King.

Kingsway is a place for builders: people intentionally making something and becoming someone through the process. Once a month, on the last Sunday, we pause for KingsHour—a practical conversation about what we're building, where we're stuck, and what comes next.

Between gatherings, you keep building. We'll keep the communication thoughtful and light.

See what happens next: ${welcomeUrl}

I'm glad you're here.

Divine
Founder, Kingsway`,
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
                          <td width="32" height="32" align="center" valign="middle" bgcolor="${BRASS}" style="width:32px;height:32px;border-radius:999px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:32px;color:#FFFFFF;">♛</td>
                          <td style="padding-left:10px;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.3px;color:${INK};">Kingsway</td>
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
              <td style="padding:48px 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.75;color:${INK};">
                <p style="margin:0 0 24px;">Hey ${safeName},</p>
                <p style="margin:0 0 24px;">There are thousands of people online, endless information to consume, and more ways than ever to do almost anything.</p>
                <p style="margin:0 0 30px;">In all of that noise, I'm glad you've decided to do it <span style="color:${BRASS};">the King’s way.</span></p>
                <h1 style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:36px;line-height:1.12;font-weight:700;letter-spacing:-1px;color:${INK};">Welcome, King.</h1>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 34px;border-collapse:collapse;background:${SECONDARY};border-left:2px dotted ${BRASS};">
                  <tr>
                    <td style="padding:24px 24px 22px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.75;color:${INK};">
                      <p style="margin:0 0 20px;">Kingsway is a place for builders: people intentionally making something and becoming someone through the process.</p>
                      <p style="margin:0 0 20px;">Once a month, on the last Sunday, we pause for <strong>KingsHour</strong>—a practical conversation about what we're building, where we're stuck, and what comes next.</p>
                      <p style="margin:0;">Between gatherings, you keep building. We'll keep the communication thoughtful and light.</p>
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
                <p style="margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:700;line-height:1.5;">Divine<br><span style="font-size:13px;font-weight:400;color:${MUTED};">Founder, Kingsway</span></p>
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
