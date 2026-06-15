"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CommentForm } from "./comment-form";
import { DecoFrame as DecoFrameComp } from "@/components/sections/deco-frame";
import { Button } from "@/components/ui/button";
import { MessageSquare, Reply, Trash2 } from "lucide-react";
import { alertSuccess, alertError } from "@/lib/alerts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Comment as CommentType } from "@/lib/api";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
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
              <DecoFrameComp className="p-4 space-y-2">
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
                  <div className="flex items-center gap-1">
                    {session && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() =>
                                setReplyingTo(
                                  replyingTo === comment.id ? null : comment.id,
                                )
                              }
                            >
                              <Reply className="size-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Phản hồi</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
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
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {comment.content}
                </p>

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

                {comment.replies && comment.replies.length > 0 && (
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
