"use client";

import { useState } from "react";
import { ReplyForm } from "./ReplyForm";

type ReplyButtonProps = {
  postId: string;
  replyCount: number;
};

export function ReplyButton({ postId, replyCount }: ReplyButtonProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowReplyForm(!showReplyForm)}
        className="
          flex items-center gap-1.5
          hover:text-purple-400
          transition-colors
        "
      >
        <span className="text-lg leading-none">💬</span>
        <span>{replyCount}</span>
      </button>
      {showReplyForm && (
        <div className="w-full mt-3 -ml-12">
          <ReplyForm
            postId={postId}
            onSuccess={() => setShowReplyForm(false)}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </>
  );
}

