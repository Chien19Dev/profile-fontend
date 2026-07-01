"use client";

import { Heading2, AlignLeft, Hash, Image as ImageIcon } from "lucide-react";
import type { Service } from "@/lib/api";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DialogComponent from "@/components/common/dialog-component";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Pattern } from "@/components/upload-file";

type ServiceForm = Omit<Service, "id" | "createdAt" | "updatedAt">;

interface Props {
  service: ServiceForm;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (f: ServiceForm) => void;
  onSave: () => void;
  isEditing: boolean;
  loading?: boolean;
}

export function ServiceEditDialog({
  service,
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
      title={isEditing ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
      description={
        isEditing
          ? "Cập nhật thông tin dịch vụ"
          : "Thêm dịch vụ mới vào danh sách"
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
            : "Xác nhận"
      }
      cancelText="Huỷ"
      isEditing={isEditing}
      onConfirm={onSave}
    >
      <Stack spacing={3} sx={{ mt: 1 }}>
        <div>
          <label className="text-sm font-medium mb-2 block">Hình ảnh</label>
          <Pattern
            maxFiles={1}
            value={service.imageUrl ? [service.imageUrl] : []}
            onUploadComplete={(urls) => onChange({ ...service, imageUrl: urls[0] || "" })}
          />
        </div>

        <TextField
          label="Tiêu đề"
          value={service.title}
          onChange={(e) => onChange({ ...service, title: e.target.value })}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Heading2 className="size-4 text-muted-foreground" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          label="Mô tả"
          value={service.description}
          onChange={(e) =>
            onChange({ ...service, description: e.target.value })
          }
          required
          multiline
          rows={3}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <AlignLeft className="size-4 text-muted-foreground" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          label="Thứ tự"
          type="number"
          value={service.order || ""}
          onChange={(e) =>
            onChange({
              ...service,
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
              checked={service.published !== false}
              onChange={(e) =>
                onChange({
                  ...service,
                  published: e.target.checked,
                })
              }
            />
          }
          label={service.published !== false ? "Đã xuất bản" : "Bản nháp"}
        />
      </Stack>
    </DialogComponent>
  );
}
