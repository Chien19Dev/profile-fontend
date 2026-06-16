"use client";

import { DecoFrame } from "@/components/sections/deco-frame";
import { Button } from "@/components/ui/button";
import { alertError, alertSuccess } from "@/lib/alerts";
import type { Post } from "@/lib/api";
import { Calendar, UserMinus, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const { data: session } = useSession();

  const [user, setUser] = useState<{
    id: string;
    name: string | null;
    email: string;
    bio: string | null;
    image: string | null;
    createdAt: string;
    _count?: {
      comments: number;
      likes: number;
      bookmarks: number;
      following: number;
      followers: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (userId) loadUser();
  }, [userId]);

  async function loadUser() {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFollowToggle() {
    if (!session) return;
    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId: userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.following);
        alertSuccess(data.following ? "Đã theo dõi" : "Đã bỏ theo dõi");
      }
    } catch {
      alertError("Lỗi");
    }
  }

  if (loading) {
    return (
      <div className="deco-page relative min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="deco-page relative min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy người dùng</p>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === userId;

  return (
    <div className="deco-page relative min-h-screen">
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <DecoFrame className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-medium">
                {user.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <h1 className="deco-title text-2xl text-foreground">
                  {user.name || "Ẩn danh"}
                </h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.bio && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.bio}
                  </p>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="size-3" />
                  Tham gia{" "}
                  {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              {!isOwnProfile && session && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? (
                    <Fragment>
                      <UserMinus className="size-3.5" /> Bỏ theo dõi
                    </Fragment>
                  ) : (
                    <Fragment>
                      <UserPlus className="size-3.5" /> Theo dõi
                    </Fragment>
                  )}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-3 border-t border-border pt-4">
              {[
                {
                  label: "Bình luận",
                  count: user._count?.comments || 0,
                },
                {
                  label: "Thích",
                  count: user._count?.likes || 0,
                },
                {
                  label: "Đã lưu",
                  count: user._count?.bookmarks || 0,
                },
                {
                  label: "Đang theo dõi",
                  count: user._count?.following || 0,
                },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg font-medium tabular-nums">
                    {stat.count}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </DecoFrame>
        </div>
      </div>
    </div>
  );
}
