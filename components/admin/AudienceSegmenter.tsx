// Admin / AudienceSegmenter (PRD §5.5). Choose audience for a send. Segments:
// Everyone · by season · by country · by interest · Joined this month ·
// Didn't attend last KingsHour · Custom. Shows resolved recipient count (pre-send).
import { StubSection } from "@/components/shared/StubSection";
import type { Segment } from "@/lib/modules/communication";

export function AudienceSegmenter({
  onChange,
}: {
  onChange?: (segment: Segment) => void;
}) {
  void onChange;
  return (
    <StubSection title="AudienceSegmenter" prd="§5.5 Email / segments">
      Everyone · season · country · interest · joined this month · missed last KingsHour · custom.
    </StubSection>
  );
}
