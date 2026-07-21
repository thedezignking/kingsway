// Admin / Email — route "/admin/email" (PRD §5.5). Compose → choose audience → send.
import { EmailComposer } from "@/components/admin/EmailComposer";

export default function AdminEmailPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-base font-semibold">Email</h1>
      <EmailComposer />
    </section>
  );
}
