// Landing / Final CTA (PRD §4.1). The natural conclusion — a warm invitation on ink, one action.
import Link from "next/link";
import { Crown } from "@/components/shared/Crown";

export function FinalCTA() {
  return (
    <section className="pb-24 pt-8">
      <div className="relative overflow-hidden rounded-2xl bg-ink px-8 py-16 text-center text-bone">
        <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brass/15 text-brass">
          <Crown size={24} />
        </span>
        <h2 className="mx-auto max-w-lg text-balance font-display text-3xl sm:text-4xl">
          Ready to build with people who get it?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-pretty text-bone/70">
          Join Kingsway and we&apos;ll see you at the next KingsHour.
        </p>
        <Link
          href="/census"
          className="mt-8 inline-flex items-center rounded-full bg-brass px-7 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
        >
          Become a King
        </Link>
      </div>
    </section>
  );
}
