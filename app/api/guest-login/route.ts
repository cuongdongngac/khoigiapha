import { createClient } from "@/utils/supabase/server";
import { createServiceRoleClient } from "@/utils/supabase/service-role";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Use environment variables directly for guest credentials
    const guestEmail = process.env.NEXT_PUBLIC_GUEST_EMAIL || "guest@giapha.com";
    const guestPassword = process.env.NEXT_PUBLIC_GUEST_PASS || "giapha@123";

    console.log("Attempting guest login with email:", guestEmail);

    // Create client with cookies for authentication
    const cookieStore = await cookies();
    const authSupabase = createClient(cookieStore);

    // Login as guest using environment variables
    const { data, error } = await authSupabase.auth.signInWithPassword({
      email: guestEmail,
      password: guestPassword,
    });

    if (error) {
      console.error("Guest login failed:", error);
      console.error("Used credentials:", { email: guestEmail, password: "***" });
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
