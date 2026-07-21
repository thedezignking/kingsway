// Kingsway — shared analytics event tracker (PRD §7 "Shared").
// Fires a single event on mount. Thin client wrapper over lib/analytics/track().
"use client";

import { useEffect } from "react";
import { track, type AnalyticsEventName } from "@/lib/analytics/events";

export function AnalyticsTracker({
  event,
  props,
}: {
  event: AnalyticsEventName;
  props?: Record<string, unknown>;
}) {
  useEffect(() => {
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return null;
}
