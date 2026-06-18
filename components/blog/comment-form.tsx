"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { alertError, alertSuccess } from "@/lib/alerts";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  replyToName?: string | null;
  onCommentAdded?: () => void;
  onOptimistic?: (content: string) => void;
  onCancel?: () => void;
}

export function CommentForm({
  postId,
  parentId,
  replyToName,
  onCommentAdded,
  onOptimistic,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    const finalContent = replyToName ? `@${replyToName} ${content}` : content;

    if (!parentId) {
      onOptimistic?.(finalContent);
    }

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: finalContent, postId, parentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        alertError(data.error || "Không thể gửi bình luận");
        return;
      }

      setContent("");
      alertSuccess(parentId ? "Đã gửi phản hồi" : "Đã gửi bình luận");
      onCommentAdded?.();
    } catch {
      alertError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <div className="text-center py-3 text-sm text-muted-foreground border border-border rounded-lg">
        Vui lòng{" "}
        <Link href="/login" className="text-primary hover:underline">
          đăng nhập
        </Link>{" "}
        để bình luận.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          replyToName
            ? `Phản hồi @${replyToName}...`
            : parentId
              ? "Viết phản hồi..."
              : "Viết bình luận..."
        }
        rows={3}
        required
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={loading || !content.trim()}>
          <Send className="size-3.5" />
          {loading
            ? "Đang gửi..."
            : parentId
              ? "Phản hồi"
              : "Gửi bình luận"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Hủy
          </Button>
        )}
      </div>
    </form>
  );
}
