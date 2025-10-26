"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./routes/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const places_1 = __importDefault(require("./routes/places"));
const favorites_1 = __importDefault(require("./routes/favorites"));
// 載入環境變數
dotenv_1.default.config({ path: './env' });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// 中間件設定
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
app.use('/api/db', db_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/places', places_1.default);
app.use('/api/favorites', favorites_1.default);
// 404 處理
app.use((req, res) => {
    res.status(404).json({
        error: '找不到請求的端點',
        path: req.originalUrl
    });
});
// 錯誤處理中間件
app.use((err, req, res, next) => {
    console.error('伺服器錯誤:', err);
    res.status(500).json({
        error: '內部伺服器錯誤',
        message: process.env.NODE_ENV === 'development' ? err.message : '請稍後再試'
    });
});
exports.default = app;
