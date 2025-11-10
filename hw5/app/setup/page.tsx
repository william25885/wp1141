import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

interface Props {
  searchParams: { error?: string };
}

export default async function SetupPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { userId: true },
  });

  if (me?.userId) redirect("/");

  let errorMessage = "";
  if (searchParams.error === "taken") {
    errorMessage = "This userID is already taken. 請換一個。";
  } else if (searchParams.error === "invalid") {
    errorMessage =
      "UserID 僅能使用小寫英文、數字、底線，長度 3-20。";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        className="bg-neutral-900 p-8 rounded-2xl w-[340px] space-y-4"
        action="/api/setup-userid"
        method="POST"
      >
        <h1 className="text-2xl font-bold mb-2">Choose your userID</h1>
        <p className="text-sm text-neutral-400 mb-2">
          你的公開帳號
        </p>

        <input
          name="userId"
          placeholder="your id"
          className="w-full px-3 py-2 rounded bg-black border border-neutral-700"
          required
        />

        {errorMessage && (
          <p className="text-red-400 text-sm">{errorMessage}</p>
        )}

        <button
          type="submit"
          className="w-full bg-white text-black font-semibold py-2 rounded-full mt-2"
        >
          Save
        </button>
      </form>
    </main>
  );
}
