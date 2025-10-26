"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
// 載入環境變數
dotenv_1.default.config({ path: './env' });
// 建立 Prisma Client 實例
exports.prisma = globalThis.__prisma || new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
        }
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
// 在開發環境中，將實例存到全域變數以避免重複建立
if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = exports.prisma;
}
// 優雅關閉連線
process.on('beforeExit', async () => {
    await exports.prisma.$disconnect();
});
