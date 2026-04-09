import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Lab 6 - Next.js",
  description: "lab 6 - next.js application for web development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-zinc-200 bg-white">
          <nav className="mx-auto flex w-full max-w-5xl items-center gap-6 px-6 py-4 text-sm font-medium text-zinc-700">
            <Link className="hover:text-zinc-900" href="/">
              Home
            </Link>
            <Link className="hover:text-zinc-900" href="/dashboard">
              Dashboard
            </Link>
            <Link className="hover:text-zinc-900" href="/dashboard/settings">
              Settings
            </Link>
            <Link className="hover:text-zinc-900" href="/sensors">
              Sensors
            </Link>
          </nav>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
