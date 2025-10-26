import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { 
  CreateFavoriteListRequest, 
  UpdateFavoriteListRequest, 
  CreateFavoriteItemRequest,
  AddToFavoriteRequest,
  FavoritesApiResponse,
  FavoriteListResponse,
  FavoriteItemResponse,
  FavoriteListWithItems
} from '../types/favorites';

// ==================== FavoriteList CRUD ====================

// 取得使用者的所有收藏清單
export const getFavoriteLists = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未經授權'
      });
    }

    const favoriteLists = await prisma.favoriteList.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const response: FavoritesApiResponse<FavoriteListWithItems[]> = {
      success: true,
      message: `找到 ${favoriteLists.length} 個收藏清單`,
      data: favoriteLists.map(list => ({
        id: list.id,
        name: list.name,
        userId: list.userId,
        createdAt: list.createdAt.toISOString(),
        updatedAt: list.updatedAt.toISOString(),
        favoriteItems: list.items.map(item => ({
          id: item.id,
          listId: item.listId,
          placeId: item.placeId,
          placeName: item.placeName,
          rating: item.rating || undefined,
          reviewCount: item.reviewCount || undefined,
          phone: item.phone || undefined,
          address: item.address || undefined,
          distance: item.distance || undefined,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.createdAt.toISOString()
        }))
      }))
    };

    res.json(response);

  } catch (error) {
    console.error('取得收藏清單錯誤:', error);
    res.status(500).json({
      success: false,
      message: '取得收藏清單失敗'
    });
  }
};

// 建立新的收藏清單
export const createFavoriteList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未經授權'
      });
    }

    const { name }: CreateFavoriteListRequest = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: '收藏清單名稱不能為空'
      });
    }

    // 檢查是否已存在相同名稱的清單
    const existingList = await prisma.favoriteList.findFirst({
      where: {
        userId: req.user.id,
        name: name.trim()
      }
    });

    if (existingList) {
      return res.status(409).json({
        success: false,
        message: '已存在相同名稱的收藏清單'
      });
    }

    const favoriteList = await prisma.favoriteList.create({
      data: {
        name: name.trim(),
        userId: req.user.id
      }
    });

    const response: FavoritesApiResponse<FavoriteListResponse> = {
      success: true,
      message: '收藏清單建立成功',
      data: {
        id: favoriteList.id,
        name: favoriteList.name,
        userId: favoriteList.userId,
        createdAt: favoriteList.createdAt.toISOString(),
        updatedAt: favoriteList.updatedAt.toISOString()
      }
    };

    res.status(201).json(response);

  } catch (error) {
    console.error('建立收藏清單錯誤:', error);
    res.status(500).json({
      success: false,
      message: '建立收藏清單失敗'
    });
  }
};

// 更新收藏清單名稱
export const updateFavoriteList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未經授權'
      });
    }

    const { id } = req.params;
    const { name }: UpdateFavoriteListRequest = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: '收藏清單名稱不能為空'
      });
    }

    // 檢查清單是否存在且屬於該使用者
    const existingList = await prisma.favoriteList.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: '找不到該收藏清單'
      });
    }

    // 檢查新名稱是否已被使用
    const duplicateList = await prisma.favoriteList.findFirst({
      where: {
        userId: req.user.id,
        name: name.trim(),
        id: { not: id }
      }
    });

    if (duplicateList) {
      return res.status(409).json({
        success: false,
        message: '已存在相同名稱的收藏清單'
      });
    }

    const updatedList = await prisma.favoriteList.update({
      where: { id },
      data: { name: name.trim() }
    });

    const response: FavoritesApiResponse<FavoriteListResponse> = {
      success: true,
      message: '收藏清單更新成功',
      data: {
        id: updatedList.id,
        name: updatedList.name,
        userId: updatedList.userId,
        createdAt: updatedList.createdAt.toISOString(),
        updatedAt: updatedList.updatedAt.toISOString()
      }
    };

    res.json(response);

  } catch (error) {
    console.error('更新收藏清單錯誤:', error);
    res.status(500).json({
      success: false,
      message: '更新收藏清單失敗'
    });
  }
};

// 刪除收藏清單
export const deleteFavoriteList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未經授權'
      });
    }

    const { id } = req.params;

    // 檢查清單是否存在且屬於該使用者
    const existingList = await prisma.favoriteList.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingList) {
      return res.status(404).json({
        success: false,
        message: '找不到該收藏清單'
      });
    }

    // 刪除清單（會自動刪除相關的收藏項目）
    await prisma.favoriteList.delete({
      where: { id }
    });

    const response: FavoritesApiResponse = {
      success: true,
      message: '收藏清單刪除成功'
    };

    res.json(response);

  } catch (error) {
    console.error('刪除收藏清單錯誤:', error);
    res.status(500).json({
      success: false,
      message: '刪除收藏清單失敗'
    });
  }
};

// ==================== FavoriteItem CRUD ====================

