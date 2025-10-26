"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favoritesController_1 = require("../controllers/favoritesController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 所有路由都需要認證
router.use(auth_1.authenticateToken);
// ==================== FavoriteList 路由 ====================
// 取得使用者的所有收藏清單
router.get('/lists', favoritesController_1.getFavoriteLists);
// 建立新的收藏清單
router.post('/lists', favoritesController_1.createFavoriteList);
// 更新收藏清單名稱
router.put('/lists/:id', favoritesController_1.updateFavoriteList);
// 刪除收藏清單
router.delete('/lists/:id', favoritesController_1.deleteFavoriteList);
// ==================== FavoriteItem 路由 ====================
// 取得特定收藏清單的所有項目
router.get('/lists/:listId/items', favoritesController_1.getFavoriteItems);
// 加入咖啡廳到收藏清單
router.post('/items', favoritesController_1.addToFavorite);
// 從收藏清單移除項目
router.delete('/items/:itemId', favoritesController_1.removeFromFavorite);
// 檢查地點是否已收藏
router.get('/check/:placeId', favoritesController_1.checkFavoriteStatus);
exports.default = router;
