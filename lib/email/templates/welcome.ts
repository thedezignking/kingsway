// Welcome email — auto, on census completion (PRD §4.4 #1). Belonging + what's next.
// First-pass copy in Kingsway's voice (a thoughtful letter, one clear next step). Refine later.
import type { BaseEmailData, RenderedEmail } from "./types";

export function welcomeEmail(data: BaseEmailData): RenderedEmail {
  const name = data.firstName?.trim() || "King";
  return {
    subject: "Welcome to Kingsway",
    html: `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#171717;line-height:1.6;">
    <p>${escapeHtml(name)},</p>
    <p>You're in. You're officially a King — and we're genuinely glad you're here.</p>
    <p>
      Kingsway moves to a simple rhythm. Once a month, on the last Sunday, we gather for
      <strong>KingsHour</strong> — a real conversation about what you're building, where you're stuck,
      and what's next. Between gatherings, you keep building, and we stay lightly in touch.
    </p>
    <p>
      A couple of things to do now:
    </p>
    <ul>
      <li>Save the KingsHour date — the next one is on your calendar if you added it.</li>
      <li>Watch your inbox: we'll send the topic and the join link before the session.</li>
    </ul>
    <p style="margin-top:24px;">
      <a href="${data.appUrl}/welcome"
         style="background:#171717;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block;">
        See what happens next
      </a>
    </p>
    <p style="color:#666;margin-top:24px;">— Kingsway</p>
  </div>`,
  };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}
