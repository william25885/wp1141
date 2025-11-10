"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-4 py-1.5 rounded-full border border-red-500/70 text-red-400 text-xs font-medium hover:bg-red-500/10 transition"
    >
      Logout
    </button>
  );
}
