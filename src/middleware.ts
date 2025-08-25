/* eslint-disable max-depth */
/* eslint-disable complexity */
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Exclude login and register pages from authentication checks to prevent redirect loops
    const isAuthPage =
      pathname.startsWith("/admin/login") || pathname.startsWith("/franchise/login") || pathname.startsWith("/auth");

    // Handle authentication errors - if it's a session missing error, allow access to auth pages
    if (authError) {
      // For auth pages, allow access even if there's an auth error
      if (isAuthPage) {
        return response;
      }

      // For protected pages, redirect to appropriate login
      if (pathname.startsWith("/admin")) {
        return Response.redirect(new URL("/admin/login", request.url));
      }
      if (pathname.startsWith("/franchise")) {
        return Response.redirect(new URL("/franchise/login", request.url));
      }

      // Allow the request to continue for non-protected pages
      return response;
    }

    // Redirect unauthenticated users from protected routes to the appropriate login page
    if (!user && !isAuthPage) {
      if (pathname.startsWith("/admin")) {
        return Response.redirect(new URL("/admin/login", request.url));
      }
      if (pathname.startsWith("/franchise")) {
        return Response.redirect(new URL("/franchise/login", request.url));
      }
      return response;
    }

    // If the user is logged in, check their role and restrict access appropriately
    if (user && !isAuthPage) {
      // Check if user is an admin
      const { data: adminProfile, error: adminError } = await supabase
        .from("admins")
        .select("id")
        .eq("id", user.id) // Using user.id to match admins.id
        .single();

      // Handle admin check errors
      if (adminError) {
        // Redirect to unauthorized page for protected routes
        if (pathname.startsWith("/admin") || pathname.startsWith("/franchise")) {
          return Response.redirect(new URL("/unauthorized", request.url));
        }
        return response;
      }

      if (adminProfile) {
        // User is an admin. Check if they manage a specific franchise.
        const { data: franchises, error: franchiseError } = await supabase
          .from("franchises")
          .select("id")
          .eq("admin_id", adminProfile.id);

        // Handle franchise check errors
        if (franchiseError) {
          // Redirect to unauthorized page for protected routes
          if (pathname.startsWith("/admin") || pathname.startsWith("/franchise")) {
            return Response.redirect(new URL("/unauthorized", request.url));
          }
          return response;
        }

        // Check if accessing a specific franchise
        const franchiseIdMatch = pathname.match(/^\/admin\/franchises\/([^\\/]+)/);
        if (franchiseIdMatch) {
          const requestedFranchiseId = franchiseIdMatch[1];
          const hasAccess = franchises.some((f) => f.id === requestedFranchiseId);

          if (!hasAccess) {
            // User doesn't have access to this specific franchise
            return Response.redirect(new URL("/admin", request.url));
          }
        }

        // If user is a franchise admin (manages at least one franchise)
        if (franchises && franchises.length > 0) {
          // Allow access to both admin and franchise dashboards
          // The franchise dashboard will scope data based on the franchise ID
        } else {
          // This is a general admin with no specific franchise
          if (pathname.startsWith("/franchise")) {
            // Redirect general admins from franchise routes to main admin dashboard
            return Response.redirect(new URL("/admin", request.url));
          }
        }
      } else {
        // User is not an admin
        if (pathname.startsWith("/admin") || pathname.startsWith("/franchise")) {
          return Response.redirect(new URL("/unauthorized", request.url));
        }
      }
    }

    return response;
  } catch (error) {
    // In case of unexpected errors, allow access to auth pages but redirect others to unauthorized
    const { pathname } = request.nextUrl;
    const isAuthPage =
      pathname.startsWith("/admin/login") || pathname.startsWith("/franchise/login") || pathname.startsWith("/auth");

    if (isAuthPage) {
      return NextResponse.next();
    }
    return Response.redirect(new URL("/unauthorized", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/franchise/:path*"],
};
