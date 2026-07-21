// Landing hero: one-read positioning, one action, and the real-Kings visual signature.
import { BecomeKingLink } from "./BecomeKingLink";
import { HeroPortraits } from "./HeroPortraits";

export function Hero() {
  return (
    <section className="landing-hero">
      <h1
        className="anim-fade-up max-w-[13ch] text-balance font-sans text-[2.6rem] font-medium leading-[1.07] tracking-[-0.015em] sm:text-6xl lg:text-[4.25rem]"
        style={{ animationDelay: "80ms" }}
      >
        Whatever you&apos;re building, you don&apos;t have to do it alone.
      </h1>
      <p
        className="anim-fade-up max-w-md text-pretty text-lg leading-relaxed text-muted sm:text-xl"
        style={{ animationDelay: "150ms" }}
      >
        Kingsway is a community for young builders.
      </p>
      <div className="anim-fade-up" style={{ animationDelay: "220ms" }}>
        <BecomeKingLink placement="hero" className="primary-pill" />
      </div>
      <div className="anim-fade-up w-full" style={{ animationDelay: "300ms" }}>
        <HeroPortraits />
      </div>
    </section>
  );
}
