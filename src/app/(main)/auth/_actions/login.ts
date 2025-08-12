"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  const { data: user } = await supabase.auth.getUser();

  if (user?.user) {
    const { data: adminProfile } = await supabase.from("admins").select("id").eq("email", user.user.email).single();

    if (adminProfile) {
      // Check if the admin is associated with a franchise
      const { data: franchise } = await supabase
        .from("franchises")
        .select("id")
        .eq("admin_id", adminProfile.id)
        .limit(1)
        .single();

      if (franchise) {
        // This admin manages a franchise, redirect to franchise dashboard
        redirect("/franchise");
      } else {
        // This is a general admin, redirect to the main admin dashboard
        redirect("/admin");
      }
    } else {
      // If not an admin, sign them out and show an error
      await supabase.auth.signOut();
      return {
        message: "You are not authorized to access this application.",
      };
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}
