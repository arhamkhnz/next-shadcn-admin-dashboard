import { type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users from protected routes to the login page
  if (!user && (pathname.startsWith("/admin") || pathname.startsWith("/franchise"))) {
    return Response.redirect(new URL("/auth/v2/login", request.url));
  }

  // If the user is logged in, check their role
  if (user) {
    const { data: adminProfile } = await supabase.from("admins").select("id").eq("email", user.email).single();

    if (adminProfile) {
      // User is an admin. Allow access to admin and franchise dashboards.
      // We can add more specific logic here later if needed.
      if (pathname.startsWith("/franchise")) {
        return response;
      }
      if (pathname.startsWith("/admin")) {
        return response;
      }
    } else {
      // User is not an admin, but is logged in.
      // Redirect them from protected routes to an unauthorized page.
      if (pathname.startsWith("/admin") || pathname.startsWith("/franchise")) {
        return Response.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/franchise/:path*"],
};
