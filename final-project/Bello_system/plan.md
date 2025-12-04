# Final Project – Midterm Plan

## Deploy Link
https://bello-tw.vercel.app/

## 1. 本次 Prototype 已完成
- **前端基礎架構**
  - Vue.js 3 專案初始化與配置
  - Vue Router 路由系統搭建
  - Bootstrap 5 UI 框架整合
  - Vite 構建工具配置
  - 基本組件結構設計
- **後端基礎架構**
  - Flask 應用框架搭建
  - 資料庫連接池設計
  - 基本 API 端點結構
  - CORS 跨域配置
- **認證系統框架**
  - 登入/註冊頁面 UI 設計
  - JWT Token 認證機制設計
  - 路由守衛（Navigation Guards）基礎架構
- **示意頁面**
  - 首頁（Lobby）基本布局
  - 個人資料頁面框架
  - 基本導航系統
- **功能 Placeholder**
  - 聚會列表頁面框架
  - 聊天介面基本結構
  - 好友系統 UI 框架

## 2. 最終版本預計完成項目

### 2.1 核心功能模組

#### 認證與用戶管理系統
- **多元登入方式**
  - 傳統帳號密碼登入（註冊、登入、登出）
  - Google OAuth 2.0 登入整合
  - JWT Token 認證機制（24 小時有效期）
  - Token 自動刷新與過期處理
  - 內嵌瀏覽器檢測與提示（LINE、Facebook、Instagram、Twitter）
- **個人資料管理**
  - 基本資料編輯（姓名、暱稱、電話、生日、國籍、城市、性別）
  - 詳細資料編輯（星座、MBTI、血型、大學、興趣、自我介紹）
  - 頭像上傳與裁剪功能（Cropper.js 整合）
  - 頭像查看與更換功能
  - Google OAuth 用戶資料自動填充

#### 聚會管理系統
- **聚會類型支援**
  - 午餐、咖啡/下午茶、晚餐、喝酒、語言交換
  - 多語言標籤篩選（中文、英文、日文、韓文等）
- **聚會操作功能**
  - 創建聚會（標題、描述、時間、地點、類型、語言、人數限制）
  - 瀏覽所有聚會列表
  - 聚會篩選與搜尋功能
  - 加入聚會（檢查人數限制、重複加入防護）
  - 離開聚會
  - 取消聚會（僅限發起者）
  - 查看我的聚會（我發起的、我參與的）
- **聚會狀態管理**
  - 進行中、已完成、已取消狀態追蹤
  - 聚會參與者列表查看
  - 聚會詳情頁面

#### 即時通訊系統
- **私人聊天功能**
  - 一對一即時聊天介面
  - 聊天列表顯示（所有聊天對象）
  - 訊息發送與接收
  - 聊天記錄保存與歷史訊息載入
  - 訊息時間戳顯示
  - 在線狀態即時顯示
- **聚會群組聊天室**
  - 聚會聊天室入口
  - 群組訊息發送與接收
  - 聊天記錄保存與顯示
  - 參與者列表查看功能
  - 點擊參與者查看個人資料
- **在線狀態系統**
  - 用戶在線/離線狀態追蹤
  - 最後活躍時間記錄
  - 好友在線狀態顯示
  - 聊天對象在線狀態顯示

#### 好友系統
- **好友搜尋與添加**
  - 用戶搜尋功能（依帳號、姓名、暱稱）
  - 發送好友請求
  - 好友請求狀態檢查（none、pending_sent、pending_received、accepted）
- **好友請求管理**
  - 查看待處理的好友請求
  - 接受好友請求
  - 拒絕好友請求
  - 取消已發送的好友請求
- **好友列表功能**
  - 查看所有好友列表
  - 好友在線狀態顯示
  - 點擊好友進入私人聊天
  - 移除好友功能
