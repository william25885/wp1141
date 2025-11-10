import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await req.json();
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user || !user.email) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, email: user.email });
}
