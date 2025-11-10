"use client";

import { useState, useTransition } from "react";

type LikeButtonProps = {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
};

export function LikeButton({
  postId,
  initialCount,
  initialLiked,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    if (isPending) return;

    startTransition(async () => {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="
        flex items-center gap-1
        hover:text-pink-500
        transition-colors
        disabled:opacity-50
      "
    >
      <span className={liked ? "text-pink-500" : ""}>♥</span>
      <span>{count}</span>
    </button>
  );
}
