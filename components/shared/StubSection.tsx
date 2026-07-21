// Kingsway — scaffold placeholder. Renders a labeled block that names the PRD
// section a piece implements. Replace with the real UI in the relevant build pass.
// Not member-facing copy — this never ships to production.

export function StubSection({
  title,
  prd,
  children,
}: {
  title: string;
  /** PRD reference, e.g. "§4.1 Landing / Hero". */
  prd: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-dashed border-line bg-white/40 p-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{prd}</span>
      </div>
      {children ? (
        <div className="mt-2 text-sm text-muted">{children}</div>
      ) : (
        <p className="mt-2 text-sm text-muted">Scaffold placeholder — not yet built.</p>
      )}
    </section>
  );
}
