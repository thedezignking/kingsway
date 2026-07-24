// API — admin email send (PRD §5.5). Thin handler over lib/modules/communication.
//   POST  compose -> resolve segment -> send -> log. Requires pre-send count confirm in UI.
import { NextResponse } from "next/server";
import { can, getAdminAccessState } from "@/lib/modules/auth";
import { getEmailBudget, resolveSegment, sendToSegment } from "@/lib/modules/communication";

export async function GET() {
  const denied = await authorize();
  if (denied) return denied;
  const memberIds = await resolveSegment({ kind: "everyone" });
  return NextResponse.json({ recipientCount: memberIds.length, budget: await getEmailBudget() });
}

export async function POST(request: Request) {
  const denied = await authorize();
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as {
    subject?: string;
    body?: string;
    confirmCount?: number;
  } | null;
  const memberIds = await resolveSegment({ kind: "everyone" });
  if (body?.confirmCount !== memberIds.length) {
    return NextResponse.json(
      {
        error: "Confirm the current recipient count before sending",
        recipientCount: memberIds.length,
        budget: await getEmailBudget(),
      },
      { status: 409 },
    );
  }
  return NextResponse.json(
    await sendToSegment({
      subject: body?.subject,
      body: body?.body,
      segment: { kind: "everyone" },
    }),
  );
}

async function authorize(): Promise<NextResponse | null> {
  const access = await getAdminAccessState();
  if (access.status === "anonymous") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (access.status !== "ready" || !can(access.admin.role, "send_email")) {
    return NextResponse.json({ error: "Admin access denied" }, { status: 403 });
  }
  return null;
}
