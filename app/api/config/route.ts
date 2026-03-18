import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Chưa xác thực" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    // Use RPC function to bypass RLS or use admin context
    const { data: configData, error: configError } = await supabase
      .rpc('get_config_for_admin');

    if (configError) {
      console.error("Failed to get config via RPC:", configError);
      
      // Fallback: try direct access (might work with proper RLS)
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("config")
        .select("*")
        .limit(1)
        .single();

      console.log("Fallback result:", { fallbackData, fallbackError });
      
      if (fallbackError) {
        return NextResponse.json(
          { 
            error: "Không thể lấy cấu hình", 
            details: fallbackError.message,
            rpcError: configError.message
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true,
        config: fallbackData
      });
    }

    return NextResponse.json({ 
      success: true,
      config: configData
    });

  } catch (err) {
    console.error("Get config error:", err);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Check if user is authenticated and is admin
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Chưa xác thực" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    // Try direct update with regular client
    const { data: configData, error: configError } = await supabase
      .from("config")
      .update({
        guestemail: body.guestemail,
        guestpass: body.guestpass,
        introduction: body.introduction,
      })
      .eq("id", body.id)
      .select()
      .single();

    if (configError) {
      console.error("Failed to update config:", configError);
      return NextResponse.json(
        { error: "Không thể cập nhật cấu hình", details: configError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      config: configData
    });

  } catch (err) {
    console.error("Update config error:", err);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}
