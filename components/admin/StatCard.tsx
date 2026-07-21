// Admin / StatCard (PRD §5.1). Plain, operational — no warmth, no celebration.
export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="border border-line bg-white/70 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</div>
      <div className="mt-3 text-3xl font-semibold tabular-nums tracking-[-0.04em]">{value}</div>
      {hint && <div className="mt-2 text-xs text-muted">{hint}</div>}
    </div>
  );
}
