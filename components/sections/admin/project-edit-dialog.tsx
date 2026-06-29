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
import {
  Loader2,
  FolderOpen,
  Link as LinkIcon,
  Code,
  Globe,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { Project } from "@/lib/api";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

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
          <DialogTitle>
            {isEditing ? "Chỉnh sửa dự án" : "Tạo dự án mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin dự án"
              : "Thêm dự án mới vào danh sách"}
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="grid gap-4">
          <TextField
            fullWidth
            variant="outlined"
            label="Tên dự án"
            value={project.title}
            onChange={(e) => onChange({ ...project, title: e.target.value })}
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <FolderOpen className="size-4 text-muted-foreground" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Mô tả"
            value={project.description}
            onChange={(e) =>
              onChange({ ...project, description: e.target.value })
            }
            required
            multiline
            rows={3}
          />
          <div className="space-y-2">
            <Label>Ảnh dự án</Label>
            <Pattern
              maxSize={5 * 1024 * 1024}
              accept="image/*"
              multiple={true}
              value={project.images}
              onUploadComplete={(urls) =>
                onChange({ ...project, images: urls })
              }
              onUploadingChange={onImageUploadingChange}
            />
          </div>
          <TextField
            fullWidth
            variant="outlined"
            label="Công nghệ (phân cách bằng dấu phẩy)"
            value={project.technologiesText}
            onChange={(e) =>
              onChange({ ...project, technologiesText: e.target.value })
            }
            placeholder="React, TypeScript, TailwindCSS"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Code className="size-4 text-muted-foreground" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="GitHub URL (tùy chọn)"
            value={project.githubUrl || ""}
            onChange={(e) =>
              onChange({ ...project, githubUrl: e.target.value })
            }
            placeholder="https://github.com/username/repo"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <FaGithub className="size-4 text-muted-foreground" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Demo URL (tùy chọn)"
            value={project.demoUrl || ""}
            onChange={(e) => onChange({ ...project, demoUrl: e.target.value })}
            placeholder="https://your-project-demo.com"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Globe className="size-4 text-muted-foreground" />
                  </InputAdornment>
                ),
              },
            }}
          />
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
