import type { Metadata } from "next";
import BlogListPage from "./blog-list";

export const metadata: Metadata = {
  title: "Blog & Kiến thức",
  description:
    "Bài viết chia sẻ kinh nghiệm lập trình, React, Next.js, TypeScript và các giải pháp web thực tế từ Nguyễn Đình Chiến.",
  openGraph: {
    title: "Blog & Kiến thức | Nguyễn Đình Chiến",
    description:
      "Bài viết chia sẻ kinh nghiệm lập trình, React, Next.js và TypeScript.",
    url: "https://chien19.vercel.app/blog",
    type: "website",
    images: [
      {
        url: "/blog.png",
        width: 1200,
        height: 630,
        alt: "Blog Nguyễn Đình Chiến",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Kiến thức | Nguyễn Đình Chiến",
    description:
      "Bài viết chia sẻ kinh nghiệm lập trình, React, Next.js và TypeScript.",
    images: ["/blog.png"],
  },
  alternates: {
    canonical: "https://chien19.vercel.app/blog",
  },
};

export default BlogListPage;
