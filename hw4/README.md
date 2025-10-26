# ☕ 咖啡廳搜尋應用

一個現代化的咖啡廳搜尋應用程式，整合 Google Maps 和 Google Places API，幫助您快速找到附近的咖啡廳，並提供地圖檢視和收藏功能。

## 🌟 功能特色

### 🔍 智慧搜尋
- **我的位置搜尋**：使用高精度 GPS 定位快速找到附近咖啡廳
- **地址搜尋**：輸入地址或地點名稱進行精確搜尋
- **多關鍵字搜尋**：支援「coffee」、「咖啡」、「咖啡廳」等多種搜尋關鍵字
- **固定搜尋範圍**：統一使用 1000m 半徑，確保一致的搜尋體驗
- **結果去重**：自動去除重複的搜尋結果，按距離排序

### 🗺️ 地圖整合
- **Google Maps 整合**：即時顯示咖啡廳位置和互動式地圖
- **當前位置標記**：藍色圓形標記顯示您的精確 GPS 位置
- **咖啡廳標記**：棕色圓形標記顯示所有搜尋結果
- **互動式地圖**：點擊標記查看詳細資訊
- **響應式設計**：地圖大小根據螢幕尺寸自動調整
- **地圖始終顯示**：無論有無搜尋結果都會顯示地圖檢視

### ❤️ 收藏功能
- **收藏清單管理**：建立多個收藏清單（如：工作咖啡廳、約會咖啡廳等）
- **一鍵收藏**：快速將咖啡廳加入收藏清單
- **清單編輯**：新增、編輯、刪除收藏清單
- **項目管理**：查看和管理收藏的咖啡廳
- **重複名稱檢查**：防止建立同名清單，提供友善錯誤提示

### 🎨 使用者體驗
- **現代化 UI**：使用 Material-UI 設計系統
- **響應式設計**：完美適配桌面和行動裝置
- **一致卡片設計**：所有咖啡廳卡片大小一致，視覺整齊
- **直觀操作**：簡潔明瞭的使用者介面
- **錯誤處理**：完善的錯誤提示和處理機制
- **載入狀態**：清晰的載入和錯誤狀態顯示

## 🛠️ 技術架構

### 前端技術
- **React 18** + **TypeScript**：現代化前端框架，型別安全
- **Material-UI (MUI)**：專業的 UI 元件庫
- **React Router**：單頁應用路由管理
- **Axios**：HTTP 客戶端，支援攔截器
- **Vite**：快速建構工具
- **Google Maps JavaScript API**：地圖顯示和互動

### 後端技術
- **Node.js** + **Express**：伺服器端框架
- **TypeScript**：型別安全的 JavaScript
- **Prisma** + **SQLite**：資料庫 ORM 和資料庫
- **JWT**：身份驗證和授權
- **CORS**：跨域資源共享設定

### 第三方服務
- **Google Maps JavaScript API**：地圖顯示和標記
- **Google Places API**：地點搜尋和詳細資訊
- **Google Geocoding API**：地址轉經緯度

## 📦 安裝與設定

### 環境需求
- Node.js 18+ 
- npm 或 yarn
- Google Cloud Platform 帳號（用於 Google Maps API）

### 1. 複製專案
```bash
git clone <repository-url>
cd hw4
```

### 2. 安裝依賴

#### 後端依賴
```bash
cd backend
npm install
```

#### 前端依賴
```bash
cd frontend
npm install
```

### 3. 環境變數設定

#### 方式一：直接編輯現有檔案
直接編輯 `backend/.env` 和 `frontend/.env` 檔案，將範例值替換為您的實際 API 金鑰。

**重要**：修改環境變數後，需要重新啟動開發伺服器才能生效。

#### 方式二：使用範例檔案
如果您偏好使用範例檔案，可以複製 `.env.sample` 檔案：

