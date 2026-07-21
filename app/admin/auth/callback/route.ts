import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getAdminAccessState, safeAdminDestination } from "@/lib/modules/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const destination = safeAdminDestination(request.nextUrl.searchParams.get("next"));
  const loginUrl = new URL("/admin/login", request.url);

  if (!code) {
    loginUrl.searchParams.set("error", "invalid_link");
    return NextResponse.redirect(loginUrl);
  }

  const { error } = await createServerSupabase().auth.exchangeCodeForSession(code);
  if (error) {
    loginUrl.searchParams.set("error", "expired_link");
    return NextResponse.redirect(loginUrl);
  }

  const access = await getAdminAccessState();
  if (access.status === "forbidden") {
    return NextResponse.redirect(new URL("/admin/unauthorized", request.url));
  }
  if (access.status === "needs_enrollment") {
    return NextResponse.redirect(
      new URL(`/admin/mfa/enroll?next=${encodeURIComponent(destination)}`, request.url),
    );
  }
  if (access.status === "needs_challenge") {
    return NextResponse.redirect(
      new URL(`/admin/mfa/verify?next=${encodeURIComponent(destination)}`, request.url),
    );
  }
  return NextResponse.redirect(new URL(destination, request.url));
}
