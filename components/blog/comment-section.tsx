"use client";

import { DecoFrame as DecoFrameComp } from "@/components/sections/deco-frame";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { alertError, alertSuccess } from "@/lib/alerts";
import type { Comment as CommentType } from "@/lib/api";
import { ChevronDown, ChevronUp, MessageSquare, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { CommentForm } from "./comment-form";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set(),
  );
  const [optimisticComments, setOptimisticComments] = useState<CommentType[]>(
    [],
  );
  const { data: session } = useSession();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadComments();
  }, [postId]);

  useEffect(() => {
    pollingRef.current = setInterval(() => {
      loadComments(true);
    }, 8000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [postId]);

  async function loadComments(silent = false) {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data: CommentType[] = await res.json();
        setComments(data);
        const realIds = new Set(data.map((c: CommentType) => c.id));
        setOptimisticComments((prev) => prev.filter((c) => !realIds.has(c.id)));
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  function addOptimisticComment(content: string) {
    const optimistic: CommentType = {
      id: `optimistic-${Date.now()}`,
      content,
      postId,
      userId: session?.user?.id || "",
      user: {
        name: session?.user?.name || "Bạn",
        image: session?.user?.image || null,
      },
      createdAt: new Date().toISOString(),
      replies: [],
    };
    setOptimisticComments((prev) => [optimistic, ...prev]);
  }

  async function handleDelete(commentId: string) {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alertSuccess("Đã xóa bình luận");
        loadComments();
      }
    } catch {
      alertError("Lỗi khi xóa bình luận");
    }
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function toggleReplies(commentId: string) {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }

  function AvatarCircle({
    name,
    image,
    size = "md",
  }: {
    name?: string | null;
    image?: string | null;
    size?: "sm" | "md";
  }) {
    const isSm = size === "sm";
    const sizeClass = isSm ? "size-6 text-[0.6rem]" : "size-8 text-xs";
    return (
      <Avatar className={sizeClass}>
        {image && <AvatarImage src={image} alt={name || ""} />}
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {name?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
    );
  }

  const totalComments =
    comments.length +
    comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-5 text-primary" />
        <h3 className="deco-title text-xl text-foreground">
          Bình luận ({totalComments})
        </h3>
      </div>

      <CommentForm
        postId={postId}
        onCommentAdded={loadComments}
        onOptimistic={addOptimisticComment}
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Đang tải bình luận...</p>
      ) : comments.length === 0 && optimisticComments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </p>
      ) : (
        <div className="space-y-4">
          {optimisticComments.map((comment) => (
            <div key={comment.id} className="space-y-3 animate-pulse">
              <DecoFrameComp
                className="p-4 space-y-2"
                bottomRightClassName="-bottom-0.5!"
                bottomLeftClassName="-bottom-0.5!"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <AvatarCircle
                      name={comment.user?.name}
                      image={comment.user?.image}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {comment.user?.name || "Ẩn danh"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Đang gửi...
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {comment.content}
                </p>
              </DecoFrameComp>
            </div>
          ))}
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <DecoFrameComp
                className="p-4 space-y-2"
                bottomRightClassName="-bottom-0.5!"
                bottomLeftClassName="-bottom-0.5!"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <AvatarCircle
                      name={comment.user?.name}
                      image={comment.user?.image}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {comment.user?.name || "Ẩn danh"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  {(session?.user?.id === comment.userId ||
                    session?.user?.role === "ADMIN") && (
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {comment.content}
                </p>

                <div className="flex items-center gap-3 pt-0.5">
                  {session && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment.id ? null : comment.id,
                        )
                      }
                    >
                      Phản hồi
                    </Button>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleReplies(comment.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      {!expandedReplies.has(comment.id) ? (
                        <Fragment>
                          <ChevronDown className="size-3.5" />
                          Xem {comment.replies.length} phản hồi
                        </Fragment>
                      ) : (
                        <Fragment>
                          <ChevronUp className="size-3.5" />
                          Ẩn phản hồi
                        </Fragment>
                      )}
                    </Button>
                  )}
                </div>

                {replyingTo === comment.id && (
                  <div className="pt-2 border-t border-border">
                    <CommentForm
                      postId={postId}
                      parentId={comment.id}
                      onCommentAdded={() => {
                        loadComments();
                        setReplyingTo(null);
                      }}
                      onCancel={() => setReplyingTo(null)}
                    />
                  </div>
                )}

                {comment.replies &&
                  comment.replies.length > 0 &&
                  expandedReplies.has(comment.id) && (
                    <div className="ml-6 space-y-3 border-l-2 border-primary/20 pl-4 pt-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="space-y-1">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <AvatarCircle
                                name={reply.user?.name}
                                image={reply.user?.image}
                                size="sm"
                              />
                              <div>
                                <span className="text-xs font-medium">
                                  {reply.user?.name || "Ẩn danh"}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                            </div>
                            {(session?.user?.id === reply.userId ||
                              session?.user?.role === "ADMIN") && (
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => handleDelete(reply.id)}
                              >
                                <Trash2 className="size-3 text-destructive" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {reply.content}
                          </p>

                          {session && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-muted-foreground"
                              onClick={() =>
                                setReplyingTo(
                                  replyingTo === reply.id ? null : reply.id,
                                )
                              }
                            >
                              Phản hồi
                            </Button>
                          )}
                          {replyingTo === reply.id && (
                            <div className="pt-2">
                              <CommentForm
                                postId={postId}
                                parentId={comment.id}
                                replyToName={reply.user?.name || "Ẩn danh"}
                                onCommentAdded={() => {
                                  loadComments();
                                  setReplyingTo(null);
                                }}
                                onCancel={() => setReplyingTo(null)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
              </DecoFrameComp>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
