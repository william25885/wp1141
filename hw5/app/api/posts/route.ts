import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, replyToId } = await req.json();
  const text = String(content || "").trim();

  if (!text) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 },
    );
  }

  // 使用 session 中的用戶 ID（已在 session callback 中設置）
  const userId = (session.user as any).id;
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, userId: true },
  });
  
  if (!me?.userId) {
    return NextResponse.json(
      { error: "Please finish setup" },
      { status: 400 },
    );
  }

  const post = await prisma.post.create({
    data: {
      authorId: me.id,
      content: text,
      replyToId: replyToId || null,
    },
  });

  return NextResponse.json({ post });
}
