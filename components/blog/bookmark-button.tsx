"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookmarkButtonProps {
  postId: string;
  initialBookmarked?: boolean;
}

export function BookmarkButton({
  postId,
  initialBookmarked = false,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetch(`/api/bookmarks?postId=${postId}`)
        .then((res) => res.json())
        .then((data) => setBookmarked(data.bookmarked))
        .catch(() => {});
    }
  }, [session, postId]);

  async function handleToggle() {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarked(data.bookmarked);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={!session || loading}
      className="flex items-center gap-1.5 text-sm"
    >
      <Bookmark
        className={`size-4 transition-colors ${
          bookmarked
            ? "fill-primary text-primary"
            : "text-muted-foreground"
        }`}
      />
      <span className={bookmarked ? "text-primary" : "text-muted-foreground"}>
        {bookmarked ? "Đã lưu" : "Lưu"}
      </span>
    </Button>
  );
}
