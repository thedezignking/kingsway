// Admin / InsightsPanels (PRD §5.3). Aggregated census read as answers pointing to the next topic.
// Presentational; data fetched by the page.
import type { Insights, Ranked } from "@/lib/modules/analytics";

export function InsightsPanels({ insights }: { insights: Insights }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <RankedPanel title="Top struggles" items={insights.topStruggles} />
      <RankedPanel title="Most requested topics" items={insights.mostRequestedTopics} />
      <RankedPanel title="What they need most" items={insights.topNeeds} />
      <div className="border border-line bg-white/70 p-4">
        <h3 className="text-sm font-semibold">At a glance</h3>
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          <Row label="Fastest-growing country" value={insights.fastestGrowingCountry} />
          <Row label="Most active age band" value={insights.mostActiveAgeBand} />
        </dl>
      </div>
    </div>
  );
}

function RankedPanel({ title, items }: { title: string; items: Ranked[] }) {
  return (
    <div className="border border-line bg-white/70 p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Not enough data yet.</p>
      ) : (
        <ol className="mt-2 flex flex-col gap-1 text-sm">
          {items.map((it, i) => (
            <li key={it.label} className="flex justify-between">
              <span>
                {i + 1}. {it.label}
              </span>
              <span className="font-mono text-xs text-muted">{it.count}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd>{value ?? "—"}</dd>
    </div>
  );
}
