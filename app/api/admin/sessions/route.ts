// API — admin sessions (PRD §5.4). Thin handler over lib/modules/kingshour.
//   POST   create a KingsHour session
//   (GET/PATCH for list/edit + attendance land in the KingsHour build pass)
import { NextResponse } from "next/server";
import { can, getAdminAccessState } from "@/lib/modules/auth";
// import { createSession, listSessions } from "@/lib/modules/kingshour";

export async function GET() {
  const denied = await authorizeSessions();
  if (denied) return denied;
  return NextResponse.json(
    { error: "Not implemented", ref: "lib/modules/kingshour.listSessions" },
    { status: 501 },
  );
}

export async function POST() {
  const denied = await authorizeSessions();
  if (denied) return denied;
  return NextResponse.json(
    { error: "Not implemented", ref: "lib/modules/kingshour.createSession" },
    { status: 501 },
  );
}

async function authorizeSessions(): Promise<NextResponse | null> {
  const access = await getAdminAccessState();
  if (access.status === "anonymous") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (access.status !== "ready" || !can(access.admin.role, "manage_sessions")) {
    return NextResponse.json({ error: "Admin access denied" }, { status: 403 });
  }
  return null;
}
