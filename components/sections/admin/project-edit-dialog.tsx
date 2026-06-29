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
import type { Project } from "@/lib/api";

type ProjectForm = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  technologiesText: string;
  images: string[];
};

interface Props {
  project: ProjectForm;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (f: ProjectForm) => void;
  onSave: () => void;
  isEditing: boolean;
  onImageUploadingChange?: (isUploading: boolean) => void;
  loading?: boolean;
}

export function ProjectEditDialog({
  project,
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
          <DialogTitle>{isEditing ? "Chỉnh sửa dự án" : "Tạo dự án mới"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Cập nhật thông tin dự án" : "Thêm dự án mới vào danh sách"}
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-4">
          <div className="space-y-2">
            <Label>Tên dự án *</Label>
            <Input
              value={project.title}
              onChange={(e) => onChange({ ...project, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Mô tả *</Label>
            <Textarea
              value={project.description}
              onChange={(e) => onChange({ ...project, description: e.target.value })}
              required
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Ảnh dự án</Label>
            <Pattern
              maxSize={5 * 1024 * 1024}
              accept="image/*"
              multiple={true}
              value={project.images}
              onUploadComplete={(urls) => onChange({ ...project, images: urls })}
              onUploadingChange={onImageUploadingChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Công nghệ (phân cách bằng dấu phẩy)</Label>
            <Input
              value={project.technologiesText}
              onChange={(e) => onChange({ ...project, technologiesText: e.target.value })}
              placeholder="React, TypeScript, TailwindCSS"
            />
          </div>
          <div className="space-y-2">
            <Label>GitHub URL (tùy chọn)</Label>
            <Input
              value={project.githubUrl || ""}
              onChange={(e) => onChange({ ...project, githubUrl: e.target.value })}
              placeholder="https://github.com/username/repo"
            />
          </div>
          <div className="space-y-2">
            <Label>Demo URL (tùy chọn)</Label>
            <Input
              value={project.demoUrl || ""}
              onChange={(e) => onChange({ ...project, demoUrl: e.target.value })}
              placeholder="https://your-project-demo.com"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={project.published !== false}
              onCheckedChange={(checked: boolean) =>
                onChange({ ...project, published: checked })
              }
            />
            <Label className="text-sm text-muted-foreground cursor-pointer">
              {project.published !== false ? "Đã xuất bản" : "Bản nháp"}
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
