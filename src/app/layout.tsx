import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nalar.AI — Think First. Code Right.",
  description:
    "Tutor AI Sokratis interaktif yang membimbing kamu menemukan solusi sendiri. Powered by Gemma 4 31B. Build with Gemma AI Hackathon 2026.",
  keywords: [
    "AI Tutor",
    "Socratic Learning",
    "Gemma AI",
    "Coding Tutor",
    "Math Tutor",
    "Nalar.AI",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
