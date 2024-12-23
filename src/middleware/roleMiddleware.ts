import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { roles } from "../utils/roles";

function hasAccess(userRole: string, pathname: string): boolean {
  const role = roles[userRole];
  if (!role) return false;

  return role.canAccess.some((entry) => {
    if (typeof entry === "string") {
      return pathname.startsWith(entry.replace("/*", ""));
    }
    if (entry.route) {
      return entry.accessSubRoutes ? pathname.startsWith(entry.route) : pathname === entry.route;
    }
    return false;
  });
}

export function roleMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userRoleCookie = req.cookies.get("user-role");
  const userRole = userRoleCookie?.value;

  if (!userRole || !(userRole in roles)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (!hasAccess(userRole, pathname)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}
