import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "酒精追蹤器 | Alcohol Tracker",
  description: "追蹤每日酒精攝取量，守護您的健康",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
