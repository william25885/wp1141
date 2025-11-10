import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { userId } = await req.json();
  if (typeof userId !== "string") {
    return NextResponse.json({ error: "Invalid userID" }, { status: 400 });
  }

  const cleaned = userId.trim().toLowerCase();
  const rule = /^[a-z0-9_]{3,15}$/;
  if (!rule.test(cleaned)) {
    return NextResponse.json(
      {
        error:
          "UserID must be 3-15 characters, letters/numbers/underscore only.",
      },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findUnique({ where: { userId: cleaned } });
  if (exists) {
    return NextResponse.json(
      { error: "This userID is already taken." },
      { status: 409 }
    );
  }

  // 使用 session 中的用戶 ID（已在 session callback 中設置）
  const userId = (session.user as any).id;
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { userId: cleaned },
  });

  return NextResponse.json({ ok: true });
}
