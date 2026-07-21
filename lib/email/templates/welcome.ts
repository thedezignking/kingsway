// Welcome email — auto, on census completion (PRD §4.4 #1).
// A personal note from Divine, designed around Kingsway's monthly cadence.
import type { BaseEmailData, RenderedEmail } from "./types";

const INK = "#17152E";
const BRASS = "#BC7C33";
const PORCELAIN = "#FBF9F4";
const MUTED = "#6F6B64";

export function welcomeEmail(data: BaseEmailData): RenderedEmail {
  const firstName = firstToken(data.firstName) || "King";
  const safeName = escapeHtml(firstName);
  const welcomeUrl = `${data.appUrl.replace(/\/$/, "")}/welcome`;

  return {
    subject: `${firstName}, welcome to Kingsway`,
    text: `${firstName},

There are thousands of people online, endless information to consume, and more ways than ever to do almost anything.

In all of that noise, I'm glad you've decided to do it the Kingsway.

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
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border-collapse:collapse;">
            <tr>
              <td style="padding:0 0 22px;border-bottom:1px solid #E5E0D6;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;letter-spacing:-0.3px;color:${INK};">
                      <span style="color:${BRASS};font-size:20px;vertical-align:1px;">♛</span>&nbsp; Kingsway
                    </td>
                    <td align="right" style="font-family:'Courier New',monospace;font-size:10px;line-height:1.3;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">
                      Last Sunday<br>Every month
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:42px 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.75;color:${INK};">
                <p style="margin:0 0 24px;">Hey ${safeName},</p>
                <p style="margin:0 0 24px;">There are thousands of people online, endless information to consume, and more ways than ever to do almost anything.</p>
                <p style="margin:0 0 30px;">In all of that noise, I'm glad you've decided to do it <em style="font-family:Georgia,'Times New Roman',serif;color:${BRASS};font-size:19px;">the Kingsway.</em></p>
                <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.15;font-weight:500;letter-spacing:-0.6px;color:${INK};">Welcome, King.</h1>
                <p style="margin:0 0 24px;">Kingsway is a place for builders: people intentionally making something and becoming someone through the process.</p>
                <p style="margin:0 0 24px;">Once a month, on the last Sunday, we pause for <strong>KingsHour</strong>—a practical conversation about what we're building, where we're stuck, and what comes next.</p>
                <p style="margin:0 0 32px;">Between gatherings, you keep building. We'll keep the communication thoughtful and light.</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td bgcolor="${BRASS}" style="border-radius:999px;">
                      <a href="${escapeHtml(welcomeUrl)}" style="display:inline-block;padding:13px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1;color:#FFFFFF;text-decoration:none;border-radius:999px;">See what happens next</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:36px 0 0;">I'm glad you're here.</p>
                <p style="margin:18px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;">Divine<br><span style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${MUTED};">Founder, Kingsway</span></p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 0 0;border-top:1px solid #E5E0D6;font-family:'Courier New',monospace;font-size:10px;line-height:1.6;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">
                Build · Pause · Reflect · Learn · Continue
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
