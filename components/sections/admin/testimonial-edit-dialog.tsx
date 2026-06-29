"use client";

import { Pattern } from "@/components/upload-file";
import { Loader2, User, Briefcase, MessageSquare, Hash } from "lucide-react";
import type { Testimonial } from "@/lib/api";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DialogComponent from "@/components/common/DialogComponent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

type TestimonialForm = Omit<Testimonial, "id" | "createdAt" | "updatedAt">;

interface Props {
  testimonial: TestimonialForm;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (f: TestimonialForm) => void;
  onSave: () => void;
  isEditing: boolean;
  onImageUploadingChange?: (isUploading: boolean) => void;
  loading?: boolean;
}

export function TestimonialEditDialog({
  testimonial,
  open,
  onOpenChange,
  onChange,
  onSave,
  isEditing,
  onImageUploadingChange,
  loading = false,
}: Props) {
  return (
    <DialogComponent
      open={open}
      onClose={() => onOpenChange(false)}
      title={isEditing ? "Chỉnh sửa đánh giá" : "Tạo đánh giá mới"}
      description={
        isEditing
          ? "Cập nhật thông tin đánh giá"
          : "Thêm đánh giá mới vào danh sách"
      }
      maxWidth="md"
      loading={loading}
      confirmText={
        loading
          ? isEditing
            ? "Đang cập nhật..."
            : "Đang tạo..."
          : isEditing
            ? "Cập nhật"
            : "Tạo"
      }
      cancelText="Huỷ"
      confirmColor="primary"
      confirmIcon={
        loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isEditing ? (
          <SaveIcon />
        ) : (
          <AddIcon />
        )
      }
      onConfirm={onSave}
    >
      <Stack spacing={3}>
        <TextField
          label="Tên người đánh giá"
          value={testimonial.authorName}
          onChange={(e) =>
            onChange({ ...testimonial, authorName: e.target.value })
          }
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <User className="size-4 text-muted-foreground" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          label="Chức danh / Công ty"
          value={testimonial.authorTitle}
          onChange={(e) =>
            onChange({ ...testimonial, authorTitle: e.target.value })
          }
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Briefcase className="size-4 text-muted-foreground" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          label="Nội dung đánh giá"
          value={testimonial.content}
          onChange={(e) =>
            onChange({ ...testimonial, content: e.target.value })
          }
          required
          multiline
          rows={4}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <MessageSquare className="size-4 text-muted-foreground" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Stack spacing={1.5}>
          <TextField
            label="URL ảnh"
            value={testimonial.avatar || ""}
            onChange={(e) =>
              onChange({ ...testimonial, avatar: e.target.value })
            }
            placeholder="https://..."
          />

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Hoặc tải ảnh lên
            </Typography>

            <Pattern
              maxSize={2 * 1024 * 1024}
              accept="image/*"
              multiple={false}
              value={testimonial.avatar ? [testimonial.avatar] : []}
              onUploadComplete={(urls) =>
                onChange({ ...testimonial, avatar: urls[0] || "" })
              }
              onUploadingChange={onImageUploadingChange}
            />
          </Box>
        </Stack>

        <TextField
          label="Thứ tự hiển thị"
          type="number"
          value={testimonial.order || ""}
          onChange={(e) =>
            onChange({
              ...testimonial,
              order: Number(e.target.value),
            })
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Hash className="size-4 text-muted-foreground" />
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={testimonial.published !== false}
              onChange={(e) =>
                onChange({
                  ...testimonial,
                  published: e.target.checked,
                })
              }
            />
          }
          label={testimonial.published !== false ? "Đã xuất bản" : "Bản nháp"}
        />
      </Stack>
    </DialogComponent>
  );
}
