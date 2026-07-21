// Landing hero: one-read positioning, one action, and the real-Kings visual signature.
import { BecomeKingLink } from "./BecomeKingLink";
import { HeroPortraits } from "./HeroPortraits";

export function Hero() {
  return (
    <section className="landing-hero">
      <p className="hero-label anim-fade-up" style={{ animationDelay: "40ms" }}>
        A community of builders
      </p>
      <h1
        className="anim-fade-up max-w-[15ch] text-balance font-sans text-[2.45rem] font-medium leading-[1.06] tracking-[-0.012em] sm:max-w-[18.75ch] sm:text-[3.75rem] lg:text-[4rem]"
        style={{ animationDelay: "100ms" }}
      >
        Whatever you&apos;re building, you don&apos;t have to do it alone.
      </h1>
      <p
        className="anim-fade-up max-w-md text-pretty text-lg leading-relaxed text-muted sm:text-xl"
        style={{ animationDelay: "170ms" }}
      >
        Kingsway is a community for young builders.
      </p>
      <div className="hero-cta anim-fade-up" style={{ animationDelay: "235ms" }}>
        <BecomeKingLink placement="hero" className="primary-pill" />
      </div>
      <div className="anim-fade-up w-full" style={{ animationDelay: "300ms" }}>
        <HeroPortraits />
      </div>
    </section>
  );
}
