// Admin / StatCard (PRD §5.1). KPI card — an icon + quiet label pill, then a big operational number.
type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

export function StatCard({
  label,
  value,
  hint,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  delta?: string;
  icon?: IconComponent;
}) {
  return (
    <div className="rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(16,24,40,0.045)] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f7f8fa] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          {Icon && <Icon size={13} className="text-brass" />}
          {label}
        </span>
        {delta && (
          <span className="rounded-full bg-brass-soft/50 px-2 py-0.5 font-mono text-[10px] font-medium text-fg">
            {delta}
          </span>
        )}
      </div>
      <div className="mt-3 text-[1.7rem] font-semibold tabular-nums tracking-[-0.03em]">{value}</div>
      {hint && <div className="mt-1.5 text-xs text-muted">{hint}</div>}
    </div>
  );
}
