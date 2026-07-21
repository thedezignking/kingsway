// Admin / King profile — route "/admin/kings/[id]" (PRD §5.2).
import { notFound } from "next/navigation";
import { getMemberProfile } from "@/lib/modules/members";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import { MemberProfile } from "@/components/admin/MemberProfile";
import { NotConfigured } from "@/components/admin/NotConfigured";

export const dynamic = "force-dynamic";

export default async function AdminKingProfilePage({
  params,
}: {
  params: { id: string };
}) {
  if (createServiceSupabaseOrNull() === null) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-base font-semibold">King</h1>
        <NotConfigured />
      </section>
    );
  }
  const profile = await getMemberProfile(params.id);
  if (!profile) notFound();
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-base font-semibold">King</h1>
      <MemberProfile profile={profile} />
    </section>
  );
}
