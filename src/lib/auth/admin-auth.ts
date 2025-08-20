import { createClient } from "@/lib/supabase/server";

/**
 * Check if a user is an admin (for server components)
 * @param userId The user ID to check
 * @returns true if user is an admin, false otherwise
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("admins").select("id").eq("id", userId).single();

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Unexpected error checking admin status:", error);
    return false;
  }
}
