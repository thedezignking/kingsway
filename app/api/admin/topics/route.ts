import { NextResponse } from "next/server";
import { can, getAdminAccessState } from "@/lib/modules/auth";
import { createTopic, type TopicInput } from "@/lib/modules/kingshour";

export async function POST(request: Request) {
  const access = await getAdminAccessState();
  if (access.status === "anonymous") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (access.status !== "ready" || !can(access.admin.role, "manage_sessions")) {
    return NextResponse.json({ error: "Admin access denied" }, { status: 403 });
  }
  try {
    const input = (await request.json()) as TopicInput;
    return NextResponse.json({ topic: await createTopic(input) }, { status: 201 });
  } catch (error) {
    console.error("Topic creation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Topic creation failed" },
      { status: 400 },
    );
  }
}
