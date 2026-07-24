// Admin / MemberTable (PRD §5.2). Search, Census-backed filters, pagination and export.
import Link from "next/link";
import { getQuestion } from "@/lib/census/questions";
import type { MemberFilter, MemberListResult } from "@/lib/modules/members";

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
      <form className="border border-line bg-white/75 p-3" aria-label="Filter Kings">
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
          {result.total} {result.total === 1 ? "record" : "records"}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          Page {result.page} of {result.pageCount}
        </p>
      </div>

      {result.members.length === 0 ? (
        <div className="border border-dashed border-line bg-white/40 px-5 py-10">
          <p className="text-sm font-medium">No matching Kings.</p>
          <p className="mt-1 text-xs text-muted">Clear one or more filters and try again.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-line bg-white/75">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line bg-[#f1eee6]/70 font-mono text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">King</th>
                <th className="px-4 py-3 font-medium">Builder profile</th>
                <th className="px-4 py-3 font-medium">Current residence</th>
                <th className="px-4 py-3 font-medium">Census</th>
                <th className="px-4 py-3 text-right font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {result.members.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-line transition-colors first:border-t-0 hover:bg-[#fbfaf7]"
                >
                  <td className="px-4 py-3 align-top">
                    <Link href={`/admin/kings/${member.id}`} className="font-semibold hover:underline">
                      {member.first_name}
                    </Link>
                    <div className="mt-0.5 max-w-56 truncate text-xs text-muted">{member.email}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div>{member.occupation || optionLabel("season", member.season) || "—"}</div>
                    {member.interests.length > 0 && (
                      <div className="mt-1 max-w-64 truncate text-xs text-muted">
                        {member.interests.map((value) => optionLabel("topics", value)).join(" · ")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div>{member.country ?? "—"}</div>
                    {member.state_city && <div className="mt-0.5 text-xs text-muted">{member.state_city}</div>}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Status status={member.status} />
                  </td>
                  <td className="px-4 py-3 text-right align-top font-mono text-xs text-muted">
                    {new Date(member.join_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result.pageCount > 1 && (
        <nav className="flex items-center justify-between border-t border-line pt-3" aria-label="Kings pages">
          {result.page > 1 ? (
            <Link
              href={`/admin/kings?${createQuery(active, result.page - 1)}`}
              className="admin-button-secondary"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          {result.page < result.pageCount && (
            <Link
              href={`/admin/kings?${createQuery(active, result.page + 1)}`}
              className="admin-button-secondary"
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
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
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-wide ${
        status === "king" ? "bg-emerald-50 text-emerald-800" : "bg-brass-soft/60 text-fg"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${status === "king" ? "bg-emerald-600" : "bg-brass"}`}
        aria-hidden="true"
      />
      {status === "king" ? "Complete" : "Incomplete"}
    </span>
  );
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
