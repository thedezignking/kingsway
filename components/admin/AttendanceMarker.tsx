// Admin / AttendanceMarker (PRD §5.4, §4.6). Mark per member per session:
// registered vs attended. Feeds profiles, Insights, Analytics.
import { StubSection } from "@/components/shared/StubSection";

export function AttendanceMarker({ sessionId }: { sessionId: string }) {
  return (
    <StubSection title={`AttendanceMarker — ${sessionId}`} prd="§5.4 KingsHour / attendance">
      Mark registered vs attended per King.
    </StubSection>
  );
}
