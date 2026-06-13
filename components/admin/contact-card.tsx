import { useState } from "react";
import { MailCheck, Trash2, Reply } from "lucide-react";
import { api, ContactMessage, ContactReply } from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alerts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export function ContactCard({
  item,
  onReload,
}: {
  item: ContactMessage;
  onReload: () => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replies, setReplies] = useState<ContactReply[]>(
    (item.replies as ContactReply[]) || [],
  );

  async function handleReply() {
    if (!replyMessage.trim()) return;
    setReplyLoading(true);
    try {
      const res = await fetch(`/api/contact/${item.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage }),
      });
      if (res.ok) {
        const reply = await res.json();
        setReplies((prev) => [...prev, reply]);
        setReplyMessage("");
        setShowReply(false);
        alertSuccess("Đã gửi phản hồi");
        onReload();
      } else {
        alertError("Lỗi khi gửi phản hồi");
      }
    } catch {
      alertError("Lỗi");
    } finally {
      setReplyLoading(false);
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

  return (
    <div
      className={[
        "border p-5 flex flex-col gap-3 transition-colors",
        item.isRead ? "border-border" : "border-primary/40 bg-primary/2",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{item.name}</p>
          <p className="text-xs text-primary truncate mt-0.5">{item.email}</p>
        </div>
        <Badge
          variant={item.isRead ? "secondary" : "destructive"}
          size="sm"
          className="shrink-0"
        >
          {item.isRead ? "Đã đọc" : "Mới"}
        </Badge>
      </div>

      <Separator className="bg-border/60" />

      <div className="flex-1 space-y-1.5">
        <p className="text-sm font-medium leading-snug">
          {item.subject || "Không có tiêu đề"}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {item.message}
        </p>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="space-y-2 border-l-2 border-primary/20 pl-3">
          {replies.map((reply) => (
            <div key={reply.id} className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-primary">
                  {reply.admin?.name || "Admin"}
                </span>
                <span className="text-[0.6rem] text-muted-foreground">
                  {formatDate(reply.createdAt)}
                </span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                {reply.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      {showReply && (
        <div className="space-y-2 border-t border-border pt-2">
          <Textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Viết phản hồi..."
            rows={2}
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleReply} disabled={replyLoading}>
              {replyLoading ? "Đang gửi..." : "Gửi phản hồi"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowReply(false);
                setReplyMessage("");
              }}
            >
              Hủy
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          onClick={async () => {
            try {
              await api.contacts.update(item.id, { isRead: true });
              alertSuccess("Đã đánh dấu đã đọc");
              onReload();
            } catch {
              alertError("Lỗi");
            }
          }}
        >
          <MailCheck className="size-3.5" />
          Đã đọc
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowReply(!showReply)}
        >
          <Reply className="size-3.5" />
          Phản hồi
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Xóa tin nhắn"
          onClick={async () => {
            try {
              await api.contacts.remove(item.id);
              alertSuccess("Đã xóa tin nhắn");
              onReload();
            } catch {
              alertError("Lỗi");
            }
          }}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
