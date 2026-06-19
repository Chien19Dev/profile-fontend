"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FollowUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface FollowListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  type: "followers" | "following";
}

interface FollowRecord {
  id: string;
  follower?: FollowUser;
  following?: FollowUser;
}

export function FollowListDialog({
  open,
  onOpenChange,
  userId,
  type,
}: FollowListDialogProps) {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/follows?userId=${userId}&type=${type}`)
      .then((res) => res.json())
      .then((data: FollowRecord[]) => {
        if (Array.isArray(data)) {
          const extracted = data.map((r) =>
            type === "followers" ? r.follower! : r.following!,
          );
          setUsers(extracted.filter(Boolean));
        }
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [open, userId, type]);

  const title =
    type === "followers" ? "Người theo dõi" : "Đang theo dõi";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogPanel>
          {loading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Đang tải...
            </p>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Chưa có ai.
            </p>
          ) : (
            <ul className="space-y-3">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center gap-3"
                >
                  <Avatar className="size-9 text-sm">
                    <AvatarImage
                      src={u.image || undefined}
                      alt={u.name || "Avatar"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {u.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-sm font-medium text-foreground truncate">
                    {u.name || "Ẩn danh"}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    render={<Link href={`/profile/${u.id}`} />}
                  >
                    Xem
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </DialogPanel>
      </DialogPopup>
    </Dialog>
  );
}
