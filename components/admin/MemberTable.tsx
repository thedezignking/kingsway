// Admin / MemberTable (PRD §5.2). Presentational list of Kings with search + incomplete indicator.
// Data is fetched by the page (server) and passed in.
import Link from "next/link";
import type { Member } from "@/lib/supabase/types";

export function MemberTable({ members, query }: { members: Member[]; query?: string }) {
  return (
    <div className="flex flex-col gap-4">
      <form className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search name, email, country"
          spellCheck={false}
          className="w-full max-w-sm rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-brass focus:ring-2 focus:ring-brass/15"
        />
        <button type="submit" className="rounded-md border border-line bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:border-muted/60">
          Search
        </button>
      </form>

      {members.length === 0 ? (
        <p className="border border-dashed border-line p-6 text-sm text-muted">
          {query ? "No Kings match that search." : "No Kings yet."}
        </p>
      ) : (
        <div className="overflow-x-auto border border-line bg-white/70">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-[#f1eee6]/70 font-mono text-[10px] uppercase tracking-wider text-muted">
              <tr>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Country</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-line transition-colors first:border-t-0 hover:bg-[#fbfaf7]">
                  <td className="py-2 pr-4">
                    <Link href={`/admin/kings/${m.id}`} className="font-medium hover:underline">
                      {m.first_name}
                    </Link>
                    {m.status === "incomplete" && (
                      <span className="ml-2 rounded-sm bg-brass-soft/60 px-1.5 py-0.5 font-mono text-[10px] text-fg">
                        incomplete
                      </span>
                    )}
                    <div className="text-xs text-muted">{m.email}</div>
                  </td>
                  <td className="py-2 pr-4">{m.country ?? "—"}</td>
                  <td className="py-2 pr-4">{m.status}</td>
                  <td className="py-2 pr-4">{new Date(m.join_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
