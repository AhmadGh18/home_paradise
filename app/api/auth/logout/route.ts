import { NextResponse } from "next/server";
import { route } from "@/lib/api";
import { sessionCookie } from "@/lib/auth/session";

export const POST = route(async () => {
  const res = NextResponse.json({ success: true });
  res.cookies.set(sessionCookie.name, "", {
    ...sessionCookie.options,
    maxAge: 0,
  });
  return res;
});
