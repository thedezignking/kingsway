// Kingsway — typed analytics event names (PRD §4.1, §4.2, §4.3, §5.6).
// Lightweight product analytics for the funnel: visitor → census start → completion
// → welcome → first KingsHour → returning. Wire to a provider in the next pass;
// track() is a safe no-op stub for now so call sites can be added anywhere.

export const AnalyticsEvent = {
  // Landing (PRD §4.1 — the five events)
  LANDING_VIEW: "landing_view",
  LANDING_CTA_CLICK: "landing_cta_click",
  CENSUS_START_CONVERSION: "census_start_conversion",
  LANDING_BOUNCE: "landing_bounce",
  LANDING_SCROLL_DEPTH: "landing_scroll_depth",

  // Census funnel (PRD §4.2 — census analytics)
  CENSUS_START: "census_start",
  CENSUS_SCREEN_VIEW: "census_screen_view", //   props: { questionId, chapter }
  CENSUS_SCREEN_DROP_OFF: "census_screen_drop_off",
  CENSUS_CHAPTER_COMPLETE: "census_chapter_complete",
  CENSUS_COMPLETE: "census_complete",

  // Welcome (PRD §4.3)
  WELCOME_VIEW: "welcome_view",
  WELCOME_COMPLETE: "welcome_complete",
  WELCOME_EMAIL_CONFIRMED: "welcome_email_confirmed",
  WHATSAPP_CONNECTION: "whatsapp_connection",
  FIRST_KINGSHOUR_REGISTRATION: "first_kingshour_registration",

  // KingsHour (PRD §4.6, §5.6)
  KINGSHOUR_RSVP: "kingshour_rsvp",
  KINGSHOUR_ATTENDED: "kingshour_attended",
  KINGSHOUR_PAGE_VIEW: "kingshour_page_view",
  KINGSHOUR_REGISTRATION_STARTED: "kingshour_registration_started",
  KINGSHOUR_REGISTRATION_CONFIRMED: "kingshour_registration_confirmed",
  KINGSHOUR_CENSUS_BRIDGE: "kingshour_census_bridge",
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

export const ANALYTICS_EVENTS = Object.values(AnalyticsEvent);

/** First-party event tracker. It degrades quietly when Supabase is unavailable. */
export function track(
  event: AnalyticsEventName,
  props?: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props ?? {});
  }
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({ event, props: props ?? {}, path: window.location.pathname });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/events", new Blob([payload], { type: "application/json" }));
    return;
  }
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}
