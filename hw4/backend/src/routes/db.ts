import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// 測試資料庫連線
router.get('/test', async (req, res) => {
  try {
    // 測試連線
    await prisma.$connect();
    
    // 使用原始 SQL 查詢表格
    const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table';`;
    
    res.json({
      status: 'success',
      message: '資料庫連線正常',
      data: {
        tables: tables,
        databaseUrl: process.env.DATABASE_URL
      }
    });
  } catch (error) {
    console.error('資料庫連線測試失敗:', error);
    res.status(500).json({
      status: 'error',
      message: '資料庫連線失敗',
      error: error instanceof Error ? error.message : '未知錯誤'
    });
  }
});

export default router;
