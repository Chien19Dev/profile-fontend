"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pattern } from "@/components/upload-file";
import { Loader2 } from "lucide-react";
import type { Testimonial } from "@/lib/api";

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
          <DialogTitle>{isEditing ? "Chỉnh sửa đánh giá" : "Tạo đánh giá mới"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Cập nhật thông tin đánh giá" : "Thêm đánh giá mới vào danh sách"}
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-4">
          <div className="space-y-2">
            <Label>Tên người đánh giá *</Label>
            <Input
              value={testimonial.authorName}
              onChange={(e) => onChange({ ...testimonial, authorName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Chức danh / Công ty *</Label>
            <Input
              value={testimonial.authorTitle}
              onChange={(e) => onChange({ ...testimonial, authorTitle: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Nội dung đánh giá *</Label>
            <Textarea
              value={testimonial.content}
              onChange={(e) => onChange({ ...testimonial, content: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Ảnh đại diện (URL hoặc upload)</Label>
            <Input
              value={testimonial.avatar || ""}
              onChange={(e) => onChange({ ...testimonial, avatar: e.target.value })}
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
          <div className="space-y-2">
            <Label>Thứ tự hiển thị</Label>
            <Input
              type="number"
              value={testimonial.order || 0}
              onChange={(e) => onChange({ ...testimonial, order: Number(e.target.value) })}
            />
          </div>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Huỷ
          </Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                {isEditing ? "Đang cập nhật..." : "Đang tạo..."}
              </>
            ) : (
              isEditing ? "Cập nhật" : "Tạo"
            )}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
