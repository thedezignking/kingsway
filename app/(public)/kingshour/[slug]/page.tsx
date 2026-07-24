import { notFound } from "next/navigation";
import Image from "next/image";
import { Footer } from "@/components/shared/Footer";
import { Wordmark } from "@/components/shared/Wordmark";
import { getPublicSessionBySlug } from "@/lib/modules/kingshour";
import { KingsHourRegistration } from "@/components/kingshour/KingsHourRegistration";
import { AnalyticsTracker } from "@/components/shared/AnalyticsTracker";
import { AnalyticsEvent } from "@/lib/analytics/events";

export const dynamic = "force-dynamic";

export default async function PublicKingsHourPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getPublicSessionBySlug(params.slug);
  if (!session) notFound();

  const title = session.public_title || session.topic?.title || "KingsHour";
  const summary =
    session.public_summary ||
    session.description ||
    "One honest conversation for young builders doing the work of building their lives.";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 sm:px-8">
      <AnalyticsTracker
        event={AnalyticsEvent.KINGSHOUR_PAGE_VIEW}
        props={{ slug: params.slug, sessionId: session.id }}
      />
      <header className="landing-nav flex items-center justify-between py-6">
        <Wordmark />
        <span className="eyebrow text-muted">KingsHour</span>
      </header>

      <main className="grid flex-1 gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:py-14">
        <section className="max-w-3xl">
          <p className="eyebrow text-brass">{formatDate(session.date)}</p>
          <h1 className="mt-4 text-balance font-sans text-4xl font-medium leading-[1.04] tracking-[-0.015em] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
            {summary}
          </p>

          {session.public_image_url && (
            <div
              className={`mt-8 overflow-hidden rounded-[1.25rem] bg-surface-2 ${
                session.public_image_aspect === "4:5" ? "aspect-[4/5] max-w-md" : "aspect-square max-w-lg"
              }`}
            >
              <Image
                src={session.public_image_url}
                alt={session.public_image_alt || title}
                width={900}
                height={session.public_image_aspect === "4:5" ? 1125 : 900}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="mt-8 max-w-2xl border-l border-dotted border-brass/70 pl-5 text-sm leading-relaxed text-muted">
            {session.public_body ? (
              session.public_body.split("\n").filter(Boolean).map((line) => <p key={line}>{line}</p>)
            ) : (
              <p>
                Bring the real month with you: what you are building, what has been difficult, and
                the questions you have been carrying quietly.
              </p>
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-6">
          <KingsHourRegistration
            slug={params.slug}
            sessionId={session.id}
            title={title}
            date={session.date}
          />
        </aside>
      </main>

      <Footer />
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
