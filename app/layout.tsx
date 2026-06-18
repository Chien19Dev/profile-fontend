import Navbar from "@/components/sections/navbar";
import { SessionSync } from "@/components/session-sync";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/lib/auth";
import { getCvExists, getNavigationItems } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chien19.vercel.app"),
  title: {
    default: "Nguyễn Đình Chiến - Frontend Developer",
    template: "%s - Nguyễn Đình Chiến",
  },
  description:
    "Frontend Developer chuyên React, Next.js, TypeScript và Modern UI. Portfolio cá nhân giới thiệu dự án, kỹ năng và kinh nghiệm phát triển web hiện đại.",
  keywords: [
    "Nguyễn Đình Chiến",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "JavaScript",
    "Portfolio",
    "Web Developer",
    "Fullstack Developer",
  ],
  authors: [{ name: "Nguyễn Đình Chiến", url: "https://chien19.vercel.app" }],
  creator: "Nguyễn Đình Chiến",
  publisher: "Nguyễn Đình Chiến",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://chien19.vercel.app",
    siteName: "Nguyễn Đình Chiến Portfolio",
    title: "Nguyễn Đình Chiến - Frontend Developer",
    description:
      "Portfolio cá nhân giới thiệu dự án, kỹ năng và kinh nghiệm phát triển web với React, Next.js và TypeScript.",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Nguyễn Đình Chiến Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nguyễn Đình Chiến - Frontend Developer",
    description:
      "Portfolio cá nhân giới thiệu dự án, kỹ năng và kinh nghiệm phát triển web.",
    images: ["/banner.png"],
  },
  alternates: {
    canonical: "https://chien19.vercel.app",
    types: {
      "application/rss+xml": "https://chien19.vercel.app/feed.xml",
      "text/plain": "https://chien19.vercel.app/llms.txt",
    },
  },
  category: "technology",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cvExists, navItems, session] = await Promise.all([
    getCvExists(),
    getNavigationItems(),
    auth(),
  ]);
  let isAdmin = false;
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    isAdmin = dbUser?.role === "ADMIN";
  }

  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
          <SessionSync />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster
              richColors
              position="top-right"
              closeButton={true}
              expand={false}
            />
            <Navbar
              cvExistsInitial={cvExists}
              navItems={navItems}
              isAdmin={isAdmin}
            />
            {children}
            <Analytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
