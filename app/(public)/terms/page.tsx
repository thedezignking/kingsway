// Terms — placeholder route so the footer link isn't dead. Replace with real terms copy.
import Link from "next/link";
import { Wordmark } from "@/components/shared/Wordmark";

export const metadata = { title: "Terms — Kingsway" };

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6">
      <header className="py-6">
        <Wordmark />
      </header>
      <main className="flex flex-col gap-4 pb-20 pt-8">
        <p className="eyebrow">Terms</p>
        <h1 className="font-display text-3xl">The basics of being a King</h1>
        <p className="text-pretty leading-relaxed text-muted">
          We&apos;re still writing this in full. The spirit of it: Kingsway is free, it&apos;s built on
          trust, and we ask you to show up in good faith. Nothing here is a contract yet — the complete
          terms will live on this page.
        </p>
        <Link href="/" className="mt-2 w-fit text-sm text-brass transition hover:opacity-80">
          ← Back home
        </Link>
      </main>
    </div>
  );
}
