import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, redirect to login
  if (!user) {
    redirect("/auth/v2/login");
  }

  // Check user role and redirect accordingly
  const { data: adminProfile } = await supabase.from("admins").select("id").eq("id", user.id).single();

  if (adminProfile) {
    // Check if they manage a franchise
    const { data: franchises } = await supabase.from("franchises").select("id").eq("admin_id", adminProfile.id);

    // If they manage a franchise, redirect to franchise dashboard, otherwise to admin dashboard
    if (franchises && franchises.length > 0) {
      redirect("/franchise");
    } else {
      redirect("/admin");
    }
  } else {
    // Regular user - redirect to unauthorized
    redirect("/unauthorized");
  }

  return <div>Redirecting...</div>;
}
