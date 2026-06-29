import { Button } from "@/components/ui/button";
import { api, Testimonial } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { WsTable } from "@/components/admin/ws-table";
import { TestimonialEditDialog } from "@/components/sections/admin/testimonial-edit-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

type TestimonialForm = Omit<Testimonial, "id" | "createdAt" | "updatedAt">;

const emptyTestimonial: TestimonialForm = {
  authorName: "",
  authorTitle: "",
  content: "",
  avatar: "",
  order: 0,
};

interface Props {
  testimonials: Testimonial[];
  onReload: () => void;
  loading?: boolean;
}

export function AdminTestimonialsSection({
  testimonials,
  onReload,
  loading,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState<TestimonialForm>(emptyTestimonial);
  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenDialog = (isEdit = false) => {
    if (!isEdit) {
      setForm(emptyTestimonial);
      setEditingId("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(emptyTestimonial);
    setEditingId("");
  };

  const handleEdit = (item: Testimonial) => {
    setForm({ ...emptyTestimonial, ...item });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (imageUploading) {
      alertError("Đang tải ảnh lên, vui lòng đợi...");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      order: Number(form.order || 0),
    };

    try {
      if (editingId) {
        await api.testimonials.update(editingId, payload);
        alertSuccess("Đã cập nhật đánh giá");
      } else {
        await api.testimonials.create(payload);
        alertSuccess("Đã thêm đánh giá");
      }
      handleCloseDialog();
      onReload();
    } catch {
      alertError("Có lỗi xảy ra khi lưu đánh giá");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Danh sách đánh giá</h2>
        <Button onClick={() => handleOpenDialog(false)}>
          <Plus className="size-4 mr-2" />
          Tạo mới
        </Button>
      </div>
      <WsTable
        cols={["Người đánh giá", "Nội dung", "Thứ tự"]}
        loading={loading}
        rows={testimonials.map((item) => ({
          key: item.id,
          cells: [
            <div key="author">
              <p className="text-sm font-medium">{item.authorName}</p>
              <p className="text-xs text-muted-foreground">
                {item.authorTitle}
              </p>
            </div>,
            <p
              key="content"
              className="text-xs text-muted-foreground line-clamp-2 max-w-55"
            >
              {item.content}
            </p>,
            <span
              key="order"
              className="text-xs tabular-nums text-primary font-medium"
            >
              {item.order ?? 0}
            </span>,
          ],
          onEdit: () => handleEdit(item),
          onDelete: async () => {
            try {
              await api.testimonials.remove(item.id);
              alertSuccess("Đã xóa đánh giá");
              onReload();
            } catch {
              alertError("Lỗi khi xóa đánh giá");
            }
          },
        }))}
      />
      <TestimonialEditDialog
        testimonial={form}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onChange={setForm}
        onSave={handleSave}
        isEditing={!!editingId}
        onImageUploadingChange={setImageUploading}
        loading={saving}
      />
    </div>
  );
}
