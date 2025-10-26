"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
// 載入環境變數
dotenv_1.default.config({ path: './env' });
class GooglePlacesService {
    constructor() {
        this.baseUrl = 'https://maps.googleapis.com/maps/api';
        this.apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('GOOGLE_PLACES_API_KEY 環境變數未設定');
        }
    }
    // 地址轉經緯度
    async geocodeAddress(address) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/geocode/json`, {
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
        }
        catch (error) {
            console.error('Geocoding API 錯誤:', error);
            return null;
        }
    }
    // 搜尋附近咖啡廳
    async searchNearbyCoffeeShops(request) {
        try {
            const { lat, lng, radius = 1000 } = request;
            const response = await axios_1.default.get(`${this.baseUrl}/place/nearbysearch/json`, {
                params: {
                    location: `${lat},${lng}`,
                    radius,
                    type: 'cafe',
                    keyword: 'coffee',
                    key: this.apiKey
                }
            });
            if (response.data.status === 'OK') {
                return response.data.results;
            }
            else if (response.data.status === 'ZERO_RESULTS') {
                console.log('附近沒有找到咖啡廳');
                return [];
            }
            else {
                console.error('Places API 錯誤:', response.data.status);
                return [];
            }
        }
        catch (error) {
            console.error('Places API 請求錯誤:', error);
            return [];
        }
    }
    // 取得地點詳細資訊
    async getPlaceDetails(placeId) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/place/details/json`, {
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
        }
        catch (error) {
            console.error('Place Details API 請求錯誤:', error);
            return null;
        }
    }
    // 計算兩點間距離（公里）
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // 地球半徑（公里）
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    // 轉換 PlaceResult 為 CoffeeShopData
    convertToCoffeeShopData(place, userLocation) {
        const coffeeShop = {
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
            coffeeShop.distance = this.calculateDistance(userLocation.lat, userLocation.lng, place.geometry.location.lat, place.geometry.location.lng);
        }
        return coffeeShop;
    }
}
exports.default = new GooglePlacesService();
