import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import Navbar from "@/components/sections/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

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
    default: "Nguyễn Đình Chiến | Frontend Developer",
    template: "%s | Nguyễn Đình Chiến",
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

  authors: [
    {
      name: "Nguyễn Đình Chiến",
    },
  ],

  creator: "Nguyễn Đình Chiến",

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
    title: "Nguyễn Đình Chiến | Frontend Developer",
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
    title: "Nguyễn Đình Chiến | Frontend Developer",
    description:
      "Portfolio cá nhân giới thiệu dự án, kỹ năng và kinh nghiệm phát triển web.",
    images: ["/banner.png"],
  },

  alternates: {
    canonical: "https://chien19.vercel.app",
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Analytics />
            <Toaster
              richColors
              position="top-right"
              closeButton={true}
              expand={false}
            />
            <Navbar />
            {children}
            <Analytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
