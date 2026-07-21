import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/auth/AuthCard";
import { PasswordUpdateForm } from "@/components/admin/auth/PasswordUpdateForm";
import { getCurrentAdmin, safeAdminDestination } from "@/lib/modules/auth";

export default async function AdminPasswordUpdatePage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const destination = safeAdminDestination(searchParams.next);

  return (
    <AuthCard
      eyebrow="Password setup"
      title="Choose your admin password"
      description="This password belongs only to your approved administrator account. You’ll set up or verify your authenticator next."
    >
      <PasswordUpdateForm destination={destination} />
    </AuthCard>
  );
}
