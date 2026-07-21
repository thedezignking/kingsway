// Admin / KingsHour — route "/admin/kingshour" (PRD §5.4). Session lifecycle list +
// create. Status states: Upcoming / Live / Done. Controls: add session, mark
// attendance, send follow-up.
import { SessionForm } from "@/components/admin/SessionForm";
import { StubSection } from "@/components/shared/StubSection";

export default function AdminKingsHourPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-base font-semibold">KingsHour</h1>
      <StubSection title="Sessions list" prd="§5.4 KingsHour">
        Upcoming / Live / Done · registrations · attendance · lifecycle emails.
      </StubSection>
      <SessionForm />
    </section>
  );
}
