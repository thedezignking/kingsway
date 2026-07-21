// Admin / Insights — route "/admin/insights" (PRD §5.3). The decision engine.
import { getInsights } from "@/lib/modules/analytics";
import { InsightsPanels } from "@/components/admin/InsightsPanels";
import { NotConfigured } from "@/components/admin/NotConfigured";

export const dynamic = "force-dynamic";

export default async function AdminInsightsPage() {
  const insights = await getInsights();
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-base font-semibold">Insights</h1>
      {insights.configured ? <InsightsPanels insights={insights} /> : <NotConfigured />}
    </section>
  );
}
