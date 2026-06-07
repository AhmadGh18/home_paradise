import { NextResponse, type NextRequest } from "next/server";
import { sessionCookie, verifySession } from "@/lib/auth/session";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(sessionCookie.name)?.value;
  return Boolean(await verifySession(token));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = await isAuthenticated(req);

  if (pathname.startsWith("/admin")) {
    if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
      if (authed) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }
    if (!authed) {
      const url = new URL("/admin/login", req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
