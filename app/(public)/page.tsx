// Landing Page — route "/" (PRD §4.1). One CTA: Become a King. No links competing with it.
// Sections in order: Hero → Problem → HowItWorks → Outcomes → FAQ → FinalCTA.
import Link from "next/link";
import { AnalyticsTracker } from "@/components/shared/AnalyticsTracker";
import { AnalyticsEvent } from "@/lib/analytics/events";
import { Wordmark } from "@/components/shared/Wordmark";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Outcomes } from "@/components/landing/Outcomes";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/shared/Footer";
import { Reveal } from "@/components/shared/Reveal";

export default function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6">
      <AnalyticsTracker event={AnalyticsEvent.LANDING_VIEW} />
      <header className="flex items-center justify-between py-6">
        <Wordmark />
        <Link
          href="/census"
          className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-surface transition hover:-translate-y-px hover:opacity-90 active:translate-y-0"
        >
          Become a King
        </Link>
      </header>
      <main>
        <Hero />
        <Reveal>
          <Problem />
        </Reveal>
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <Outcomes />
        </Reveal>
        <Reveal>
          <FAQ />
        </Reveal>
        <Reveal>
          <FinalCTA />
        </Reveal>
      </main>
      <Reveal>
        <Footer />
      </Reveal>
    </div>
  );
}
