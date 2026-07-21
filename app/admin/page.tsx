// Admin / Overview — route "/admin" (PRD §5.1). "What needs my attention today?" (<10s).
// Real stat cards from the analytics module; charts remain stubs until the analytics pass.
import { getOverviewStats } from "@/lib/modules/analytics";
import { StatCard } from "@/components/admin/StatCard";
import { ChartPanel } from "@/components/admin/ChartPanel";
import { NotConfigured } from "@/components/admin/NotConfigured";

export const dynamic = "force-dynamic";

const CHARTS = ["Age distribution", "Countries", "Occupations", "Growth areas", "Monthly signups"];

export default async function AdminOverviewPage() {
  const stats = await getOverviewStats();
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-base font-semibold">Overview</h1>
      {!stats.configured && <NotConfigured />}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Kings" value={stats.totalKings} />
        <StatCard label="Joined this week" value={stats.joinedThisWeek} />
        <StatCard label="Census completion" value={`${stats.censusCompletionRate}%`} />
        <StatCard label="Days to KingsHour" value={stats.daysToKingsHour} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CHARTS.map((c) => (
          <ChartPanel key={c} title={c} />
        ))}
      </div>
    </section>
  );
}
