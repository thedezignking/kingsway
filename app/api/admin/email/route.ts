// API — admin email send (PRD §5.5). Thin handler over lib/modules/communication.
//   POST  compose -> resolve segment -> send -> log. Requires pre-send count confirm in UI.
import { NextResponse } from "next/server";
import { can, getAdminAccessState } from "@/lib/modules/auth";
// import { sendToSegment } from "@/lib/modules/communication";

export async function POST() {
  const access = await getAdminAccessState();
  if (access.status === "anonymous") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (access.status !== "ready" || !can(access.admin.role, "send_email")) {
    return NextResponse.json({ error: "Admin access denied" }, { status: 403 });
  }
  return NextResponse.json(
    { error: "Not implemented", ref: "lib/modules/communication.sendToSegment" },
    { status: 501 },
  );
}
