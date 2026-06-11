import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api, Profile } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { WorkspaceSplit } from "../admin/workspace-split";
import { WsField } from "../admin/ws-field";
import { WsSubmit } from "../admin/ws-submit";
import { WsTable } from "../admin/ws-table";

type ProfileForm = Omit<Profile, "id" | "createdAt" | "updatedAt">;

const EXTRA_FIELDS: Record<string, string> = {
  avatar: "Ảnh đại diện (URL)",
  email: "Email",
  phone: "Số điện thoại",
  location: "Địa điểm",
  githubUrl: "GitHub URL",
  linkedinUrl: "LinkedIn URL",
  websiteUrl: "Website URL",
};

interface Props {
  profiles: Profile[];
  form: ProfileForm;
  editingId: string;
  onChange: (f: ProfileForm) => void;
  onSubmit: (e: FormEvent) => void;
  onEdit: (item: Profile) => void;
  onReload: () => void;
  emptyForm: ProfileForm;
  setEditingId: (id: string) => void;
}

export function ProfilesSection({
  profiles,
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
          <WsField label="Họ và tên">
            <Input
              value={form.fullName}
              onChange={(e) => onChange({ ...form, fullName: e.target.value })}
              required
            />
          </WsField>
          <WsField label="Chức danh">
            <Input
              value={form.title}
              onChange={(e) => onChange({ ...form, title: e.target.value })}
              required
            />
          </WsField>
          <WsField label="Giới thiệu">
            <Textarea
              value={form.bio}
              onChange={(e) => onChange({ ...form, bio: e.target.value })}
              required
              rows={3}
            />
          </WsField>
          {Object.entries(EXTRA_FIELDS).map(([f, lbl]) => (
            <WsField key={f} label={lbl}>
              <Input
                value={String(form[f as keyof ProfileForm] || "")}
                onChange={(e) => onChange({ ...form, [f]: e.target.value })}
              />
            </WsField>
          ))}
          <WsSubmit
            isEditing={!!editingId}
            label="hồ sơ"
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
          cols={["Họ và tên", "Chức danh"]}
          rows={profiles.map((item) => ({
            key: item.id,
            cells: [
              <div key="name">
                <p className="text-sm font-medium truncate">{item.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.email}
                </p>
              </div>,
              <Badge key="title" variant="success" size="lg">
                {item.title}
              </Badge>,
            ],
            onEdit: () => onEdit(item),
            onDelete: async () => {
              try {
                await api.profiles.remove(item.id);
                alertSuccess("Đã xóa hồ sơ");
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
