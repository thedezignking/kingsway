// Landing / Hero (PRD §4.1). The thesis: what Kingsway is + who it's for, zero clicks. The signature
// Cadence sits under the headline — the monthly rhythm is the whole promise. One CTA: Become a King.
import Link from "next/link";
import { Cadence } from "@/components/shared/Cadence";

export function Hero() {
  return (
    <section className="flex flex-col items-start gap-7 pb-14 pt-16 sm:pt-24">
      <p className="eyebrow anim-fade-up" style={{ animationDelay: "40ms" }}>
        A growth community for builders
      </p>
      <h1
        className="anim-fade-up max-w-2xl text-balance font-display text-[2.6rem] font-medium leading-[1.05] tracking-tight sm:text-6xl"
        style={{ animationDelay: "120ms" }}
      >
        Build with clarity.
        <br />
        Grow with people who <span className="italic text-brass">get it</span>.
      </h1>
      <p
        className="anim-fade-up max-w-xl text-pretty text-lg leading-relaxed text-muted"
        style={{ animationDelay: "220ms" }}
      >
        Kingsway is for people building something real. Once a month, we gather for KingsHour —
        honest conversation, accountability, and reflection. Not more content. A rhythm.
      </p>
      <div className="anim-fade-up" style={{ animationDelay: "320ms" }}>
        <Link
          href="/census"
          className="inline-flex items-center rounded-full bg-brass px-7 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
        >
          Become a King
        </Link>
      </div>
      <div
        className="anim-fade-up mt-6 w-full max-w-xl rounded-2xl border border-line bg-surface-2/60 p-5"
        style={{ animationDelay: "440ms" }}
      >
        <Cadence />
      </div>
    </section>
  );
}
