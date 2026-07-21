// API — census (PRD §4.2, §7). Thin handler over lib/modules/census.
//   POST   save progress / upsert answers (creates the Member once name+email are present)
//   PATCH  complete the census (promotes to King, sends the Welcome email)
import { NextResponse } from "next/server";
import { saveCensus, completeCensus, type SaveCensusInput } from "@/lib/modules/census";

async function parse(request: Request): Promise<SaveCensusInput | null> {
  try {
    const body = (await request.json()) as SaveCensusInput;
    if (!body || typeof body.answers !== "object") return null;
    return body;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await parse(request);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  try {
    const result = await saveCensus(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Save failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const body = await parse(request);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  try {
    const result = await completeCensus(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Complete failed" },
      { status: 500 },
    );
  }
}
