import { NextResponse, type NextRequest } from "next/server";
import { createSession, sessionCookie } from "@/lib/auth/session";
import { verifyCredentials } from "@/lib/auth/admin";
import { badRequest } from "@/lib/api";

export async function POST(request: NextRequest) {
  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return badRequest();
  }

  const { username, password } = body;
  if (typeof username !== "string" || typeof password !== "string") {
    return badRequest("Username and password are required");
  }

  if (!verifyCredentials(username, password)) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 },
    );
  }

  const token = await createSession(username);
  const res = NextResponse.json({ success: true });
  res.cookies.set(sessionCookie.name, token, sessionCookie.options);
  return res;
}
