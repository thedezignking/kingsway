// Admin / Analytics — route "/admin/analytics" (PRD §5.6). Community analytics (not
// website). Metrics + funnel: visitor → census start → completion → welcome → first
// KingsHour → returning. Surface the census drop-off screen prominently.
import { StubSection } from "@/components/shared/StubSection";
import { ChartPanel } from "@/components/admin/ChartPanel";

export default function AdminAnalyticsPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-base font-semibold">Analytics</h1>
      <StubSection title="Funnel" prd="§5.6 Analytics">
        visitor → census start → completion → welcome → first KingsHour → returning.
      </StubSection>
      <ChartPanel title="Joins per month · attendance · opens · retention" />
      <StubSection title="Census drop-off screen (callout)" prd="§5.6" />
    </section>
  );
}
