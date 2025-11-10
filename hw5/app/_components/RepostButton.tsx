"use client";

import { useState, useTransition } from "react";

type RepostButtonProps = {
  postId: string;
  initialCount: number;
  initialReposted: boolean;
};

export function RepostButton({
  postId,
  initialCount,
  initialReposted,
}: RepostButtonProps) {
  const [reposted, setReposted] = useState(initialReposted);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    if (isPending) return;

    startTransition(async () => {
      const res = await fetch(`/api/posts/${postId}/repost`, {
        method: "POST",
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setReposted(data.reposted);
      setCount(data.count);
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="
        flex items-center gap-1.5
        hover:text-cyan-400
        transition-colors
        disabled:opacity-50
      "
    >
      <span className={`text-lg leading-none ${reposted ? "text-cyan-400" : ""}`}>
        🌊
      </span>
      <span>{count}</span>
    </button>
  );
}

