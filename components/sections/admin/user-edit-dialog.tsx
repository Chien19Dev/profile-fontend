"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { alertError } from "@/lib/alerts";
import type { User } from "@/lib/api";
import { Loader2, Pencil, Users2 } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarUpload(file: File) {
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
    onSave({
      name: editName || undefined,
      bio: editBio || undefined,
      image: editImage || undefined,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <div className="relative px-6 pt-8 pb-6 border-b border-white/5">
          <div className="absolute inset-0 bg-linear-to-br from-amber-500/7 via-transparent to-violet-500/4 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="relative group/avatar">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="relative block rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
              >
                <Avatar className="h-16 w-16 ring-2 ring-amber-500/25 shadow-lg shadow-amber-500/10 transition-transform group-hover/avatar:scale-105">
                  <AvatarImage
                    src={editImage || user.image || undefined}
                    alt={editName || user.name || ""}
                  />
                  <AvatarFallback className="text-lg font-bold bg-linear-to-br from-amber-500/20 to-amber-600/10 text-amber-400">
                    {(editName || user.email)[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                  {imageUploading ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Pencil className="h-4 w-4 text-white" />
                  )}
                  Tên hiển thị
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                  e.target.value = "";
                }}
              />
            </div>
            <div className="min-w-0">
              <DialogHeader className="p-0">
                <DialogTitle className="flex items-center gap-2">
                  Chỉnh sửa hồ sơ
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground/60 mt-0.5 truncate">
                  {user.email}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="text-muted-foreground">
              Tên hiển thị
            </Label>
            <div className="relative">
              <Users2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 pointer-events-none" />
              <Input
                id="edit-name"
                size="lg"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nhập tên hiển thị"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-bio" className="text-muted-foreground">
              Giới thiệu
            </Label>
            <Textarea
              id="edit-bio"
              size="sm"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Viết vài dòng giới thiệu về bản thân..."
              rows={3}
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/5 bg-white/1 flex items-center justify-end gap-2.5">
          <DialogClose className="px-4 py-1.5 text-sm rounded-sm border border-white/8 hover:bg-white/4 cursor-pointer transition-all duration-200 text-muted-foreground">
            Hủy
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="rounded-sm"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
