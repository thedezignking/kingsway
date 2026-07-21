// RSVP — route "/rsvp/[sessionId]" (PRD §4.6, §7). One-click RSVP: records a
// Registration for member+session. (Blueprint left the mechanism open; V1 uses this
// minimal RSVP — confirm before build.)
// TODO(kingshour): resolve member (from email link token), call kingshour.rsvp(), confirm.
import { StubSection } from "@/components/shared/StubSection";

export default function RsvpPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-lg font-semibold">RSVP — KingsHour</h1>
      <StubSection title={`One-click RSVP — session ${params.sessionId}`} prd="§4.6 RSVP">
        Records a Registration for member + session, then confirms.
      </StubSection>
    </main>
  );
}
