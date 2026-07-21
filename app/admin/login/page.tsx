import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/auth/AuthCard";
import { LoginForm } from "@/components/admin/auth/LoginForm";
import { getAdminAccessState, safeAdminDestination } from "@/lib/modules/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const destination = safeAdminDestination(searchParams.next);
  const access = await getAdminAccessState();

  if (access.status === "ready") redirect(destination);
  if (access.status === "needs_enrollment") {
    redirect(`/admin/mfa/enroll?next=${encodeURIComponent(destination)}`);
  }
  if (access.status === "needs_challenge") {
    redirect(`/admin/mfa/verify?next=${encodeURIComponent(destination)}`);
  }
  if (access.status === "forbidden") redirect("/admin/unauthorized");

  return (
    <AuthCard
      eyebrow="Admin access"
      title="Sign in to operations"
      description="Use your approved administrator email and password. A separate authenticator code is required next."
    >
      <LoginForm destination={destination} />
    </AuthCard>
  );
}
