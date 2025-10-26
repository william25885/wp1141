// 前端類型定義

// 使用者相關類型
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// 咖啡廳相關類型
export interface CoffeeShop {
  placeId: string;
  name: string;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  address?: string;
  lat: number;
  lng: number;
  openingHours?: string;
  distance?: number;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface PlacesSearchResponse {
  success: boolean;
  message: string;
  data: {
    coffeeShops: CoffeeShop[];
    location?: Location;
    address?: string;
  };
}

// 收藏功能相關類型
export interface FavoriteList {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  favoriteItems?: FavoriteItem[];
}

export interface FavoriteItem {
  id: string;
  listId: string;
  placeId: string;
  placeName: string;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  address?: string;
  distance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteListResponse {
  success: boolean;
  message: string;
  data: FavoriteList[];
}

export interface CreateFavoriteListRequest {
  name: string;
}

export interface AddToFavoriteRequest {
  listId: string;
  placeId: string;
  placeName: string;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  address?: string;
  distance?: number;
}

// API 回應通用類型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// 認證狀態類型
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 應用程式狀態類型
export interface AppState {
  auth: AuthState;
  coffeeShops: CoffeeShop[];
  favoriteLists: FavoriteList[];
  currentLocation: Location | null;
  searchAddress: string;
  isLoading: boolean;
  error: string | null;
}
