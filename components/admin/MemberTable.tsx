// Admin / MemberTable (PRD §5.2). Search, Census-backed filters, clickable rows, pagination, export.
// Lönar-style presentation in Kingsway's palette: avatar rows, soft status pills, numbered pages.
import Link from "next/link";
import { getQuestion } from "@/lib/census/questions";
import type { MemberFilter, MemberListResult } from "@/lib/modules/members";
import { KingRow } from "./KingRow";

export function MemberTable({ result, active }: { result: MemberListResult; active: MemberFilter }) {
  const hasFilters = !!(
    active.query ||
    (active.status && active.status !== "all") ||
    active.country ||
    active.season ||
    active.interest
  );
  const exportQuery = createQuery(active, undefined);

  return (
    <div className="flex flex-col gap-4">
      <form className="rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(16,24,40,0.045)] p-3" aria-label="Filter Kings">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_repeat(4,minmax(130px,1fr))]">
          <Field label="Search">
            <input
              type="search"
              name="q"
              defaultValue={active.query}
              placeholder="Name, email, location, work"
              spellCheck={false}
              className="admin-control"
            />
          </Field>
          <Field label="Census status">
            <select name="status" defaultValue={active.status ?? "all"} className="admin-control">
              <option value="all">All records</option>
              <option value="king">Complete</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </Field>
          <Field label="Residence">
            <select name="country" defaultValue={active.country ?? ""} className="admin-control">
              <option value="">All countries</option>
              {result.filters.countries.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </Field>
          <Field label="Season">
            <select name="season" defaultValue={active.season ?? ""} className="admin-control">
              <option value="">All seasons</option>
              {result.filters.seasons.map((season) => (
                <option key={season} value={season}>
                  {optionLabel("season", season)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Interest">
            <select name="interest" defaultValue={active.interest ?? ""} className="admin-control">
              <option value="">All interests</option>
              {result.filters.interests.map((interest) => (
                <option key={interest} value={interest}>
                  {optionLabel("topics", interest)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <div className="flex items-center gap-2">
            <button type="submit" className="admin-button-primary">
              Apply filters
            </button>
            {hasFilters && (
              <Link href="/admin/kings" className="admin-button-secondary">
                Clear
              </Link>
            )}
          </div>
          <Link
            href={`/api/admin/kings/export${exportQuery ? `?${exportQuery}` : ""}`}
            className="text-xs font-medium text-muted underline-offset-4 hover:text-fg hover:underline"
          >
            Export current results
          </Link>
        </div>
      </form>

      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-medium">
          {result.total} {result.total === 1 ? "King" : "Kings"}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          Page {result.page} of {result.pageCount}
        </p>
      </div>

      {result.members.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white px-5 py-12 text-center">
          <p className="text-sm font-medium">No matching Kings.</p>
          <p className="mt-1 text-xs text-muted">Clear one or more filters and try again.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(16,24,40,0.045)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-line font-mono text-[10px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5 font-medium">King</th>
                  <th className="px-5 py-3.5 font-medium">Builder profile</th>
                  <th className="px-5 py-3.5 font-medium">Residence</th>
                  <th className="px-5 py-3.5 font-medium">Joined</th>
                  <th className="px-5 py-3.5 font-medium">Census</th>
                </tr>
              </thead>
              <tbody>
                {result.members.map((member) => (
                  <KingRow key={member.id} href={`/admin/kings/${member.id}`}>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Avatar name={member.first_name} />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/kings/${member.id}`}
                            className="font-semibold hover:underline"
                          >
                            {member.first_name}
                          </Link>
                          <div className="max-w-56 truncate text-xs text-muted">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="truncate">
                        {member.occupation || optionLabel("season", member.season) || "—"}
                      </div>
                      {member.interests.length > 0 && (
                        <div className="mt-0.5 max-w-64 truncate text-xs text-muted">
                          {member.interests.map((value) => optionLabel("topics", value)).join(" · ")}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div>{member.country ?? "—"}</div>
                      {member.state_city && (
                        <div className="text-xs text-muted">{member.state_city}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 align-middle font-mono text-xs text-muted">
                      {new Date(member.join_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <Status status={member.status} />
                    </td>
                  </KingRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result.pageCount > 1 && (
        <Pagination page={result.page} pageCount={result.pageCount} active={active} />
      )}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass-soft/60 text-sm font-semibold text-fg">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Status({ status }: { status: "king" | "incomplete" }) {
  const complete = status === "king";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${
        complete ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${complete ? "bg-emerald-500" : "bg-amber-500"}`}
        aria-hidden="true"
      />
      {complete ? "Complete" : "Incomplete"}
    </span>
  );
}

// ── Numbered pagination (1 2 3 … last), active page in brass ──────────────
function Pagination({
  page,
  pageCount,
  active,
}: {
  page: number;
  pageCount: number;
  active: MemberFilter;
}) {
  return (
    <nav className="flex items-center justify-center gap-1.5 pt-2" aria-label="Kings pages">
      <PageArrow href={page > 1 ? `/admin/kings?${createQuery(active, page - 1)}` : null} label="Previous">
        ‹
      </PageArrow>
      {pageItems(page, pageCount).map((item, i) =>
        item === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-muted">
            …
          </span>
        ) : (
          <PageDot
            key={item}
            n={item}
            active={item === page}
            href={`/admin/kings?${createQuery(active, item)}`}
          />
        ),
      )}
      <PageArrow href={page < pageCount ? `/admin/kings?${createQuery(active, page + 1)}` : null} label="Next">
        ›
      </PageArrow>
    </nav>
  );
}

function PageDot({ n, active, href }: { n: number; active: boolean; href: string }) {
  if (active) {
    return (
      <span
        aria-current="page"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brass text-sm font-semibold text-white"
      >
        {n}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-sm text-muted transition hover:border-brass/50 hover:text-fg"
    >
      {n}
    </Link>
  );
}

function PageArrow({
  href,
  label,
  children,
}: {
  href: string | null;
  label: string;
  children: React.ReactNode;
}) {
  const cls =
    "flex h-9 w-9 items-center justify-center rounded-full border border-line text-base transition";
  if (!href) {
    return (
      <span className={`${cls} cursor-not-allowed text-muted/40`} aria-hidden="true">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className={`${cls} text-muted hover:border-brass/50 hover:text-fg`}>
      {children}
    </Link>
  );
}

/** Compact page list: 1 … around-current … last. */
function pageItems(current: number, total: number): (number | "…")[] {
  const out: (number | "…")[] = [];
  const push = (n: number) => out.push(n);
  const window = 1;
  const first = 1;
  const last = total;
  const from = Math.max(first, current - window);
  const to = Math.min(last, current + window);

  push(first);
  if (from > first + 1) out.push("…");
  for (let n = Math.max(first + 1, from); n <= Math.min(last - 1, to); n++) push(n);
  if (to < last - 1) out.push("…");
  if (last > first) push(last);
  return out;
}

function optionLabel(questionId: string, value: string | null): string | null {
  if (!value) return null;
  return getQuestion(questionId)?.options?.find((option) => option.value === value)?.label ?? value;
}

function createQuery(filter: MemberFilter, page?: number): string {
  const params = new URLSearchParams();
  if (filter.query) params.set("q", filter.query);
  if (filter.status && filter.status !== "all") params.set("status", filter.status);
  if (filter.country) params.set("country", filter.country);
  if (filter.season) params.set("season", filter.season);
  if (filter.interest) params.set("interest", filter.interest);
  if (page && page > 1) params.set("page", String(page));
  return params.toString();
}
