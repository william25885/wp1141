import { Request, Response } from 'express';
import googlePlacesService from '../services/googlePlacesService';
import coffeeShopCacheService from '../services/coffeeShopCacheService';
import { PlaceSearchRequest, AddressSearchRequest, PlacesApiResponse } from '../types/places';

// 根據經緯度搜尋附近咖啡廳
export const searchNearby = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 1000 }: PlaceSearchRequest = req.query as any;

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

    // 搜尋附近咖啡廳 - 直接使用指定範圍
    console.log(`🔍 搜尋咖啡廳: 位置(${latitude}, ${longitude}), 範圍 ${searchRadius}m`);
    
    const places = await googlePlacesService.searchNearbyCoffeeShops({
      lat: latitude,
      lng: longitude,
      radius: searchRadius
    });

    if (places.length === 0) {
      return res.json({
        success: true,
        message: `附近 ${searchRadius}m 範圍內沒有找到咖啡廳，建議嘗試其他地址或擴大搜尋範圍`,
        data: {
          coffeeShops: [],
          location: userLocation,
          searchRadius: searchRadius
        }
      });
    }

    // 轉換為 CoffeeShopData 格式
    const allCoffeeShops = places.map(place => 
      googlePlacesService.convertToCoffeeShopData(place, userLocation)
    );

    // 精確篩選：只保留在指定範圍內的咖啡廳
    const coffeeShops = allCoffeeShops.filter(shop => {
      if (!shop.distance) return false;
      // 將距離從公里轉換為公尺進行比較
      return shop.distance * 1000 <= searchRadius;
    });

    // 按距離排序
    coffeeShops.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    // 快取資料
    await coffeeShopCacheService.cacheCoffeeShops(coffeeShops);

    const response: PlacesApiResponse = {
      success: true,
      message: `找到 ${coffeeShops.length} 間咖啡廳`,
      data: {
        coffeeShops,
        location: userLocation
      }
    };

    res.json(response);

  } catch (error) {
    console.error('搜尋附近咖啡廳錯誤:', error);
    res.status(500).json({
      success: false,
      message: '搜尋咖啡廳失敗，請稍後再試'
    });
  }
};

// 根據地址搜尋附近咖啡廳
export const searchByAddress = async (req: Request, res: Response) => {
  try {
    const { address, radius = 1000 }: AddressSearchRequest = req.query as any;

    // 驗證輸入
    if (!address) {
      return res.status(400).json({
        success: false,
        message: '請提供地址'
      });
    }

    const searchRadius = parseInt(String(radius)) || 1000;

    // 地址轉經緯度
    const location = await googlePlacesService.geocodeAddress(address as string);

    if (!location) {
      return res.status(400).json({
        success: false,
        message: '無法找到該地址，請檢查地址是否正確'
      });
    }

    // 搜尋附近咖啡廳 - 直接使用指定範圍
    console.log(`🔍 地址搜尋咖啡廳: 位置(${location.lat}, ${location.lng}), 範圍 ${searchRadius}m`);
    
    const places = await googlePlacesService.searchNearbyCoffeeShops({
      lat: location.lat,
      lng: location.lng,
      radius: searchRadius
    });

    if (places.length === 0) {
      return res.json({
        success: true,
        message: `「${address}」附近 ${searchRadius}m 範圍內沒有找到咖啡廳，建議嘗試其他地址或擴大搜尋範圍`,
        data: {
          coffeeShops: [],
          location,
          address: address as string,
          searchRadius: searchRadius
        }
      });
    }

    // 轉換為 CoffeeShopData 格式
    const allCoffeeShops = places.map(place => 
      googlePlacesService.convertToCoffeeShopData(place, location)
    );

    // 精確篩選：只保留在指定範圍內的咖啡廳
    const coffeeShops = allCoffeeShops.filter(shop => {
      if (!shop.distance) return false;
      // 將距離從公里轉換為公尺進行比較
      return shop.distance * 1000 <= searchRadius;
    });

    // 按距離排序
    coffeeShops.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    // 快取資料
    await coffeeShopCacheService.cacheCoffeeShops(coffeeShops);

    const response: PlacesApiResponse = {
      success: true,
      message: `在 ${address} 附近找到 ${coffeeShops.length} 間咖啡廳`,
      data: {
        coffeeShops,
        location,
        address: address as string
      }
    };

    res.json(response);

  } catch (error) {
    console.error('根據地址搜尋咖啡廳錯誤:', error);
    res.status(500).json({
      success: false,
      message: '搜尋咖啡廳失敗，請稍後再試'
    });
  }
};

// 取得地點詳細資訊
export const getPlaceDetails = async (req: Request, res: Response) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({
        success: false,
        message: '請提供地點 ID'
      });
    }

    // 先檢查快取
    const cached = await coffeeShopCacheService.getCachedCoffeeShop(placeId);
    if (cached) {
      return res.json({
        success: true,
        message: '取得地點詳細資訊成功（快取）',
        data: { coffeeShop: cached }
      });
    }

    // 從 Google Places API 取得詳細資訊
    const placeDetails = await googlePlacesService.getPlaceDetails(placeId);

    if (!placeDetails) {
      return res.status(404).json({
        success: false,
        message: '找不到該地點'
      });
    }

    // 轉換為 CoffeeShopData 格式
    const coffeeShop = googlePlacesService.convertToCoffeeShopData(placeDetails);

    // 快取資料
    await coffeeShopCacheService.cacheCoffeeShop(coffeeShop);

    res.json({
      success: true,
      message: '取得地點詳細資訊成功',
      data: { coffeeShop }
    });

  } catch (error) {
    console.error('取得地點詳細資訊錯誤:', error);
    res.status(500).json({
      success: false,
      message: '取得地點詳細資訊失敗'
    });
  }
};

// 清理快取
export const cleanCache = async (req: Request, res: Response) => {
  try {
    const cleanedCount = await coffeeShopCacheService.cleanExpiredCache();

    res.json({
      success: true,
      message: `清理快取完成，共清理 ${cleanedCount} 個過期項目`
    });

  } catch (error) {
    console.error('清理快取錯誤:', error);
    res.status(500).json({
      success: false,
      message: '清理快取失敗'
    });
  }
};
