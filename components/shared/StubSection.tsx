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
    <section className="rounded-lg border border-dashed border-gray-300 p-4 dark:border-gray-700">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-xs text-gray-500">{prd}</span>
      </div>
      {children ? (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{children}</div>
      ) : (
        <p className="mt-2 text-sm text-gray-500">Scaffold placeholder — not yet built.</p>
      )}
    </section>
  );
}
