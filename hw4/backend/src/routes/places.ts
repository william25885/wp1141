import { Router } from 'express';
import { searchNearby, searchByAddress, getPlaceDetails, cleanCache } from '../controllers/placesController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// 公開路由（可選認證）
router.get('/nearby', optionalAuth, searchNearby);
router.get('/search', optionalAuth, searchByAddress);
router.get('/details/:placeId', optionalAuth, getPlaceDetails);

// 管理路由（需要認證）
router.post('/clean-cache', cleanCache);

export default router;
