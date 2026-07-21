// Census / AcknowledgmentToast (PRD §4.2 #3). A short, capped micro-acknowledgment that appears
// briefly after a high-signal answer, then the engine advances. Capped at ~3–4 across the census.
"use client";

export function AcknowledgmentToast({ message }: { message: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 flex justify-center px-4">
      <div className="anim-fade-up flex items-center gap-2 rounded-full border border-brass/30 bg-ink px-5 py-2.5 text-sm text-bone shadow-soft">
        <span className="text-brass" aria-hidden="true">
          ◆
        </span>
        {message}
      </div>
    </div>
  );
}
