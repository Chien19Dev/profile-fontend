"use client";

import { DecoFrame } from "@/components/sections/deco-frame";
import { Badge } from "@/components/ui/badge";
import { CKEditor } from "@/components/ui/editor";
import { Pattern } from "@/components/upload-file";
import type { Post } from "@/lib/api";
import { Calendar, Eye, Loader2, Save, Send, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { AiWriterButton, type AiWriterResult } from "./ai-writer-button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DateTimePickerField } from "@/components/common/date-time-picker";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";

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
  const [adminUsers, setAdminUsers] = useState<
    { id: string; name: string | null; email: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(
        (
          users: {
            id: string;
            name: string | null;
            email: string;
            role: string;
          }[],
        ) => {
          if (Array.isArray(users)) {
            setAdminUsers(users.filter((u) => u.role === "ADMIN"));
          }
        },
      )
      .catch(() => {});
  }, []);

  const wordCount = (form.content || "")
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
          <TextField
            fullWidth
            required
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              onChange({
                ...form,
                title,
                slug: editingId ? form.slug : slugify(title),
              });
            }}
            slotProps={{
              input: {
                sx: {
                  fontSize: "1.125rem",
                  fontWeight: 500,
                },
              },
            }}
          />
          <FieldLabel hint="URL thân thiện SEO, ví dụ: bai-viet-moi">
            Slug
          </FieldLabel>
          <TextField
            fullWidth
            required
            value={form.slug}
            onChange={(e) =>
              onChange({
                ...form,
                slug: slugify(e.target.value),
              })
            }
            slotProps={{
              input: {
                sx: {
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                },
              },
            }}
          />
          <FieldLabel hint="Mô tả ngắn hiển thị trong danh sách bài viết">
            Tóm tắt
          </FieldLabel>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={form.summary || ""}
            onChange={(e) =>
              onChange({
                ...form,
                summary: e.target.value,
              })
            }
            slotProps={{
              input: {
                sx: {
                  resize: "vertical",
                },
              },
            }}
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
              value={form.content || ""}
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
            <FormControlLabel
              control={
                <Switch
                  checked={form.published !== false}
                  onChange={(e) =>
                    onChange({
                      ...form,
                      published: e.target.checked,
                    })
                  }
                />
              }
              label={form.published !== false ? "Công khai" : "Bản nháp"}
              sx={{ mr: 0 }}
            />
          </div>

          <div>
            <FieldLabel>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" />
                Ngày đăng
              </span>
            </FieldLabel>
            <DateTimePickerField
              value={form.publishedAt}
              onChange={(publishedAt) =>
                onChange({
                  ...form,
                  publishedAt,
                })
              }
            />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="contained"
              type="button"
              fullWidth
              disabled={saving}
              onClick={(e) =>
                onSubmit(e as unknown as FormEvent, { published: true })
              }
              startIcon={
                saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )
              }
            >
              {editingId ? "Cập nhật & đăng" : "Đăng bài viết"}
            </Button>
            <Button
              variant="outlined"
              type="button"
              fullWidth
              disabled={saving}
              onClick={(e) =>
                onSubmit(e as unknown as FormEvent, { published: false })
              }
              startIcon={<Save className="size-4" />}
            >
              Lưu nháp
            </Button>
            {editingId && (
              <Button
                component={Link}
                href="/admin/blogs"
                variant="text"
                fullWidth
                disabled={saving}
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
            <FormControl fullWidth size="small">
              <Select
                displayEmpty
                value={form.author || ""}
                onChange={(e: SelectChangeEvent) =>
                  onChange({
                    ...form,
                    author: e.target.value,
                  })
                }
              >
                <MenuItem value="" disabled>
                  Chọn tác giả
                </MenuItem>

                {adminUsers.map((u) => (
                  <MenuItem key={u.id} value={u.name || u.email}>
                    {u.name || u.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <FieldLabel>Danh mục</FieldLabel>
            <TextField
              fullWidth
              size="small"
              value={form.category || ""}
              onChange={(e) =>
                onChange({
                  ...form,
                  category: e.target.value,
                })
              }
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
            <TextField
              fullWidth
              size="small"
              placeholder="react, nextjs, typescript"
              value={form.tagsText}
              onChange={(e) =>
                onChange({
                  ...form,
                  tagsText: e.target.value,
                })
              }
            />
            {form.tagsText && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tagsText.split(",").map((tag) => {
                  const t = tag.trim();
                  if (!t) return null;
                  return (
                    <Chip
                      key={t}
                      label={t}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  );
                })}
              </div>
            )}
          </div>
        </DecoFrame>
        {form.title && (
          <DecoFrame className="p-5">
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <Eye className="size-3.5 text-primary" />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "text.secondary",
                  }}
                >
                  Xem trước thẻ
                </Typography>
              </Stack>
              {form.coverImage && (
                <CardMedia
                  component="img"
                  image={form.coverImage}
                  alt={form.title}
                  sx={{
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                    borderRadius: 1,
                    opacity: 0.9,
                  }}
                />
              )}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {form.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {form.summary || "Chưa có tóm tắt..."}
                </Typography>
              </Box>
            </Stack>
          </DecoFrame>
        )}
      </aside>
    </div>
  );
}
