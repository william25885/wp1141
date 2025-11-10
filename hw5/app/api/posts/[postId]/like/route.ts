import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ postId: string }>;
};

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { postId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 使用 session 中的用戶 ID（已在 session callback 中設置）
  const userId = (session.user as any).id;
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const me = { id: userId };


  const existing = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: me.id,
        postId,
      },
    },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_postId: { userId: me.id, postId } },
    });
  } else {
    await prisma.like.create({
      data: { userId: me.id, postId },
    });
  }

  const count = await prisma.like.count({ where: { postId } });

  return NextResponse.json({ liked: !existing, count });
}
