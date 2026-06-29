"use client";

import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pattern } from "@/components/upload-file";
import { Loader2, User, Briefcase, MessageSquare, Hash } from "lucide-react";
import type { Testimonial } from "@/lib/api";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa đánh giá" : "Tạo đánh giá mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin đánh giá"
              : "Thêm đánh giá mới vào danh sách"}
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="grid gap-4">
          <TextField
            fullWidth
            variant="outlined"
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
            fullWidth
            variant="outlined"
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
            fullWidth
            variant="outlined"
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
          <div className="grid gap-4">
            <TextField
              label="URL ảnh"
              fullWidth
              variant="outlined"
              value={testimonial.avatar || ""}
              onChange={(e) =>
                onChange({ ...testimonial, avatar: e.target.value })
              }
              placeholder="https://..."
              className="mb-2"
            />
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
          </div>
          <TextField
            fullWidth
            variant="outlined"
            label="Thứ tự hiển thị"
            type="number"
            value={testimonial.order || ""}
            onChange={(e) =>
              onChange({ ...testimonial, order: Number(e.target.value) })
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
          <div className="flex items-center gap-2">
            <Switch
              checked={testimonial.published !== false}
              onCheckedChange={(checked: boolean) =>
                onChange({ ...testimonial, published: checked })
              }
            />
            <Label className="text-sm text-muted-foreground cursor-pointer">
              {testimonial.published !== false ? "Đã xuất bản" : "Bản nháp"}
            </Label>
          </div>
        </DialogPanel>
        <DialogFooter>
          <Button
            variant="outlined"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            startIcon={<CloseIcon />}
          >
            Huỷ
          </Button>
          <Button
            variant="contained"
            onClick={onSave}
            disabled={loading}
            startIcon={
              loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isEditing ? (
                <SaveIcon />
              ) : (
                <AddIcon />
              )
            }
          >
            {loading
              ? isEditing
                ? "Đang cập nhật..."
                : "Đang tạo..."
              : isEditing
                ? "Cập nhật"
                : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
