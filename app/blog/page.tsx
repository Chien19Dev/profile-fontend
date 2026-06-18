import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import BlogListPage from "./blog-list";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://chien19.vercel.app";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog & Kiến thức",
  description:
    "Bài viết chia sẻ kinh nghiệm lập trình, React, Next.js, TypeScript và các giải pháp web thực tế từ Nguyễn Đình Chiến.",
  openGraph: {
    title: "Blog & Kiến thức - Nguyễn Đình Chiến",
    description:
      "Bài viết chia sẻ kinh nghiệm lập trình, React, Next.js và TypeScript.",
    url: `${SITE_URL}/blog`,
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
    title: "Blog & Kiến thức - Nguyễn Đình Chiến",
    description:
      "Bài viết chia sẻ kinh nghiệm lập trình, React, Next.js và TypeScript.",
    images: ["/blog.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 10,
    select: {
      title: true,
      slug: true,
      summary: true,
      author: true,
      coverImage: true,
      tags: true,
      publishedAt: true,
    },
  });

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog & Kiến thức - Nguyễn Đình Chiến",
    description:
      "Bài viết chia sẻ kinh nghiệm lập trình, React, Next.js, TypeScript và các giải pháp web thực tế.",
    url: `${SITE_URL}/blog`,
    inLanguage: "vi-VN",
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.summary || undefined,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt?.toISOString(),
      author: {
        "@type": "Person",
        name: post.author || "Nguyễn Đình Chiến",
      },
      image: post.coverImage || `${SITE_URL}/banner.png`,
      keywords: post.tags?.join(", ") || undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogListPage />
    </>
  );
}
