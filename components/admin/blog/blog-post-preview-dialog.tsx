"use client";

import { DecoFrame } from "@/components/sections/deco-frame";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, User, Tag, X } from "lucide-react";
import Image from "next/image";
import type { BlogPostForm } from "./blog-post-editor";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface BlogPostPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  form: BlogPostForm;
}

export function BlogPostPreviewDialog({
  open,
  onClose,
  form,
}: BlogPostPreviewDialogProps) {
  const formattedDate = form.publishedAt
    ? new Date(form.publishedAt).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const tags = form.tagsText
    ? form.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            maxHeight: "90vh",
          },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Eye className="size-5" />
        </Box>
        Xem trước bài viết
        <IconButton onClick={onClose} sx={{ ml: "auto" }}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ maxHeight: "calc(90vh - 120px)" }}>
        <Stack spacing={3}>
          {form.coverImage && (
            <Box
              sx={{
                position: "relative",
                aspectRatio: "16 / 9",
                overflow: "hidden",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Image
                src={form.coverImage}
                alt={form.title || "Cover"}
                fill
                unoptimized
                style={{ objectFit: "cover" }}
              />
            </Box>
          )}
          <Stack spacing={2}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Badge variant={form.published ? "success" : "secondary"}>
                {form.published ? "Công khai" : "Bản nháp"}
              </Badge>
              {form.category && (
                <Badge variant="outline">{form.category}</Badge>
              )}
            </Box>

            <Typography
              variant="h4"
              sx={{ fontWeight: 600, lineHeight: 1.3 }}
              component="h1"
            >
              {form.title}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <User className="size-4" />
                <Typography variant="body2" color="text.secondary">
                  {form.author || "Nguyễn Đình Chiến"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Calendar className="size-4" />
                <Typography variant="body2" color="text.secondary">
                  {formattedDate}
                </Typography>
              </Box>
            </Box>
            {tags.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Tag className="size-4 text-muted-foreground" />
                {tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            )}
          </Stack>
          {form.summary && (
            <DecoFrame className="p-5">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                {form.summary}
              </Typography>
            </DecoFrame>
          )}
          {form.content && (
            <DecoFrame className="p-6">
              <Box
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: form.content }}
              />
            </DecoFrame>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontFamily: "monospace" }}
          >
            Slug: /{form.slug}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
