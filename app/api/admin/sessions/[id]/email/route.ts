import { NextResponse } from "next/server";
import { can, getAdminAccessState } from "@/lib/modules/auth";
import {
  previewSessionEmail,
  sendSessionEmail,
  type LifecycleEmailType,
} from "@/lib/modules/communication";

const TYPES: LifecycleEmailType[] = ["invitation", "reminder", "follow_up"];

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const denied = await authorize();
  if (denied) return denied;
  const type = lifecycleType(new URL(request.url).searchParams.get("type"));
  if (!type) return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
  try {
    return NextResponse.json(await previewSessionEmail(params.id, type));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Preview failed" },
      { status: 400 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const denied = await authorize();
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as { type?: string; confirmCount?: number } | null;
  const type = lifecycleType(body?.type);
  if (!type) return NextResponse.json({ error: "Invalid email type" }, { status: 400 });

  try {
    const preview = await previewSessionEmail(params.id, type);
    if (typeof body?.confirmCount !== "number" || body.confirmCount !== preview.recipientCount) {
      return NextResponse.json(
        {
          error: "Confirm the current recipient count before sending",
          recipientCount: preview.recipientCount,
          budget: preview.budget,
        },
        { status: 409 },
      );
    }
    return NextResponse.json(await sendSessionEmail(params.id, type));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Send failed" },
      { status: 400 },
    );
  }
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

function lifecycleType(value: string | null | undefined): LifecycleEmailType | null {
  return TYPES.includes(value as LifecycleEmailType) ? (value as LifecycleEmailType) : null;
}
