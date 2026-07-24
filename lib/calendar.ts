// Shared calendar helpers for public KingsHour actions. Browser buttons should prefer web calendar
// compose links on Android/desktop, with .ics kept as the universal/native fallback.
import { buildIcs, type IcsEvent } from "@/lib/email/ics";

export interface CalendarEventInput {
  uid: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string | null;
  url?: string | null;
}

export interface CalendarLinks {
  google: string;
  outlook: string;
  ics: string;
  filename: string;
}

export function buildCalendarLinks(event: CalendarEventInput): CalendarLinks {
  const title = event.title.trim() || "KingsHour";
  const description = [event.description, event.url ? `Link: ${event.url}` : null]
    .filter(Boolean)
    .join("\n\n");
  const location = event.location ?? event.url ?? "";
  const dates = `${toGoogleDate(event.start)}/${toGoogleDate(event.end)}`;

  const google = new URL("https://calendar.google.com/calendar/r/eventedit");
  google.searchParams.set("action", "TEMPLATE");
  google.searchParams.set("text", title);
  google.searchParams.set("dates", dates);
  google.searchParams.set("details", description);
  google.searchParams.set("location", location);

  const outlook = new URL("https://outlook.live.com/calendar/deeplink/compose");
  outlook.searchParams.set("path", "/calendar/action/compose");
  outlook.searchParams.set("rru", "addevent");
  outlook.searchParams.set("subject", title);
  outlook.searchParams.set("startdt", event.start.toISOString());
  outlook.searchParams.set("enddt", event.end.toISOString());
  outlook.searchParams.set("body", description);
  outlook.searchParams.set("location", location);

  return {
    google: google.toString(),
    outlook: outlook.toString(),
    ics: buildIcs(toIcsEvent({ ...event, title, description, location })),
    filename: `${slugify(title)}.ics`,
  };
}

function toGoogleDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function toIcsEvent(event: CalendarEventInput): IcsEvent {
  return {
    uid: event.uid,
    title: event.title,
    description: event.description,
    start: event.start,
    end: event.end,
    location: event.location ?? undefined,
    url: event.url ?? undefined,
  };
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "kingshour"
  );
}
