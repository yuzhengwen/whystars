import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Why Stars",
  description: "Timetable for the stars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="w-full h-fit text-gray-200 border-t-1 border-gray-400 mt-24">
          <div className="flex flex-col items-center justify-center w-full h-16 text-gray-500 dark:text-gray-400">
            <div className="text-sm">
              © {new Date().getFullYear()} Yu Zhengwen. All rights reserved
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
