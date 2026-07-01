"use client";

import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api, Post } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { WorkspaceSplit } from "@/components/admin/workspace-split";
import { WsField } from "@/components/admin/ws-field";
import { WsSubmit } from "@/components/admin/ws-submit";
import { WsTable } from "@/components/admin/ws-table";
import { Pattern } from "@/components/upload-file";
import { CKEditor } from "@/components/ui/editor";
import { Switch } from "@/components/ui/switch";

type PostForm = Omit<Post, "id" | "createdAt" | "updatedAt"> & {
  tagsText: string;
};

interface Props {
  posts: Post[];
  form: PostForm;
  editingId: string;
  onChange: (f: PostForm) => void;
  onSubmit: (e: FormEvent) => void;
  onEdit: (item: Post) => void;
  onReload: () => void;
  emptyForm: PostForm;
  setEditingId: (id: string) => void;
  onImageUploadingChange?: (isUploading: boolean) => void;
  loading?: boolean;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export function AdminPostsSection({
  posts,
  form,
  editingId,
  onChange,
  onSubmit,
  onEdit,
  onReload,
  emptyForm,
  setEditingId,
  onImageUploadingChange,
  loading,
}: Props) {
  return (
    <WorkspaceSplit
      form={
        <form onSubmit={onSubmit} className="space-y-4">
          <WsField label="Tiêu đề bài viết">
            <Input
              size="lg"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                onChange({
                  ...form,
                  title,
                  slug: editingId ? form.slug : slugify(title),
                });
              }}
              required
            />
          </WsField>

          <WsField label="Slug (Đường dẫn tĩnh)">
            <Input
              size="lg"
              value={form.slug}
              onChange={(e) =>
                onChange({ ...form, slug: slugify(e.target.value) })
              }
              required
            />
          </WsField>

          <WsField label="Tóm tắt ngắn">
            <Textarea
              size="lg"
              value={form.summary || ""}
              onChange={(e) => onChange({ ...form, summary: e.target.value })}
              rows={2}
            />
          </WsField>

          <WsField label="Ảnh bìa bài viết">
            <Pattern
              maxSize={5 * 1024 * 1024}
              accept="image/*"
              multiple={false}
              value={form.coverImage ? [form.coverImage] : []}
              onUploadComplete={(urls) =>
                onChange({ ...form, coverImage: urls[0] || "" })
              }
              onUploadingChange={onImageUploadingChange}
            />
          </WsField>

          <WsField label="Tác giả">
            <Input
              size="lg"
              value={form.author || ""}
              onChange={(e) => onChange({ ...form, author: e.target.value })}
            />
          </WsField>

          <WsField label="Danh mục">
            <Input
              size="lg"
              value={form.category || ""}
              onChange={(e) => onChange({ ...form, category: e.target.value })}
            />
          </WsField>

          <WsField label="Tags (phân cách bằng dấu phẩy)">
            <Input
              size="lg"
              value={form.tagsText}
              onChange={(e) => onChange({ ...form, tagsText: e.target.value })}
            />
          </WsField>

          <WsField label="Ngày giờ đăng bài">
            <Input
              size="lg"
              type="datetime-local"
              value={form.publishedAt ? form.publishedAt.slice(0, 16) : ""}
              onChange={(e) => {
                const date = e.target.value
                  ? new Date(e.target.value).toISOString()
                  : new Date().toISOString();
                onChange({ ...form, publishedAt: date });
              }}
            />
          </WsField>

          <div className="flex items-center justify-between py-2 border-t border-b border-border/40">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Xuất bản bài viết
            </span>
            <Switch
              checked={form.published}
              onCheckedChange={(checked) =>
                onChange({ ...form, published: checked })
              }
            />
          </div>

          <div className="space-y-1">
            <span className="text-[0.6rem] tracking-widest uppercase text-muted-foreground block font-semibold mb-1">
              Nội dung bài viết (CKEditor)
            </span>
            <CKEditor
              value={form.content || ""}
              onChange={(content) => onChange({ ...form, content })}
            />
          </div>

          <WsSubmit
            isEditing={!!editingId}
            label="bài viết"
            onCancel={
              editingId
                ? () => {
                    onChange(emptyForm);
                    setEditingId("");
                  }
                : undefined
            }
          />
        </form>
      }
      list={
        <WsTable
          cols={["Bài viết", "Danh mục / Tác giả", "Thời gian"]}
          loading={loading}
          rows={posts.map((item) => {
            const formattedDate = item.publishedAt
              ? new Date(item.publishedAt).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "—";

            return {
              key: item.id,
              cells: [
                <div key="title">
                  <p className="text-sm font-medium truncate max-w-50">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge
                      variant={item.published ? "success" : "secondary"}
                      size="sm"
                    >
                      {item.published ? "Đã đăng" : "Bản nháp"}
                    </Badge>
                  </div>
                </div>,
                <div key="meta">
                  <p className="text-xs font-semibold">
                    {item.author || "Chiến Nguyễn"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.category || "General"}
                  </p>
                </div>,
                <span
                  key="date"
                  className="text-xs text-muted-foreground font-mono"
                >
                  {formattedDate}
                </span>,
              ],
              onEdit: () => onEdit(item),
              onDelete: async () => {
                try {
                  await api.posts.remove(item.id);
                  alertSuccess("Đã xóa bài viết");
                  onReload();
                } catch {
                  alertError("Lỗi khi xóa bài viết");
                }
              },
            };
          })}
        />
      }
    />
  );
}
