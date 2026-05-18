import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "СтальИскра — Интернет-магазин строительных инструментов",
  description:
    "СтальИскра — широкий выбор строительных инструментов и оборудования. Качественные инструменты для профессионалов и домашних мастеров по доступным ценам.",
  keywords: [
    "строительные инструменты",
    "инструменты",
    "СтальИскра",
    "электроинструменты",
    "ручные инструменты",
    "строительное оборудование",
  ],
  openGraph: {
    title: "СтальИскра — Интернет-магазин строительных инструментов",
    description:
      "Широкий выбор строительных инструментов и оборудования для профессионалов и домашних мастеров.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
