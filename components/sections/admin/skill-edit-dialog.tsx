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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import type { Skill } from "@/lib/api";

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
          <DialogTitle>{isEditing ? "Chỉnh sửa kỹ năng" : "Tạo kỹ năng mới"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Cập nhật thông tin kỹ năng" : "Thêm kỹ năng mới vào danh sách"}
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-4">
          <div className="space-y-2">
            <Label>Tên kỹ năng *</Label>
            <Input
              value={skill.name}
              onChange={(e) => onChange({ ...skill, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Danh mục</Label>
            <Input
              value={skill.category || ""}
              onChange={(e) => onChange({ ...skill, category: e.target.value })}
              placeholder="Frontend, Backend, DevOps..."
            />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <Input
              value={skill.icon || ""}
              onChange={(e) => onChange({ ...skill, icon: e.target.value })}
              placeholder="lucide-react icon name"
            />
          </div>
          <div className="space-y-2">
            <Label>Mức độ (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={skill.level || 0}
              onChange={(e) => onChange({ ...skill, level: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Thứ tự</Label>
            <Input
              type="number"
              value={skill.order || 0}
              onChange={(e) => onChange({ ...skill, order: Number(e.target.value) })}
            />
          </div>
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
