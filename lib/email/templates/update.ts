// Community Update — admin-triggered, infrequent, only when meaningful (PRD §4.4 #5).
// Composed in the admin Email page and sent to a segment (PRD §5.5).
// TODO(copy): authored per-send by admin; this is the wrapper/identity only.
import type { RenderedEmail } from "./types";

export interface UpdateData {
  firstName: string;
  subject: string;
  bodyHtml: string; // admin-composed content
}

export function updateEmail(data: UpdateData): RenderedEmail {
  return {
    subject: data.subject,
    html: `<!-- Consistent Kingsway identity wrapper (PRD §4.4). -->
      <div>${data.bodyHtml}</div>`,
  };
}
