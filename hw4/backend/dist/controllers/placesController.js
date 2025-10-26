"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanCache = exports.getPlaceDetails = exports.searchByAddress = exports.searchNearby = void 0;
const googlePlacesService_1 = __importDefault(require("../services/googlePlacesService"));
const coffeeShopCacheService_1 = __importDefault(require("../services/coffeeShopCacheService"));
// 根據經緯度搜尋附近咖啡廳
const searchNearby = async (req, res) => {
    try {
        const { lat, lng, radius = 1000 } = req.query;
        // 驗證輸入
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: '請提供經緯度座標'
            });
        }
        const latitude = parseFloat(String(lat));
        const longitude = parseFloat(String(lng));
        const searchRadius = parseInt(String(radius)) || 1000;
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: '經緯度格式不正確'
            });
        }
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({
                success: false,
                message: '經緯度範圍不正確'
            });
        }
        const userLocation = { lat: latitude, lng: longitude };
        // 搜尋附近咖啡廳
        const places = await googlePlacesService_1.default.searchNearbyCoffeeShops({
            lat: latitude,
            lng: longitude,
            radius: searchRadius
        });
        if (places.length === 0) {
            return res.json({
                success: true,
                message: '附近沒有找到咖啡廳',
                data: {
                    coffeeShops: [],
                    location: userLocation
                }
            });
        }
        // 轉換為 CoffeeShopData 格式
        const coffeeShops = places.map(place => googlePlacesService_1.default.convertToCoffeeShopData(place, userLocation));
        // 按距離排序
        coffeeShops.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        // 快取資料
        await coffeeShopCacheService_1.default.cacheCoffeeShops(coffeeShops);
        const response = {
            success: true,
            message: `找到 ${coffeeShops.length} 間咖啡廳`,
            data: {
                coffeeShops,
                location: userLocation
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('搜尋附近咖啡廳錯誤:', error);
        res.status(500).json({
            success: false,
            message: '搜尋咖啡廳失敗，請稍後再試'
        });
    }
};
exports.searchNearby = searchNearby;
// 根據地址搜尋附近咖啡廳
const searchByAddress = async (req, res) => {
    try {
        const { address, radius = 1000 } = req.query;
        // 驗證輸入
        if (!address) {
            return res.status(400).json({
                success: false,
                message: '請提供地址'
            });
        }
        const searchRadius = parseInt(String(radius)) || 1000;
        // 地址轉經緯度
        const location = await googlePlacesService_1.default.geocodeAddress(address);
        if (!location) {
            return res.status(400).json({
                success: false,
                message: '無法找到該地址，請檢查地址是否正確'
            });
        }
        // 搜尋附近咖啡廳
        const places = await googlePlacesService_1.default.searchNearbyCoffeeShops({
            lat: location.lat,
            lng: location.lng,
            radius: searchRadius
        });
        if (places.length === 0) {
            return res.json({
                success: true,
                message: '該地址附近沒有找到咖啡廳',
                data: {
                    coffeeShops: [],
                    location,
                    address: address
                }
            });
        }
        // 轉換為 CoffeeShopData 格式
        const coffeeShops = places.map(place => googlePlacesService_1.default.convertToCoffeeShopData(place, location));
        // 按距離排序
        coffeeShops.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        // 快取資料
        await coffeeShopCacheService_1.default.cacheCoffeeShops(coffeeShops);
        const response = {
            success: true,
            message: `在 ${address} 附近找到 ${coffeeShops.length} 間咖啡廳`,
            data: {
                coffeeShops,
                location,
                address: address
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('根據地址搜尋咖啡廳錯誤:', error);
        res.status(500).json({
            success: false,
            message: '搜尋咖啡廳失敗，請稍後再試'
        });
    }
};
exports.searchByAddress = searchByAddress;
// 取得地點詳細資訊
const getPlaceDetails = async (req, res) => {
    try {
        const { placeId } = req.params;
        if (!placeId) {
            return res.status(400).json({
                success: false,
                message: '請提供地點 ID'
            });
        }
        // 先檢查快取
        const cached = await coffeeShopCacheService_1.default.getCachedCoffeeShop(placeId);
        if (cached) {
            return res.json({
                success: true,
                message: '取得地點詳細資訊成功（快取）',
                data: { coffeeShop: cached }
            });
        }
        // 從 Google Places API 取得詳細資訊
        const placeDetails = await googlePlacesService_1.default.getPlaceDetails(placeId);
        if (!placeDetails) {
            return res.status(404).json({
                success: false,
                message: '找不到該地點'
            });
        }
        // 轉換為 CoffeeShopData 格式
        const coffeeShop = googlePlacesService_1.default.convertToCoffeeShopData(placeDetails);
        // 快取資料
        await coffeeShopCacheService_1.default.cacheCoffeeShop(coffeeShop);
        res.json({
            success: true,
            message: '取得地點詳細資訊成功',
            data: { coffeeShop }
        });
    }
    catch (error) {
        console.error('取得地點詳細資訊錯誤:', error);
        res.status(500).json({
            success: false,
            message: '取得地點詳細資訊失敗'
        });
    }
};
exports.getPlaceDetails = getPlaceDetails;
// 清理快取
const cleanCache = async (req, res) => {
    try {
        const cleanedCount = await coffeeShopCacheService_1.default.cleanExpiredCache();
        res.json({
            success: true,
            message: `清理快取完成，共清理 ${cleanedCount} 個過期項目`
        });
    }
    catch (error) {
        console.error('清理快取錯誤:', error);
        res.status(500).json({
            success: false,
            message: '清理快取失敗'
        });
    }
};
exports.cleanCache = cleanCache;