- **用戶資料查看**
  - 查看其他用戶的公開個人資料
  - 顯示完整基本資料（性別、生日、國籍、城市）
  - 顯示完整詳細資料（星座、MBTI、血型、宗教、婚姻狀態、學校、想找的聚會類型、興趣、自我介紹）
  - 社群帳號顯示（願意交換社群時顯示所有社群帳號，不願意時顯示「無」）
  - 顯示好友關係狀態
  - 從聊天室或聚會中點擊用戶查看資料

#### 管理員功能系統
- **聚會管理**
  - 瀏覽所有聚會列表
  - 查看聚會詳情
  - 取消聚會功能
  - 結束聚會功能
- **用戶管理**
  - 瀏覽所有用戶列表
  - 查看用戶詳細資料
  - 移除用戶功能
- **聊天記錄查看**
  - 查看所有私人聊天對話列表（自動載入所有對話，顯示雙方用戶、訊息數、最後訊息時間）
  - 查看所有聚會聊天列表（自動載入有聊天記錄的聚會，顯示聚會資訊、訊息數、狀態）
  - 點擊查看詳細聊天記錄（私人對話詳情、聚會聊天詳情）
  - 支援分頁瀏覽
  - 支援 ID 搜尋特定用戶或聚會的聊天記錄

### 2.2 技術架構與安全

#### 資料庫設計
- **9 張核心資料表**
  - `USER`：用戶基本資料表
  - `USER_DETAIL`：用戶詳細資料表
  - `MEETING`：聚會資訊表
  - `PARTICIPATION`：參與記錄表
  - `FRIENDSHIP`：好友關係表
  - `PRIVATE_MESSAGE`：私人訊息表
  - `CHATTING_ROOM`：聚會聊天記錄表
  - `USER_ONLINE_STATUS`：在線狀態表
  - `ADMIN`：管理員表
- **資料庫特性**
  - 4NF 正規化設計
  - 外鍵約束與級聯操作
  - 索引優化
  - 資料完整性檢查

#### 後端 API 架構
- **模組化設計**
  - Flask Blueprint 組織路由
  - 28+ API 端點實作
  - 統一的錯誤處理機制
  - JSON 格式回應標準化
- **認證與授權**
  - `@require_auth` 裝飾器保護用戶端點
  - `@require_admin` 裝飾器保護管理員端點
  - JWT Token 驗證中間件
  - 角色權限控制

#### 前端架構
- **組件化開發**
  - 35+ Vue 組件
  - 可重用組件設計（UserProfilePopup、FriendsList 等）
  - 響應式設計（Bootstrap 5）
- **狀態管理**
  - Local Storage 存儲認證資訊
  - 路由守衛控制頁面訪問
  - 全局事件處理（認證過期、登出等）

#### 安全特性
- **認證安全**
  - JWT Token 加密存儲
  - Token 過期自動處理
  - 401 錯誤自動登出重定向
- **路由保護**
  - 未登入用戶自動重定向到登入頁
  - 管理員路由權限檢查
  - 404 頁面處理
- **API 安全**
  - SQL 注入防護（參數化查詢）
  - 輸入驗證與錯誤處理
  - CORS 正確配置
- **瀏覽器兼容**
  - 內嵌瀏覽器檢測
  - Google OAuth 失敗提示
  - 外部瀏覽器開啟指引

#### 部署架構
- **Vercel 部署**
  - 前端靜態資源部署
  - 後端 Serverless Functions 部署
  - `vercel.json` 路由配置
  - SPA 路由支援（404 fallback）
- **資料庫**
  - Neon PostgreSQL 雲端資料庫
  - 連接池管理
  - 環境變數配置

## 3. 預期開發進度

### Week 1 (11/13 - 11/20)：基礎架構與認證系統

#### Day 1-2 (11/13-11/14)：專案初始化與資料庫設計
- **資料庫設計**
  - ER Diagram 繪製與需求分析
  - 9 張資料表結構設計
  - 4NF 正規化驗證
  - 外鍵關係設計
  - `init_bello_db.sql` 腳本撰寫
  - 資料庫初始化測試
