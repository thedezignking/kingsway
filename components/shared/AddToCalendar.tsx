"use client";

import { useMemo } from "react";
import { buildCalendarLinks, type CalendarEventInput } from "@/lib/calendar";

export function AddToCalendar({
  event,
  className = "",
}: {
  event: CalendarEventInput;
  className?: string;
}) {
  const links = useMemo(() => buildCalendarLinks(event), [event]);

  function downloadIcs() {
    const url = URL.createObjectURL(new Blob([links.ics], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = links.filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={`calendar-actions ${className}`}>
      <a
        href={links.google}
        target="_blank"
        rel="noopener noreferrer"
        className="calendar-actions__primary"
      >
        Add to Google Calendar
      </a>
      <div className="calendar-actions__secondary" aria-label="Other calendar options">
        <a href={links.outlook} target="_blank" rel="noopener noreferrer">
          Outlook
        </a>
        <button type="button" onClick={downloadIcs}>
          Apple / other
        </button>
      </div>
    </div>
  );
}