```bash
# 後端
cd backend
cp .env.sample .env
# 然後編輯 .env 檔案填入實際值

# 前端
cd frontend
cp .env.sample .env
# 然後編輯 .env 檔案填入實際值
```

**注意**：修改環境變數後，請重新啟動前端和後端開發伺服器。

#### 後端環境變數
在 `backend/.env` 檔案中設定以下環境變數：

```env
# 伺服器設定
PORT=3001

# 資料庫設定
DATABASE_URL="file:./prisma/dev.db"

# JWT 認證密鑰（請使用強密鑰，建議至少 32 個字符）
JWT_SECRET=your_jwt_secret_key_here

# Google Places API 金鑰
# 請前往 https://console.cloud.google.com/ 建立 API 金鑰
# 需要啟用：Maps JavaScript API, Places API, Geocoding API
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# CORS 設定（前端網址）
CORS_ORIGIN=http://localhost:5173

# 環境設定
NODE_ENV=development
```

#### 前端環境變數
在 `frontend/.env` 檔案中設定以下環境變數：

```env
# Google Maps JavaScript API 金鑰
# 請前往 https://console.cloud.google.com/ 建立 API 金鑰
# 需要啟用：Maps JavaScript API, Places API, Geocoding API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# 後端 API 基礎網址
VITE_API_BASE_URL=http://localhost:3001/api
```

### 4. Google Maps API 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用以下 API：
   - **Maps JavaScript API**（用於地圖顯示）
   - **Places API**（用於地點搜尋）
   - **Geocoding API**（用於地址轉經緯度）
4. 建立 API 金鑰
5. 將 API 金鑰設定到環境變數中：
   - 後端：`GOOGLE_PLACES_API_KEY`
   - 前端：`VITE_GOOGLE_MAPS_API_KEY`
6. 在前端 `index.html` 中載入 Google Maps JavaScript API（已包含 `places` 庫）

**注意**：本專案使用傳統的 Google Maps Marker，確保在所有環境下都能正常運作。

### 5. 資料庫初始化
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 6. 啟動應用程式

#### 啟動後端伺服器
```bash
cd backend
npm run dev
```

#### 啟動前端開發伺服器
```bash
cd frontend
npm run dev
```

應用程式將在以下網址啟動：
- 前端：http://localhost:5173
- 後端：http://localhost:3001

## 🚀 使用指南

### 基本搜尋
1. **我的位置搜尋**：
   - 點擊「我的位置」按鈕
   - 允許瀏覽器存取您的位置
   - 系統會自動搜尋 1000m 範圍內的咖啡廳

2. **地址搜尋**：
   - 在搜尋框中輸入地址或地點名稱
   - 點擊「搜尋」按鈕
   - 系統會搜尋該地址 1000m 範圍內的咖啡廳

### 地圖檢視
- 搜尋結果會自動顯示在地圖上
- 藍色圓形標記：您的當前位置
- 棕色圓形標記：咖啡廳位置
- 點擊標記查看詳細資訊
- 地圖會始終顯示，即使沒有搜尋結果

### 收藏功能
1. **建立收藏清單**：
   - 前往「我的收藏」頁面
   - 點擊「新增」按鈕
   - 輸入清單名稱（不能重複）

2. **收藏咖啡廳**：
   - 在搜尋結果中點擊咖啡廳卡片的「+」按鈕
   - 選擇要加入的收藏清單

3. **管理收藏**：
   - 在「我的收藏」頁面查看所有清單
   - 點擊清單查看收藏的咖啡廳
   - 可以編輯清單名稱或刪除清單

## 📁 專案結構

