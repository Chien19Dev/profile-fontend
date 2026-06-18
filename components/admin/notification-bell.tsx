"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Notification } from "@/lib/api";
import { Bell, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) return;

    loadNotifications();
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.unreadCount !== undefined) {
          setUnreadCount(data.unreadCount);
          if (data.unreadCount > notifications.filter((n) => !n.isRead).length) {
            loadNotifications();
          }
        }
      } catch {
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isAdmin]);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
      }
    } catch {
    }
  }

  async function markAsRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
    }
  }

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
    }
  }

  if (!isAdmin) return null;

  function formatTime(dateStr?: string) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return new Date(dateStr).toLocaleDateString("vi-VN");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="sm" className="relative" />
        }
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-4 rounded-full bg-destructive text-destructive-foreground text-[0.6rem] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverPopup side="bottom" align="end" sideOffset={8} className="w-80 p-0">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <span className="text-sm font-medium">Thông báo</span>
          {unreadCount > 0 && (
            <Button size="sm" variant="ghost" onClick={markAllRead}>
              <Check className="size-3" />
              Đọc tất cả
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Không có thông báo
          </div>
        ) : (
          <div className="divide-y divide-border bg-muted/30 backdrop-blur-md max-h-80 overflow-y-auto scrollbar-hide">
            {notifications.slice(0, 10).map((notif) => (
              <div
                key={notif.id}
                className={`p-3 space-y-1 ${notif.isRead ? "" : "bg-primary/5"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium leading-tight">
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => markAsRead(notif.id)}
                      className="shrink-0 text-primary hover:text-primary/80"
                    >
                      <Check className="size-3" />
                    </Button>
                  )}
                </div>
                <p className="text-[0.65rem] text-muted-foreground leading-relaxed">
                  {notif.message}
                </p>
                <p className="text-[0.6rem] text-muted-foreground/60">
                  {formatTime(notif.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </PopoverPopup>
    </Popover>
  );
}
