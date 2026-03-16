import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import BranchesTable from "@/components/BranchesTable";

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Quay lại Dashboard</span>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Chi Họ Gia Phả
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quản lý và theo dõi thông tin các chi họ trong hệ thống gia phả
            </p>
          </div>
        </div>

        {/* Branches Table */}
        <BranchesTable />
      </div>
    </div>
  );
}
