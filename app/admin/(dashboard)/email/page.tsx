// Admin / Email — route "/admin/email" (PRD §5.5). Compose → choose audience → send.
import { EmailComposer } from "@/components/admin/EmailComposer";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminEmailPage() {
  return (
    <section className="flex flex-col gap-4">
      <AdminPageHeader
        title="Email"
        description="Compose purposeful updates and confirm the audience before anything sends."
      />
      <EmailComposer />
    </section>
  );
}
