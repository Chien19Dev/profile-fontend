import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api, Profile } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { WsTable } from "@/components/admin/ws-table";
import { ProfileEditDialog } from "@/components/sections/admin/profile-edit-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

type ProfileForm = Omit<Profile, "id" | "createdAt" | "updatedAt">;

const emptyProfile: ProfileForm = {
  fullName: "",
  title: "",
  bio: "",
  avatar: "",
  email: "",
  phone: "",
  location: "",
  githubUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  websiteUrl: "",
};

interface Props {
  profiles: Profile[];
  onReload: () => void;
  loading?: boolean;
}

export function ProfilesSection({ profiles, onReload, loading }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState<ProfileForm>(emptyProfile);
  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenDialog = (isEdit = false) => {
    if (!isEdit) {
      setForm(emptyProfile);
      setEditingId("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(emptyProfile);
    setEditingId("");
  };

  const handleEdit = (item: Profile) => {
    setForm({ ...emptyProfile, ...item });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (imageUploading) {
      alertError("Đang tải ảnh lên, vui lòng đợi...");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.profiles.update(editingId, form);
        alertSuccess("Đã cập nhật hồ sơ");
      } else {
        await api.profiles.create(form);
        alertSuccess("Đã tạo hồ sơ");
      }
      handleCloseDialog();
      onReload();
    } catch {
      alertError("Có lỗi xảy ra khi lưu hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Danh sách hồ sơ</h2>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(false)}
        >
          Tạo mới
        </Button>
      </div>
      <WsTable
        cols={["Hồ sơ", "Thông tin", "Chức danh"]}
        loading={loading}
        rows={profiles.map((item) => ({
          key: item.id,
          cells: [
            <div key="avatar" className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage
                  src={item.avatar || undefined}
                  alt={item.fullName}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {item.fullName?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium truncate">{item.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.email}
                </p>
              </div>
            </div>,
            <div key="contact" className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {item.phone || "—"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.location || "—"}
              </p>
            </div>,
            <Badge key="title" variant="success" size="lg">
              {item.title}
            </Badge>,
          ],
          onEdit: () => handleEdit(item),
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
      <ProfileEditDialog
        profile={form}
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
