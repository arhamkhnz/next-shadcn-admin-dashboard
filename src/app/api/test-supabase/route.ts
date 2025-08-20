import { NextResponse } from "next/server";

import { testSupabaseConnection } from "@/lib/supabase/test-connection";

export async function GET() {
  try {
    console.log("Testing Supabase connection via API route...");
    const result = await testSupabaseConnection();

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ success: false, error: "Failed to test Supabase connection" }, { status: 500 });
  }
}
