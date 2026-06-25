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
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { alertError, alertSuccess } from "@/lib/alerts";
import { Camera, Loader2, Eye, EyeOff } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
  const router = useRouter();
  const [name, setName] = useState(initialName || "");
  const [bio, setBio] = useState(initialBio || "");
  const [image, setImage] = useState(initialImage || "");
  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      if (showPassword && newPassword) {
        await signOut({ redirect: false });
        router.push("/login");
        return;
      }
      setShowPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
            <Textarea
              size="default"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Viết vài dòng về bản thân..."
              rows={3}
            />
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-primary font-medium rounded-full"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Ẩn đổi mật khẩu" : "Đổi mật khẩu"}
          </Button>

          <AnimatePresence>
            {showPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-3 border border-border rounded-lg p-4 overflow-hidden"
              >
                <Field>
                  <FieldLabel>Mật khẩu hiện tại</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Nhập mật khẩu hiện tại..."
                    />
                    <InputGroupAddon
                      align="inline-end"
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      onClick={() => setShowCurrentPassword((v) => !v)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel>Mật khẩu mới</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự..."
                    />
                    <InputGroupAddon
                      align="inline-end"
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      onClick={() => setShowNewPassword((v) => !v)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel>Xác nhận mật khẩu mới</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới..."
                    />
                    <InputGroupAddon
                      align="inline-end"
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </motion.div>
            )}
          </AnimatePresence>
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
