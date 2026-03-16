"use server";

import { UserRole } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function changeUserRole(userId: string, newRole: UserRole) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.rpc("set_user_role", {
    target_user_id: userId,
    new_role: newRole,
  });

  if (error) {
    console.error("Failed to change user role:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.rpc("delete_user", {
    target_user_id: userId,
  });

  if (error) {
    console.error("Failed to delete user:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function adminCreateUser(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString() || "member";

  if (role !== "admin" && role !== "editor" && role !== "member") {
    return { error: "Vai trò không hợp lệ." };
  }

  const isActiveStr = formData.get("is_active")?.toString();
  const isActive = isActiveStr === "false" ? false : true;

  if (!email || !password) {
    return { error: "Email và mật khẩu là bắt buộc." };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.rpc("admin_create_user", {
    new_email: email,
    new_password: password,
    new_role: role,
    new_active: isActive,
  });

  if (error) {
    console.error("Failed to create user:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function toggleUserStatus(userId: string, newStatus: boolean) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.rpc("set_user_active_status", {
    target_user_id: userId,
    new_status: newStatus,
  });

  if (error) {
    console.error("Failed to change user status:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function resetUserPassword(userId: string, newPassword: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  try {
    // Reset password using service role key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return { error: "Service role key not configured" };
    }

    // Create admin client with service role
    const { createClient: createAdminClient } = await import("@supabase/supabase-js");
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { error } = await adminClient.auth.admin.updateUserById(
      userId,
      { 
        password: newPassword,
        email_confirm: true  // Confirm email automatically
      }
    );

    if (error) {
      console.error("Failed to reset user password:", error);
      return { error: error.message };
    }

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return { error: error.message || "Failed to reset password" };
  }
}
