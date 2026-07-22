// Privacy — placeholder route so the footer link isn't dead. Replace with real policy copy.
import Link from "next/link";
import { Wordmark } from "@/components/shared/Wordmark";

export const metadata = { title: "Privacy — Kingsway" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6">
      <header className="py-6">
        <Wordmark />
      </header>
      <main className="flex flex-col gap-4 pb-20 pt-8">
        <p className="eyebrow">Privacy</p>
        <h1 className="font-sans text-3xl font-medium tracking-[-0.012em]">
          How we handle your information
        </h1>
        <p className="text-pretty leading-relaxed text-muted">
          We&apos;re still writing this in full. The short version: we collect only what the King&apos;s
          Census asks for, we use it to run KingsHour and stay in touch, and we never sell it. If you
          have a question in the meantime, reach out on WhatsApp.
        </p>
        <Link href="/" className="mt-2 w-fit text-sm text-brass transition hover:opacity-80">
          ← Back home
        </Link>
      </main>
    </div>
  );
}
