// Admin / KingsHour — route "/admin/kingshour" (PRD §5.4). Session lifecycle list +
// create. Status states: Upcoming / Live / Done. Controls: add session, mark
// attendance, send follow-up.
import { SessionForm } from "@/components/admin/SessionForm";
import { StubSection } from "@/components/shared/StubSection";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminKingsHourPage() {
  return (
    <section className="flex flex-col gap-4">
      <AdminPageHeader
        title="KingsHour"
        description="Plan sessions, monitor registrations, and close the follow-up loop."
      />
      <StubSection title="Sessions list" prd="§5.4 KingsHour">
        Upcoming / Live / Done · registrations · attendance · lifecycle emails.
      </StubSection>
      <SessionForm />
    </section>
  );
}
