import { NextResponse } from "next/server";
import { getPublicSessionBySlug, registerByEmail } from "@/lib/modules/kingshour";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const session = await getPublicSessionBySlug(params.slug);
    if (!session) {
      return NextResponse.json({ error: "KingsHour not found" }, { status: 404 });
    }

    const body = (await request.json()) as { email?: string; source?: string };
    const email = body.email?.trim();
    if (!email) return NextResponse.json({ error: "Enter your email address" }, { status: 400 });

    const result = await registerByEmail(session.id, email, {
      source: body.source || "public_kingshour",
      sourceDetail: params.slug,
    });

    return NextResponse.json({
      ...result,
      sessionId: session.id,
      slug: params.slug,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 },
    );
  }
}
