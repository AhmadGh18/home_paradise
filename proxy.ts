import { NextResponse, type NextRequest } from "next/server";
import { sessionCookie, verifySession } from "@/lib/auth/session";

const LOGIN_PATH = "/admin/login";

/**
 * Server-side guard for every `/admin/*` route.
 *
 * - Unauthenticated requests to any admin page are redirected to the login
 *   page (with the original path preserved in `?next=` so we can send the
 *   user back after a successful login).
 * - Authenticated requests that hit the login page are bounced to the
 *   dashboard so a logged-in admin never sees the login form.
 *
 * API routes under `/api/*` are intentionally not matched here: each mutating
 * handler enforces auth itself via `requireAdmin`, and the auth endpoints
 * (login/logout/me) must stay reachable while logged out.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(sessionCookie.name)?.value;
  const session = await verifySession(token);

  const isLoginPage = pathname === LOGIN_PATH;

  if (isLoginPage) {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
