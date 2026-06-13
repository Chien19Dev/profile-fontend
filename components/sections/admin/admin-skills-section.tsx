import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { api, Skill } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { WorkspaceSplit } from "@/components/admin/workspace-split";
import { WsField } from "@/components/admin/ws-field";
import { WsSubmit } from "@/components/admin/ws-submit";
import { WsTable } from "@/components/admin/ws-table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type SkillForm = Omit<Skill, "id" | "createdAt" | "updatedAt">;

interface Props {
  skills: Skill[];
  form: SkillForm;
  editingId: string;
  onChange: (f: SkillForm) => void;
  onSubmit: (e: FormEvent) => void;
  onEdit: (item: Skill) => void;
  onReload: () => void;
  emptyForm: SkillForm;
  setEditingId: (id: string) => void;
}

export function SkillsSection({
  skills,
  form,
  editingId,
  onChange,
  onSubmit,
  onEdit,
  onReload,
  emptyForm,
  setEditingId,
}: Props) {
  return (
    <WorkspaceSplit
      form={
        <form onSubmit={onSubmit} className="space-y-2">
          <WsField label="Tên kỹ năng">
            <Input
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              required
            />
          </WsField>
          <WsField label="Danh mục">
            <Input
              value={form.category || ""}
              onChange={(e) => onChange({ ...form, category: e.target.value })}
            />
          </WsField>
          <WsField label="Icon">
            <Input
              value={form.icon || ""}
              onChange={(e) => onChange({ ...form, icon: e.target.value })}
            />
          </WsField>
          <WsField label="Mức độ (%)">
            <Input
              type="number"
              min={0}
              max={100}
              value={form.level || 0}
              onChange={(e) =>
                onChange({ ...form, level: Number(e.target.value) })
              }
            />
          </WsField>
          <WsField label="Thứ tự">
            <Input
              type="number"
              value={form.order || 0}
              onChange={(e) =>
                onChange({ ...form, order: Number(e.target.value) })
              }
            />
          </WsField>
          <WsField label="Xuất bản">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.published !== false}
                onCheckedChange={(checked: boolean) => onChange({ ...form, published: checked })}
              />
              <Label className="text-sm text-muted-foreground">
                {form.published !== false ? "Đã xuất bản" : "Bản nháp"}
              </Label>
            </div>
          </WsField>
          <WsSubmit
            isEditing={!!editingId}
            label="kỹ năng"
            onCancel={
              editingId
                ? () => {
                    onChange(emptyForm);
                    setEditingId("");
                  }
                : undefined
            }
          />
        </form>
      }
      list={
        <WsTable
          cols={["Kỹ năng", "Danh mục", "Mức độ"]}
          rows={skills.map((item) => ({
            key: item.id,
            cells: [
              <p key="name" className="text-sm font-medium">
                {item.name}
              </p>,
              <span key="cat" className="text-xs text-muted-foreground">
                {item.category || "—"}
              </span>,
              <span
                key="lvl"
                className="text-xs tabular-nums text-primary font-medium"
              >
                {item.level ? `${item.level}%` : "—"}
              </span>,
            ],
            onEdit: () => onEdit(item),
            onDelete: async () => {
              try {
                await api.skills.remove(item.id);
                alertSuccess("Đã xóa kỹ năng");
                onReload();
              } catch {
                alertError("Lỗi khi xóa");
              }
            },
          }))}
        />
      }
    />
  );
}
