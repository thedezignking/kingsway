import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/auth/AuthCard";
import { MfaEnrollForm } from "@/components/admin/auth/MfaEnrollForm";
import { getAdminAccessState, safeAdminDestination } from "@/lib/modules/auth";

export default async function EnrollMfaPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const destination = safeAdminDestination(searchParams.next);
  const access = await getAdminAccessState();
  if (access.status === "anonymous") redirect("/admin/login");
  if (access.status === "forbidden") redirect("/admin/unauthorized");
  if (access.status === "ready") redirect(destination);
  if (access.status === "needs_challenge") {
    redirect(`/admin/mfa/verify?next=${encodeURIComponent(destination)}`);
  }

  return (
    <AuthCard
      eyebrow="Security setup"
      title="Protect this admin account"
      description="Kingsway requires an authenticator code for every new admin session. This setup is completed once."
    >
      <MfaEnrollForm destination={destination} />
    </AuthCard>
  );
}
