import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SessionForm } from "@/components/admin/SessionForm";
import { SessionList } from "@/components/admin/SessionList";
import { listSessions, listTopics } from "@/lib/modules/kingshour";

export const dynamic = "force-dynamic";

export default async function AdminKingsHourPage() {
  const [sessionsResult, topicsResult] = await Promise.allSettled([listSessions(), listTopics()]);
  const sessions = sessionsResult.status === "fulfilled" ? sessionsResult.value : [];
  const topics = topicsResult.status === "fulfilled" ? topicsResult.value : [];
  const loadFailed = sessionsResult.status === "rejected" || topicsResult.status === "rejected";

  return (
    <section className="flex flex-col gap-4">
      <AdminPageHeader
        title="KingsHour"
        description="Plan sessions, monitor registrations, and close the follow-up loop."
      />
      {loadFailed && (
        <div className="border border-[#e6cda9] bg-[#fff9ef] px-4 py-3 text-xs text-[#754006]">
          KingsHour data could not be reached. The planning interface remains available for preview;
          refresh when the database connection is stable.
        </div>
      )}
      <SessionList sessions={sessions} />
      <details className="group">
        <summary className="admin-button-primary ml-auto w-fit cursor-pointer list-none">
          Plan a KingsHour
        </summary>
        <div className="mt-4">
          <SessionForm topics={topics} />
        </div>
      </details>
    </section>
  );
}
