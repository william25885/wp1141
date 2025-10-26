// Google Places API 相關的 TypeScript 類型定義

export interface Location {
  lat: number;
  lng: number;
}

export interface PlaceSearchRequest {
  lat: number;
  lng: number;
  radius?: number; // 預設 1000 公尺
}

export interface AddressSearchRequest {
  address: string;
  radius?: number; // 預設 1000 公尺
}

export interface PlaceResult {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  formatted_address?: string;
  geometry: {
    location: Location;
  };
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  price_level?: number;
  vicinity?: string;
}

export interface PlacesSearchResponse {
  results: PlaceResult[];
  status: string;
  next_page_token?: string;
}

export interface GeocodingResult {
  formatted_address: string;
  geometry: {
    location: Location;
  };
  place_id: string;
}

export interface GeocodingResponse {
  results: GeocodingResult[];
  status: string;
}

export interface CoffeeShopData {
  placeId: string;
  name: string;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  address?: string;
  lat: number;
  lng: number;
  openingHours?: string; // JSON 字串
  distance?: number; // 距離（公里）
}

export interface PlacesApiResponse {
  success: boolean;
  message: string;
  data?: {
    coffeeShops: CoffeeShopData[];
    location?: Location;
    address?: string;
  };
}
