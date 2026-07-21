// API — admin email send (PRD §5.5). Thin handler over lib/modules/communication.
//   POST  compose -> resolve segment -> send -> log. Requires pre-send count confirm in UI.
// TODO(auth): gate with getCurrentAdmin() before enabling.
import { NextResponse } from "next/server";
// import { sendToSegment } from "@/lib/modules/communication";

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented", ref: "lib/modules/communication.sendToSegment" },
    { status: 501 },
  );
}
