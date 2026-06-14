"use client";

import { BlogAdminShell } from "@/components/admin/blog/blog-admin-shell";
import {
  BlogPostEditor,
  emptyBlogPost,
  type BlogPostForm,
} from "@/components/admin/blog/blog-post-editor";
import { alertError } from "@/lib/alerts";
import { api } from "@/lib/api";
import { handleBlogSubmit } from "@/lib/blog-admin";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<BlogPostForm>(emptyBlogPost);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    api.posts
      .get(id)
      .then((post) => {
        setForm({
          ...emptyBlogPost,
          ...post,
          tagsText: (post.tags || []).join(", "),
          publishedAt: post.publishedAt
            ? new Date(post.publishedAt).toISOString()
            : new Date().toISOString(),
        });
      })
      .catch(() => {
        alertError("Không thể tải bài viết");
        router.push("/admin/blogs");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  function onSubmit(e: FormEvent, options?: { published?: boolean }) {
    handleBlogSubmit(e, form, {
      editingId: id,
      published: options?.published,
      imageUploading,
      saving,
      setSaving,
      onSuccess: () => router.push("/admin/blogs"),
    });
  }

  if (loading) {
    return (
      <BlogAdminShell subtitle="Đang tải..." title="Chỉnh sửa bài viết">
        <div className="blog-luxury-skeleton h-96 animate-pulse bg-muted/30 border border-border/40" />
      </BlogAdminShell>
    );
  }

  return (
    <BlogAdminShell subtitle="Chỉnh sửa" title={form.title || "Bài viết"}>
      <BlogPostEditor
        form={form}
        editingId={id}
        saving={saving}
        onChange={setForm}
        onSubmit={onSubmit}
        onImageUploadingChange={setImageUploading}
      />
    </BlogAdminShell>
  );
}
