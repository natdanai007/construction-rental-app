import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "เว็บเช่าวัสดุก่อสร้าง",
  description: "Construction material rental web app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
