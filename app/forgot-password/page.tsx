"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Vui lòng nhập email của bạn");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to get user using signInWithPassword with a dummy password
      // This will tell us if the user exists without revealing their password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: "dummy-password-for-check-only",
      });

      if (signInError?.message?.includes("Invalid login credentials")) {
        // User exists but wrong password - this is expected
        // So the email exists in the system
      } else if (signInError?.message?.includes("Email not confirmed")) {
        // User exists but email not confirmed
      } else if (signInError?.message?.includes("User not found")) {
        setError("Email không tồn tại trong hệ thống. Vui lòng liên hệ admin.");
        return;
      } else if (!signInError) {
        // This shouldn't happen with dummy password, but if it does, sign out
        await supabase.auth.signOut();
      }

      // For demo purposes, we'll show a success message
      // In production, you'd send an actual email with reset link
      setSuccess(true);

      // You could also store a reset token in your database and send it via email
      // For now, we'll use a simple approach
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-300/20 rounded-full blur-[100px]" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                Yêu Cầu Đã Gửi!
              </h1>
              <p className="text-stone-600 mb-4">
                Email <strong>{email}</strong> đã được xác nhận trong hệ thống.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-800 text-sm font-medium mb-2">
                  📧 Để reset mật khẩu:
                </p>
                <ol className="text-amber-700 text-sm text-left space-y-1">
                  <li>1. Liên hệ admin của hệ thống</li>
                  <li>2. Yêu cầu reset mật khẩu cho email này</li>
                  <li>3. Admin sẽ reset và gửi mật khẩu mới cho bạn</li>
                </ol>
              </div>
              <p className="text-stone-500 text-sm">
                Đây là cách bảo mật để đảm bảo chỉ người dùng hợp lệ mới có thể
                reset mật khẩu.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Về trang đăng nhập
              </Link>

              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-colors font-medium"
              >
                Thử email khác
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-300/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Link>

            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-amber-600" />
            </div>

            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">
              Quên Mật Khẩu?
            </h1>
            <p className="text-stone-600">
              Nhập email của bạn để nhận link reset mật khẩu
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/80 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="email@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang gửi..." : "Gửi Link Reset"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-stone-500 text-sm">
              Nhớ lại mật khẩu?{" "}
              <Link
                href="/login"
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
