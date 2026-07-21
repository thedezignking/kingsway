// Kingsway — minimal .ics (iCalendar) generator for KingsHour invites (PRD §4.4).
// Hand-rolled to avoid an extra dependency; covers a single VEVENT with a Meet link.

export interface IcsEvent {
  uid: string; //           stable per session (e.g. `session-<id>@kingsway`)
  title: string; //         e.g. "KingsHour — <topic>"
  description?: string;
  start: Date;
  end: Date;
  location?: string; //     the Google Meet link
  url?: string;
}

function toIcsDate(d: Date): string {
  // UTC basic format: YYYYMMDDTHHMMSSZ
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Returns the .ics file contents as a string. Attach as `invite.ics`. */
export function buildIcs(event: IcsEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kingsway//KingsHour//EN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(event.start)}`,
    `DTEND:${toIcsDate(event.end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeText(event.description)}` : null,
    event.location ? `LOCATION:${escapeText(event.location)}` : null,
    event.url ? `URL:${event.url}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}
