import { prisma } from '../lib/prisma';
import { CoffeeShopData } from '../types/places';

class CoffeeShopCacheService {
  // 快取過期時間（小時）
  private readonly CACHE_EXPIRY_HOURS = 24;

  // 從快取中取得咖啡廳資料
  async getCachedCoffeeShop(placeId: string): Promise<CoffeeShopData | null> {
    try {
      const cached = await prisma.coffeeShop.findUnique({
        where: { placeId }
      });

      if (!cached) {
        return null;
      }

      // 檢查是否過期
      const now = new Date();
      const cacheAge = now.getTime() - cached.updatedAt.getTime();
      const expiryTime = this.CACHE_EXPIRY_HOURS * 60 * 60 * 1000; // 轉換為毫秒

      if (cacheAge > expiryTime) {
        // 快取過期，刪除舊資料
        await prisma.coffeeShop.delete({
          where: { placeId }
        });
        return null;
      }

      // 回傳快取的資料
      return {
        placeId: cached.placeId,
        name: cached.name,
        rating: cached.rating || undefined,
        reviewCount: cached.reviewCount || undefined,
        phone: cached.phone || undefined,
        address: cached.address || undefined,
        lat: cached.lat,
        lng: cached.lng,
        openingHours: cached.openingHours || undefined
      };
    } catch (error) {
      console.error('取得快取咖啡廳資料錯誤:', error);
      return null;
    }
  }

  // 快取咖啡廳資料
  async cacheCoffeeShop(coffeeShop: CoffeeShopData): Promise<void> {
    try {
      await prisma.coffeeShop.upsert({
        where: { placeId: coffeeShop.placeId },
        update: {
          name: coffeeShop.name,
          rating: coffeeShop.rating,
          reviewCount: coffeeShop.reviewCount,
          phone: coffeeShop.phone,
          address: coffeeShop.address,
          lat: coffeeShop.lat,
          lng: coffeeShop.lng,
          openingHours: coffeeShop.openingHours,
          updatedAt: new Date()
        },
        create: {
          placeId: coffeeShop.placeId,
          name: coffeeShop.name,
          rating: coffeeShop.rating,
          reviewCount: coffeeShop.reviewCount,
          phone: coffeeShop.phone,
          address: coffeeShop.address,
          lat: coffeeShop.lat,
          lng: coffeeShop.lng,
          openingHours: coffeeShop.openingHours
        }
      });
    } catch (error) {
      console.error('快取咖啡廳資料錯誤:', error);
    }
  }

  // 批次快取咖啡廳資料
  async cacheCoffeeShops(coffeeShops: CoffeeShopData[]): Promise<void> {
    try {
      const promises = coffeeShops.map(coffeeShop => this.cacheCoffeeShop(coffeeShop));
      await Promise.all(promises);
    } catch (error) {
      console.error('批次快取咖啡廳資料錯誤:', error);
    }
  }

  // 從快取中取得多個咖啡廳
  async getCachedCoffeeShops(placeIds: string[]): Promise<CoffeeShopData[]> {
    try {
      const cached = await prisma.coffeeShop.findMany({
        where: {
          placeId: { in: placeIds }
        }
      });

      const now = new Date();
      const expiryTime = this.CACHE_EXPIRY_HOURS * 60 * 60 * 1000;

      const validCached: CoffeeShopData[] = [];
      const expiredIds: string[] = [];

      for (const item of cached) {
        const cacheAge = now.getTime() - item.updatedAt.getTime();
        
        if (cacheAge > expiryTime) {
          expiredIds.push(item.placeId);
        } else {
          validCached.push({
            placeId: item.placeId,
            name: item.name,
            rating: item.rating || undefined,
            reviewCount: item.reviewCount || undefined,
            phone: item.phone || undefined,
            address: item.address || undefined,
            lat: item.lat,
            lng: item.lng,
            openingHours: item.openingHours || undefined
          });
        }
      }

      // 刪除過期的快取
      if (expiredIds.length > 0) {
        await prisma.coffeeShop.deleteMany({
          where: { placeId: { in: expiredIds } }
        });
      }

      return validCached;
    } catch (error) {
      console.error('取得快取咖啡廳資料錯誤:', error);
      return [];
    }
  }

  // 清理過期快取
  async cleanExpiredCache(): Promise<number> {
    try {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() - this.CACHE_EXPIRY_HOURS);

      const result = await prisma.coffeeShop.deleteMany({
        where: {
          updatedAt: {
            lt: expiryTime
          }
        }
      });

      console.log(`清理了 ${result.count} 個過期的咖啡廳快取`);
      return result.count;
    } catch (error) {
      console.error('清理過期快取錯誤:', error);
      return 0;
    }
  }
}

export default new CoffeeShopCacheService();
