import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import config from "./config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
});
export const metadata: Metadata = {
  title: {
    default: "GIA PHẢ HỌ NGUYỄN BỈM SƠN",
    template: "%s | GIA PHẢ HỌ NGUYỄN BỈM SƠN",
  },
  description:
    "GIA PHẢ HỌ NGUYỄN BỈM SƠN - Nền tảng gia phả hiện đại & bảo mật. Gìn giữ và lưu truyền những giá trị, cội nguồn và truyền thống tốt đẹp của dòng họ cho các thế hệ mai sau.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gia Phả Nguyễn Bỉm Sơn",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="Gia Phả Nguyễn Bỉm Sơn"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Gia Phả Nguyễn Bỉm Sơn" />
        <meta name="theme-color" content="#f59e0b" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased relative`}
      >
        {children}
      </body>
    </html>
  );
}