```
hw4/
├── backend/                 # 後端應用程式
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   │   ├── authController.ts      # 認證控制器
│   │   │   ├── favoritesController.ts # 收藏功能控制器
│   │   │   └── placesController.ts    # 地點搜尋控制器
│   │   ├── middleware/      # 中間件
│   │   │   └── auth.ts               # JWT 認證中間件
│   │   ├── routes/          # 路由
│   │   │   ├── auth.ts               # 認證路由
│   │   │   ├── favorites.ts          # 收藏功能路由
│   │   │   └── places.ts             # 地點搜尋路由
│   │   ├── services/        # 服務層
│   │   │   ├── coffeeShopCacheService.ts # 咖啡廳快取服務
│   │   │   └── googlePlacesService.ts    # Google Places API 服務
│   │   ├── types/           # 型別定義
│   │   │   ├── auth.ts               # 認證相關型別
│   │   │   ├── favorites.ts          # 收藏功能型別
│   │   │   └── places.ts             # 地點搜尋型別
│   │   ├── lib/             # 工具庫
│   │   │   └── prisma.ts            # Prisma 客戶端
│   │   ├── app.ts          # 應用程式入口
│   │   └── server.ts       # 伺服器啟動
│   ├── prisma/             # 資料庫 schema
│   │   └── schema.prisma   # 資料庫結構定義
│   └── env                 # 環境變數
├── frontend/               # 前端應用程式
│   ├── src/
│   │   ├── components/     # React 元件
│   │   │   ├── Layout.tsx            # 主要佈局元件
│   │   │   ├── ProtectedRoute.tsx    # 受保護路由元件
│   │   │   └── GoogleMap.tsx         # Google Maps 元件
│   │   ├── contexts/       # React Context
│   │   │   └── AuthContext.tsx       # 認證狀態管理
│   │   ├── pages/          # 頁面元件
│   │   │   ├── HomePage.tsx          # 首頁（搜尋功能）
│   │   │   ├── FavoritesPage.tsx     # 收藏頁面
│   │   │   ├── LoginPage.tsx         # 登入頁面
│   │   │   └── RegisterPage.tsx      # 註冊頁面
│   │   ├── services/       # API 服務
│   │   │   └── api.ts                # API 呼叫服務
│   │   ├── types/          # TypeScript 型別
│   │   │   └── index.ts              # 型別定義
│   │   ├── utils/          # 工具函數
│   │   ├── main.tsx       # 應用程式入口
│   │   └── App.tsx        # 根元件
│   └── index.html         # HTML 模板
└── README.md              # 專案說明
```

## 🔧 開發指令

### 後端指令
```bash
# 開發模式
npm run dev

# 建構
npm run build

# 啟動生產版本
npm start

# 資料庫相關
npx prisma generate    # 生成 Prisma 客戶端
npx prisma db push     # 推送 schema 到資料庫
npx prisma studio      # 開啟資料庫管理介面
```

### 前端指令
```bash
# 開發模式
npm run dev

# 建構
npm run build

# 預覽建構結果
npm run preview

# 型別檢查
npm run type-check

# Lint 檢查
npm run lint
```

## 🌐 API 端點

### 認證相關
- `POST /api/auth/register` - 使用者註冊
- `POST /api/auth/login` - 使用者登入
- `GET /api/auth/me` - 取得當前使用者資訊
- `POST /api/auth/logout` - 使用者登出

### 地點搜尋
- `GET /api/places/nearby` - 根據經緯度搜尋附近咖啡廳
- `GET /api/places/search` - 根據地址搜尋附近咖啡廳
- `GET /api/places/details/:placeId` - 取得地點詳細資訊

### 收藏功能
- `GET /api/favorites/lists` - 取得收藏清單
- `POST /api/favorites/lists` - 建立收藏清單
- `PUT /api/favorites/lists/:id` - 更新收藏清單
- `DELETE /api/favorites/lists/:id` - 刪除收藏清單
- `GET /api/favorites/lists/:id/items` - 取得收藏項目
- `POST /api/favorites/items` - 新增收藏項目
- `DELETE /api/favorites/items/:id` - 刪除收藏項目

## 🎯 功能特色詳解

