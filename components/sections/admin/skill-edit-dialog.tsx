"use client";

import { Zap, Folder, Star, Hash } from "lucide-react";
import type { Skill } from "@/lib/api";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DialogComponent from "@/components/common/DialogComponent";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

type SkillForm = Omit<Skill, "id" | "createdAt" | "updatedAt">;

interface Props {
  skill: SkillForm;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (f: SkillForm) => void;
  onSave: () => void;
  isEditing: boolean;
  loading?: boolean;
}

export function SkillEditDialog({
  skill,
  open,
  onOpenChange,
  onChange,
  onSave,
  isEditing,
  loading = false,
}: Props) {
  return (
    <DialogComponent
      open={open}
      onClose={() => onOpenChange(false)}
      title={isEditing ? "Chỉnh sửa kỹ năng" : "Tạo kỹ năng mới"}
      description={
        isEditing
          ? "Cập nhật thông tin kỹ năng"
          : "Thêm kỹ năng mới vào danh sách"
      }
      maxWidth="sm"
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
          label="Tên kỹ năng"
          value={skill.name}
          onChange={(e) => onChange({ ...skill, name: e.target.value })}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Zap className="size-4 text-muted-foreground" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          label="Danh mục"
          value={skill.category || ""}
          onChange={(e) => onChange({ ...skill, category: e.target.value })}
          placeholder="Frontend, Backend, DevOps..."
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Folder className="size-4 text-muted-foreground" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          label="Icon"
          value={skill.icon || ""}
          onChange={(e) => onChange({ ...skill, icon: e.target.value })}
          placeholder="lucide-react icon name"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Star className="size-4 text-muted-foreground" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Mức độ (%)"
              type="number"
              value={skill.level || ""}
              onChange={(e) =>
                onChange({
                  ...skill,
                  level: Number(e.target.value),
                })
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Thứ tự"
              type="number"
              value={skill.order || ""}
              onChange={(e) =>
                onChange({
                  ...skill,
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
          </Grid>
        </Grid>

        <FormControlLabel
          control={
            <Switch
              checked={skill.published !== false}
              onChange={(e) =>
                onChange({
                  ...skill,
                  published: e.target.checked,
                })
              }
            />
          }
          label={skill.published !== false ? "Đã xuất bản" : "Bản nháp"}
        />
      </Stack>
    </DialogComponent>
  );
}
