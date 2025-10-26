import { Router } from 'express';
import { 
  getFavoriteLists, 
  createFavoriteList, 
  updateFavoriteList, 
  deleteFavoriteList,
  getFavoriteItems,
  addToFavorite,
  removeFromFavorite,
  checkFavoriteStatus
} from '../controllers/favoritesController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 所有路由都需要認證
router.use(authenticateToken);

// ==================== FavoriteList 路由 ====================

// 取得使用者的所有收藏清單
router.get('/lists', getFavoriteLists);

// 建立新的收藏清單
router.post('/lists', createFavoriteList);

// 更新收藏清單名稱
router.put('/lists/:id', updateFavoriteList);

// 刪除收藏清單
router.delete('/lists/:id', deleteFavoriteList);

// ==================== FavoriteItem 路由 ====================

// 取得特定收藏清單的所有項目
router.get('/lists/:listId/items', getFavoriteItems);

// 加入咖啡廳到收藏清單
router.post('/items', addToFavorite);

// 從收藏清單移除項目
router.delete('/items/:itemId', removeFromFavorite);

// 檢查地點是否已收藏
router.get('/check/:placeId', checkFavoriteStatus);

export default router;
