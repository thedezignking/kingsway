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
          className="w-full max-w-sm rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-black dark:border-gray-700 dark:focus:border-white"
        />
        <button type="submit" className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700">
          Search
        </button>
      </form>

      {members.length === 0 ? (
        <p className="text-sm text-gray-500">
          {query ? "No Kings match that search." : "No Kings yet."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-gray-400">
              <tr>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Country</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4">
                    <Link href={`/admin/kings/${m.id}`} className="font-medium hover:underline">
                      {m.first_name}
                    </Link>
                    {m.status === "incomplete" && (
                      <span className="ml-2 rounded bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200">
                        incomplete
                      </span>
                    )}
                    <div className="text-xs text-gray-400">{m.email}</div>
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
