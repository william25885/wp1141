"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ReplyFormProps = {
  postId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function ReplyForm({ postId, onSuccess, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const text = content.trim();
    if (!text) return;

    try {
      setLoading(true);
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, replyToId: postId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reply");
        return;
      }
      setContent("");
      router.refresh();
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-3 pt-3 border-t border-slate-800/70">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        className="w-full bg-slate-900/50 text-slate-50 text-[14px] resize-none outline-none rounded-lg px-3 py-2 border border-slate-700/50 focus:border-cyan-400/50"
        rows={2}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <div className="flex justify-end gap-2 mt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-full bg-slate-800 text-sm text-slate-300 hover:bg-slate-700 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-1.5 rounded-full bg-cyan-500/90 text-sm font-semibold text-slate-950 disabled:opacity-50 hover:bg-cyan-400 transition"
        >
          {loading ? "Replying..." : "Reply"}
        </button>
      </div>
    </form>
  );
}

