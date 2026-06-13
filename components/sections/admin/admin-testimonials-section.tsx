import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, Testimonial } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { WorkspaceSplit } from "@/components/admin/workspace-split";
import { WsField } from "@/components/admin/ws-field";
import { WsSubmit } from "@/components/admin/ws-submit";
import { WsTable } from "@/components/admin/ws-table";
import { Pattern } from "@/components/upload-file";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type TestimonialForm = Omit<Testimonial, "id" | "createdAt" | "updatedAt">;

interface Props {
  testimonials: Testimonial[];
  form: TestimonialForm;
  editingId: string;
  onChange: (f: TestimonialForm) => void;
  onSubmit: (e: FormEvent) => void;
  onEdit: (item: Testimonial) => void;
  onReload: () => void;
  emptyForm: TestimonialForm;
  setEditingId: (id: string) => void;
  onImageUploadingChange?: (isUploading: boolean) => void;
}

export function AdminTestimonialsSection({
  testimonials,
  form,
  editingId,
  onChange,
  onSubmit,
  onEdit,
  onReload,
  emptyForm,
  setEditingId,
  onImageUploadingChange,
}: Props) {
  return (
    <WorkspaceSplit
      form={
        <form onSubmit={onSubmit} className="space-y-3">
          <WsField label="Tên người đánh giá">
            <Input
              value={form.authorName}
              onChange={(e) =>
                onChange({ ...form, authorName: e.target.value })
              }
              required
            />
          </WsField>
          <WsField label="Chức danh / Công ty">
            <Input
              value={form.authorTitle}
              onChange={(e) =>
                onChange({ ...form, authorTitle: e.target.value })
              }
              required
            />
          </WsField>
          <WsField label="Nội dung đánh giá">
            <Textarea
              value={form.content}
              onChange={(e) => onChange({ ...form, content: e.target.value })}
              rows={4}
              required
            />
          </WsField>
          <WsField label="Ảnh đại diện (URL hoặc upload)">
            <Input
              value={form.avatar || ""}
              onChange={(e) => onChange({ ...form, avatar: e.target.value })}
              placeholder="https://..."
              className="mb-2"
            />
            <Pattern
              maxSize={2 * 1024 * 1024}
              accept="image/*"
              multiple={false}
              value={form.avatar ? [form.avatar] : []}
              onUploadComplete={(urls) =>
                onChange({ ...form, avatar: urls[0] || "" })
              }
              onUploadingChange={onImageUploadingChange}
            />
          </WsField>
          <WsField label="Thứ tự hiển thị">
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
            label="đánh giá"
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
          cols={["Người đánh giá", "Nội dung", "Thứ tự"]}
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
            onEdit: () => onEdit(item),
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
      }
    />
  );
}
