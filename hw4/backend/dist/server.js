"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
// 啟動伺服器
app_1.default.listen(PORT, () => {
    console.log(`🚀 伺服器運行在 http://localhost:${PORT}`);
    console.log(`📊 健康檢查: http://localhost:${PORT}/health`);
    console.log(`🌍 CORS 允許來源: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
// 優雅關閉
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信號，正在關閉伺服器...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('收到 SIGINT 信號，正在關閉伺服器...');
    process.exit(0);
});
