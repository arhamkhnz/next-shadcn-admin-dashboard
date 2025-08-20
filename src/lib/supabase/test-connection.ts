import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...");

    // Test with our own implementation
    const cookieStore = await cookies();
    console.log("Cookies retrieved successfully");

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch (error) {
              console.log("Error setting cookies (expected in some contexts)");
            }
          },
        },
      },
    );

    console.log("Supabase client created successfully");

    // Test a simple query
    const { data, error } = await supabase.from("admins").select("id").limit(1);

    if (error) {
      console.error("Supabase query error:", error);
      return { success: false, error: error.message };
    }

    console.log("Supabase query successful");
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Failed to test Supabase connection" };
  }
}
