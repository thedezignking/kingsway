// API — admin sessions (PRD §5.4). Thin handler over lib/modules/kingshour.
//   POST   create a KingsHour session
//   (GET/PATCH for list/edit + attendance land in the KingsHour build pass)
// TODO(auth): gate with getCurrentAdmin() before enabling.
import { NextResponse } from "next/server";
// import { createSession, listSessions } from "@/lib/modules/kingshour";

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented", ref: "lib/modules/kingshour.listSessions" },
    { status: 501 },
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented", ref: "lib/modules/kingshour.createSession" },
    { status: 501 },
  );
}
