import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { AuthCard } from "@/components/admin/auth/AuthCard";

export default function UnauthorizedAdminPage() {
  return (
    <AuthCard
      eyebrow="Access denied"
      title="This account is not approved"
      description="Signing in to Supabase does not grant Kingsway Admin access. An active administrator record is also required."
    >
      <div className="flex flex-col gap-3">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bone transition-colors hover:bg-fg/90"
          >
            Sign out
          </button>
        </form>
        <Link href="/" className="py-2 text-center text-sm text-muted hover:text-fg">
          Return to Kingsway
        </Link>
      </div>
    </AuthCard>
  );
}
