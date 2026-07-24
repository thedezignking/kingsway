import { NextResponse } from "next/server";
import { can, getAdminAccessState } from "@/lib/modules/auth";
import { markAttendance } from "@/lib/modules/kingshour";
import type { AttendanceStatus } from "@/lib/supabase/types";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const access = await getAdminAccessState();
  if (access.status === "anonymous") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (access.status !== "ready" || !can(access.admin.role, "manage_sessions")) {
    return NextResponse.json({ error: "Admin access denied" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as { memberId?: string; status?: AttendanceStatus };
    if (!body.memberId || !body.status) {
      return NextResponse.json({ error: "Member and attendance status are required" }, { status: 400 });
    }
    await markAttendance(params.id, body.memberId, body.status);
    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("Attendance update failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Attendance update failed" },
      { status: 400 },
    );
  }
}
