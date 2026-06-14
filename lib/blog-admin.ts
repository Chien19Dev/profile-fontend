"use client";

import type { BlogPostForm } from "@/components/admin/blog/blog-post-editor";
import { alertError, alertSuccess } from "@/lib/alerts";
import { api } from "@/lib/api";
import type { FormEvent } from "react";

export function buildPostPayload(
  form: BlogPostForm,
  published?: boolean,
) {
  const payload = {
    ...form,
    published: published !== undefined ? published : form.published,
    tags: form.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };
  delete (payload as Partial<BlogPostForm>).tagsText;
  return payload;
}

export async function saveBlogPost(
  form: BlogPostForm,
  options: {
    editingId?: string;
    published?: boolean;
    imageUploading?: boolean;
    onSuccess?: () => void;
  },
) {
  if (options.imageUploading) {
    alertError("Đang tải ảnh lên, vui lòng đợi...");
    return false;
  }

  if (!form.title.trim()) {
    alertError("Vui lòng nhập tiêu đề bài viết");
    return false;
  }

  if (!form.slug.trim()) {
    alertError("Vui lòng nhập slug bài viết");
    return false;
  }

  const payload = buildPostPayload(form, options.published);

  try {
    if (options.editingId) {
      await api.posts.update(options.editingId, payload);
      alertSuccess(
        options.published ? "Đã cập nhật và đăng bài viết" : "Đã lưu bản nháp",
      );
    } else {
      await api.posts.create(payload);
      alertSuccess(
        options.published ? "Đã đăng bài viết thành công" : "Đã lưu bản nháp",
      );
    }
    options.onSuccess?.();
    return true;
  } catch {
    alertError("Có lỗi xảy ra khi lưu bài viết");
    return false;
  }
}

export function handleBlogSubmit(
  e: FormEvent,
  form: BlogPostForm,
  options: {
    editingId?: string;
    published?: boolean;
    imageUploading?: boolean;
    saving: boolean;
    setSaving: (v: boolean) => void;
    onSuccess?: () => void;
  },
) {
  e.preventDefault();
  if (options.saving) return;

  options.setSaving(true);
  saveBlogPost(form, {
    editingId: options.editingId,
    published: options.published,
    imageUploading: options.imageUploading,
    onSuccess: options.onSuccess,
  }).finally(() => options.setSaving(false));
}
