import SimpleHTMLGenerator from "@/components/SimpleHTMLGenerator";

export default async function HTMLGeneratorPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              Tạo HTML Gia Phả
            </h1>
            <p className="text-stone-600">
              Tạo file HTML đơn giản từ database gia phả. File này sẽ có cấu trúc cây gia phả với khả năng mở rộng/thu gọn các nhánh.
            </p>
          </div>

          <SimpleHTMLGenerator />
        </div>
      </div>
    </div>
  );
}
