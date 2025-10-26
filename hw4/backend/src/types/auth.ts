// 認證相關的 TypeScript 類型定義

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
    };
    token: string;
  };
}

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}
