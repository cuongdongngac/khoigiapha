import { createServiceRoleClient } from "@/utils/supabase/service-role";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing service role client...");
    
    // Test service role client creation
    const serviceSupabase = createServiceRoleClient();
    console.log("Service role client created successfully");

    // Test if config table exists
    console.log("Testing config table access...");
    
    const { data: allData, error: allError } = await serviceSupabase
      .from("config")
      .select("id, site_name, guest_email");
    
    console.log("Table query result:", { allData, allError });

    if (allError) {
      console.error("Table access error:", allError);
      return NextResponse.json({
        success: false,
        error: "Table access error",
        details: allError.message,
        code: allError.code
      });
    }

    // Try to get single record
    const { data: singleData, error: singleError } = await serviceSupabase
      .from("config")
      .select("*")
      .limit(1)
      .single();

    console.log("Single record result:", { singleData, singleError });

    return NextResponse.json({
      success: true,
      allRecords: allData,
      singleRecord: singleData,
      singleError: singleError
    });

  } catch (err) {
    console.error("Test config error:", err);
    return NextResponse.json({
      success: false,
      error: "Test failed",
      details: err instanceof Error ? err.message : "Unknown error"
    });
  }
}
