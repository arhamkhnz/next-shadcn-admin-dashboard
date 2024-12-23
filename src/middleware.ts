import { NextRequest, NextResponse } from "next/server";

import { authMiddleware } from "./middleware/authMiddleware";
import { roleMiddleware } from "./middleware/roleMiddleware";

export function middleware(req: NextRequest) {
  // authMiddleware
  // const response = authMiddleware(req)
  // if (response) {
  //   return response
  // }

  // roleMiddleware
  // const roleResponse = roleMiddleware(req)
  // if (roleResponse) {
  //   return roleResponse
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"],
};
