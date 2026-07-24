// Admin / InsightsPanels (PRD §5.3). Census patterns for deciding what deserves attention next.
import type { Insights, Ranked } from "@/lib/modules/analytics";

export function InsightsPanels({ insights }: { insights: Insights }) {
  return (
    <div className="space-y-3">
      <section className="grid border border-line bg-white/75 sm:grid-cols-3">
        <Signal label="Complete Kings" value={String(insights.totalKings)} />
        <Signal
          label="Country momentum"
          value={insights.fastestGrowingCountry ?? "—"}
          note={
            insights.fastestGrowingCountry
              ? `${signed(insights.fastestGrowingCountryDelta)} versus the previous 30 days`
              : "No recent comparison yet"
          }
        />
        <Signal label="Largest age group" value={insights.mostRepresentedAgeBand ?? "—"} />
      </section>

      <div className="grid gap-3 lg:grid-cols-2">
        <RankedPanel
          title="Top struggles"
          description="Multi-select answers from the King’s Census."
          items={insights.topStruggles}
        />
        <RankedPanel
          title="Most requested topics"
          description="Useful input for the next KingsHour topic."
          items={insights.mostRequestedTopics}
        />
        <RankedPanel
          title="What Kings need most"
          description="The role Kings currently want the community to play."
          items={insights.topNeeds}
        />
        <RankedPanel
          title="Repeated goals"
          description="Exact or near-identical goal answers; read with care."
          items={insights.topGoals}
          longLabels
        />
      </div>
    </div>
  );
}

function RankedPanel({
  title,
  description,
  items,
  longLabels = false,
}: {
  title: string;
  description: string;
  items: Ranked[];
  longLabels?: boolean;
}) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return (
    <section className="border border-line bg-white/75">
      <header className="border-b border-line px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </header>
      {items.length === 0 ? (
        <p className="px-4 py-8 text-sm text-muted">Not enough data yet.</p>
      ) : (
        <ol className="divide-y divide-line/70 px-4">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="grid grid-cols-[24px_minmax(0,1fr)_auto] gap-3 py-3">
              <span className="font-mono text-[10px] text-muted">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <p className={`${longLabels ? "line-clamp-2" : "truncate"} text-sm font-medium`}>
                  {item.label}
                </p>
                <div className="mt-2 h-1 bg-line/70" aria-hidden="true">
                  <span
                    className="block h-full bg-brass"
                    style={{ width: `${Math.max(4, (item.count / max) * 100)}%` }}
                  />
                </div>
              </div>
              <span className="font-mono text-xs tabular-nums text-muted">{item.count}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Signal({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border-t border-line px-4 py-4 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0">
      <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="mt-2 text-xl font-semibold tracking-[-0.02em]">{value}</dd>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
    </div>
  );
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}
