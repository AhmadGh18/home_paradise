import { NextResponse } from "next/server";
import { route } from "@/lib/api";
import { getAdminSession } from "@/lib/auth/admin";

export const GET = route(async (request) => {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: { username: session.sub },
  });
});
