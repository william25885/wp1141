"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const placesController_1 = require("../controllers/placesController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 公開路由（可選認證）
router.get('/nearby', auth_1.optionalAuth, placesController_1.searchNearby);
router.get('/search', auth_1.optionalAuth, placesController_1.searchByAddress);
router.get('/details/:placeId', auth_1.optionalAuth, placesController_1.getPlaceDetails);
// 管理路由（需要認證）
router.post('/clean-cache', placesController_1.cleanCache);
exports.default = router;