- **開發環境搭建**
  - Python 虛擬環境配置
  - Node.js 專案初始化
  - Git 版本控制設定
  - 開發工具配置（ESLint、Prettier）

#### Day 3-4 (11/15-11/16)：後端框架搭建
- **Flask 應用架構**
  - `app.py` 主應用文件
  - `config.py` 配置文件
  - Blueprint 模組化設計
  - CORS 跨域配置
- **資料庫工具類**
  - `DB_utils.py` DatabaseManager 類設計
  - 連接池管理
  - 錯誤處理機制
  - 資料庫操作封裝（CRUD 方法）
- **JWT 認證工具**
  - `jwt_utils.py` 工具函數
  - Token 生成與驗證
  - `@require_auth` 裝飾器實作
  - `@require_admin` 裝飾器實作

#### Day 5-6 (11/17-11/18)：前端框架搭建
- **Vue.js 專案配置**
  - Vite 構建工具配置
  - Vue Router 路由系統
  - Bootstrap 5 UI 框架整合
  - 全局樣式配置
- **API 工具類**
  - `utils/api.js` API 請求封裝
  - Axios 配置與攔截器
  - Token 自動附加
  - 401 錯誤處理
  - 認證狀態管理
- **基本頁面架構**
  - `App.vue` 根組件
  - `LobbyView.vue` 首頁
  - `LoginView.vue` 登入頁
  - `RegisterView.vue` 註冊頁
  - 導航欄組件

#### Day 7 (11/19)：認證系統實作
- **後端認證 API**
  - `POST /api/login` 登入端點
  - `POST /api/signup` 註冊端點
  - 密碼加密與驗證
  - JWT Token 發放
  - 用戶資料驗證
- **前端認證功能**
  - 登入表單與驗證
  - 註冊表單與驗證
  - Token 存儲與管理
  - 登入狀態檢查
  - 路由守衛基礎實作

#### Day 8 (11/20)：Google OAuth 整合
- **Google OAuth 設定**
  - Google Cloud Console 專案建立
  - OAuth 2.0 Client ID 配置
  - Authorized JavaScript origins 設定
  - Authorized redirect URIs 設定
- **後端 OAuth API**
  - `POST /api/auth/google` Google 登入端點
  - ID Token 驗證
  - Google 用戶資料提取
  - 自動創建 Google 用戶帳號
  - `GET /api/auth/google/client-id` 端點
- **前端 OAuth 整合**
  - Google Identity Services SDK 載入
  - Google 登入按鈕渲染
  - ID Token 發送到後端
  - OAuth 登入流程處理
  - 錯誤處理與提示

### Week 2 (11/21 - 11/27)：聚會管理與聊天系統

#### Day 9-10 (11/21-11/22)：聚會管理後端 API
- **聚會 CRUD API**
  - `POST /api/create-meeting` 創建聚會
  - `GET /api/meetings` 獲取所有聚會
  - `POST /api/join-meeting` 加入聚會
  - `POST /api/leave-meeting` 離開聚會
  - `POST /api/cancel-meeting` 取消聚會
  - `GET /api/my-meetings/:user_id` 獲取我的聚會
- **資料庫操作**
  - `create_meeting()` 方法
  - `get_all_meetings()` 方法
  - `join_meeting()` 方法（檢查人數限制）
  - `leave_meeting()` 方法
  - `cancel_meeting()` 方法
  - `get_user_meetings()` 方法
- **業務邏輯**
  - 聚會人數限制檢查
  - 重複加入防護
  - 聚會狀態管理
  - 參與者列表維護

#### Day 11-12 (11/23-11/24)：聚會管理前端介面
- **聚會列表頁面**
  - `MeetingsView.vue` 所有聚會列表
  - 聚會卡片組件設計
  - 聚會類型篩選
  - 語言標籤篩選
  - 搜尋功能
  - 分頁或無限滾動
