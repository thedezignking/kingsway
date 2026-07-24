// Admin / Kings — route "/admin/kings" (PRD §5.2). Searchable list of every King.
import { listMembers, type MemberFilter } from "@/lib/modules/members";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import { MemberTable } from "@/components/admin/MemberTable";
import { NotConfigured } from "@/components/admin/NotConfigured";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminKingsPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    status?: string;
    country?: string;
    season?: string;
    interest?: string;
    page?: string;
  };
}) {
  const configured = createServiceSupabaseOrNull() !== null;
  const active: MemberFilter = {
    query: searchParams.q,
    status:
      searchParams.status === "king" || searchParams.status === "incomplete"
        ? searchParams.status
        : "all",
    country: searchParams.country,
    season: searchParams.season,
    interest: searchParams.interest,
    page: positiveInteger(searchParams.page),
  };
  const result = configured ? await listMembers(active) : null;
  return (
    <section>
      <AdminPageHeader
        title="Kings"
        description="Search the member record, census history, and communication timeline."
      />
      {configured && result ? (
        <MemberTable result={result} active={active} />
      ) : (
        <NotConfigured />
      )}
    </section>
  );
}

function positiveInteger(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}