// 取得特定收藏清單的所有項目
export const getFavoriteItems = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未經授權'
      });
    }

    const { listId } = req.params;

    // 檢查清單是否存在且屬於該使用者
    const favoriteList = await prisma.favoriteList.findFirst({
      where: {
        id: listId,
        userId: req.user.id
      }
    });

    if (!favoriteList) {
      return res.status(404).json({
        success: false,
        message: '找不到該收藏清單'
      });
    }

    const favoriteItems = await prisma.favoriteItem.findMany({
      where: { listId },
      orderBy: { createdAt: 'desc' }
    });

    const response: FavoritesApiResponse<FavoriteItemResponse[]> = {
      success: true,
      message: `找到 ${favoriteItems.length} 個收藏項目`,
      data: favoriteItems.map(item => ({
        id: item.id,
        listId: item.listId,
        placeId: item.placeId,
        placeName: item.placeName,
        rating: item.rating || undefined,
        reviewCount: item.reviewCount || undefined,
        phone: item.phone || undefined,
        address: item.address || undefined,
        distance: item.distance || undefined,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.createdAt.toISOString()
      }))
    };

    res.json(response);

  } catch (error) {
    console.error('取得收藏項目錯誤:', error);
    res.status(500).json({
      success: false,
      message: '取得收藏項目失敗'
    });
  }
};

// 加入咖啡廳到收藏清單
export const addToFavorite = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未經授權'
      });
    }

    const { listId, placeId, placeName, rating, reviewCount, phone, address, distance }: AddToFavoriteRequest = req.body;

    if (!listId || !placeId || !placeName) {
      return res.status(400).json({
        success: false,
        message: '清單 ID、地點 ID 和地點名稱為必填欄位'
      });
    }

    // 檢查清單是否存在且屬於該使用者
    const favoriteList = await prisma.favoriteList.findFirst({
      where: {
        id: listId,
        userId: req.user.id
      }
    });

    if (!favoriteList) {
      return res.status(404).json({
        success: false,
        message: '找不到該收藏清單'
      });
    }

    // 檢查是否已存在相同的地點
    const existingItem = await prisma.favoriteItem.findFirst({
      where: {
        listId,
        placeId
      }
    });

    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: '該地點已在收藏清單中'
      });
    }

    const favoriteItem = await prisma.favoriteItem.create({
      data: {
        listId,
        placeId,
        placeName,
        rating,
        reviewCount,
        phone,
        address,
        distance
      }
    });

    const response: FavoritesApiResponse<FavoriteItemResponse> = {
      success: true,
      message: '成功加入收藏',
      data: {
        id: favoriteItem.id,
        listId: favoriteItem.listId,
        placeId: favoriteItem.placeId,
        placeName: favoriteItem.placeName,
        rating: favoriteItem.rating || undefined,
        reviewCount: favoriteItem.reviewCount || undefined,
        phone: favoriteItem.phone || undefined,
        address: favoriteItem.address || undefined,
        distance: favoriteItem.distance || undefined,
        createdAt: favoriteItem.createdAt.toISOString(),
        updatedAt: favoriteItem.createdAt.toISOString()
      }
    };

    res.status(201).json(response);

  } catch (error) {
    console.error('加入收藏錯誤:', error);
    res.status(500).json({
      success: false,
      message: '加入收藏失敗'
    });
  }
};

// 從收藏清單移除項目
export const removeFromFavorite = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未經授權'
      });
    }

    const { itemId } = req.params;

    // 檢查項目是否存在且屬於該使用者
    const favoriteItem = await prisma.favoriteItem.findFirst({
      where: { id: itemId },
      include: {
        list: true
      }
    });

    if (!favoriteItem) {
      return res.status(404).json({
        success: false,
        message: '找不到該收藏項目'
      });
    }

    if (favoriteItem.list.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '無權限操作此收藏項目'
      });
    }

    await prisma.favoriteItem.delete({
      where: { id: itemId }
    });

    const response: FavoritesApiResponse = {
      success: true,
      message: '成功移除收藏'
    };

    res.json(response);

  } catch (error) {
    console.error('移除收藏錯誤:', error);
    res.status(500).json({
      success: false,
      message: '移除收藏失敗'
    });
  }
};

// 檢查地點是否已收藏
export const checkFavoriteStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未經授權'
      });
    }

    const { placeId } = req.params;

    const favoriteItems = await prisma.favoriteItem.findMany({
      where: {
        placeId,
        list: {
          userId: req.user.id
        }
      },
      include: {
        list: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const response: FavoritesApiResponse<{
      isFavorite: boolean;
      favoriteLists: Array<{ id: string; name: string }>;
    }> = {
      success: true,
      message: '檢查收藏狀態成功',
      data: {
        isFavorite: favoriteItems.length > 0,
        favoriteLists: favoriteItems.map(item => ({
          id: item.list.id,
          name: item.list.name
        }))
      }
    };

    res.json(response);

  } catch (error) {
    console.error('檢查收藏狀態錯誤:', error);
    res.status(500).json({
      success: false,
      message: '檢查收藏狀態失敗'
    });
  }
};
