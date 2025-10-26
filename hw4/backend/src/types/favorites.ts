// 收藏功能相關的 TypeScript 類型定義

export interface CreateFavoriteListRequest {
  name: string;
}

export interface UpdateFavoriteListRequest {
  name: string;
}

export interface FavoriteListResponse {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  favoriteItems?: FavoriteItemResponse[];
}

export interface CreateFavoriteItemRequest {
  placeId: string;
  placeName: string;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  address?: string;
  distance?: number;
}

export interface FavoriteItemResponse {
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

export interface FavoritesApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface FavoriteListWithItems extends FavoriteListResponse {
  favoriteItems: FavoriteItemResponse[];
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
