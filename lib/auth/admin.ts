import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { sessionCookie, verifySession, type SessionPayload } from "./session";

/** Hashing first gives equal-length inputs, so the length isn't leaked either. */
function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export function verifyCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME;
  const p = process.env.ADMIN_PASSWORD;
  if (!u || !p) {
    console.error("ADMIN_USERNAME and ADMIN_PASSWORD must be set to log in.");
    return false;
  }
  // Compare both every time: stopping early would reveal a valid username.
  const usernameMatches = safeEqual(username, u);
  const passwordMatches = safeEqual(password, p);
  return usernameMatches && passwordMatches;
}

export async function getAdminSession(
  req: NextRequest,
): Promise<SessionPayload | null> {
  const token = req.cookies.get(sessionCookie.name)?.value;
  return verifySession(token);
}

export async function requireAdmin(
  req: NextRequest,
): Promise<NextResponse | null> {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
