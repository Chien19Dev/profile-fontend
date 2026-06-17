"use client";

import { useState } from "react";
import { api, User } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from "@/components/ui/alert-dialog";
import {
  Trash2,
  Mail,
  Calendar,
  MessageSquare,
  Heart,
  Bookmark,
  Users2,
  Shield,
  ShieldCheck,
} from "lucide-react";

export function UsersSection({
  users,
  onReload,
}: {
  users: User[];
  onReload: () => void;
}) {
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount = users.filter((u) => u.role === "USER").length;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/8 border border-primary/15">
          <Users2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{users.length}</span>
          <span className="text-xs text-muted-foreground">tổng</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-info/8 border border-info/15">
          <ShieldCheck className="h-4 w-4 text-info-foreground" />
          <span className="text-sm font-medium">{adminCount}</span>
          <span className="text-xs text-muted-foreground">admin</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-success/8 border border-success/15">
          <Shield className="h-4 w-4 text-success-foreground" />
          <span className="text-sm font-medium">{userCount}</span>
          <span className="text-xs text-muted-foreground">user</span>
        </div>
      </div>

      {users.length === 0 ? (
        <Label className="text-sm text-muted-foreground">
          Chưa có người dùng nào đăng ký.
        </Label>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} onReload={onReload} />
          ))}
        </div>
      )}
    </div>
  );
}

function UserCard({ user, onReload }: { user: User; onReload: () => void }) {
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
        "relative border p-5 flex flex-col gap-4 transition-colors",
        isAdmin ? "border-info/20 bg-info/3" : "border-border bg-background/50",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11 shrink-0 ring-1 ring-border">
          <AvatarImage src={user.image || undefined} alt={user.name || ""} />
          <AvatarFallback
            className={[
              "text-sm font-semibold",
              isAdmin
                ? "bg-info/15 text-info-foreground"
                : "bg-primary/10 text-primary",
            ].join(" ")}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">
              {user.name || "Chưa đặt tên"}
            </span>
            <Badge
              variant={isAdmin ? "info" : "success"}
              size="sm"
              className="shrink-0"
            >
              {isAdmin ? "Admin" : "User"}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>
      </div>
      {user.bio && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 -mt-1">
          {user.bio}
        </p>
      )}
      <div className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
        <Calendar className="h-3 w-3" />
        <span>Tham gia {joinDate}</span>
      </div>
      <div className="grid grid-cols-4 gap-1 pt-3 border-t border-border/40">
        <StatItem
          icon={MessageSquare}
          value={stats.comments ?? 0}
          label="bình luận"
        />
        <StatItem icon={Heart} value={stats.likes ?? 0} label="thích" />
        <StatItem icon={Bookmark} value={stats.bookmarks ?? 0} label="lưu" />
        <StatItem icon={Users2} value={stats.followers ?? 0} label="theo dõi" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-2">
          <span className="text-[0.65rem] text-muted-foreground uppercase tracking-wider">
            Vai trò
          </span>
          <Select
            value={role}
            onValueChange={handleRoleChange}
            disabled={loading}
          >
            <SelectTrigger className="h-7 w-22 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogTrigger
            className="inline-flex items-center justify-center h-7 w-7 rounded-sm text-muted-foreground/50 hover:text-destructive hover:bg-destructive/8 transition-colors cursor-pointer"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa người dùng?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc muốn xóa người dùng &quot;{user.name || user.email}
                &quot;? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogClose className="px-4 py-2 text-sm rounded-sm border border-border hover:bg-accent cursor-pointer">
                Hủy
              </AlertDialogClose>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
              >
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />
      <span className="text-sm font-medium tabular-nums">{value}</span>
      <span className="text-[0.6rem] text-muted-foreground/60 leading-none">
        {label}
      </span>
    </div>
  );
}
