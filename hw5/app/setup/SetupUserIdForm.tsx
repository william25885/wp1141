"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupUserIdForm() {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleaned = userId.trim().toLowerCase().replace(/^@/, "");

    if (!cleaned) {
      setError("Please enter a userID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: cleaned }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to set userID.");
        return;
      }
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex">
        <span className="px-4 py-3 rounded-l-full bg-gray-900 border border-gray-700 text-gray-400">
          @
        </span>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="flex-1 px-4 py-3 rounded-r-full bg-transparent border border-gray-700 border-l-0 focus:outline-none focus:border-white"
          placeholder="your_name"
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Confirm"}
      </button>
    </form>
  );
}
