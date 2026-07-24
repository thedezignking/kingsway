import Link from "next/link";
import type { AttentionItem } from "@/lib/modules/analytics";

export function AttentionQueue({ items }: { items: AttentionItem[] }) {
  return (
    <section className="mb-5 border border-line bg-white/75" aria-labelledby="attention-title">
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Today</p>
          <h2 id="attention-title" className="mt-0.5 text-sm font-semibold">
            Attention queue
          </h2>
        </div>
        <span
          className={`h-2 w-2 rounded-full ${items.length ? "bg-brass" : "bg-emerald-600"}`}
          aria-hidden="true"
        />
      </header>

      {items.length === 0 ? (
        <p className="px-4 py-5 text-sm text-muted">Nothing needs action right now.</p>
      ) : (
        <ul className="divide-y divide-line/70">
          {items.map((item) => (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                className="grid gap-2 px-4 py-3 transition-colors hover:bg-[#fbfaf7] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    item.tone === "attention" ? "bg-brass" : "bg-muted/50"
                  }`}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                    {item.detail}
                  </span>
                </span>
                <span className="font-mono text-xs tabular-nums text-muted">{item.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
