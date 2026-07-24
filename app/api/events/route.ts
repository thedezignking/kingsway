import { NextResponse } from "next/server";
import { createServiceSupabaseOrNull } from "@/lib/supabase/server";
import { ANALYTICS_EVENTS, type AnalyticsEventName } from "@/lib/analytics/events";

export async function POST(request: Request) {
  const db = createServiceSupabaseOrNull();
  if (!db) return NextResponse.json({ persisted: false });

  const body = (await request.json().catch(() => null)) as {
    event?: string;
    props?: Record<string, unknown>;
    path?: string;
  } | null;
  if (!body?.event || !ANALYTICS_EVENTS.includes(body.event as AnalyticsEventName)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const { error } = await db.from("analytics_events").insert({
    event: body.event,
    props: body.props ?? {},
    path: body.path ?? null,
  });
  if (error) return NextResponse.json({ persisted: false });
  return NextResponse.json({ persisted: true });
}
