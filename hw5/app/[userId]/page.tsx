import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { userId },
    include: {
      _count: {
        select: { posts: true, followers: true, following: true },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!user) notFound();

  return (
    <main className="min-h-screen relative overflow-hidden text-slate-50">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/pexels-ryank-12015345.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/78 backdrop-blur-sm" />

      <div className="relative z-10 min-h-screen px-4 py-8 flex justify-center">
        <div className="w-full max-w-4xl space-y-6">
          <header className="rounded-3xl px-6 py-6 bg-slate-950/92 border border-slate-800/80 shadow-[0_18px_55px_rgba(0,0,0,0.9)] space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.image ?? "/default-avatar.png"}
                  alt={user.userId ?? "User"}
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-800"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold truncate">
                  {user.name ?? user.userId}
                </h1>
                <p className="text-sm text-sky-400 truncate">
                  @{user.userId}
                </p>
              </div>
            </div>

            {user.bio && (
              <p className="text-sm text-slate-300 leading-relaxed">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-5 text-xs text-slate-400">
              <div>
                <span className="font-semibold text-slate-50 mr-1">
                  {user._count.posts}
                </span>
                Posts
              </div>
              <div>
                <span className="font-semibold text-slate-50 mr-1">
                  {user._count.followers}
                </span>
                Followers
              </div>
              <div>
                <span className="font-semibold text-slate-50 mr-1">
                  {user._count.following}
                </span>
                Following
              </div>
            </div>
          </header>

          <section className="rounded-3xl bg-slate-950/90 border border-slate-850/80 shadow-[0_14px_40px_rgba(0,0,0,0.85)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-900/80 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">
                Recent posts
              </h2>
              <span className="text-[10px] text-slate-500">
              </span>
            </div>

            {user.posts.length === 0 ? (
              <div className="px-6 py-10 text-sm text-slate-500 text-center">
                沒貼文
              </div>
            ) : (
              <ul className="divide-y divide-slate-900/90">
                {user.posts.map((post: { id: string; content: string; createdAt: Date }) => (
                  <li
                    key={post.id}
                    className="px-6 py-4 hover:bg-slate-900/85 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span>貼文</span>
                      <span>
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-50 whitespace-pre-wrap leading-snug">
                      {post.content}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
