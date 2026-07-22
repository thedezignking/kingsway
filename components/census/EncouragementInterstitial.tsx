// Census / EncouragementInterstitial (PRD §4.2). One calm nudge at the midpoint, one near the end.
"use client";

import { nudge } from "@/lib/census/copy";

export function EncouragementInterstitial({
  placement,
  firstName,
  onContinue,
}: {
  placement: "midpoint" | "near_end";
  firstName?: string;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <p className="max-w-md text-balance font-sans text-2xl font-medium leading-snug tracking-[-0.01em]">
        {nudge(placement, firstName)}
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="rounded-full bg-fg px-6 py-2.5 text-sm font-semibold text-surface transition duration-200 hover:-translate-y-px hover:opacity-90 active:translate-y-0"
      >
        Keep going
      </button>
    </div>
  );
}
