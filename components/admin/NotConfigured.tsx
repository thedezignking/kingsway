// Admin / NotConfigured — shown when Supabase env is missing so admin pages render an honest empty
// state instead of crashing during the keyless scaffold phase.
export function NotConfigured() {
  return (
    <div className="rounded-md border border-dashed border-line bg-white/40 p-4 text-sm text-muted">
      Supabase isn&apos;t configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
      <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> to see live data here.
    </div>
  );
}
