"use client";

import { BlogAdminShell } from "@/components/admin/blog/blog-admin-shell";
import {
  BlogPostEditor,
  emptyBlogPost,
  type BlogPostForm,
} from "@/components/admin/blog/blog-post-editor";
import { handleBlogSubmit } from "@/lib/blog-admin";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<BlogPostForm>(emptyBlogPost);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  function onSubmit(e: FormEvent, options?: { published?: boolean }) {
    handleBlogSubmit(e, form, {
      published: options?.published,
      imageUploading,
      saving,
      setSaving,
      onSuccess: () => router.push("/admin/blogs"),
    });
  }

  return (
    <BlogAdminShell subtitle="Soạn thảo mới" title="Viết bài viết">
      <BlogPostEditor
        form={form}
        saving={saving}
        onChange={setForm}
        onSubmit={onSubmit}
        onImageUploadingChange={setImageUploading}
      />
    </BlogAdminShell>
  );
}
