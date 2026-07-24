// Admin / Overview — route "/admin" (PRD §5.1). "What needs my attention today?" (<10s).
// Live operational metrics and first-party distributions from the analytics module.
import { getOverviewStats } from "@/lib/modules/analytics";
import { StatCard } from "@/components/admin/StatCard";
import { ChartPanel } from "@/components/admin/ChartPanel";
import { AttentionQueue } from "@/components/admin/AttentionQueue";
import { NotConfigured } from "@/components/admin/NotConfigured";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getOverviewStats();
  return (
    <section>
      <AdminPageHeader
        title="Overview"
        description="The current state of the community and what needs attention."
        meta={`Updated ${new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}`}
      />
      {!stats.configured ? (
        <NotConfigured />
      ) : (
        <>
          <AttentionQueue items={stats.attention} />

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard label="Total Kings" value={stats.totalKings} />
            <StatCard label="Joined this week" value={stats.joinedThisWeek} />
            <StatCard label="Census complete" value={`${stats.censusCompletionRate}%`} />
            <StatCard label="Days to KingsHour" value={stats.daysToKingsHour} />
            <StatCard
              label="Attendance"
              value={stats.attendanceRate === null ? "—" : `${stats.attendanceRate}%`}
              hint={stats.attendanceRate === null ? "No marked sessions" : "Marked attendance"}
            />
            <StatCard
              label="Last email"
              value={stats.lastEmailAt ? shortDate(stats.lastEmailAt) : "—"}
              hint="Open tracking remains off"
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Signal label="Most repeated goal" value={stats.topGoal} />
            <Signal label="Biggest struggle" value={stats.biggestStruggle} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <ChartPanel title="Monthly signups" items={stats.monthlySignups} caption="Last six months" />
            <ChartPanel title="Current residence" items={stats.countryDistribution} />
            <ChartPanel title="Age distribution" items={stats.ageDistribution} />
            <ChartPanel title="Occupations" items={stats.occupationDistribution} />
            <div className="lg:col-span-2">
              <ChartPanel title="Requested topics" items={stats.topicDistribution} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Signal({ label, value }: { label: string; value: string | null }) {
  return (
    <section className="border border-line bg-white/75 px-4 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-relaxed">{value ?? "Not enough data yet"}</p>
    </section>
  );
}

function shortDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
