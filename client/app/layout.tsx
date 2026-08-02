import type { Metadata } from "next";
import "sweetalert2/dist/sweetalert2.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "คลังหนังสือส่วนตัว",
  description: "รวบรวม ค้นหา และจัดระเบียบหนังสือของคุณไว้ในที่เดียว"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
