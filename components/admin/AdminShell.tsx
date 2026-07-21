import type { AdminUser } from "@/lib/modules/auth";
import { AdminNav } from "./AdminNav";
import { signOut } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Overview", short: "OV" },
  { href: "/admin/kings", label: "Kings", short: "KI" },
  { href: "/admin/insights", label: "Insights", short: "IN" },
  { href: "/admin/kingshour", label: "KingsHour", short: "KH" },
  { href: "/admin/email", label: "Email", short: "EM" },
  { href: "/admin/analytics", label: "Analytics", short: "AN" },
] as const;

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminUser;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#f7f5ef] text-fg">
      <a
        href="#admin-content"
        className="sr-only z-50 bg-fg px-4 py-2 text-sm text-bone focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>

      <div className="mx-auto grid min-h-dvh max-w-[1500px] md:grid-cols-[224px_1fr]">
        <aside className="border-b border-line bg-[#f1eee6] md:border-b-0 md:border-r">
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Kingsway</p>
              <p className="text-sm font-semibold">Operations</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-brass" aria-label="System online" />
          </div>

          <AdminNav items={NAV} />

          <div className="border-t border-line p-4 md:fixed md:bottom-0 md:w-[223px] md:bg-[#f1eee6]">
            <p className="truncate text-xs font-medium">{admin.email}</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {admin.role.replace("_", " ")}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-xs text-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main id="admin-content" className="min-w-0 p-5 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
