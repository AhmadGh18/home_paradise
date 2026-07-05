import { NextResponse, type NextRequest } from "next/server";
import { sessionCookie, verifySession, type SessionPayload } from "./session";

function timingSafeEqual(a: string, b: string): boolean {
  // Compare over the longer length so we never early-return on a length
  // mismatch (which would leak the secret's length via timing). A length
  // difference still forces the result to false via the `matched` flag.
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export function verifyCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME;
  const p = process.env.ADMIN_PASSWORD;
  if (!u || !p) return false;
  return timingSafeEqual(username, u) && timingSafeEqual(password, p);
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
