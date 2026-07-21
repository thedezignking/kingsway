import { Crown } from "@/components/shared/Crown";
import { BecomeKingLink } from "./BecomeKingLink";

export function FinalCTA() {
  return (
    <section className="final-invitation" aria-labelledby="final-invitation-title">
      <span className="final-invitation__way final-invitation__way--top" aria-hidden="true" />
      <div className="final-invitation__mark" aria-hidden="true">
        <Crown size={30} />
      </div>

      <p className="journey-kicker">Start here</p>
      <h2
        id="final-invitation-title"
        className="mx-auto mt-5 max-w-3xl text-balance font-sans text-4xl font-medium leading-[1.07] tracking-[-0.015em] sm:text-6xl"
      >
        Come as you are. Bring what you&apos;re building.
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
        Every King begins with the King&apos;s Census—our first chance to understand who is here before
        we gather at KingsHour.
      </p>

      <BecomeKingLink placement="final" className="primary-pill final-invitation__button mt-8" />

      <ul className="final-invitation__facts" aria-label="What joining involves">
        <li>Free to join</li>
        <li>No member account</li>
        <li>One monthly gathering</li>
      </ul>
      <span className="final-invitation__way final-invitation__way--bottom" aria-hidden="true" />
    </section>
  );
}
