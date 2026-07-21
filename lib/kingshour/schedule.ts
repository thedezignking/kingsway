// Kingsway — KingsHour scheduling helper (PRD §4.6: monthly, last Sunday).
// Pure date math, safe on client and server. Used for add-to-calendar before real sessions exist.

/** The last Sunday of the given year/month (month is 0-indexed). */
export function lastSundayOfMonth(year: number, month: number): Date {
  const lastDay = new Date(year, month + 1, 0); // day 0 of next month = last day
  const offset = lastDay.getDay(); // 0 = Sunday
  return new Date(year, month, lastDay.getDate() - offset);
}

/** The next KingsHour: this month's last Sunday if still upcoming, else next month's. */
export function nextKingsHour(from: Date = new Date()): Date {
  const thisMonth = lastSundayOfMonth(from.getFullYear(), from.getMonth());
  // Give the whole day; if today is past the last Sunday, roll to next month.
  if (thisMonth.getDate() >= from.getDate() || from.getMonth() !== thisMonth.getMonth()) {
    if (thisMonth >= new Date(from.getFullYear(), from.getMonth(), from.getDate())) {
      return atDefaultTime(thisMonth);
    }
  }
  const nextMonth = new Date(from.getFullYear(), from.getMonth() + 1, 1);
  return atDefaultTime(lastSundayOfMonth(nextMonth.getFullYear(), nextMonth.getMonth()));
}

/** Default KingsHour start time (local) until per-session times exist. */
function atDefaultTime(d: Date): Date {
  const out = new Date(d);
  out.setHours(18, 0, 0, 0); // 6:00 PM local placeholder
  return out;
}
