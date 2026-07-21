// Admin / EmailComposer (PRD §5.5). Compose → choose audience → send. Requires a
// pre-send confirmation (recipient count) and a post-send confirmation. Shows send
// history + per-campaign opens.
import { StubSection } from "@/components/shared/StubSection";
import { AudienceSegmenter } from "./AudienceSegmenter";

export function EmailComposer() {
  return (
    <StubSection title="EmailComposer" prd="§5.5 Email / compose">
      <p>Subject + body · pre-send count confirmation · post-send confirmation · send history.</p>
      <div className="mt-2">
        <AudienceSegmenter />
      </div>
    </StubSection>
  );
}
