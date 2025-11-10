"use client";

import { signOut } from "next-auth/react";

interface Props {
  name?: string | null;
  userId?: string | null;
  image?: string | null;
}

export function AccountMenu({ name, userId, image }: Props) {
  return (
    <div className="mt-10 flex items-center justify-between gap-3 p-2 rounded-full hover:bg-neutral-900 cursor-pointer">
      <div className="flex items-center gap-3">
        <img
          src={image || "/default-avatar.png"}
          className="w-8 h-8 rounded-full bg-neutral-700"
        />
        <div className="flex flex-col text-sm">
          <span className="font-semibold truncate max-w-[120px]">
            {name || userId}
          </span>
          <span className="text-neutral-500 text-xs">@{userId}</span>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-xs text-red-400 px-2 py-1 rounded-full border border-red-500 hover:bg-red-500 hover:text-white"
      >
        Logout
      </button>
    </div>
  );
}
