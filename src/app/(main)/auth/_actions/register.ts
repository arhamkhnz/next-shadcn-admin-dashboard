"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function register(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  // If role is franchise, we might want to do additional setup
  // For now, we'll just redirect to the appropriate login page
  if (role === "franchise") {
    // In a real implementation, you might want to create a franchise record here
    revalidatePath("/", "layout");
    redirect("/franchise/login");
  } else {
    revalidatePath("/", "layout");
    redirect("/admin/login");
  }
}
