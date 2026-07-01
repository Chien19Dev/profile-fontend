import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { api, Service } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { WsTable } from "@/components/admin/ws-table";
import { ServiceEditDialog } from "@/components/sections/admin/service-edit-dialog";
import { useState } from "react";
import Image from "next/image";

type ServiceForm = Omit<Service, "id" | "createdAt" | "updatedAt">;

const emptyService: ServiceForm = {
  imageUrl: "",
  title: "",
  description: "",
  order: 0,
  published: true,
};

interface Props {
  services: Service[];
  onReload: () => void;
  loading?: boolean;
}

export function AdminServicesSection({ services, onReload, loading }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState<ServiceForm>(emptyService);
  const [saving, setSaving] = useState(false);

  const handleOpenDialog = (isEdit = false) => {
    if (!isEdit) {
      setForm(emptyService);
      setEditingId("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(emptyService);
    setEditingId("");
  };

  const handleEdit = (item: Service) => {
    setForm({ ...emptyService, ...item });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      order: Number(form.order || 0),
    };
    try {
      if (editingId) {
        await api.services.update(editingId, payload);
        alertSuccess("Đã cập nhật dịch vụ");
      } else {
        await api.services.create(payload);
        alertSuccess("Đã tạo dịch vụ");
      }
      handleCloseDialog();
      onReload();
    } catch {
      alertError("Có lỗi xảy ra khi lưu dịch vụ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Danh sách dịch vụ</h2>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(false)}
        >
          Tạo mới
        </Button>
      </div>
      <WsTable
        cols={["Hình ảnh", "Tiêu đề", "Mô tả"]}
        loading={loading}
        rows={services.map((item) => ({
          key: item.id,
          cells: [
            <Image
              key="image"
              src={item.imageUrl}
              alt={item.title}
              width={40}
              height={40}
              className="w-10 h-10 rounded object-cover"
            />,
            <p key="title" className="text-sm font-medium">
              {item.title}
            </p>,
            <span
              key="desc"
              className="text-xs text-muted-foreground max-w-xs truncate"
            >
              {item.description}
            </span>,
          ],
          onEdit: () => handleEdit(item),
          onDelete: async () => {
            try {
              await api.services.remove(item.id);
              alertSuccess("Đã xóa dịch vụ");
              onReload();
            } catch {
              alertError("Lỗi khi xóa");
            }
          },
        }))}
      />
      <ServiceEditDialog
        service={form}
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
