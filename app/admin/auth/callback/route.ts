import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  ADMIN_FLOW_COOKIE,
  ADMIN_NEXT_COOKIE,
  getAdminAccessState,
  getCurrentAdmin,
  safeAdminDestination,
} from "@/lib/modules/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const destination = safeAdminDestination(
    request.nextUrl.searchParams.get("next") ?? request.cookies.get(ADMIN_NEXT_COOKIE)?.value,
  );
  const flow = request.cookies.get(ADMIN_FLOW_COOKIE)?.value;
  const loginUrl = new URL("/admin/login", request.url);

  if (!code) {
    loginUrl.searchParams.set("error", "invalid_link");
    return redirectAndClear(loginUrl);
  }

  const { error } = await createServerSupabase().auth.exchangeCodeForSession(code);
  if (error) {
    loginUrl.searchParams.set("error", "expired_link");
    return redirectAndClear(loginUrl);
  }

  if (flow === "password-reset") {
    const admin = await getCurrentAdmin();
    if (!admin) return redirectAndClear(new URL("/admin/unauthorized", request.url));
    return redirectAndClear(
      new URL(`/admin/password/update?next=${encodeURIComponent(destination)}`, request.url),
    );
  }

  const access = await getAdminAccessState();
  if (access.status === "forbidden") {
    return redirectAndClear(new URL("/admin/unauthorized", request.url));
  }
  if (access.status === "needs_enrollment") {
    return redirectAndClear(
      new URL(`/admin/mfa/enroll?next=${encodeURIComponent(destination)}`, request.url),
    );
  }
  if (access.status === "needs_challenge") {
    return redirectAndClear(
      new URL(`/admin/mfa/verify?next=${encodeURIComponent(destination)}`, request.url),
    );
  }
  return redirectAndClear(new URL(destination, request.url));
}

function redirectAndClear(url: URL): NextResponse {
  const response = NextResponse.redirect(url);
  response.cookies.set(ADMIN_NEXT_COOKIE, "", {
    expires: new Date(0),
    maxAge: 0,
    path: "/admin",
  });
  response.cookies.set(ADMIN_FLOW_COOKIE, "", {
    expires: new Date(0),
    maxAge: 0,
    path: "/admin",
  });
  return response;
}
