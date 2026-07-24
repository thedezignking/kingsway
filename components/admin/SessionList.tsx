import Link from "next/link";
import type { SessionSummary } from "@/lib/modules/kingshour";

export function SessionList({ sessions }: { sessions: SessionSummary[] }) {
  return (
    <section className="border border-line bg-white/75">
      <header className="flex items-end justify-between gap-4 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">Sessions</p>
          <h2 className="mt-0.5 text-sm font-semibold">KingsHour schedule</h2>
        </div>
        <span className="font-mono text-[10px] text-muted">{sessions.length} total</span>
      </header>

      {sessions.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="text-sm font-medium">No KingsHour has been planned yet.</p>
          <p className="mt-1 text-xs text-muted">Use the session form below to create the first one.</p>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/admin/kingshour/${session.id}`}
              className="grid gap-3 px-4 py-4 transition-colors hover:bg-[#f8f6f1] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Status status={session.status} />
                  <PublicStatus
                    status={session.public_status}
                    slug={session.slug}
                  />
                  {!session.meet_link && session.status !== "done" && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#9a5a13]">
                      Meet link missing
                    </span>
                  )}
                </div>
                <p className="mt-2 truncate text-sm font-semibold">
                  {session.topic?.title ?? "Topic not selected"}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {formatDate(session.date)}
                  {session.facilitator ? ` · ${session.facilitator}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-5 text-xs text-muted sm:justify-end">
                <Metric value={session.registrationCount} label="registered" />
                <Metric value={session.attendedCount} label="attended" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Status({ status }: { status: SessionSummary["status"] }) {
  const tone =
    status === "live"
      ? "border-[#dba359] bg-[#fff8ec] text-[#754006]"
      : status === "done"
        ? "border-line bg-[#f4f3ef] text-muted"
        : "border-[#cdd9cc] bg-[#f4faf3] text-[#315f39]";
  return (
    <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] ${tone}`}>
      {status}
    </span>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <span>
      <strong className="font-mono font-medium text-fg">{value}</strong> {label}
    </span>
  );
}

function PublicStatus({
  status,
  slug,
}: {
  status: SessionSummary["public_status"];
  slug: string | null;
}) {
  const published = status === "published" && slug;
  return (
    <span
      className={`font-mono text-[9px] uppercase tracking-[0.08em] ${
        published ? "text-emerald-700" : "text-muted"
      }`}
    >
      {published ? "Public page live" : "Public draft"}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
