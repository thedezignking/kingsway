import type { AdminUser } from "@/lib/modules/auth";
import Link from "next/link";
import { AdminNav } from "./AdminNav";
import { SearchIcon, BellIcon, PlusIcon } from "./icons";
import { Crown } from "@/components/shared/Crown";
import { signOut } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Overview", icon: "overview" },
  { href: "/admin/kings", label: "Kings", icon: "kings" },
  { href: "/admin/insights", label: "Insights", icon: "insights" },
  { href: "/admin/kingshour", label: "KingsHour", icon: "kingshour" },
  { href: "/admin/email", label: "Email", icon: "email" },
  { href: "/admin/analytics", label: "Analytics", icon: "analytics" },
] as const;

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminUser;
  children: React.ReactNode;
}) {
  const initial = admin.email.charAt(0).toUpperCase();

  return (
    <div className="admin-scope min-h-dvh bg-white text-fg">
      <a
        href="#admin-content"
        className="sr-only z-50 bg-fg px-4 py-2 text-sm text-bone focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>

      <div className="mx-auto grid min-h-dvh max-w-[1560px] md:grid-cols-[248px_1fr]">
        {/* ── Sidebar (sticky full height — profile stays pinned to the bottom) ── */}
        <aside className="flex flex-col border-b border-line bg-[#f7f8fa] md:sticky md:top-0 md:h-dvh md:self-start md:border-b-0 md:border-r">
          <div className="flex h-16 shrink-0 items-center gap-2 px-5">
            <span className="text-brass">
              <Crown size={22} />
            </span>
            <span className="text-lg font-semibold tracking-tight">Kingsway</span>
            <span className="ml-auto rounded-full border border-line bg-white px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              Admin
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <AdminNav items={NAV} />
          </div>

          <div className="shrink-0 border-t border-line p-3">
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass-soft/70 text-sm font-semibold text-fg">
                {initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{admin.email}</p>
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted">
                  {admin.role.replace("_", " ")}
                </p>
              </div>
              {admin.isDevelopmentBypass ? (
                <span className="shrink-0 font-mono text-[8px] uppercase tracking-wider text-brass">
                  Bypass
                </span>
              ) : (
                <form action={signOut}>
                  <button
                    type="submit"
                    className="shrink-0 text-xs text-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
                  >
                    Sign out
                  </button>
                </form>
              )}
            </div>
          </div>
        </aside>

        {/* ── Content ─────────────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/85 px-5 backdrop-blur sm:px-8">
            <form action="/admin/kings" className="relative w-full max-w-md">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <SearchIcon size={16} />
              </span>
              <input
                type="search"
                name="q"
                placeholder="Search Kings…"
                aria-label="Search Kings"
                className="h-10 w-full rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(16,24,40,0.045)] pl-9 pr-3 text-sm outline-none transition focus:border-brass"
              />
            </form>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden items-center rounded-full border border-line bg-white p-2.5 text-muted sm:inline-flex">
                <BellIcon size={18} />
              </span>
              <Link
                href="/admin/kingshour"
                className="inline-flex items-center gap-1.5 rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bone transition hover:opacity-90"
              >
                <PlusIcon size={16} />
                New KingsHour
              </Link>
            </div>
          </header>

          <main id="admin-content" className="min-w-0 flex-1 p-5 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
