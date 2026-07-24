// API — RSVP (PRD §4.6). Thin handler over lib/modules/kingshour.rsvp.
//   POST  record a Registration for member + session (one-click from invite email).
import { NextResponse } from "next/server";
import { registerByEmail } from "@/lib/modules/kingshour";

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } },
) {
  try {
    const body = (await request.json()) as { email?: string; source?: string };
    const email = body.email?.trim();
    if (!email) return NextResponse.json({ error: "Enter your email address" }, { status: 400 });
    return NextResponse.json(
      await registerByEmail(params.sessionId, email, {
        source: body.source || "rsvp",
        sourceDetail: params.sessionId,
      }),
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "RSVP failed" },
      { status: 500 },
    );
  }
}
