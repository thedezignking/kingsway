// Admin / Insights — route "/admin/insights" (PRD §5.3). The decision engine.
import { getInsights } from "@/lib/modules/analytics";
import { InsightsPanels } from "@/components/admin/InsightsPanels";
import { NotConfigured } from "@/components/admin/NotConfigured";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminInsightsPage() {
  const insights = await getInsights();
  return (
    <section>
      <AdminPageHeader
        title="Insights"
        description="Patterns from the King’s Census that should influence the next decision."
      />
      {insights.configured ? <InsightsPanels insights={insights} /> : <NotConfigured />}
    </section>
  );
}
