"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  postId: string;
  initialCount?: number;
  initialLiked?: boolean;
}

export function LikeButton({
  postId,
  initialCount = 0,
  initialLiked = false,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetch(`/api/likes?postId=${postId}`)
        .then((res) => res.json())
        .then((data) => setLiked(data.liked))
        .catch(() => {});
    }
  }, [session, postId]);

  async function handleToggle() {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount((prev) => (data.liked ? prev + 1 : prev - 1));
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
      <Heart
        className={`size-4 transition-colors ${
          liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
        }`}
      />
      <span className={liked ? "text-red-500" : "text-muted-foreground"}>
        {count}
      </span>
    </Button>
  );
}
