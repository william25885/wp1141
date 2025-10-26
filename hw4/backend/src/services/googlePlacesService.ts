import axios from 'axios';
import dotenv from 'dotenv';
import { 
  PlaceSearchRequest, 
  AddressSearchRequest, 
  PlacesSearchResponse, 
  GeocodingResponse, 
  PlaceResult,
  Location,
  CoffeeShopData 
} from '../types/places';

// 載入環境變數
dotenv.config({ path: './env' });

class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('GOOGLE_PLACES_API_KEY 環境變數未設定');
    }
  }

  // 地址轉經緯度
  async geocodeAddress(address: string): Promise<Location | null> {
    try {
      const response = await axios.get<GeocodingResponse>(`${this.baseUrl}/geocode/json`, {
        params: {
          address,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        };
      }

      console.error('Geocoding 失敗:', response.data.status);
      return null;
    } catch (error) {
      console.error('Geocoding API 錯誤:', error);
      return null;
    }
  }

  // 搜尋附近咖啡廳
  async searchNearbyCoffeeShops(request: PlaceSearchRequest): Promise<PlaceResult[]> {
    try {
      const { lat, lng, radius = 1000 } = request;

      console.log(`🔍 Google Places API 搜尋: 位置(${lat}, ${lng}), 範圍 ${radius}m`);

      // 搜尋多個關鍵字：coffee, 咖啡, 咖啡廳
      const keywords = ['coffee', '咖啡', '咖啡廳'];
      const allResults: PlaceResult[] = [];

      for (const keyword of keywords) {
        try {
          console.log(`🔍 搜尋關鍵字: "${keyword}"`);
          
          const response = await axios.get<PlacesSearchResponse>(`${this.baseUrl}/place/nearbysearch/json`, {
            params: {
              location: `${lat},${lng}`,
              radius,
              type: 'cafe',
              keyword: keyword,
              key: this.apiKey
            }
          });

          console.log(`📊 關鍵字 "${keyword}" 回應: ${response.data.status}, 結果數量: ${response.data.results?.length || 0}`);

          if (response.data.status === 'OK') {
            const results = response.data.results || [];
            allResults.push(...results);
            console.log(`✅ 關鍵字 "${keyword}" 找到 ${results.length} 個結果`);
          } else if (response.data.status === 'ZERO_RESULTS') {
            console.log(`⚠️ 關鍵字 "${keyword}" 沒有找到結果`);
          } else if (response.data.status === 'OVER_QUERY_LIMIT') {
            console.error(`❌ 關鍵字 "${keyword}" 查詢限制已達上限`);
            break; // 停止搜尋其他關鍵字
          } else if (response.data.status === 'REQUEST_DENIED') {
            console.error('❌ Google Places API 請求被拒絕，請檢查 API Key');
            return [];
          } else if (response.data.status === 'INVALID_REQUEST') {
            console.error('❌ Google Places API 請求無效，請檢查參數');
            return [];
          } else {
            console.error(`❌ 關鍵字 "${keyword}" API 錯誤: ${response.data.status}`);
          }

          // 等待 100ms 避免 API 限制
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          console.error(`❌ 關鍵字 "${keyword}" 請求錯誤:`, error);
        }
      }

      // 去重：使用 place_id 作為唯一識別
      const uniqueResults = allResults.filter((place, index, self) => 
        index === self.findIndex(p => p.place_id === place.place_id)
      );

      console.log(`📊 總搜尋結果: ${allResults.length} 個，去重後: ${uniqueResults.length} 個咖啡廳`);

      return uniqueResults;

    } catch (error) {
      console.error('❌ Google Places API 請求錯誤:', error);
      return [];
    }
  }

  // 取得地點詳細資訊
  async getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/place/details/json`, {
        params: {
          place_id: placeId,
          fields: 'place_id,name,rating,user_ratings_total,formatted_phone_number,formatted_address,geometry,opening_hours,photos,price_level,vicinity',
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK') {
        return response.data.result;
      }

      console.error('Place Details API 錯誤:', response.data.status);
      return null;
    } catch (error) {
      console.error('Place Details API 請求錯誤:', error);
      return null;
    }
  }

  // 計算兩點間距離（公里）
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // 地球半徑（公里）
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // 轉換 PlaceResult 為 CoffeeShopData
  convertToCoffeeShopData(place: PlaceResult, userLocation?: Location): CoffeeShopData {
    const coffeeShop: CoffeeShopData = {
      placeId: place.place_id,
      name: place.name,
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      phone: place.formatted_phone_number,
      address: place.formatted_address || place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      openingHours: place.opening_hours ? JSON.stringify(place.opening_hours) : undefined
    };

    // 計算距離
    if (userLocation) {
      coffeeShop.distance = this.calculateDistance(
        userLocation.lat,
        userLocation.lng,
        place.geometry.location.lat,
        place.geometry.location.lng
      );
    }

    return coffeeShop;
  }
}

export default new GooglePlacesService();
