import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NewPostForm } from "./_components/NewPostForm";
import { LikeButton } from "./_components/LikeButton";
import { LogoutButton } from "./_components/LogoutButton";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, userId: true, name: true, image: true, bio: true },
  });

  if (!me?.userId) redirect("/setup");

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { userId: true, name: true, image: true } },
      likes: { where: { userId: me.id }, select: { id: true } },
      _count: { select: { likes: true, reposts: true, replies: true } },
    },
    take: 50,
  });

  return (
    <main className="min-h-screen relative text-slate-50">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/pexels-jess-vide-4321504.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-slate-950/90 backdrop-blur-[2px]" />

      <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-[0.15em] text-slate-300 uppercase">
          </span>
          <span className="text-xs text-slate-500">
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-20">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-950/85 border border-red-500/40 shadow-lg">
          <img
            src={me!.image ?? "/default-avatar.png"}
            alt={me!.userId}
            className="w-9 h-9 rounded-full object-cover bg-slate-800"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">
              {me!.name ?? me!.userId}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              @{me!.userId}
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="relative z-10 flex items-start justify-center px-4 pt-16 pb-10">
        <div className="w-full max-w-5xl">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-semibold">Home</h1>
              <span className="text-[10px] text-slate-400">
              </span>
            </div>
            <nav className="flex items-center gap-2 text-xs">
              <a
                href="/"
                className="px-3 py-1.5 rounded-full bg-cyan-500/90 text-slate-950 font-semibold shadow hover:bg-cyan-400 transition"
              >
                Home
              </a>
              <a
                href={`/${me!.userId}`}
                className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-600 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 transition"
              >
                Profile
              </a>
            </nav>
          </div>

          <div className="rounded-3xl bg-slate-950/88 border border-slate-800/80 backdrop-blur-xl shadow-[0_26px_80px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800/70">
              <NewPostForm />
            </div>

            <div>
              {posts.length === 0 && (
                <div className="px-5 py-10 text-center text-sm text-slate-500">
                </div>
              )}

              {posts.map((post) => (
                <article
                  key={post.id}
                  className="px-5 py-4 border-b border-slate-900/80 hover:bg-slate-900/70 transition"
                >
                  <div className="flex gap-3">
                    <a href={`/${post.author.userId}`}>
                      <img
                        src={post.author.image ?? "/default-avatar.png"}
                        alt={post.author.userId}
                        className="w-9 h-9 rounded-full object-cover bg-slate-800"
                      />
                    </a>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="font-semibold">
                          {post.author.name ?? post.author.userId}
                        </span>
                        <span className="text-slate-500">
                          @{post.author.userId}
                        </span>
                        <span className="text-slate-500 text-[9px]">
                          · {new Date(post.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="mt-1 text-[14px] leading-snug whitespace-pre-wrap">
                        {post.content}
                      </p>

                      <div className="mt-2 flex gap-7 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5 cursor-default">
                          <span className="text-lg leading-none">💬</span>
                          <span>{post._count.replies}</span>
                        </div>
                        <div className="flex items-center gap-1.5 cursor-default">
                          <span className="text-lg leading-none">🌊</span>
                          <span>{post._count.reposts}</span>
                        </div>
                        <LikeButton
                          postId={post.id}
                          initialCount={post._count.likes}
                          initialLiked={post.likes.length > 0}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
