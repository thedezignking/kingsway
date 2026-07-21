// Landing / Why Builders Join — outcomes, not features (PRD §4.1).
import { Crown } from "@/components/shared/Crown";

const OUTCOMES = [
  { title: "Clarity", body: "Cut through the noise and know your next real step." },
  { title: "Accountability", body: "People who ask what you shipped — and mean it." },
  { title: "Perspective", body: "Honest conversations with builders a little further along." },
  { title: "Real conversation", body: "Depth over feeds. Substance over hype." },
  { title: "Consistency", body: "A monthly rhythm that keeps you building." },
];

export function Outcomes() {
  return (
    <section className="py-16">
      <div className="hairline mb-12" />
      <p className="eyebrow">Why builders join</p>
      <h2 className="mt-6 max-w-xl font-display text-3xl">
        You leave with more than you came with.
      </h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OUTCOMES.map((o) => (
          <div
            key={o.title}
            className="rounded-xl border border-line bg-surface-2/50 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brass/40 hover:shadow-card"
          >
            <span className="text-brass">
              <Crown size={18} />
            </span>
            <div className="mt-3 font-display text-lg">{o.title}</div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{o.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
