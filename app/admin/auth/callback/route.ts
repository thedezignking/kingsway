import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  ADMIN_NEXT_COOKIE,
  getAdminAccessState,
  safeAdminDestination,
} from "@/lib/modules/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const destination = safeAdminDestination(
    request.nextUrl.searchParams.get("next") ?? request.cookies.get(ADMIN_NEXT_COOKIE)?.value,
  );
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
  return response;
}
