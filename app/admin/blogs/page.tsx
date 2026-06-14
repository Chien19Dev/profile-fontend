"use client";

import { BlogAdminShell } from "@/components/admin/blog/blog-admin-shell";
import { BlogPostList } from "@/components/admin/blog/blog-post-list";
import { Button } from "@/components/ui/button";
import { api, Post } from "@/lib/api";
import { PenLine, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.posts.list();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <BlogAdminShell
      postCount={posts.length}
      subtitle="Blog Studio"
      title="Quản lý bài viết"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={load} className="rounded-sm">
            <RefreshCw className="size-3.5" />
            Làm mới
          </Button>
          <Button size="sm" className="rounded-sm" render={<Link href="/admin/blogs/new" />}>
            <PenLine className="size-3.5" />
            Viết bài mới
          </Button>
        </>
      }
    >
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="blog-luxury-skeleton aspect-4/5 animate-pulse bg-muted/30 border border-border/40"
            />
          ))}
        </div>
      ) : (
        <BlogPostList posts={posts} onReload={load} />
      )}
    </BlogAdminShell>
  );
}
