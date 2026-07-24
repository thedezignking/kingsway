import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AttendanceMarker } from "@/components/admin/AttendanceMarker";
import { SessionPublicPanel } from "@/components/admin/SessionPublicPanel";
import { SessionEmailActions } from "@/components/admin/SessionEmailActions";
import { SessionForm } from "@/components/admin/SessionForm";
import { getSession, listTopics } from "@/lib/modules/kingshour";

export const dynamic = "force-dynamic";

export default async function AdminKingsHourSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const [session, topics] = await Promise.all([getSession(params.id), listTopics()]);
  if (!session) notFound();

  return (
    <section className="flex flex-col gap-4">
      <AdminPageHeader
        title={session.topic?.title ?? "KingsHour session"}
        description={`${formatDate(session.date)} · ${session.registrationCount} registered · ${session.attendedCount} attended`}
        meta={session.status}
      />

      {!session.meet_link && session.status !== "done" && (
        <div className="border border-[#e6cda9] bg-[#fff9ef] px-4 py-3 text-xs text-[#754006]">
          Add the Google Meet link before sending invitations or reminders.
        </div>
      )}

      <SessionPublicPanel session={session} />
      <SessionForm topics={topics} session={session} />
      <SessionEmailActions sessionId={session.id} />
      <AttendanceMarker sessionId={session.id} registrations={session.registrations} />
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
