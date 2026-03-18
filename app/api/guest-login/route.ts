import { createClient } from "@/utils/supabase/server";
import { createServiceRoleClient } from "@/utils/supabase/service-role";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Use service role client to bypass RLS for config access
    const serviceSupabase = createServiceRoleClient();

    // Get guest credentials from database config table
    const { data: configData, error: configError } = await serviceSupabase
      .from("config")
      .select("guestemail, guestpass")
      .limit(1)
      .single();

    if (configError || !configData) {
      console.error("Failed to get config from database:", configError);
      return NextResponse.json(
        { error: "Không thể lấy cấu hình từ database" },
        { status: 500 }
      );
    }

    // Create client with cookies for authentication
    const cookieStore = await cookies();
    const authSupabase = createClient(cookieStore);

    // Login as guest using database credentials
    const { data, error } = await authSupabase.auth.signInWithPassword({
      email: configData.guestemail || "guest@giapha.com",
      password: configData.guestpass || "giapha@123",
    });

    if (error) {
      console.error("Guest login failed:", error);
      return NextResponse.json(
        { error: "Không thể đăng nhập với tài khoản guest" },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      session: data.session 
    });

  } catch (err) {
    console.error("Guest login error:", err);
    return NextResponse.json(
      { error: "Lỗi server khi đăng nhập guest" },
      { status: 500 }
    );
  }
}
