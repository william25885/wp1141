import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { prisma } from "@/lib/prisma";

// 自定義 adapter，讓每個 OAuth provider 建立獨立帳號
export function CustomPrismaAdapter(): Adapter {
  const baseAdapter = PrismaAdapter(prisma);

  return {
    ...baseAdapter,
    // 覆蓋 getUserByEmail，讓它不通過 email 查找用戶
    // 這樣每個 OAuth provider 就會建立新用戶，而不是連結到現有用戶
    async getUserByEmail(email: string) {
      return null;
    },
  } as Adapter;
}

