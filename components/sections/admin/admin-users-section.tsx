"use client";

import { User } from "@/lib/api";
import { Shield, ShieldCheck, Users2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCard } from "./user-card";

export function UsersSection({
  users,
  onReload,
  loading,
}: {
  users: User[];
  onReload: () => void;
  loading?: boolean;
}) {
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount = users.filter((u) => u.role === "USER").length;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        {loading ? (
          <>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </>
        ) : (
          <>
            <StatPill
              icon={<Users2 className="h-3.5 w-3.5" />}
              value={users.length}
              label="tổng"
              gradient="from-primary/20 to-primary/5"
              border="border-primary/20"
              text="text-primary"
            />
            <StatPill
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
              value={adminCount}
              label="admin"
              gradient="from-amber-500/15 to-amber-500/5"
              border="border-amber-500/20"
              text="text-amber-500"
            />
            <StatPill
              icon={<Shield className="h-3.5 w-3.5" />}
              value={userCount}
              label="user"
              border="border-white/[0.06]"
              text="text-foreground/70"
            />
          </>
        )}
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Users2 className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">Chưa có người dùng nào đăng ký.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} onReload={onReload} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatPill({
  icon,
  value,
  label,
  gradient,
  border,
  text,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  gradient?: string;
  border: string;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border bg-linear-to-br ${gradient || "from-white/2 to-transparent"} ${border} backdrop-blur-sm`}
    >
      <span className={text}>{icon}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
      <span className="text-[0.65rem] text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
