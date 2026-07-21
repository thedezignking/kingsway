import { AnalyticsTracker } from "@/components/shared/AnalyticsTracker";
import { AnalyticsEvent } from "@/lib/analytics/events";
import { Wordmark } from "@/components/shared/Wordmark";
import { Hero } from "@/components/landing/Hero";
import { ScrollJourney } from "@/components/landing/ScrollJourney";
import { PostJourneyLayers } from "@/components/landing/PostJourneyLayers";
import { BecomeKingLink } from "@/components/landing/BecomeKingLink";
import { Footer } from "@/components/shared/Footer";

export default function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <AnalyticsTracker event={AnalyticsEvent.LANDING_VIEW} />
      <header className="landing-nav flex items-center justify-between py-6">
        <Wordmark />
        <BecomeKingLink placement="nav" className="nav-pill" />
      </header>
      <main>
        <Hero />
        <ScrollJourney />
        <PostJourneyLayers />
      </main>
      <Footer />
    </div>
  );
}
