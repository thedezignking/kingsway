import { notFound } from "next/navigation";
import { Wordmark } from "@/components/shared/Wordmark";
import { getSession } from "@/lib/modules/kingshour";
import { RsvpRegistration } from "@/components/kingshour/RsvpRegistration";

export const dynamic = "force-dynamic";

export default async function RsvpPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const session = await getSession(params.sessionId);
  if (!session) notFound();
  const title = session.public_title || session.topic?.title || "KingsHour";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-6">
      <header className="py-6">
        <Wordmark />
      </header>
      <section className="flex flex-1 items-center pb-16">
        <div className="w-full">
          <p className="eyebrow text-brass">{formatDate(session.date)}</p>
          <h1 className="mt-4 text-balance font-sans text-4xl font-medium leading-tight">
            Register for {title}
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-muted">
            Confirm with your email. If you are already a King, we will register you. If not, we will
            take you through the King&apos;s Census first.
          </p>
          <div className="mt-8">
            <RsvpRegistration sessionId={session.id} title={title} date={session.date} />
          </div>
        </div>
      </section>
    </main>
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
