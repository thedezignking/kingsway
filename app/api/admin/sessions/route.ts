import { NextResponse } from "next/server";
import { can, getAdminAccessState } from "@/lib/modules/auth";
import { createSession, listSessions, type SessionInput } from "@/lib/modules/kingshour";

export async function GET() {
  const denied = await authorize();
  if (denied) return denied;
  try {
    return NextResponse.json({ sessions: await listSessions() });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  const denied = await authorize();
  if (denied) return denied;
  try {
    const input = (await request.json()) as SessionInput;
    return NextResponse.json({ session: await createSession(input) }, { status: 201 });
  } catch (error) {
    return failure(error, 400);
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

function failure(error: unknown, status = 500) {
  console.error("Admin session operation failed", error);
  return NextResponse.json(
    { error: errorMessage(error, "Session operation failed") },
    { status },
  );
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return fallback;
}
