"use client";

import { DecoFrame as DecoFrameComp } from "@/components/sections/deco-frame";
import { Button } from "@/components/ui/button";
import { alertError, alertSuccess } from "@/lib/alerts";
import type { Comment as CommentType } from "@/lib/api";
import { ChevronDown, ChevronUp, MessageSquare, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CommentForm } from "./comment-form";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [collapsedReplies, setCollapsedReplies] = useState<Set<string>>(new Set());
  const { data: session } = useSession();

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function loadComments() {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
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
    setCollapsedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
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

      <CommentForm postId={postId} onCommentAdded={loadComments} />

      {loading ? (
        <p className="text-sm text-muted-foreground">Đang tải bình luận...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <DecoFrameComp
                className="p-4 space-y-2"
                bottomRightClassName="-bottom-0.5!"
                bottomLeftClassName="-bottom-0.5!"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                      {comment.user?.name?.[0]?.toUpperCase() || "?"}
                    </div>
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
                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment.id ? null : comment.id,
                        )
                      }
                      className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      Phản hồi
                    </button>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      {collapsedReplies.has(comment.id) ? (
                        <>
                          <ChevronDown className="size-3.5" />
                          Xem {comment.replies.length} phản hồi
                        </>
                      ) : (
                        <>
                          <ChevronUp className="size-3.5" />
                          Ẩn phản hồi
                        </>
                      )}
                    </button>
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

                {comment.replies && comment.replies.length > 0 && !collapsedReplies.has(comment.id) && (
                  <div className="ml-6 space-y-3 border-l-2 border-primary/20 pl-4 pt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="space-y-1">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[0.6rem] font-medium">
                              {reply.user?.name?.[0]?.toUpperCase() || "?"}
                            </div>
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
                          <button
                            onClick={() =>
                              setReplyingTo(
                                replyingTo === reply.id ? null : reply.id,
                              )
                            }
                            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            Phản hồi
                          </button>
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
