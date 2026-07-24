import Link from "next/link";
import type { SessionDetail } from "@/lib/modules/kingshour";

export function SessionPublicPanel({ session }: { session: SessionDetail }) {
  const live = session.public_status === "published" && !!session.slug;
  const missing = [
    session.slug ? null : "slug",
    session.public_title || session.topic?.title ? null : "title",
    session.public_summary || session.description ? null : "summary",
  ].filter(Boolean);

  return (
    <section className="border border-line bg-white/75">
      <header className="flex items-end justify-between gap-4 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
            Public page
          </p>
          <h2 className="mt-0.5 text-sm font-semibold">Lead-magnet destination</h2>
        </div>
        <span
          className={`font-mono text-[9px] uppercase tracking-[0.12em] ${
            live ? "text-emerald-700" : "text-muted"
          }`}
        >
          {live ? "Live" : "Draft"}
        </span>
      </header>
      <div className="grid gap-4 p-4 text-xs text-muted md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p>
            {live
              ? "Use this link on flyers, WhatsApp Status, DMs and socials."
              : "Publish with a slug when this KingsHour is ready to share."}
          </p>
          {session.slug && (
            <p className="mt-1 font-mono text-fg">/kingshour/{session.slug}</p>
          )}
          {missing.length > 0 && (
            <p className="mt-2 text-[#9a5a13]">Missing: {missing.join(", ")}.</p>
          )}
        </div>
        {live && (
          <Link href={`/kingshour/${session.slug}`} target="_blank" className="admin-button-secondary">
            Open public page
          </Link>
        )}
      </div>
    </section>
  );
}