- **創建聚會頁面**
  - `CreateMeetingView.vue` 創建表單
  - 表單驗證
  - 日期時間選擇器
  - 地點輸入
  - 類型與語言選擇
  - 人數限制設定
- **我的聚會頁面**
  - `MyMeetingsView.vue` 我的聚會列表
  - 我發起的聚會
  - 我參與的聚會
  - 聚會操作按鈕（取消、離開）

#### Day 13-14 (11/25-11/26)：聊天系統後端 API
- **私人聊天 API**
  - `GET /api/my-chats` 獲取聊天列表
  - `GET /api/private-chat/history` 獲取聊天記錄
  - `POST /api/private-chat/send` 發送私人訊息
  - 聊天對象列表生成邏輯
- **聚會聊天 API**
  - `GET /api/meeting-chat/:meeting_id` 獲取聚會聊天記錄
  - `POST /api/meeting-chat/send` 發送聚會訊息
  - 聚會參與者驗證
- **資料庫操作**
  - `get_user_chat_list()` 方法
  - `get_user_chat_history()` 方法
  - `send_private_message()` 方法
  - `get_meeting_chat_history()` 方法
  - `send_meeting_message()` 方法
- **在線狀態系統**
  - `update_user_online_status()` 方法
  - `get_user_online_status()` 方法
  - 定時更新機制設計

#### Day 15 (11/27)：聊天系統前端介面
- **私人聊天頁面**
  - `ChatView.vue` 聊天列表與聊天介面
  - 聊天列表側邊欄
  - 聊天訊息顯示區域
  - 訊息輸入框與發送按鈕
  - 訊息時間戳格式化
  - 自動滾動到底部
  - 在線狀態顯示
- **聚會聊天頁面**
  - `MeetingChatView.vue` 聚會聊天介面
  - 聚會資訊顯示
  - 參與者列表功能
  - 群組訊息顯示
  - 訊息發送功能
  - 點擊參與者查看資料功能

### Week 3 (11/28 - 12/4)：好友系統與最終整合

#### Day 16-17 (11/28-11/29)：好友系統後端 API
- **好友搜尋 API**
  - `GET /api/friends/search` 搜尋用戶
  - 模糊搜尋實作（帳號、姓名、暱稱）
- **好友請求 API**
  - `POST /api/friends/add` 發送好友請求
  - `POST /api/friends/accept` 接受好友請求
  - `POST /api/friends/reject` 拒絕好友請求
  - `POST /api/friends/remove` 移除好友
  - `GET /api/friends/status/:user_id` 檢查好友狀態
  - `GET /api/friends` 獲取好友列表
- **資料庫操作**
  - `search_users()` 方法
  - `send_friend_request()` 方法
  - `check_friendship_status()` 方法
  - `accept_friend_request()` 方法
  - `reject_friend_request()` 方法
  - `remove_friend()` 方法
  - `get_user_friends()` 方法
- **業務邏輯**
  - 重複請求防護
  - 好友狀態檢查
  - 雙向好友關係維護

#### Day 18 (11/30)：好友系統前端介面
- **好友列表組件**
  - `FriendsList.vue` 好友列表顯示
  - 好友在線狀態顯示
  - 點擊好友進入聊天
  - 移除好友功能
- **添加好友功能**
  - `AddFriendModal.vue` 搜尋與添加模態框
  - 用戶搜尋功能
  - 好友請求發送
  - 請求狀態顯示
- **好友請求管理**
  - 待處理請求列表
  - 接受/拒絕按鈕
  - 請求通知顯示
- **用戶資料彈窗**
  - `UserProfilePopup.vue` 用戶資料顯示
  - 公開資料展示
  - 好友狀態顯示
  - 添加好友按鈕
  - 從聊天室/聚會中觸發

#### Day 19 (12/1)：個人資料管理
- **個人資料後端 API**
  - `GET /api/user-profile/:user_id` 獲取用戶資料
  - `POST /api/update-profile` 更新個人資料
  - `POST /api/update-avatar` 更新頭像
  - 基本資料與詳細資料分離處理
