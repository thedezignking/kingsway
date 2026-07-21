// King's Census — route "/census" (PRD §4.2). Six-chapter conversational onboarding, one question
// per screen, resumable. The core asset. The interactive engine is a client component; this page is
// a thin server shell with a quiet wordmark.
import { Wordmark } from "@/components/shared/Wordmark";
import { CensusEngine } from "@/components/census/CensusEngine";

export const metadata = { title: "King's Census — Kingsway" };

export default function CensusPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-6">
      <header className="py-6">
        <Wordmark />
      </header>
      <main className="flex flex-1 items-start justify-center pb-16 pt-4 sm:items-center sm:pt-0">
        <CensusEngine />
      </main>
    </div>
  );
}
