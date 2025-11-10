type ReplyItemProps = {
  reply: {
    id: string;
    content: string;
    createdAt: Date;
    author: { userId: string | null; name: string | null; image: string | null };
  };
};

export function ReplyItem({ reply }: ReplyItemProps) {
  return (
    <div className="mt-3 pt-3 border-t border-slate-800/50 flex gap-3">
      <a href={`/${reply.author.userId}`}>
        <img
          src={reply.author.image ?? "/default-avatar.png"}
          alt={reply.author.userId ?? "User"}
          className="w-7 h-7 rounded-full object-cover bg-slate-800"
        />
      </a>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="font-semibold">
            {reply.author.name ?? reply.author.userId}
          </span>
          <span className="text-slate-500">
            @{reply.author.userId}
          </span>
          <span className="text-slate-500 text-[9px]">
            · {new Date(reply.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="mt-1 text-[13px] leading-snug whitespace-pre-wrap text-slate-300">
          {reply.content}
        </p>
      </div>
    </div>
  );
}