- **個人資料前端**
  - `ProfileView.vue` 個人資料頁面
  - 基本資料編輯表單
  - 詳細資料編輯表單
  - 頭像上傳與裁剪功能
  - Cropper.js 整合
  - 頭像查看功能
  - 資料更新 API 串接

#### Day 20-21 (12/2-12/3)：管理員功能
- **管理員後端 API**
  - `GET /api/admin/meetings` 獲取所有聚會
  - `POST /api/admin/meetings/:meeting_id/cancel` 取消聚會
  - `POST /api/admin/meetings/:meeting_id/end` 結束聚會
  - `GET /api/admin/users` 獲取所有用戶
  - `GET /api/admin/users/:user_id` 獲取用戶詳情
  - `POST /api/admin/users/:user_id/remove` 移除用戶
  - `GET /api/admin/all-private-chats` 獲取所有私人聊天對話列表
  - `POST /api/admin/chat-history` 獲取指定兩個用戶間的私人聊天記錄
  - `GET /api/admin/all-meeting-chats` 獲取所有有聊天記錄的聚會列表
  - `GET /api/admin/meeting-chat/:meeting_id` 獲取指定聚會的聊天記錄
  - `GET /api/admin/chat-partners/:user_id` 獲取用戶聊天對象列表
- **管理員前端介面**
  - `AdminLobbyView.vue` 管理員控制台
  - `AdminMeetingsView.vue` 聚會管理頁面
  - `AdminUsersView.vue` 用戶管理頁面
  - `AdminUserChatRecordsView.vue` 私人聊天記錄頁面
  - `AdminMeetingChatRecordsView.vue` 聚會聊天記錄頁面
  - 管理員路由保護

#### Day 22 (12/4)：最終整合與優化
- **安全性強化**
  - 路由守衛完整實作
  - API 端點權限檢查
  - 404 頁面處理
  - SPA 路由配置（Vercel）
  - 內嵌瀏覽器檢測與提示
  - Google OAuth 錯誤處理
- **使用者體驗優化**
  - 載入狀態顯示
  - 錯誤訊息提示
  - 成功操作反饋
  - 表單驗證完善
  - 響應式設計優化
  - 介面細節調整
- **部署準備**
  - `vercel.json` 配置完善
  - 環境變數配置
  - 資料庫連接測試
  - API 端點測試
  - 前端構建測試
  - 部署到 Vercel
- **文檔撰寫**
  - README.md 完整文檔
  - API 端點文檔
  - 部署指南
  - 開發指南

### 實際開發成果（超前進度）

由於開發效率超出預期，實際完成時間較計劃提前，並額外完成了以下優化項目：

- **進階功能實作**
  - 頭像裁剪功能完整實作（Cropper.js 整合）
  - 用戶資料彈窗組件（可從多處觸發）
  - 聚會參與者列表查看功能
  - 內嵌瀏覽器智能檢測（多種瀏覽器支援）
  - 外部瀏覽器開啟指引與 URL 複製功能
  - 管理員聊天記錄完整列表功能（所有私人對話、所有聚會聊天）
  - 用戶資訊完整顯示（包含所有詳細資料欄位、社群帳號顯示邏輯）
  - 狀態顯示優化（黑字顯示，提高可讀性）

- **安全性增強**
  - 完整的錯誤處理機制
  - Token 過期自動處理
  - 路由權限細粒度控制
  - 404 頁面與 SPA 路由支援
  - 輸入驗證與 SQL 注入防護

- **使用者體驗優化**
  - 響應式設計完善
  - 載入狀態與錯誤提示
  - 操作反饋機制
  - 介面細節優化
  - 跨瀏覽器兼容性測試

- **文檔完善**
  - 完整的 README.md 文檔
  - 專案結構說明
  - API 端點文檔
  - 部署指南
  - 開發指南

