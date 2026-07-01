"use client";

import { BlogAdminShell } from "@/components/admin/blog/blog-admin-shell";
import { BlogPostList } from "@/components/admin/blog/blog-post-list";
import { api, Post } from "@/lib/api";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
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
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={load}
            startIcon={<RefreshCw size={14} />}
          >
            Làm mới
          </Button>

          <Button
            component={Link}
            href="/admin/blogs/new"
            variant="contained"
            size="small"
            startIcon={<PenLine size={14} />}
          >
            Viết bài mới
          </Button>
        </Stack>
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
