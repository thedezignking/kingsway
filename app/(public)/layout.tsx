export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="public-theme min-h-dvh bg-surface text-fg">{children}</div>;
}
