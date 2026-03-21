"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Edit2, BookOpen, Save, X } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";

export default function Introduction() {
  const [introduction, setIntroduction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Check if user is admin
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setIsAdmin(profile?.role === "admin");
      }

      // Get introduction from config table
      const { data: configData, error: configError } = await supabase
        .from("config")
        .select("introduction")
        .limit(1)
        .single();

      if (configError) {
        console.error("Error loading config:", configError);
        setError("Không thể tải nội dung giới thiệu");
      } else if (configData) {
        setIntroduction(configData.introduction);
        setDraft(configData.introduction || "");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const saveIntroduction = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from("config")
        .update({ introduction: draft })
        .eq("id", 1); // Assuming first row has id=1

      if (error) {
        throw error;
      }

      setIntroduction(draft);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving:", err);
      setError("Không thể lưu nội dung");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Giới thiệu</h1>
        </div>

        {!isEditing && isAdmin && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Cập nhật giới thiệu</span>
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Đã lưu nội dung giới thiệu thành công!
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {isEditing ? (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Edit2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Chỉnh sửa nội dung giới thiệu
              </h2>
            </div>

            {/* Editor */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung giới thiệu
              </label>
              <div className="bg-gray-50 rounded-lg p-1">
                <RichTextEditor
                  value={draft}
                  onChange={setDraft}
                  placeholder="Nhập nội dung giới thiệu..."
                  editorKey="intro-editor"
                  className="min-h-[400px]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Sử dụng công cụ soạn thảo để định dạng nội dung</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Hủy</span>
                </button>
                <button
                  onClick={saveIntroduction}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Đang lưu..." : "Lưu"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            {introduction ? (
              <div className="prose prose-lg max-w-none">
                <div
                  className="ck-content"
                  dangerouslySetInnerHTML={{ __html: introduction }}
                />
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Chưa có nội dung giới thiệu
                </h3>
                <p className="text-gray-500">
                  Vui lòng thêm nội dung giới thiệu cho trang web.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CKEditor content styles */}
      <style jsx global>{`
        .ck-editor__editable {
          min-height: 400px !important;
          width: 100% !important;
        }
        .ck-editor {
          width: 100% !important;
        }
        .ck-content {
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
          line-height: 1.6;
          color: #374151;
          min-height: 400px !important;
          width: 100% !important;
        }
        .ck-content h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #111827;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 8px;
        }
        .ck-content h2 {
          font-size: 26px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1f2937;
          margin-top: 24px;
        }
        .ck-content h3 {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #374151;
          margin-top: 20px;
        }
        .ck-content p {
          margin-bottom: 16px;
          line-height: 1.7;
        }
        .ck-content ul,
        .ck-content ol {
          margin-left: 24px;
          margin-bottom: 16px;
        }
        .ck-content li {
          margin-bottom: 4px;
        }
        .ck-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 16px;
          margin: 16px 0;
          background-color: #eff6ff;
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          font-style: italic;
        }
        .ck-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .ck-content table td,
        .ck-content table th {
          border: 1px solid #e5e7eb;
          padding: 12px;
          text-align: left;
        }
        .ck-content table th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        .ck-content table tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .ck-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
