"use client";

import { Pattern } from "@/components/upload-file";
import { FolderOpen, Code, Globe } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { Project } from "@/lib/api";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DialogComponent from "@/components/common/DialogComponent";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";

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
    <DialogComponent
      open={open}
      onClose={() => onOpenChange(false)}
      title={isEditing ? "Chỉnh sửa dự án" : "Tạo dự án mới"}
      description={
        isEditing ? "Cập nhật thông tin dự án" : "Thêm dự án mới vào danh sách"
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
      onConfirm={onSave}
    >
      <Stack spacing={3}>
        <TextField
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
          label="Mô tả"
          value={project.description}
          onChange={(e) =>
            onChange({ ...project, description: e.target.value })
          }
          required
          multiline
          rows={3}
        />

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Ảnh dự án
          </Typography>

          <Pattern
            maxSize={5 * 1024 * 1024}
            accept="image/*"
            multiple
            value={project.images}
            onUploadComplete={(urls) => onChange({ ...project, images: urls })}
            onUploadingChange={onImageUploadingChange}
          />
        </Box>

        <TextField
          label="Công nghệ"
          value={project.technologiesText}
          onChange={(e) =>
            onChange({
              ...project,
              technologiesText: e.target.value,
            })
          }
          placeholder="React, Next.js, TypeScript..."
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

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="GitHub URL"
              value={project.githubUrl || ""}
              onChange={(e) =>
                onChange({
                  ...project,
                  githubUrl: e.target.value,
                })
              }
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
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Demo URL"
              value={project.demoUrl || ""}
              onChange={(e) =>
                onChange({
                  ...project,
                  demoUrl: e.target.value,
                })
              }
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
          </Grid>
        </Grid>

        <FormControlLabel
          control={
            <Switch
              checked={project.published !== false}
              onChange={(e) =>
                onChange({
                  ...project,
                  published: e.target.checked,
                })
              }
            />
          }
          label={project.published !== false ? "Đã xuất bản" : "Bản nháp"}
        />
      </Stack>
    </DialogComponent>
  );
}
