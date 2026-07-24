import { NextResponse } from "next/server";
import { can, getAdminAccessState } from "@/lib/modules/auth";
import { getSession, updateSession, type SessionInput } from "@/lib/modules/kingshour";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const denied = await authorize();
  if (denied) return denied;
  const session = await getSession(params.id);
  return session
    ? NextResponse.json({ session })
    : NextResponse.json({ error: "Session not found" }, { status: 404 });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = await authorize();
  if (denied) return denied;
  try {
    const input = (await request.json()) as SessionInput;
    return NextResponse.json({ session: await updateSession(params.id, input) });
  } catch (error) {
    console.error("Admin session update failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Session update failed" },
      { status: 400 },
    );
  }
}

async function authorize(): Promise<NextResponse | null> {
  const access = await getAdminAccessState();
  if (access.status === "anonymous") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (access.status !== "ready" || !can(access.admin.role, "manage_sessions")) {
    return NextResponse.json({ error: "Admin access denied" }, { status: 403 });
  }
  return null;
}
