import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carisurau",
  description:
    "Carisurau - Cari surau berdekatan anda dengan mudah. Cari waktu solat, kemudahan, dan arah ke surau.",
  keywords:
    "carisurau, cari, surau, cari surau, surau ioi, masjid, surau near me, masjid near me, surau finder, next.js, prayer times, mosque finder, surau locator, Islamic prayer app",
  authors: [{ name: "farhanhelmy" }],
  twitter: {
    card: "summary_large_image",
    site: "@farhanhelmycode",
    title: "Carisurau | Cari surau berdekatan anda dengan mudah",
    description:
      "Carisurau - Cari surau berdekatan anda dengan mudah. Cari waktu solat, kemudahan, dan arah ke surau.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
