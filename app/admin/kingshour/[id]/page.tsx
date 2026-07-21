// Admin / KingsHour session — route "/admin/kingshour/[id]" (PRD §5.4).
// Edit session, monitor registrations, mark attendance, trigger/schedule the three
// lifecycle emails. Warn if no Meet link before invites go out.
import { SessionForm } from "@/components/admin/SessionForm";
import { AttendanceMarker } from "@/components/admin/AttendanceMarker";

export default function AdminKingsHourSessionPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-base font-semibold">KingsHour Session</h1>
      <SessionForm sessionId={params.id} />
      <AttendanceMarker sessionId={params.id} />
    </section>
  );
}
