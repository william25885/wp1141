import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config({ path: './env' });

// 全域變數，避免在開發環境中重複建立連線
declare global {
  var __prisma: PrismaClient | undefined;
}

// 建立 Prisma Client 實例
export const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// 在開發環境中，將實例存到全域變數以避免重複建立
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

// 優雅關閉連線
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
