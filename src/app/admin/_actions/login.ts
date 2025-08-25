/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint no-constant-condition: ["error", { "checkLoops": false }] */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function adminLogin(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    if (!email || !password) {
      return {
        message: "Email and password are required.",
      };
    }

    // Attempt to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Sign in error:", signInError);
      return {
        message: "Invalid email or password. Please try again.",
      };
    }

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError ?? !user) {
      console.error("Get user error:", userError);
      return {
        message: "Authentication failed. Please try again.",
      };
    }

    // Check if the user is an admin
    const { data: adminProfile, error: adminError } = await supabase
      .from("admins")
      .select("id")
      .eq("id", user.id) // Using user.id instead of email for more reliable matching
      .single();

    if (adminError) {
      console.error("Admin check error:", adminError);
      // Don't sign out here as it might cause issues with the session
      return {
        message: "You are not authorized to access the admin dashboard.",
      };
    }

    if (!adminProfile) {
      return {
        message: "You are not authorized to access the admin dashboard.",
      };
    }

    // Check if the admin is associated with a franchise
    const { data: franchise, error: franchiseError } = await supabase
      .from("franchises")
      .select("id")
      .eq("admin_id", adminProfile.id)
      .limit(1)
      .single();

    // Handle the case where no franchise is found (which is expected for general admins)
    if (franchiseError && franchiseError.code !== "PGRST116") {
      // PGRST116 is "no rows found"
      console.error("Franchise check error:", franchiseError);
      return {
        message: "System error. Please try again later.",
      };
    }

    // Redirect to appropriate dashboard
    revalidatePath("/", "layout");
    if (franchise) {
      // This is a franchise admin, redirect to franchise dashboard
      redirect("/franchise");
    } else {
      // This is a general admin, redirect to the main admin dashboard
      redirect("/admin");
    }
  } catch (error) {
    console.error("Unexpected error in adminLogin:", error);
    // Check if it's a redirect error (which is expected)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      // This is expected when redirect is called, re-throw it
      throw error;
    }
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
