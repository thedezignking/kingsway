import { Crown } from "@/components/shared/Crown";
import { BecomeKingLink } from "./BecomeKingLink";

export function FinalCTA() {
  return (
    <section className="final-invitation" aria-labelledby="final-invitation-title">
      <span className="final-invitation__way final-invitation__way--top" aria-hidden="true" />
      <div className="final-invitation__mark" aria-hidden="true">
        <Crown size={28} />
      </div>
      <p className="journey-kicker">Become a King</p>
      <h2
        id="final-invitation-title"
        className="mx-auto mt-5 max-w-2xl text-balance font-sans text-4xl font-medium leading-[1.07] tracking-[-0.015em] sm:text-6xl"
      >
        If this feels like your room, start with the Census.
      </h2>
      <p className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted">
        A few thoughtful questions help us know who is here before KingsHour.
      </p>
      <BecomeKingLink placement="final" className="primary-pill final-invitation__button mt-8" />
      <span className="final-invitation__way final-invitation__way--bottom" aria-hidden="true" />
    </section>
  );
}
