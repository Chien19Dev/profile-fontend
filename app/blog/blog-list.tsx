"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DecoFrame } from "@/components/sections/deco-frame";
import { Calendar, Clock, ArrowRight, BookOpen, User, Tag, Search } from "lucide-react";
import Image from "next/image";
import { SearchBar } from "@/components/sections/search-bar";
import type { Post, Project } from "@/lib/api";

export const revalidate = 60;

export default function BlogListClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const res = await fetch("/api/posts?published=true");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query: string) {
    setSearchQuery(query);
    if (!query.trim()) {
      loadPosts();
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  }

  return (
    <div className="deco-page relative min-h-screen">
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="deco-eyebrow">Chia sẻ</p>
            <div className="deco-rule justify-center">
              <h1 className="deco-title text-4xl md:text-5xl text-foreground shrink-0 px-4">
                Bài Viết & Kiến thức
              </h1>
            </div>
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              Những bài viết đúc kết kinh nghiệm, công nghệ mới và những giải
              pháp lập trình thực tế của tôi.
            </p>
          </div>

          <SearchBar
            onSearch={handleSearch}
            placeholder="Tìm kiếm bài viết..."
            className="max-w-md mx-auto"
          />

          {loading ? (
            <div className="text-center text-muted-foreground py-12">
              Đang tải...
            </div>
          ) : posts.length === 0 ? (
            <DecoFrame className="p-12 text-center text-muted-foreground">
              <BookOpen className="size-12 mx-auto text-primary/40 mb-4" />
              <p className="text-sm">
                {searchQuery
                  ? `Không tìm thấy bài viết nào cho "${searchQuery}"`
                  : "Chưa có bài viết nào được xuất bản."}
              </p>
            </DecoFrame>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => {
                const formattedDate = new Date(
                  post.publishedAt || post.createdAt!,
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

                return (
                  <Link
                    href={`/blog/${post.slug}`}
                    key={post.id}
                    className="group block"
                  >
                    <DecoFrame className="p-6 md:p-8 transition-all duration-300 hover:border-primary/50 group-hover:-translate-y-0.5 overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-6">
                        {post.coverImage && (
                          <div className="relative w-full md:w-48 aspect-video md:aspect-square shrink-0 rounded-lg overflow-hidden border border-border">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-primary font-medium">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3.5" />
                                {formattedDate}
                              </span>
                              <span className="text-muted-foreground/30">
                                •
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3.5" />
                                {readTime} phút đọc
                              </span>
                              <span className="text-muted-foreground/30">
                                •
                              </span>
                              <span className="flex items-center gap-1">
                                <Tag className="size-3.5" />
                                {post.category || "General"}
                              </span>
                            </div>

                            <h2 className="deco-title text-2xl md:text-3xl text-foreground transition-colors group-hover:text-primary">
                              {post.title}
                            </h2>
                            {post.summary && (
                              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {post.summary}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <User className="size-3.5 text-primary" />
                              {post.author || "Chiến Nguyễn"}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider group-hover:gap-2.5 transition-all">
                              Đọc bài viết
                              <ArrowRight className="size-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </DecoFrame>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
