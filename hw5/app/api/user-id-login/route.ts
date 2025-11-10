import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { error: "Please enter your userID." },
      { status: 400 }
    );
  }

  const cleaned = userId.trim().toLowerCase().replace(/^@/, "");

  const user = await prisma.user.findUnique({
    where: { userId: cleaned },
    include: { accounts: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  }

  if (!user.accounts.length) {
    return NextResponse.json(
      { error: "No OAuth provider linked for this user." },
      { status: 400 }
    );
  }

  const provider = user.accounts[0].provider;

  return NextResponse.json({ provider });
}
