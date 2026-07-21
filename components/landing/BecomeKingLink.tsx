"use client";

import Link from "next/link";
import { AnalyticsEvent, track } from "@/lib/analytics/events";

export function BecomeKingLink({
  placement,
  className = "",
}: {
  placement: "nav" | "hero" | "final";
  className?: string;
}) {
  return (
    <Link
      href="/census"
      onClick={() => track(AnalyticsEvent.LANDING_CTA_CLICK, { placement })}
      className={className}
    >
      Become a King
    </Link>
  );
}
