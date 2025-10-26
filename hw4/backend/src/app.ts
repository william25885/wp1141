import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbRoutes from './routes/db';
import authRoutes from './routes/auth';
import placesRoutes from './routes/places';
import favoritesRoutes from './routes/favorites';

// 載入環境變數
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// 中間件設定 - 簡化 CORS 設定
app.use(cors({
  origin: true, // 允許所有來源（開發環境）
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 基本路由
app.get('/', (req, res) => {
  res.json({ 
    message: '咖啡廳搜尋 API 伺服器運行中',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API 路由
app.use('/api/db', dbRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/favorites', favoritesRoutes);

// 404 處理
app.use((req, res) => {
  res.status(404).json({ 
    error: '找不到請求的端點',
    path: req.originalUrl 
  });
});

// 錯誤處理中間件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('伺服器錯誤:', err);
  res.status(500).json({ 
    error: '內部伺服器錯誤',
    message: process.env.NODE_ENV === 'development' ? err.message : '請稍後再試'
  });
});

export default app;
