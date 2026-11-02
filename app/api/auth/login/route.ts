import { NextResponse } from "next/server";
import { HttpError, readJsonObject, route } from "@/lib/api";
import { verifyCredentials } from "@/lib/auth/admin";
import { createSession, sessionCookie } from "@/lib/auth/session";
import { enforceRateLimit, resetRateLimit } from "@/lib/rate-limit";

const LOGIN_LIMIT = { scope: "login", max: 5, windowSeconds: 15 * 60 };
// Caps guessing from many addresses at once, or from faked ones. An attacker
// could use this to block logins for a while, which beats unlimited guesses.
const LOGIN_LIMIT_ALL = {
  scope: "login",
  max: 100,
  windowSeconds: 15 * 60,
  shared: true,
};

export const POST = route(async (request) => {
  // If the limiter's database is unavailable this throws and login fails
  // closed: without a limit, passwords could be guessed at full speed.
  await enforceRateLimit(request, LOGIN_LIMIT);
  await enforceRateLimit(request, LOGIN_LIMIT_ALL);

  const { username, password } = await readJsonObject(request, 4 * 1024);
  if (typeof username !== "string" || typeof password !== "string") {
    throw new HttpError(400, "Username and password are required");
  }

  if (!verifyCredentials(username, password)) {
    throw new HttpError(401, "Invalid credentials");
  }

  const token = await createSession(username);
  await resetRateLimit(request, LOGIN_LIMIT);
  await resetRateLimit(request, LOGIN_LIMIT_ALL);

  const res = NextResponse.json({ success: true });
  res.cookies.set(sessionCookie.name, token, sessionCookie.options);
  return res;
});
