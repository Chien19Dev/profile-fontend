"use client";

import { DecoFrame } from "@/components/sections/deco-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CKEditor } from "@/components/ui/ckeditor";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Pattern } from "@/components/upload-file";
import type { Post } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Calendar, Eye, Loader2, Save, Send, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { AiWriterButton, type AiWriterResult } from "./ai-writer-button";

export type BlogPostForm = Omit<Post, "id" | "createdAt" | "updatedAt"> & {
  tagsText: string;
};

export const emptyBlogPost: BlogPostForm = {
  title: "",
  slug: "",
  content: "",
  summary: "",
  published: false,
  coverImage: "",
  author: "Nguyễn Đình Chiến",
  category: "Công nghệ",
  tags: [],
  tagsText: "",
  publishedAt: new Date().toISOString(),
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

interface BlogPostEditorProps {
  form: BlogPostForm;
  editingId?: string;
  saving?: boolean;
  onChange: (form: BlogPostForm) => void;
  onSubmit: (e: FormEvent, options?: { published?: boolean }) => void;
  onImageUploadingChange?: (uploading: boolean) => void;
}

function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-2">
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {children}
      </span>
      {hint && (
        <p className="text-xs text-muted-foreground/70 mt-0.5">{hint}</p>
      )}
    </div>
  );
}

