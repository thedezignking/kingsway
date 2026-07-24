import type { DistributionItem } from "@/lib/modules/analytics";

export function ChartPanel({
  title,
  items,
  caption,
}: {
  title: string;
  items: DistributionItem[];
  caption?: string;
}) {
  return (
    <section className="border border-line bg-white/75" aria-label={title}>
      <header className="flex items-end justify-between gap-4 border-b border-line px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {caption && <p className="mt-0.5 text-xs text-muted">{caption}</p>}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Top {Math.max(items.length, 0)}
        </span>
      </header>

      {items.length === 0 ? (
        <p className="px-4 py-8 text-sm text-muted">No data yet.</p>
      ) : (
        <ol className="divide-y divide-line/70 px-4">
          {items.map((item) => (
            <li key={item.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3">
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="truncate font-medium">{item.label}</span>
                  <span className="shrink-0 font-mono text-[10px] text-muted">{item.share}%</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden bg-line/70" aria-hidden="true">
                  <span
                    className="block h-full bg-brass transition-[width] duration-500"
                    style={{ width: `${Math.max(item.share, item.count ? 3 : 0)}%` }}
                  />
                </div>
              </div>
              <span className="min-w-7 text-right font-mono text-xs tabular-nums text-muted">
                {item.count}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
