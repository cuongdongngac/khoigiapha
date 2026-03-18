"use client";

import { useState } from "react";
import { Download, FileText, Code } from "lucide-react";
import {
  buildFamilyTreeData,
  generateSimpleFamilyTreeHTML,
} from "@/utils/familyTreeUtils";
import { createClient } from "@/utils/supabase/client";

export default function SimpleHTMLGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const generateHTML = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Fetch all data
      const [personsData, relationshipsData, branchesData] = await Promise.all([
        supabase
          .from("persons")
          .select("*")
          .order("birth_year", { ascending: true }),
        supabase.from("relationships").select("*"),
        supabase.from("branches").select("*"),
      ]);

      if (personsData.error || relationshipsData.error || branchesData.error) {
        throw new Error("Failed to fetch data");
      }

      const persons = personsData.data || [];
      const relationships = relationshipsData.data || [];
      const branches = branchesData.data || [];

      // Build family tree using shared utility
      const familyTreeData = buildFamilyTreeData(
        persons,
        relationships,
        branches,
      );

      // Generate HTML using shared utility
      const htmlContent = generateSimpleFamilyTreeHTML(
        familyTreeData.tree,
        branches,
      );

      // Download
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `giapha-simple-${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate HTML");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-stone-900 mb-4">
          Tạo HTML Gia Phả Đơn Giản
        </h2>

        <p className="text-stone-600 mb-6">
          Tạo file HTML đơn giản từ database gia phả. File này sẽ có cấu trúc
          cây gia phả với khả năng mở rộng/thu gọn các nhánh.
        </p>

        <div className="space-y-4">
          <button
            onClick={generateHTML}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-amber-400 rounded-full animate-spin"></div>
                <span>Đang tạo HTML...</span>
              </>
            ) : (
              <>
                <Code className="w-5 h-5" />
                <span>Tạo và tải HTML</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-stone-50 rounded-lg">
          <h3 className="text-sm font-semibold text-stone-700 mb-2">
            Đặc điểm:
          </h3>
          <ul className="text-sm text-stone-600 space-y-1">
            <li>• Cấu trúc cây gia phả theo chiều dọc</li>
            <li>• Mỗi thế hệ thụt vào một chút (15px) để dễ phân biệt</li>
            <li>• Có thể mở rộng/thu gọn các nhánh</li>
            <li>• Tối ưu cho việc in ấn</li>
            <li>• Không có hiệu ứng phức tạp</li>
            <li>• File size nhỏ, tải nhanh</li>
            <li>• Dùng chung logic với Tree và Mindmap</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
