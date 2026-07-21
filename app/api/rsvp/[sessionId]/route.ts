// API — RSVP (PRD §4.6). Thin handler over lib/modules/kingshour.rsvp.
//   POST  record a Registration for member + session (one-click from invite email).
import { NextResponse } from "next/server";
// import { rsvp } from "@/lib/modules/kingshour";

export async function POST(
  _request: Request,
  { params }: { params: { sessionId: string } },
) {
  void params;
  // TODO(kingshour): resolve member (link token) -> rsvp(sessionId, memberId).
  return NextResponse.json(
    { error: "Not implemented", ref: "lib/modules/kingshour.rsvp" },
    { status: 501 },
  );
}
