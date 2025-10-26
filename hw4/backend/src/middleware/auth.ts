import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload, AuthenticatedRequest } from '../types/auth';

// 擴展 Request 介面以包含 user 屬性
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, jwtSecret) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT 驗證失敗:', error);
    return res.status(403).json({
      success: false,
      message: '無效的存取權杖'
    });
  }
};

// 可選的認證中間件（不強制要求登入）
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, jwtSecret) as UserPayload;
    req.user = decoded;
  } catch (error) {
    // 忽略錯誤，繼續執行
  }
  
  next();
};
