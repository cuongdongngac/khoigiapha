"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    // Just check if we have the required parameters
    const token = searchParams.get("token");

    if (!token) {
      setError("Link reset mật khẩu không hợp lệ hoặc đã hết hạn");
    }
    // Don't verify token upfront - let the reset attempt handle it
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (error && !success) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-200/20 rounded-full blur-[100px]" />
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Reset Mật Khẩu Thủ Công
            </h1>
            <p className="text-stone-600 mb-4">
              Để reset mật khẩu, vui lòng làm theo hướng dẫn:
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-left">
              <p className="text-amber-800 text-sm font-medium mb-2">
                📝 Các bước thực hiện:
              </p>
              <ol className="text-amber-700 text-sm space-y-1">
                <li>1. Liên hệ admin của hệ thống</li>
                <li>2. Cung cấp email của bạn</li>
                <li>3. Admin sẽ reset mật khẩu</li>
                <li>4. Admin gửi mật khẩu mới qua email/điện thoại</li>
              </ol>
            </div>
            <p className="text-stone-500 text-sm mb-6">
              Đây là cách bảo mật để đảm bảo an toàn cho tài khoản của bạn.
            </p>
            <div className="space-y-3">
              <Link
                href="/forgot-password"
                className="w-full inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại yêu cầu reset
              </Link>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-colors font-medium"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-[100px]" />
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Mật Khẩu Đã Đổi!
            </h1>
            <p className="text-stone-600 mb-6">
              Mật khẩu của bạn đã được cập nhật thành công.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors font-medium"
            >
              Đăng Nhập Ngay
            </Link>
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
              <svg
                className="w-8 h-8 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 012 12m-7 7l-3-3m0 0l-3 3m3-3V4"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">
              Đặt Mật Khẩu Mới
            </h1>
            <p className="text-stone-600">
              Nhập mật khẩu mới cho tài khoản của bạn
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
                htmlFor="password"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 bg-white/80 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Ít nhất 6 ký tự"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 bg-white/80 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang cập nhật..." : "Cập Nhật Mật Khẩu"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
