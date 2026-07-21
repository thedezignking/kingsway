import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  ADMIN_FLOW_COOKIE,
  ADMIN_NEXT_COOKIE,
  getCurrentAdmin,
  safeAdminDestination,
} from "@/lib/modules/auth";

/**
 * Verifies recovery links directly from their token hash. Unlike the PKCE callback, this route does
 * not depend on the link opening in the same browser that requested the email.
 */
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const destination = safeAdminDestination(request.cookies.get(ADMIN_NEXT_COOKIE)?.value);
  const loginUrl = new URL("/admin/login", request.url);

  if (!tokenHash || type !== "recovery") {
    loginUrl.searchParams.set("error", "invalid_link");
    return redirectAndClear(loginUrl);
  }

  const supabase = createServerSupabase();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "recovery",
  });

  if (error) {
    loginUrl.searchParams.set("error", "expired_link");
    return redirectAndClear(loginUrl);
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    await supabase.auth.signOut();
    return redirectAndClear(new URL("/admin/unauthorized", request.url));
  }

  return redirectAndClear(
    new URL(`/admin/password/update?next=${encodeURIComponent(destination)}`, request.url),
  );
}

function redirectAndClear(url: URL): NextResponse {
  const response = NextResponse.redirect(url);
  for (const name of [ADMIN_NEXT_COOKIE, ADMIN_FLOW_COOKIE]) {
    response.cookies.set(name, "", {
      expires: new Date(0),
      maxAge: 0,
      path: "/admin",
    });
  }
  return response;
}
