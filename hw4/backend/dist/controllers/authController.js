"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: 'file:./prisma/dev.db'
        }
    }
});
// 註冊
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // 驗證輸入
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: '請提供完整的註冊資訊（email、密碼、姓名）'
            });
        }
        // 驗證 email 格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: '請提供有效的 email 格式'
            });
        }
        // 驗證密碼長度
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: '密碼長度至少需要 6 個字元'
            });
        }
        // 檢查 email 是否已存在
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: '此 email 已被註冊'
            });
        }
        // 加密密碼
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // 建立使用者
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });
        // 生成 JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET 環境變數未設定');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, name: user.name }, jwtSecret, { expiresIn: '7d' });
        const response = {
            success: true,
            message: '註冊成功',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                },
                token
            }
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('註冊錯誤:', error);
        res.status(500).json({
            success: false,
            message: '註冊失敗，請稍後再試'
        });
    }
};
exports.register = register;
// 登入
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 驗證輸入
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: '請提供 email 和密碼'
            });
        }
        // 查找使用者
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'email 或密碼錯誤'
            });
        }
        // 驗證密碼
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'email 或密碼錯誤'
            });
        }
        // 生成 JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET 環境變數未設定');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, name: user.name }, jwtSecret, { expiresIn: '7d' });
        const response = {
            success: true,
            message: '登入成功',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                },
                token
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('登入錯誤:', error);
        res.status(500).json({
            success: false,
            message: '登入失敗，請稍後再試'
        });
    }
};
exports.login = login;
// 取得當前使用者資訊
const getMe = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '未授權'
            });
        }
        // 從資料庫取得最新使用者資訊
        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: '使用者不存在'
            });
        }
        res.json({
            success: true,
            message: '取得使用者資訊成功',
            data: { user: userData }
        });
    }
    catch (error) {
        console.error('取得使用者資訊錯誤:', error);
        res.status(500).json({
            success: false,
            message: '取得使用者資訊失敗'
        });
    }
};
exports.getMe = getMe;
// 登出（客戶端處理，這裡只是確認端點）
const logout = async (req, res) => {
    res.json({
        success: true,
        message: '登出成功（請在客戶端刪除 token）'
    });
};
exports.logout = logout;
