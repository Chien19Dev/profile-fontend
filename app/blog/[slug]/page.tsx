import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DecoFrame } from "@/components/sections/deco-frame";
import { Calendar, Clock, ChevronLeft, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CommentSection } from "@/components/blog/comment-section";
import { LikeButton } from "@/components/blog/like-button";
import { BookmarkButton } from "@/components/blog/bookmark-button";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: {
      title: true,
      summary: true,
      coverImage: true,
      author: true,
      publishedAt: true,
      tags: true,
    },
  });

  if (!post) {
    return { title: "Không tìm thấy bài viết" };
  }

  const description =
    post.summary ||
    `Bài viết ${post.title} — chia sẻ từ ${post.author || "Nguyễn Đình Chiến"}.`;
  const url = `https://chien19.vercel.app/blog/${slug}`;
  const images = post.coverImage
    ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
    : [{ url: "/banner.png", width: 1200, height: 630, alt: post.title }];

  return {
    title: post.title,
    description,
    keywords: post.tags,
    authors: [{ name: post.author || "Nguyễn Đình Chiến" }],
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author || "Nguyễn Đình Chiến"],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: images.map((img) => img.url),
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  });

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(
    post.publishedAt || post.createdAt,
  ).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const wordCount = post.content
    ? post.content.replace(/<[^>]*>/g, "").split(/\s+/).length
    : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary || undefined,
    image: post.coverImage || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: {
      "@type": "Person",
      name: post.author || "Nguyễn Đình Chiến",
    },
    publisher: {
      "@type": "Person",
      name: "Nguyễn Đình Chiến",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://chien19.vercel.app/blog/${slug}`,
    },
  };

  return (
    <div className="deco-page relative min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button
            render={<Link href="/blog" />}
            variant="ghost"
            size="sm"
            className="-ms-3 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            Quay lại Blog
          </Button>

          <DecoFrame className="p-6 md:p-10 lg:p-12 space-y-6 md:space-y-8 overflow-hidden">
            <div className="space-y-4 border-b border-border pb-6 md:pb-8">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-primary font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {formattedDate}
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {readTime} phút đọc
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="flex items-center gap-1.5">
                  <Tag className="size-3.5" />
                  {post.category || "General"}
                </span>
              </div>

              <h1 className="deco-title text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5 text-primary" />
                  {post.author || "Chiến Nguyễn"}
                </span>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full border border-border bg-muted/40"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {post.coverImage && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-muted">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <article
              className="prose dark:prose-invert max-w-none text-foreground leading-relaxed text-sm md:text-base space-y-5"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <LikeButton postId={post.id} />
              <BookmarkButton postId={post.id} />
            </div>
          </DecoFrame>

          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
}
