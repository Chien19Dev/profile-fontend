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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  Loader2,
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { useRef, useState } from "react";
import { alertError } from "@/lib/alerts";
import type { Profile } from "@/lib/api";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

type ProfileForm = Omit<Profile, "id" | "createdAt" | "updatedAt">;

interface Props {
  profile: ProfileForm;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (f: ProfileForm) => void;
  onSave: () => void;
  isEditing: boolean;
  onImageUploadingChange?: (isUploading: boolean) => void;
  loading?: boolean;
}

export function ProfileEditDialog({
  profile,
  open,
  onOpenChange,
  onChange,
  onSave,
  isEditing,
  onImageUploadingChange,
  loading = false,
}: Props) {
  const [imageUploading, setImageUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alertError("Ảnh phải nhỏ hơn 5MB");
      return;
    }
    setImageUploading(true);
    onImageUploadingChange?.(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onChange({ ...profile, avatar: data.url });
      } else {
        alertError("Tải ảnh lên thất bại");
      }
    } catch {
      alertError("Tải ảnh lên thất bại");
    } finally {
      setImageUploading(false);
      onImageUploadingChange?.(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin hồ sơ"
              : "Thêm hồ sơ mới vào danh sách"}
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="size-16 text-xl">
                <AvatarImage
                  src={profile.avatar || undefined}
                  alt={profile.fullName || "Avatar"}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {profile.fullName?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                onClick={() => fileRef.current?.click()}
                disabled={imageUploading}
              >
                {imageUploading ? (
                  <Loader2 className="size-4 text-white animate-spin" />
                ) : (
                  <Camera className="size-4 text-white" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div className="flex-1">
              <Label className="text-sm font-medium">Ảnh đại diện</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Nhấp vào ảnh để tải lên hoặc thay đổi
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextField
              fullWidth
              variant="outlined"
              label="Họ và tên"
              value={profile.fullName}
              onChange={(e) =>
                onChange({ ...profile, fullName: e.target.value })
              }
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <User className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Chức danh"
              value={profile.title}
              onChange={(e) => onChange({ ...profile, title: e.target.value })}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Briefcase className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <TextField
              fullWidth
              variant="outlined"
              label="Giới thiệu"
              value={profile.bio}
              onChange={(e) => onChange({ ...profile, bio: e.target.value })}
              required
              multiline
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextField
              fullWidth
              variant="outlined"
              label="Số điện thoại"
              value={profile.phone || ""}
              onChange={(e) => onChange({ ...profile, phone: e.target.value })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Phone className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              value={profile.email || ""}
              onChange={(e) => onChange({ ...profile, email: e.target.value })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Mail className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <TextField
              fullWidth
              variant="outlined"
              label="Địa điểm"
              value={profile.location || ""}
              onChange={(e) =>
                onChange({ ...profile, location: e.target.value })
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <MapPin className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              variant="outlined"
              label="GitHub URL"
              value={profile.githubUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, githubUrl: e.target.value })
              }
              placeholder="https://github.com/username"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <FaGithub className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="LinkedIn URL"
              value={profile.linkedinUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, linkedinUrl: e.target.value })
              }
              placeholder="https://linkedin.com/in/username"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <FaLinkedin className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Twitter / X URL"
              value={profile.twitterUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, twitterUrl: e.target.value })
              }
              placeholder="https://twitter.com/username"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <FaTwitter className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Instagram URL"
              value={profile.instagramUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, instagramUrl: e.target.value })
              }
              placeholder="https://instagram.com/username"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <FaInstagram className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Facebook URL"
              value={profile.facebookUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, facebookUrl: e.target.value })
              }
              placeholder="https://facebook.com/username"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <FaFacebook className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Website URL"
              value={profile.websiteUrl || ""}
              onChange={(e) =>
                onChange({ ...profile, websiteUrl: e.target.value })
              }
              placeholder="https://yourwebsite.com"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Globe className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
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
            disabled={loading || imageUploading}
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
