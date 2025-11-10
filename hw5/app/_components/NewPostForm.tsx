"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewPostForm() {
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
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to post");
        return;
      }
      setContent("");
      router.refresh(); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="px-4 py-3 border-b border-neutral-800">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full bg-black text-white text-[15px] resize-none outline-none"
        rows={3}
      />
      {error && <p className="text-red-400 text-xs mb-1">{error}</p>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-1.5 rounded-full bg-[#1d9bf0] text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