export function BlogPostEditor({
  form,
  editingId,
  saving,
  onChange,
  onSubmit,
  onImageUploadingChange,
}: BlogPostEditorProps) {
  const wordCount = form.content
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6 min-w-0">
        <DecoFrame
          accent
          className="p-6 md:p-8 space-y-5"
          bottomRightClassName="!bottom-[-12px]"
          bottomLeftClassName="!bottom-[-12px]"
        >
          <FieldLabel hint="Tiêu đề hiển thị trên trang blog">
            Tiêu đề bài viết
          </FieldLabel>
          <Input
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              onChange({
                ...form,
                title,
                slug: editingId ? form.slug : slugify(title),
              });
            }}
            placeholder="Nhập tiêu đề bài viết..."
            className="blog-luxury-input text-lg h-12"
            required
          />

          <FieldLabel hint="URL thân thiện SEO, ví dụ: bai-viet-moi">
            Slug
          </FieldLabel>
          <Input
            value={form.slug}
            onChange={(e) =>
              onChange({ ...form, slug: slugify(e.target.value) })
            }
            placeholder="duong-dan-bai-viet"
            className="blog-luxury-input font-mono text-sm"
            required
          />

          <FieldLabel hint="Mô tả ngắn hiển thị trong danh sách bài viết">
            Tóm tắt
          </FieldLabel>
          <Textarea
            value={form.summary || ""}
            onChange={(e) => onChange({ ...form, summary: e.target.value })}
            placeholder="Viết vài dòng tóm tắt nội dung..."
            rows={3}
            className="blog-luxury-input resize-none"
          />
        </DecoFrame>

        <DecoFrame className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <FieldLabel>Nội dung bài viết</FieldLabel>
            <div className="flex items-center gap-3">
              <AiWriterButton
                existingTitle={form.title}
                onApply={(result: AiWriterResult) => {
                  onChange({
                    ...form,
                    title: result.title || form.title,
                    slug: result.slug || slugify(result.title),
                    summary: result.summary || form.summary,
                    content: result.content,
                    tagsText: result.tags?.join(", ") || form.tagsText,
                  });
                }}
              />
              <span className="text-xs text-muted-foreground tabular-nums">
                ~{wordCount} từ
              </span>
            </div>
          </div>
          <div className="blog-editor rounded-sm overflow-hidden border border-border/60">
            <CKEditor
              value={form.content}
              onChange={(content) => onChange({ ...form, content })}
            />
          </div>
        </DecoFrame>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
        <DecoFrame
          accent
          className="p-5 space-y-5"
          bottomRightClassName="!bottom-[-12px]"
          bottomLeftClassName="!bottom-[-12px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Xuất bản
            </span>
            <Badge variant={form.published ? "success" : "secondary"} size="sm">
              {form.published ? "Công khai" : "Bản nháp"}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-2 border-y border-border/40">
            <span className="text-sm text-muted-foreground">Đăng bài</span>
            <Switch
              checked={form.published}
              onCheckedChange={(checked) =>
                onChange({ ...form, published: checked })
              }
            />
          </div>

          <div>
            <FieldLabel>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" />
                Ngày đăng
              </span>
            </FieldLabel>
            <Input
              type="datetime-local"
              value={form.publishedAt ? form.publishedAt.slice(0, 16) : ""}
              onChange={(e) => {
                const date = e.target.value
                  ? new Date(e.target.value).toISOString()
                  : new Date().toISOString();
                onChange({ ...form, publishedAt: date });
              }}
              className="blog-luxury-input"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="button"
              size="lg"
              disabled={saving}
              className="w-full rounded-sm"
              onClick={(e) =>
                onSubmit(e as unknown as FormEvent, { published: true })
              }
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {editingId ? "Cập nhật & đăng" : "Đăng bài viết"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={saving}
              className="w-full rounded-sm"
              onClick={(e) =>
                onSubmit(e as unknown as FormEvent, { published: false })
              }
            >
              <Save className="size-4" />
              Lưu nháp
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                render={<Link href="/admin/blogs" />}
              >
                Hủy
              </Button>
            )}
          </div>
        </DecoFrame>

        <DecoFrame
          className="p-5 space-y-4"
          bottomRightClassName="!bottom-[-8px]"
          bottomLeftClassName="!bottom-[-8px]"
        >
          <FieldLabel>Ảnh bìa</FieldLabel>
          {form.coverImage ? (
            <div className="relative aspect-video overflow-hidden border border-border/50">
              <Image
                src={form.coverImage}
                alt="Cover"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video border border-dashed border-border/60 flex items-center justify-center text-xs text-muted-foreground">
              Chưa có ảnh bìa
            </div>
          )}
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
        </DecoFrame>

        <DecoFrame
          className="p-5 space-y-4"
          bottomRightClassName="!bottom-[-8px]"
          bottomLeftClassName="!bottom-[-8px]"
        >
          <div>
            <FieldLabel>
              <span className="inline-flex items-center gap-1.5">
                <User className="size-3" />
                Tác giả
              </span>
            </FieldLabel>
            <Input
              value={form.author || ""}
              onChange={(e) => onChange({ ...form, author: e.target.value })}
              className="blog-luxury-input"
            />
          </div>

          <div>
            <FieldLabel>Danh mục</FieldLabel>
            <Input
              value={form.category || ""}
              onChange={(e) => onChange({ ...form, category: e.target.value })}
              className="blog-luxury-input"
            />
          </div>

          <div>
            <FieldLabel>
              <span className="inline-flex items-center gap-1.5">
                <Tag className="size-3" />
                Tags{" "}
                <span className="text-xs text-muted-foreground lowercase">
                  keywords của thẻ metadata
                </span>
              </span>
            </FieldLabel>
            <Input
              value={form.tagsText}
              onChange={(e) => onChange({ ...form, tagsText: e.target.value })}
              placeholder="react, nextjs, typescript"
              className="blog-luxury-input"
            />
            {form.tagsText && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tagsText.split(",").map((tag) => {
                  const t = tag.trim();
                  if (!t) return null;
                  return (
                    <Badge key={t} variant="outline" size="sm">
                      {t}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </DecoFrame>

        {form.title && (
          <DecoFrame className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="size-3.5 text-primary" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Xem trước thẻ
              </span>
            </div>
            <div className={cn("space-y-2", !form.coverImage && "pt-1")}>
              {form.coverImage && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={form.coverImage}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover opacity-90"
                  />
                </div>
              )}
              <p className="deco-title text-base leading-snug line-clamp-2">
                {form.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {form.summary || "Chưa có tóm tắt..."}
              </p>
            </div>
          </DecoFrame>
        )}
      </aside>
    </div>
  );
}
