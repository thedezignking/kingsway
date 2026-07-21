// Kingsway signature — "The Cadence". A strip of the month's days with the last Sunday (the next
// KingsHour) lit in brass. It encodes the product's actual heartbeat: monthly, last Sunday. Threaded
// through the hero, and echoed as the census progress motif. Client-side so the date math and the
// staggered draw-in run in the browser (no SSR/timezone mismatch).
"use client";

import { useEffect, useState } from "react";
import { nextKingsHour } from "@/lib/kingshour/schedule";

export function Cadence({ className = "" }: { className?: string }) {
  const [data, setData] = useState<{
    days: number;
    highlight: number; // 1-indexed day that is the next KingsHour
    label: string;
  } | null>(null);

  useEffect(() => {
    const next = nextKingsHour();
    const year = next.getFullYear();
    const month = next.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    setData({
      days,
      highlight: next.getDate(),
      label: next.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    });
  }, []);

  const days = data?.days ?? 30;

  return (
    <div className={className}>
      <div className="flex items-end gap-[3px]" aria-hidden="true">
        {Array.from({ length: days }, (_, i) => {
          const day = i + 1;
          const isNext = data ? day === data.highlight : false;
          return (
            <span
              key={day}
              className="anim-fade-in flex-1 origin-bottom rounded-full"
              style={{
                height: isNext ? 40 : 16,
                background: isNext ? "var(--accent)" : "var(--line)",
                boxShadow: isNext ? "0 0 14px 1px var(--accent)" : "none",
                animationDelay: `${i * 14}ms`,
              }}
            />
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="eyebrow">Last Sunday · every month</span>
        <span className="font-mono text-xs text-brass">
          {data ? `Next · ${data.label}` : " "}
        </span>
      </div>
    </div>
  );
}
