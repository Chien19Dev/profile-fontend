"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { alertError, alertSuccess } from "@/lib/alerts";
import { Camera, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";

interface UserSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialName: string | null;
  initialBio: string | null;
  initialImage: string | null;
  onSaved: () => void;
}

export function UserSettingsDialog({
  open,
  onOpenChange,
  userId,
  initialName,
  initialBio,
  initialImage,
  onSaved,
}: UserSettingsDialogProps) {
  const { update } = useSession();
  const [name, setName] = useState(initialName || "");
  const [bio, setBio] = useState(initialBio || "");
  const [image, setImage] = useState(initialImage || "");
  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setName(initialName || "");
      setBio(initialBio || "");
      setImage(initialImage || "");
      setShowPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    onOpenChange(nextOpen);
  };

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alertError("Ảnh phải nhỏ hơn 5MB");
      return;
    }
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.url);
      } else {
        alertError("Tải ảnh thất bại");
      }
    } catch {
      alertError("Tải ảnh thất bại");
    } finally {
      setImageUploading(false);
    }
  }

  async function handleSave() {
    if (imageUploading) {
      alertError("Đang tải ảnh, vui lòng đợi...");
      return;
    }
    if (showPassword && newPassword !== confirmPassword) {
      alertError("Mật khẩu mới không khớp");
      return;
    }
    if (showPassword && newPassword.length > 0 && newPassword.length < 6) {
      alertError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, string> = {
        name: name.trim(),
        bio: bio.trim(),
        image,
      };
      if (showPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alertError(err.error || "Cập nhật thất bại");
        return;
      }

      alertSuccess("Đã cập nhật hồ sơ");
      await update();
      onSaved();
      onOpenChange(false);
    } catch {
      alertError("Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        </DialogHeader>
        <DialogPanel className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="size-16 text-xl">
                <AvatarImage src={image || undefined} alt="Avatar" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {name?.[0]?.toUpperCase() || "?"}
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
            <p className="text-xs text-muted-foreground">
              Click vào ảnh để thay đổi (tối đa 5MB)
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Họ tên</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ tên..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Giới thiệu</Label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Viết vài dòng về bản thân..."
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>
          <button
            type="button"
            className="text-xs text-primary font-medium hover:underline"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Ẩn đổi mật khẩu" : "Đổi mật khẩu"}
          </button>

          {showPassword && (
            <div className="space-y-3 border border-border rounded-lg p-4">
              <div className="space-y-1.5">
                <Label>Mật khẩu hiện tại</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Mật khẩu mới</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Xác nhận mật khẩu mới</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                />
              </div>
            </div>
          )}
        </DialogPanel>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
