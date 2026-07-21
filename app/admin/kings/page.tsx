// Admin / Kings — route "/admin/kings" (PRD §5.2). Searchable list of every King.
import { listMembers } from "@/lib/modules/members";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import { MemberTable } from "@/components/admin/MemberTable";
import { NotConfigured } from "@/components/admin/NotConfigured";

export const dynamic = "force-dynamic";

export default async function AdminKingsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const configured = createServiceSupabaseOrNull() !== null;
  const members = configured ? await listMembers({ query: searchParams.q }) : [];
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-base font-semibold">Kings</h1>
      {configured ? (
        <MemberTable members={members} query={searchParams.q} />
      ) : (
        <NotConfigured />
      )}
    </section>
  );
}
