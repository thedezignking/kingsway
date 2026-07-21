// Admin / Kings — route "/admin/kings" (PRD §5.2). Searchable list of every King.
import { listMembers } from "@/lib/modules/members";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import { MemberTable } from "@/components/admin/MemberTable";
import { NotConfigured } from "@/components/admin/NotConfigured";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminKingsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const configured = createServiceSupabaseOrNull() !== null;
  const members = configured ? await listMembers({ query: searchParams.q }) : [];
  return (
    <section>
      <AdminPageHeader
        title="Kings"
        description="Search the member record, census history, and communication timeline."
      />
      {configured ? (
        <MemberTable members={members} query={searchParams.q} />
      ) : (
        <NotConfigured />
      )}
    </section>
  );
}
