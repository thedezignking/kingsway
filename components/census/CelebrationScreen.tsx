// Census / CelebrationScreen (PRD §4.2 Ch.6, §4.3). The payoff — an emotional high, never
// "Form Submitted". Crown rises → you're a King → add-to-calendar (next KingsHour) → connect on
// WhatsApp → confirmation the Welcome email is on its way.
"use client";

import { celebration } from "@/lib/census/copy";
import { nextKingsHour } from "@/lib/kingshour/schedule";
import { whatsappLink } from "@/lib/whatsapp";
import { Crown } from "@/components/shared/Crown";
import { BRAND_LINE_DISPLAY } from "@/lib/brand";
import { AddToCalendar } from "@/components/shared/AddToCalendar";

export function CelebrationScreen({ firstName }: { firstName?: string }) {
  const copy = celebration(firstName);
  const start = nextKingsHour();
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="anim-crown flex h-20 w-20 items-center justify-center rounded-full bg-fg text-surface">
        <Crown size={40} />
      </div>
      <h2 className="text-balance font-sans text-3xl font-medium leading-tight tracking-[-0.012em] sm:text-4xl">
        {copy.headline}
      </h2>
      <div className="flex flex-col gap-1.5 text-pretty leading-relaxed text-muted">
        {copy.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className="mt-2 flex w-full max-w-xs flex-col items-stretch gap-3">
        <AddToCalendar
          event={{
            uid: `kingshour-${start.toISOString().slice(0, 10)}@kingsway`,
            title: "KingsHour",
            description: "The monthly Kingsway gathering. The exact join link will come by email.",
            start,
            end,
            url: typeof window === "undefined" ? undefined : window.location.origin,
          }}
        />
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line px-6 py-3 text-center text-sm font-medium transition duration-200 hover:border-brass/50 hover:bg-brass-soft/30"
        >
          Connect on WhatsApp
        </a>
        <p className="mt-1 font-mono text-xs text-muted">{copy.emailNote}</p>
        <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-muted/70">
          {BRAND_LINE_DISPLAY}
        </p>
      </div>
    </div>
  );
}
