// Welcome Experience — route "/welcome" (PRD §4.3). The bridge from onboarding to participation.
import { Wordmark } from "@/components/shared/Wordmark";
import { WelcomeExperience } from "@/components/welcome/WelcomeExperience";

export const metadata = { title: "Welcome — Kingsway" };

export default function WelcomePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6">
      <header className="py-6">
        <Wordmark />
      </header>
      <main className="pb-20">
        <WelcomeExperience />
      </main>
    </div>
  );
}
