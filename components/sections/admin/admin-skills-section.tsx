import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { api, Skill } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { WsTable } from "@/components/admin/ws-table";
import { SkillEditDialog } from "@/components/sections/admin/skill-edit-dialog";
import { useState } from "react";

type SkillForm = Omit<Skill, "id" | "createdAt" | "updatedAt">;

const emptySkill: SkillForm = {
  name: "",
  category: "",
  icon: "",
  level: 0,
  order: 0,
};

interface Props {
  skills: Skill[];
  onReload: () => void;
  loading?: boolean;
}

export function SkillsSection({ skills, onReload, loading }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState<SkillForm>(emptySkill);
  const [saving, setSaving] = useState(false);

  const handleOpenDialog = (isEdit = false) => {
    if (!isEdit) {
      setForm(emptySkill);
      setEditingId("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(emptySkill);
    setEditingId("");
  };

  const handleEdit = (item: Skill) => {
    setForm({ ...emptySkill, ...item });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      level: Number(form.level || 0),
      order: Number(form.order || 0),
    };
    try {
      if (editingId) {
        await api.skills.update(editingId, payload);
        alertSuccess("Đã cập nhật kỹ năng");
      } else {
        await api.skills.create(payload);
        alertSuccess("Đã tạo kỹ năng");
      }
      handleCloseDialog();
      onReload();
    } catch {
      alertError("Có lỗi xảy ra khi lưu kỹ năng");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Danh sách kỹ năng</h2>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(false)}
        >
          Tạo mới
        </Button>
      </div>
      <WsTable
        cols={["Kỹ năng", "Danh mục", "Mức độ"]}
        loading={loading}
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
          onEdit: () => handleEdit(item),
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
      <SkillEditDialog
        skill={form}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onChange={setForm}
        onSave={handleSave}
        isEditing={!!editingId}
        loading={saving}
      />
    </div>
  );
}
