import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/auth/AuthCard";
import { MfaEnrollForm } from "@/components/admin/auth/MfaEnrollForm";
import { getAdminAccessState, safeAdminDestination } from "@/lib/modules/auth";
import { createServerSupabase } from "@/lib/supabase/server";

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

  const supabase = createServerSupabase();
  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
  if (factorsError) {
    return <EnrollmentError />;
  }

  const verifiedFactor = factors.totp.find((factor) => factor.status === "verified");
  if (verifiedFactor) {
    redirect(`/admin/mfa/verify?next=${encodeURIComponent(destination)}`);
  }

  for (const factor of factors.all) {
    if (factor.status !== "verified") {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
      if (error) return <EnrollmentError />;
    }
  }

  const { data: enrollment, error: enrollmentError } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Kingsway Admin",
  });
  if (enrollmentError) {
    return <EnrollmentError />;
  }

  return (
    <AuthCard
      eyebrow="Security setup"
      title="Protect this admin account"
      description="Kingsway requires an authenticator code for every new admin session. This setup is completed once."
    >
      <MfaEnrollForm
        destination={destination}
        enrollment={{
          id: enrollment.id,
          qr: enrollment.totp.qr_code,
          secret: enrollment.totp.secret,
        }}
      />
    </AuthCard>
  );
}

function EnrollmentError() {
  return (
    <AuthCard
      eyebrow="Security setup"
      title="Secure setup needs another try"
      description="We could not prepare the authenticator connection. Refresh this page once to try again."
    >
      <p className="text-sm text-red-700" role="alert">
        Authenticator setup was not created. No security settings were changed.
      </p>
    </AuthCard>
  );
}
