import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const formData = await req.formData();
  let userId = String(formData.get("userId") || "").trim();


  userId = userId.toLowerCase().replace(/^@/, "");


  if (!/^[a-z0-9_]{3,20}$/.test(userId)) {
    return NextResponse.redirect(
      new URL(`/setup?error=invalid`, req.url),
    );
  }


  const exists = await prisma.user.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (exists) {
    return NextResponse.redirect(
      new URL(`/setup?error=taken`, req.url),
    );
  }


  // 使用 session 中的用戶 ID（已在 session callback 中設置）
  const userDbId = (session.user as any).id;
  if (!userDbId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  await prisma.user.update({
    where: { id: userDbId },
    data: { userId },
  });

  return NextResponse.redirect(new URL("/", req.url));
}
