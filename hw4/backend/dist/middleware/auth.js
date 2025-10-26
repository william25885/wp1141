"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({
            success: false,
            message: '缺少存取權杖'
        });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT_SECRET 環境變數未設定');
        return res.status(500).json({
            success: false,
            message: '伺服器設定錯誤'
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('JWT 驗證失敗:', error);
        return res.status(403).json({
            success: false,
            message: '無效的存取權杖'
        });
    }
};
exports.authenticateToken = authenticateToken;
// 可選的認證中間件（不強制要求登入）
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return next(); // 沒有 token 也繼續執行
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
    }
    catch (error) {
        // 忽略錯誤，繼續執行
    }
    next();
};
exports.optionalAuth = optionalAuth;
