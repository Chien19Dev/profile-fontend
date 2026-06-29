"use client";

import { DecoFrame } from "@/components/sections/deco-frame";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { alertError, alertSuccess } from "@/lib/alerts";
import type { Post } from "@/lib/api";
import { BookOpen, Calendar, Pencil, UserMinus, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FollowListDialog } from "./follow-list-dialog";
import { UserSettingsDialog } from "./user-settings-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

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
    hasPassword?: boolean;
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
  const [postsLoading, setPostsLoading] = useState(false);
  const [followDialog, setFollowDialog] = useState<{
    open: boolean;
    type: "followers" | "following";
  }>({ open: false, type: "followers" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 6;

  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = searchParams?.get("page");
  const [page, setPage] = useState<number>(initialPage ? parseInt(initialPage, 10) : 1);

  const navigateToPage = (newPage: number) => {
    setPage(newPage);
    router.push(`?page=${newPage}`, { scroll: false });
  };

  useEffect(() => {
    const p = searchParams?.get("page");
    const pageNum = p ? parseInt(p, 10) : 1;
    if (!isNaN(pageNum) && pageNum !== page) {
      setPage(pageNum);
    }
  }, [searchParams]);

  useEffect(() => {
    if (userId) loadUser();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const currentPage = page;
    setPostsLoading(true);
    fetch(`/api/posts?authorId=${userId}&published=true&page=${currentPage}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        if (currentPage !== page) return;
        if (data.posts) setUserPosts(data.posts);
        if (typeof data.totalPages === "number") setTotalPages(data.totalPages);
      })
      .catch(() => { })
      .finally(() => setPostsLoading(false));
  }, [userId, page]);

  useEffect(() => {
    if (session?.user?.id && userId && session.user.id !== userId) {
      fetch(`/api/follows?userId=${session.user.id}&type=following`)
        .then((res) => res.json())
        .then((data: { followingId: string }[]) => {
          if (Array.isArray(data)) {
            setIsFollowing(data.some((f) => f.followingId === userId));
          }
        })
        .catch(() => { });
    }
  }, [session?.user?.id, userId]);

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
        loadUser();
      }
    } catch {
      alertError("Lỗi");
    }
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
          <DecoFrame
            className="p-8 space-y-6"
            bottomRightClassName="!-bottom-3"
            bottomLeftClassName="!-bottom-3"
          >
            <div className="flex items-center gap-4">
              {loading ? (
                <Skeleton className="size-16 rounded-full" />
              ) : (
                <Avatar className="size-16 text-2xl">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.name || "Avatar"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
              {isOwnProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Pencil className="size-3.5" /> Chỉnh sửa
                </Button>
              )}
            </div>

            <div className="grid grid-cols-5 gap-3 border-t border-border pt-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="text-center space-y-1">
                    <Skeleton className="h-5 w-8 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                ))
              ) : (
                [
                  { label: "Bình luận", count: user._count?.comments || 0 },
                  { label: "Thích", count: user._count?.likes || 0 },
                  { label: "Đã lưu", count: user._count?.bookmarks || 0 },
                  {
                    label: "Đang theo dõi",
                    count: user._count?.following || 0,
                    followType: "following" as const,
                  },
                  {
                    label: "Người theo dõi",
                    count: user._count?.followers || 0,
                    followType: "followers" as const,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={
                      "text-center" +
                      (stat.followType && stat.count > 0
                        ? " cursor-pointer hover:bg-muted/60 rounded-md transition-colors py-1 -my-1"
                        : "")
                    }
                    onClick={
                      stat.followType && stat.count > 0
                        ? () =>
                          setFollowDialog({
                            open: true,
                            type: stat.followType!,
                          })
                        : undefined
                    }
                  >
                    <p
                      className={
                        "text-lg font-medium tabular-nums" +
                        (stat.followType && stat.count > 0 ? " text-primary" : "")
                      }
                    >
                      {stat.count}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))
              )}
            </div>
          </DecoFrame>
          <div className="mt-6">
            <h2 className="deco-title text-xl text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              Bài viết
            </h2>
            {postsLoading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: limit }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-border p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : userPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Chưa có bài viết nào.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {userPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/40"
                  >
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      <span>
                        {new Date(
                          post.publishedAt || post.createdAt!,
                        ).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {post.category && (
                        <>
                          <span className="text-border">•</span>
                          <span>{post.category}</span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination className="pt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={page > 1 ? `?page=${page - 1}` : undefined}
                      onClick={() => {
                        if (page > 1) navigateToPage(page - 1);
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === page}
                          onClick={() => navigateToPage(p)}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (page < totalPages) navigateToPage(page + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>

      <FollowListDialog
        open={followDialog.open}
        onOpenChange={(open) => setFollowDialog((prev) => ({ ...prev, open }))}
        userId={userId}
        type={followDialog.type}
      />

      <UserSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        userId={userId}
        initialName={user.name}
        initialBio={user.bio}
        initialImage={user.image}
        hasPassword={user.hasPassword ?? false}
        onSaved={() => loadUser()}
      />
    </div>
  );
}
