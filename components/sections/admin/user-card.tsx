"use client";

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { alertError, alertSuccess } from "@/lib/alerts";
import { api, User } from "@/lib/api";
import {
  Bookmark,
  Calendar,
  Crown,
  Heart,
  Mail,
  MessageSquare,
  Pencil,
  Trash2,
  Users2,
} from "lucide-react";
import { useState } from "react";
import { StatItem } from "./stat-item";
import { UserEditDialog } from "./user-edit-dialog";
import { Label } from "@/components/ui/label";

export function UserCard({
  user,
  onReload,
}: {
  user: User;
  onReload: () => void;
}) {
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const initials = (user.name || user.email)
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleRoleChange(value: string | null) {
    if (!value) return;
    setLoading(true);
    try {
      await api.users.updateRole(user.id, value);
      setRole(value);
      alertSuccess("Đã cập nhật vai trò");
      onReload();
    } catch {
      alertError("Lỗi khi cập nhật vai trò");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await api.users.remove(user.id);
      alertSuccess("Đã xóa người dùng");
      setDeleteOpen(false);
      onReload();
    } catch {
      alertError("Lỗi khi xóa người dùng");
    } finally {
      setLoading(false);
    }
  }

  async function handleEditSave(data: {
    name?: string;
    bio?: string;
    image?: string;
  }) {
    setLoading(true);
    try {
      await api.users.updateProfile(user.id, data);
      alertSuccess("Đã cập nhật thông tin");
      setEditOpen(false);
      onReload();
    } catch {
      alertError("Lỗi khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  }

  const stats = user._count || {};
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const isAdmin = role === "ADMIN";

  return (
    <div
      className={[
        "group relative flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300",
        "bg-linear-to-br from-white/3 to-transparent backdrop-blur-sm",
        "hover:shadow-lg hover:shadow-black/10",
        isAdmin
          ? "border-amber-500/15 hover:border-amber-500/30 hover:shadow-amber-500/5"
          : "border-white/6 hover:border-white/12",
      ].join(" ")}
    >
      {isAdmin && (
        <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-amber-500/6 to-transparent pointer-events-none" />
      )}
      <div className="relative flex items-start gap-3.5">
        <div className="relative">
          <Avatar
            className={[
              "h-12 w-12 shrink-0 ring-2 transition-all duration-300",
              isAdmin
                ? "ring-amber-500/30 shadow-md shadow-amber-500/10"
                : "ring-white/10",
            ].join(" ")}
          >
            <AvatarImage src={user.image || undefined} alt={user.name || ""} />
            <AvatarFallback
              className={[
                "text-sm font-bold",
                isAdmin
                  ? "bg-linear-to-br from-amber-500/20 to-amber-600/10 text-amber-400"
                  : "bg-linear-to-br from-primary/15 to-primary/5 text-primary",
              ].join(" ")}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          {isAdmin && (
            <div className="absolute -top-1 -right-1 flex items-center justify-center h-4.5 w-4.5 rounded-full bg-linear-to-br from-amber-400 to-amber-600 shadow-sm shadow-amber-500/30">
              <Crown className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate tracking-tight">
              {user.name || "Chưa đặt tên"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[0.7rem] text-muted-foreground/80">
            <Mail className="h-3 w-3 shrink-0 opacity-50" />
            <Label className="text-[11px]!">{user.email}</Label>
          </div>
        </div>

        <div
          className={[
            "shrink-0 px-2.5 py-1 rounded-lg text-[0.6rem] font-bold uppercase tracking-widest border",
            isAdmin
              ? "bg-linear-to-r from-amber-500/15 to-amber-600/10 text-amber-400 border-amber-500/20"
              : "bg-white/4 border-white/6",
          ].join(" ")}
        >
          {isAdmin ? "Admin" : "User"}
        </div>
      </div>
      {user.bio && (
        <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">
          {user.bio}
        </p>
      )}
      <div className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground/50">
        <Calendar className="h-3 w-3 opacity-60" />
        <span>Tham gia {joinDate}</span>
      </div>
      <div className="grid grid-cols-4 gap-1 pt-3.5 border-t border-white/5">
        <StatItem
          icon={MessageSquare}
          value={stats.comments ?? 0}
          label="bình luận"
        />
        <StatItem icon={Heart} value={stats.likes ?? 0} label="thích" />
        <StatItem icon={Bookmark} value={stats.bookmarks ?? 0} label="lưu" />
        <StatItem icon={Users2} value={stats.followers ?? 0} label="theo dõi" />
      </div>
      <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="text-[0.6rem] text-muted-foreground/50 uppercase tracking-[0.12em] font-medium">
            Vai trò
          </span>
          <Select
            value={role}
            onValueChange={handleRoleChange}
            disabled={loading || isAdmin}
          >
            <SelectTrigger className="h-7 w-22 text-xs rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground/40 hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-200 cursor-pointer"
              title="Chỉnh sửa"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {!isAdmin && (
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa người dùng?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc muốn xóa người dùng &quot;
                  {user.name || user.email}
                  &quot;? Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose className="px-4 py-2 text-sm rounded-lg border border-white/8 hover:bg-white/4 cursor-pointer transition-colors">
                  Hủy
                </AlertDialogClose>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                  className="rounded-lg"
                >
                  Xóa
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <UserEditDialog
        user={user}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleEditSave}
        loading={loading}
      />
    </div>
  );
}
