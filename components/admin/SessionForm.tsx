// Admin / SessionForm (PRD §5.4). Create/edit a KingsHour session: topic (from Topic
// Bank), date, description, facilitator, Meet link (pasted manually), resources, status.
// Warn when a session has no Meet link before invites go out.
import { StubSection } from "@/components/shared/StubSection";

export function SessionForm({ sessionId }: { sessionId?: string }) {
  return (
    <StubSection
      title={sessionId ? `SessionForm — edit ${sessionId}` : "SessionForm — new"}
      prd="§5.4 KingsHour / session"
    >
      Topic · date · description · facilitator · Meet link · resources · status.
    </StubSection>
  );
}
