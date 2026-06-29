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
import { Loader2, Zap, Folder, Star, Hash } from "lucide-react";
import type { Skill } from "@/lib/api";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa kỹ năng" : "Tạo kỹ năng mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin kỹ năng"
              : "Thêm kỹ năng mới vào danh sách"}
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="grid gap-4">
          <TextField
            fullWidth
            variant="outlined"
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
            fullWidth
            variant="outlined"
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
            fullWidth
            variant="outlined"
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
          <TextField
            fullWidth
            variant="outlined"
            label="Mức độ (%)"
            type="number"
            value={skill.level || ""}
            onChange={(e) =>
              onChange({ ...skill, level: Number(e.target.value) })
            }
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Thứ tự"
            type="number"
            value={skill.order || ""}
            onChange={(e) =>
              onChange({ ...skill, order: Number(e.target.value) })
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
              checked={skill.published !== false}
              onCheckedChange={(checked: boolean) =>
                onChange({ ...skill, published: checked })
              }
            />
            <Label className="text-sm text-muted-foreground cursor-pointer">
              {skill.published !== false ? "Đã xuất bản" : "Bản nháp"}
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
