// Admin / ChartPanel (PRD §5.1). Host for charts: age distribution, countries,
// occupations, growth areas, monthly signups. Charting lib chosen in the admin pass.
import { StubSection } from "@/components/shared/StubSection";

export function ChartPanel({ title }: { title: string }) {
  return <StubSection title={`ChartPanel — ${title}`} prd="§5.1 Overview / charts" />;
}
