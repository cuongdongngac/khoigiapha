"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { SiteConfig } from "@/types";
import RichTextEditor from "@/components/editor/RichTextEditor";

export default function ConfigEditor() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch("/api/config");
      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error("API Error:", result);
        throw new Error(result.error || "Không thể tải cấu hình");
      }

      setConfig(result.config);
    } catch (err) {
      console.error("Error loading config:", err);
      setError(err instanceof Error ? err.message : "Không thể tải cấu hình");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: config.id,
          guestemail: config.guestemail,
          guestpass: config.guestpass,
          introduction: config.introduction,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Không thể lưu cấu hình");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving config:", err);
      setError("Không thể lưu cấu hình");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Không tìm thấy cấu hình</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cấu hình trang web</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Đã lưu cấu hình thành công!
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email tài khoản guest
          </label>
          <input
            type="email"
            value={config.guestemail || ""}
            onChange={(e) =>
              setConfig({ ...config, guestemail: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu tài khoản guest
          </label>
          <input
            type="password"
            value={config.guestpass || ""}
            onChange={(e) =>
              setConfig({ ...config, guestpass: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung giới thiệu
          </label>
          <div className="bg-gray-50 rounded-lg p-1 w-full">
            <RichTextEditor
              value={config.introduction || ""}
              onChange={(value) =>
                setConfig({ ...config, introduction: value })
              }
              placeholder="Nhập nội dung giới thiệu..."
              editorKey={`config-intro-${config.id}`}
              className="w-full min-h-[400px]"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Sử dụng công cụ soạn thảo để định dạng nội dung với văn bản phong
            phú, hình ảnh, bảng, v.v.
          </p>
        </div>
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
          border-bottom: 2px solid #f59e0b;
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
          border-left: 4px solid #f59e0b;
          padding-left: 16px;
          margin: 16px 0;
          background-color: #fef3c7;
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
