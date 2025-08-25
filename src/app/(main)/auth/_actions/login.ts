/* eslint-disable complexity */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(prevState: any, formData: FormData) {
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
      .eq("email", user.email)
      .single();

    if (adminError) {
      console.error("Admin check error:", adminError);
      await supabase.auth.signOut();
      return {
        message: "Authentication error. Please try again.",
      };
    }

    if (!adminProfile) {
      await supabase.auth.signOut();
      return {
        message: "You are not authorized to access this application.",
      };
    }

    // Check if the admin is associated with a franchise
    const { data: franchise, error: franchiseError } = await supabase
      .from("franchises")
      .select("id")
      .eq("admin_id", adminProfile.id)
      .limit(1)
      .single();

    // Handle the case where no franchise is found
    if (franchiseError && franchiseError.code !== "PGRST116") {
      // PGRST116 is "no rows found"
      console.error("Franchise check error:", franchiseError);
      await supabase.auth.signOut();
      return {
        message: "System error. Please try again later.",
      };
    }

    if (franchise) {
      // This admin manages a franchise, redirect to franchise dashboard
      revalidatePath("/", "layout");
      redirect("/franchise");
    } else {
      // This is a general admin, redirect to the main admin dashboard
      revalidatePath("/", "layout");
      redirect("/admin");
    }
  } catch (error) {
    console.error("Unexpected error in login:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
