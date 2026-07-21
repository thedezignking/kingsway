import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/auth/AuthCard";
import { MfaVerifyForm } from "@/components/admin/auth/MfaVerifyForm";
import { getAdminAccessState, safeAdminDestination } from "@/lib/modules/auth";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function VerifyMfaPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const destination = safeAdminDestination(searchParams.next);
  const access = await getAdminAccessState();
  if (access.status === "anonymous") redirect("/admin/login");
  if (access.status === "forbidden") redirect("/admin/unauthorized");
  if (access.status === "ready") redirect(destination);
  if (access.status === "needs_enrollment") {
    redirect(`/admin/mfa/enroll?next=${encodeURIComponent(destination)}`);
  }

  const { data: factors } = await createServerSupabase().auth.mfa.listFactors();
  const factor = factors?.totp.find((item) => item.status === "verified");
  if (!factor) {
    redirect(`/admin/mfa/enroll?next=${encodeURIComponent(destination)}`);
  }

  return (
    <AuthCard
      eyebrow="Two-step verification"
      title="Enter your authenticator code"
      description="Open the authenticator app connected to Kingsway Admin and enter its current six-digit code."
    >
      <MfaVerifyForm destination={destination} factorId={factor.id} />
    </AuthCard>
  );
}
