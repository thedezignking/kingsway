import { NextResponse } from "next/server";
import { can, getAdminAccessState } from "@/lib/modules/auth";
import { listMembers, type MemberFilter } from "@/lib/modules/members";

export async function GET(request: Request) {
  const access = await getAdminAccessState();
  if (access.status === "anonymous") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (access.status !== "ready" || !can(access.admin.role, "manage_kings")) {
    return NextResponse.json({ error: "Admin access denied" }, { status: 403 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const filter: MemberFilter = {
    query: value(url, "q"),
    status: status === "king" || status === "incomplete" ? status : "all",
    country: value(url, "country"),
    season: value(url, "season"),
    interest: value(url, "interest"),
    pageSize: 5000,
  };
  const result = await listMembers(filter);
  const rows = [
    [
      "name",
      "email",
      "phone",
      "current_country",
      "current_state_city",
      "age_range",
      "season",
      "occupation",
      "interests",
      "census_status",
      "joined_at",
      "last_activity",
    ],
    ...result.members.map((member) => [
      member.first_name,
      member.email,
      member.phone,
      member.country,
      member.state_city,
      member.age_range,
      member.season,
      member.occupation,
      member.interests.join(" | "),
      member.status,
      member.join_date,
      member.last_activity,
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kingsway-kings-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

function value(url: URL, key: string): string | undefined {
  return url.searchParams.get(key)?.trim() || undefined;
}

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}
