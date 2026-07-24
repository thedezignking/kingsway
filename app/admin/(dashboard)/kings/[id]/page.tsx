// Admin / King profile — route "/admin/kings/[id]" (PRD §5.2).
import { notFound } from "next/navigation";
import { getMemberProfile } from "@/lib/modules/members";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import { MemberProfile } from "@/components/admin/MemberProfile";
import { NotConfigured } from "@/components/admin/NotConfigured";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminKingProfilePage({
  params,
}: {
  params: { id: string };
}) {
  if (createServiceSupabaseOrNull() === null) {
    return (
      <section className="flex flex-col gap-4">
        <AdminPageHeader title="King" description="Complete member record." />
        <NotConfigured />
      </section>
    );
  }
  const profile = await getMemberProfile(params.id);
  if (!profile) notFound();
  return (
    <section className="flex flex-col gap-4">
      <AdminPageHeader
        title={profile.member.first_name}
        description={profile.member.email}
        meta={profile.member.status === "king" ? "Census complete" : "Census incomplete"}
      />
      <MemberProfile profile={profile} />
    </section>
  );
}
