// middleware.ts
import { NextResponse } from "next/server";
import { getUserFromCookie, requireAdmin } from "./lib/auth";

export function middleware(req: Request) {
  const url = new URL(req.url);

  // Only protect /admin routes
  if (!url.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const cookieHeader = req.headers.get("cookie") || "";
  const session = getUserFromCookie(cookieHeader);

  if (!requireAdmin(session)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
