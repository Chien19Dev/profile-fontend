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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { alertError } from "@/lib/alerts";
import type { Profile } from "@/lib/api";
import { cn } from "@/lib/utils";

type ProfileForm = Omit<Profile, "id" | "createdAt" | "updatedAt">;

const EXTRA_FIELDS: Record<string, string> = {
  email: "Email",
  phone: "Số điện thoại",
  location: "Địa điểm",
  githubUrl: "GitHub URL",
  linkedinUrl: "LinkedIn URL",
  twitterUrl: "Twitter / X URL",
  instagramUrl: "Instagram URL",
  facebookUrl: "Facebook URL",
  websiteUrl: "Website URL",
};

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
            <div className="space-y-2">
              <Label>Họ và tên *</Label>
              <Input
                value={profile.fullName}
                onChange={(e) =>
                  onChange({ ...profile, fullName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Chức danh *</Label>
              <Input
                value={profile.title}
                onChange={(e) =>
                  onChange({ ...profile, title: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Giới thiệu *</Label>
            <Textarea
              value={profile.bio}
              onChange={(e) => onChange({ ...profile, bio: e.target.value })}
              required
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                value={profile.phone || ""}
                onChange={(e) =>
                  onChange({ ...profile, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={profile.email || ""}
                onChange={(e) =>
                  onChange({ ...profile, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Địa điểm</Label>
            <Input
              value={profile.location || ""}
              onChange={(e) =>
                onChange({ ...profile, location: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input
                value={profile.githubUrl || ""}
                onChange={(e) =>
                  onChange({ ...profile, githubUrl: e.target.value })
                }
                placeholder="https://github.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input
                value={profile.linkedinUrl || ""}
                onChange={(e) =>
                  onChange({ ...profile, linkedinUrl: e.target.value })
                }
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter / X URL</Label>
              <Input
                value={profile.twitterUrl || ""}
                onChange={(e) =>
                  onChange({ ...profile, twitterUrl: e.target.value })
                }
                placeholder="https://twitter.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input
                value={profile.instagramUrl || ""}
                onChange={(e) =>
                  onChange({ ...profile, instagramUrl: e.target.value })
                }
                placeholder="https://instagram.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label>Facebook URL</Label>
              <Input
                value={profile.facebookUrl || ""}
                onChange={(e) =>
                  onChange({ ...profile, facebookUrl: e.target.value })
                }
                placeholder="https://facebook.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input
                value={profile.websiteUrl || ""}
                onChange={(e) =>
                  onChange({ ...profile, websiteUrl: e.target.value })
                }
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </DialogPanel>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Huỷ
          </Button>
          <Button onClick={onSave} disabled={loading || imageUploading}>
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                {isEditing ? "Đang cập nhật..." : "Đang tạo..."}
              </>
            ) : isEditing ? (
              "Cập nhật"
            ) : (
              "Tạo"
            )}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
