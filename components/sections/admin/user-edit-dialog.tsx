"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { alertError } from "@/lib/alerts";
import type { User } from "@/lib/api";
import { Camera, Loader2, Mail } from "lucide-react";
import { useRef, useState } from "react";

export function UserEditDialog({
  user,
  open,
  onOpenChange,
  onSave,
  loading,
}: {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name?: string; bio?: string; image?: string }) => void;
  loading: boolean;
}) {
  const [editName, setEditName] = useState(user.name || "");
  const [editBio, setEditBio] = useState(user.bio || "");
  const [editImage, setEditImage] = useState(user.image || "");
  const [imageUploading, setImageUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setEditName(user.name || "");
      setEditBio(user.bio || "");
      setEditImage(user.image || "");
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
      if (data.success && data.url) {
        setEditImage(data.url);
      } else {
        alertError("Tải ảnh lên thất bại");
      }
    } catch {
      alertError("Tải ảnh lên thất bại");
    } finally {
      setImageUploading(false);
    }
  }

  function handleSave() {
    if (imageUploading) {
      alertError("Đang tải ảnh, vui lòng đợi...");
      return;
    }
    onSave({
      name: editName || undefined,
      bio: editBio || undefined,
      image: editImage || undefined,
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
          <DialogDescription className="flex items-center gap-1.5">
            <Mail className="size-3" />
            {user.email}
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="size-16 text-xl">
                <AvatarImage
                  src={editImage || user.image || undefined}
                  alt={editName || user.name || "Avatar"}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {(editName || user.email)[0]?.toUpperCase() || "?"}
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
            <Label>Tên hiển thị</Label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nhập tên hiển thị..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Giới thiệu</Label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Viết vài dòng giới thiệu về bản thân..."
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>
        </DialogPanel>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
