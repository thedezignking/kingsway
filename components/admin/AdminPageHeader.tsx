export function AdminPageHeader({
  title,
  description,
  meta,
}: {
  title: string;
  description: string;
  meta?: string;
}) {
  return (
    <header className="mb-7 flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>
      </div>
      {meta && (
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{meta}</span>
      )}
    </header>
  );
}
