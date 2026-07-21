import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminAccessState } from "@/lib/modules/auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getAdminAccessState();

  if (access.status === "anonymous") redirect("/admin/login");
  if (access.status === "forbidden") redirect("/admin/unauthorized");
  if (access.status === "needs_enrollment") redirect("/admin/mfa/enroll");
  if (access.status === "needs_challenge") redirect("/admin/mfa/verify");

  return <AdminShell admin={access.admin}>{children}</AdminShell>;
}
