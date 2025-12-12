// Proxy disabled.
// Rename this file to `proxy.ts` to enable it.
import { type NextRequest, NextResponse } from "next/server";

/**
 * Runs before requests complete.
 * Use for rewrites, redirects, or header changes.
 * Refer to Next.js Proxy docs for more examples.
 */
export function proxy(_req: NextRequest) {
  // Example: redirect to dashboard if user is logged in
  // const token = req.cookies.get("session_token")?.value;
  // if (token && req.nextUrl.pathname === "/auth/login")
  //   return NextResponse.redirect(new URL("/dashboard", req.url));

  return NextResponse.next();
}

/**
 * Matcher runs for all routes.
 * To skip assets or APIs, use a negative matcher from docs.
 */
export const config = {
  matcher: "/:path*",
};
