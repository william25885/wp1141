import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  PlacesSearchResponse,
  FavoriteListResponse,
  CreateFavoriteListRequest,
  AddToFavoriteRequest,
  ApiResponse,
  CoffeeShop
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 請求攔截器 - 自動添加 token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 回應攔截器 - 處理錯誤
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token 過期或無效，清除本地儲存
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== 認證相關 API ====================

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', data);
    return response.data;
  }

  async getMe(): Promise<ApiResponse<{ user: any }>> {
    const response: AxiosResponse<ApiResponse<{ user: any }>> = await this.api.get('/auth/me');
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post('/auth/logout');
    return response.data;
  }

  // ==================== 咖啡廳搜尋 API ====================

  async searchNearby(lat: number, lng: number, radius: number = 1000): Promise<PlacesSearchResponse> {
    const response: AxiosResponse<PlacesSearchResponse> = await this.api.get('/places/nearby', {
      params: { lat, lng, radius }
    });
    return response.data;
  }

  async searchByAddress(address: string, radius: number = 1000): Promise<PlacesSearchResponse> {
    const response: AxiosResponse<PlacesSearchResponse> = await this.api.get('/places/search', {
      params: { address, radius }
    });
    return response.data;
  }

  async getPlaceDetails(placeId: string): Promise<ApiResponse<{ coffeeShop: CoffeeShop }>> {
    const response: AxiosResponse<ApiResponse<{ coffeeShop: CoffeeShop }>> = await this.api.get(`/places/details/${placeId}`);
    return response.data;
  }

  // ==================== 收藏功能 API ====================

  async getFavoriteLists(): Promise<FavoriteListResponse> {
    const response: AxiosResponse<FavoriteListResponse> = await this.api.get('/favorites/lists');
    return response.data;
  }

  async createFavoriteList(data: CreateFavoriteListRequest): Promise<ApiResponse<{ id: string; name: string; userId: string; createdAt: string; updatedAt: string }>> {
    const response: AxiosResponse<ApiResponse<{ id: string; name: string; userId: string; createdAt: string; updatedAt: string }>> = await this.api.post('/favorites/lists', data);
    return response.data;
  }

  async updateFavoriteList(id: string, data: CreateFavoriteListRequest): Promise<ApiResponse<{ id: string; name: string; userId: string; createdAt: string; updatedAt: string }>> {
    const response: AxiosResponse<ApiResponse<{ id: string; name: string; userId: string; createdAt: string; updatedAt: string }>> = await this.api.put(`/favorites/lists/${id}`, data);
    return response.data;
  }

  async deleteFavoriteList(id: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/favorites/lists/${id}`);
    return response.data;
  }

  async getFavoriteItems(listId: string): Promise<ApiResponse<any[]>> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get(`/favorites/lists/${listId}/items`);
    return response.data;
  }

  async addToFavorite(data: AddToFavoriteRequest): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.post('/favorites/items', data);
    return response.data;
  }

  async removeFromFavorite(itemId: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/favorites/items/${itemId}`);
    return response.data;
  }

  async checkFavoriteStatus(placeId: string): Promise<ApiResponse<{ isFavorite: boolean; favoriteLists: Array<{ id: string; name: string }> }>> {
    const response: AxiosResponse<ApiResponse<{ isFavorite: boolean; favoriteLists: Array<{ id: string; name: string }> }>> = await this.api.get(`/favorites/check/${placeId}`);
    return response.data;
  }
}

// 建立單例實例
export const apiService = new ApiService();
export default apiService;