### 搜尋機制
- **多關鍵字搜尋**：同時搜尋「coffee」、「咖啡」、「咖啡廳」等關鍵字
- **結果去重**：自動去除重複的搜尋結果（基於 place_id）
- **距離計算**：精確計算咖啡廳與搜尋位置的距離
- **結果排序**：按距離由近到遠排序
- **API 限制處理**：在 API 呼叫間加入延遲，避免觸發限制

### 地圖功能
- **即時載入**：Google Maps API 非同步載入
- **標記動畫**：咖啡廳標記有掉落動畫效果
- **資訊視窗**：點擊標記顯示詳細資訊
- **響應式設計**：地圖大小根據螢幕尺寸調整
- **當前位置**：精確的 GPS 定位和標記

### 收藏系統
- **多清單支援**：使用者可建立多個收藏清單
- **快速收藏**：一鍵將咖啡廳加入收藏
- **清單管理**：完整的 CRUD 操作
- **資料持久化**：收藏資料儲存在資料庫中
- **重複檢查**：防止建立同名清單

### 錯誤處理
- **API 錯誤處理**：完善的錯誤提示和處理
- **網路錯誤處理**：處理網路連線問題
- **使用者輸入驗證**：前端和後端雙重驗證
- **友善錯誤訊息**：提供清楚的錯誤說明和解決建議

## 🐛 常見問題

### Q: 搜尋結果為空怎麼辦？
A: 請確認：
1. 網路連接正常
2. Google Places API 金鑰設定正確
3. API 配額未超限
4. 搜尋位置附近確實有咖啡廳
5. 嘗試使用不同的地址或關鍵字

### Q: 地圖無法顯示？
A: 請確認：
1. Google Maps JavaScript API 已啟用
2. API 金鑰設定正確
3. 瀏覽器支援 JavaScript
4. 網路連接正常
5. 檢查瀏覽器控制台是否有錯誤訊息

### Q: 收藏功能無法使用？
A: 請確認：
1. 已登入帳號
2. 後端伺服器正常運行
3. 資料庫連接正常
4. JWT token 未過期

### Q: 建立收藏清單時出現錯誤？
A: 請確認：
1. 清單名稱不為空
2. 清單名稱不與現有清單重複
3. 網路連接正常
4. 已正確登入

### Q: 我的位置功能無法使用？
A: 請確認：
1. 瀏覽器已允許位置存取權限
2. 裝置支援 GPS 定位
3. 網路連接正常
4. 瀏覽器支援 Geolocation API

## 🔒 安全性

- **JWT 認證**：使用 JSON Web Token 進行身份驗證
- **CORS 設定**：正確設定跨域資源共享
- **輸入驗證**：前端和後端雙重輸入驗證
- **錯誤處理**：不洩露敏感資訊的錯誤處理
- **API 金鑰保護**：環境變數保護 API 金鑰

## 📝 授權

本專案僅供學習和展示用途。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改善這個專案。

## 📞 聯絡資訊

如有任何問題或建議，請透過以下方式聯絡：
- 建立 GitHub Issue
- 發送 Email

---

**享受您的咖啡廳探索之旅！** ☕️

## 📊 專案統計

- **前端**：React + TypeScript + Material-UI
- **後端**：Node.js + Express + TypeScript
- **資料庫**：SQLite + Prisma
- **地圖服務**：Google Maps JavaScript API
- **地點服務**：Google Places API
- **認證**：JWT
- **建構工具**：Vite
- **程式碼品質**：ESLint + TypeScript

## 🚀 部署建議

### 生產環境部署
1. 設定生產環境變數
2. 建構前端應用程式
3. 設定反向代理（如 Nginx）
4. 使用 PM2 管理 Node.js 程序
5. 設定 SSL 憑證
6. 配置資料庫備份

### 環境變數範例
```env
NODE_ENV=production
PORT=3001
DATABASE_URL="file:./prisma/prod.db"
JWT_SECRET=your_production_jwt_secret
GOOGLE_PLACES_API_KEY=your_production_api_key
CORS_ORIGIN=https://yourdomain.com
```