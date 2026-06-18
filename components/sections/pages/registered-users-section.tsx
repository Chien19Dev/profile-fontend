"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { api, PublicUser } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Users, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";

export function RegisteredUsersSection() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await api.publicUsers.list();
        setUsers(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="deco-frame p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <Users className="h-5 w-5 text-primary" />
          <Label className="deco-eyebrow">Cộng đồng</Label>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-full bg-muted animate-pulse" />
              <div className="h-2.5 w-12 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) return null;

  return (
    <motion.div {...fadeUp} className="deco-frame p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
          <Users className="h-4 w-4 text-primary" />
        </div>
        <div>
          <Label className="deco-eyebrow">Cộng đồng</Label>
          <span className="text-xs text-muted-foreground ml-2">
            {users.length} thành viên đã đăng ký
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {users.slice(0, 16).map((user) => (
          <UserAvatar key={user.id} user={user} />
        ))}
      </div>

      {users.length > 16 && (
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>+{users.length - 16} thành viên khác</span>
        </div>
      )}
    </motion.div>
  );
}

function UserAvatar({ user }: { user: PublicUser }) {
  const initials = (user.name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const stats = user._count || {};

  return (
    <Link
      href={`/profile/${user.id}`}
      className="group flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg hover:bg-accent/40 transition-all"
    >
      <div className="relative">
        <Avatar className="h-12 w-12 ring-2 ring-border/50 group-hover:ring-primary/40 transition-all group-hover:scale-105">
          <AvatarImage src={user.image || undefined} alt={user.name || ""} />
          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      <span className="text-[0.7rem] font-medium text-foreground truncate max-w-full text-center leading-tight">
        {user.name || "Ẩn danh"}
      </span>
      <div className="flex items-center gap-1.5 text-[0.6rem] text-muted-foreground/70">
        <span className="flex items-center gap-0.5">
          <Heart className="h-2.5 w-2.5" />
          {stats.likes ?? 0}
        </span>
        <span className="text-muted-foreground/30">·</span>
        <span className="flex items-center gap-0.5">
          <MessageSquare className="h-2.5 w-2.5" />
          {stats.comments ?? 0}
        </span>
      </div>
    </Link>
  );
}
