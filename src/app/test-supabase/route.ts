import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    console.log("Supabase client created successfully");

    // Test a simple query
    const { data, error } = await supabase.from("admins").select("id").limit(1);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Supabase query successful");
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Failed to test Supabase connection" }, { status: 500 });
  }
}
