"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Edit, Trash2, Clock, User } from "lucide-react";
import { DecoFrame } from "@/components/sections/deco-frame";
import { api, Post } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { Fragment, useState } from "react";

interface BlogPostListProps {
  posts: Post[];
  onReload: () => void;
}

const onDelete = async (postId: string, onReload: () => void) => {
  try {
    await api.posts.remove(postId);
    alertSuccess("Đã xóa bài viết");
    onReload();
  } catch {
    alertError("Lỗi khi xóa bài viết");
  }
};

export function BlogPostList({ posts, onReload }: BlogPostListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      setDeleting(true);
      await onDelete(postToDelete, onReload);
      setDeleting(false);
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  if (posts.length === 0) {
    return (
      <DecoFrame accent className="p-12">
        <Stack
          sx={{
            gap: 2,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{
              letterSpacing: "0.2em",
              fontWeight: 600,
            }}
          >
            Chưa có nội dung
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Bắt đầu viết bài đầu tiên
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: 360,
            }}
          >
            Tạo bài viết mới với trình soạn thảo CKEditor, thêm ảnh bìa và xuất
            bản lên blog của bạn.
          </Typography>

          <Box sx={{ pt: 1 }}>
            <Button
              component={Link}
              href="/admin/blogs/new"
              variant="contained"
              size="large"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Viết bài mới
            </Button>
          </Box>
        </Stack>
      </DecoFrame>
    );
  }

  return (
    <Fragment>
      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
        }}
      >
        {posts.map((post, i) => {
          const date = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—";
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <DecoFrame className="group overflow-hidden h-full flex flex-col hover:border-primary/30 transition-colors">
                <Box
                  sx={{
                    position: "relative",
                    aspectRatio: "16 / 10",
                    overflow: "hidden",
                    bgcolor: "action.hover",
                  }}
                >
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.disabled",
                        typography: "caption",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                      }}
                    >
                      Không có ảnh
                    </Box>
                  )}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                    }}
                  >
                    <Chip
                      size="small"
                      color={post.published ? "success" : "default"}
                      label={post.published ? "Đã đăng" : "Nháp"}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  {post.category && (
                    <Typography
                      variant="overline"
                      sx={{
                        fontSize: "0.65rem",
                        mb: 1,
                      }}
                    >
                      {post.category}
                    </Typography>
                  )}
                  <Typography
                    variant="h6"
                    sx={{
                      lineHeight: 1.35,
                      mb: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      fontWeight: 700,
                      color: "text.primary",
                    }}
                  >
                    {post.title}
                  </Typography>
                  {post.summary && (
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        color: "text.secondary",
                      }}
                    >
                      {post.summary}
                    </Typography>
                  )}
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      mt: "auto",
                      pt: 2,
                      borderTop: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Stack direction="row" spacing={0.5}>
                      <User size={14} />
                      <Typography variant="caption">
                        {post.author || "Admin"}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      sx={{
                        gap: 0.5,
                        alignItems: "center",
                      }}
                    >
                      <Clock
                        size={14}
                        style={{
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="caption">{date}</Typography>
                    </Stack>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      mt: 2,
                    }}
                  >
                    <Button
                      component={Link}
                      href={`/admin/blogs/${post.id}/edit`}
                      variant="outlined"
                      fullWidth
                      startIcon={<Edit size={16} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(post.id)}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Stack>
                </Box>
              </DecoFrame>
            </motion.div>
          );
        })}
      </Box>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa bài viết này?"
        confirmText="Xóa bài viết"
        cancelText="Hủy"
        variant="danger"
        loading={deleting}
      />
    </Fragment>
  );
}
