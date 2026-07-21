// Admin shell — auth-gated (PRD §5). Voice: plain and utilitarian.
//
// ⚠️ AUTH STUB: this currently allows everyone through. Wire real gating in the admin
// auth pass: call auth.getCurrentAdmin() (lib/modules/auth) and redirect to a login
// route when null. V1 = single Super Admin; role system designed to extend later.
import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/kings", label: "Kings" },
  { href: "/admin/insights", label: "Insights" },
  { href: "/admin/kingshour", label: "KingsHour" },
  { href: "/admin/email", label: "Email" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO(auth): const admin = await getCurrentAdmin(); if (!admin) redirect("/admin/login");
  // Admin voice is plain and utilitarian (PRD §5) — tokens for consistency, no member-facing flourish.
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 p-6">
      <header className="flex items-center justify-between border-b border-line pb-3">
        <span className="font-mono text-sm font-medium">Kingsway Admin</span>
        <nav className="flex flex-wrap gap-4 font-mono text-xs">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-muted transition hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <p className="rounded-md border border-brass/30 bg-brass-soft/30 px-2.5 py-1.5 font-mono text-xs text-fg">
        Auth stub — this area is not yet access-controlled.
      </p>
      {children}
    </div>
  );
}
