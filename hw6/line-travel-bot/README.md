# LINE Travel Bot

一個基於 LINE Bot 的對話式旅遊規劃系統，結合 AI 推薦與後台管理功能。

## 專案簡介

LINE Travel Bot 是一個智能旅遊規劃助手，透過 LINE 對話介面收集使用者的旅遊偏好（目的地、天數、預算、主題、月份），並提供個人化的旅遊推薦。同時提供完整的後台管理系統，讓管理員可以查看對話紀錄、分析數據，並管理所有使用者的互動。

## 功能特色

### 🤖 LINE Bot 功能
- **對話式資料收集**：透過自然對話收集旅遊偏好
- **狀態管理**：追蹤對話進度（詢問國家、天數、預算、主題、月份）
- **智能推薦**：根據使用者偏好生成旅遊規劃建議
- **對話紀錄**：完整保存所有使用者與 Bot 的互動歷史

### 📊 後台管理系統
- **Google OAuth 登入**：安全的後台存取控制
- **對話列表**：查看所有使用者的對話紀錄
- **對話詳情**：查看完整的對話內容、旅遊偏好與推薦結果
- **搜尋與篩選**：依使用者 ID 或狀態篩選對話
- **數據分析**：
  - 熱門目的地統計
  - 對話狀態分佈
  - 規劃完成率

## 技術堆疊

- **前端框架**: Next.js 16 (App Router)
- **後端**: Next.js API Routes
- **資料庫**: PostgreSQL (使用 Neon)
- **ORM**: Prisma
- **認證**: NextAuth.js (Google OAuth)
- **樣式**: Tailwind CSS
- **LINE Bot SDK**: @line/bot-sdk
- **語言**: TypeScript

## 專案結構

```
hw6/line-travel-bot/
├── app/
│   ├── admin/              # 後台管理頁面
│   │   ├── page.tsx        # 儀表板
│   │   ├── conversations/  # 對話列表與詳情
│   │   └── analytics/      # 數據分析
│   ├── api/
│   │   ├── auth/           # NextAuth 認證
│   │   └── webhook/        # LINE Bot Webhook
│   └── login/              # 登入頁面
├── lib/
│   ├── prisma.ts           # Prisma Client
│   ├── line-bot.ts         # LINE Bot Client
│   └── conversation-state.ts # 對話狀態管理
├── prisma/
│   └── schema.prisma       # 資料庫 Schema
└── scripts/
    ├── seed-test-data.ts   # 測試資料腳本
    └── test-phase3.ts     # Phase 3 測試腳本
```

## 快速開始

### 前置需求

- Node.js 18.x 或以上
- Yarn 或 npm
- PostgreSQL 資料庫（推薦使用 [Neon](https://neon.tech/)）

### 安裝步驟

1. **複製專案**：
   ```bash
   cd hw6/line-travel-bot
   ```

2. **安裝依賴**：
   ```bash
   yarn install
   ```

3. **設定環境變數**：
   ```bash
   cp .env.example .env
   ```
   編輯 `.env` 檔案，填入必要的環境變數（詳見下方）。

4. **初始化資料庫**：
   ```bash
   npx prisma migrate dev --name init
   ```

5. **啟動開發伺服器**：
   ```bash
   yarn dev
   ```

6. **訪問應用**：
   - 前端：http://localhost:3000
   - 後台：http://localhost:3000/admin

## 環境變數設定

### 必須設定的環境變數

```bash
# 資料庫連線
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# NextAuth 設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-string  # 使用 `openssl rand -base64 32` 生成

# Google OAuth (後台登入)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 可選的環境變數（LINE Bot）

```bash
# LINE Bot（如果不需要 LINE Bot 功能，可以不設定）
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
LINE_CHANNEL_SECRET=your-line-channel-secret
```

> **注意**：後台管理功能不需要 LINE Bot 設定即可正常運作。只有在需要使用 LINE Bot 對話功能時才需要設定。

## 測試資料

插入測試資料以測試後台功能：

```bash
yarn seed:test
```

這會建立 5 個測試使用者與 8 個對話紀錄，包含不同狀態的對話與完整的旅遊偏好資料。

## 開發指令

```bash
# 啟動開發伺服器
yarn dev

# 建置生產版本
yarn build

# 啟動生產伺服器
yarn start

# 執行 Lint
yarn lint

# 插入測試資料
yarn seed:test

# 執行 Phase 3 測試
yarn test:phase3

# 開啟 Prisma Studio（資料庫管理工具）
npx prisma studio
```

## 測試指南

專案包含多個階段的測試文件：

- **TEST_PHASE3.md**: 資料庫儲存系統測試
- **TEST_PHASE4.md**: 後台登入與權限測試
- **TEST_PHASE5.md**: 對話列表與詳情頁面測試
- **TEST_PHASE6.md**: 搜尋、篩選與數據分析測試

## 部署

詳細的部署指南請參考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

### 快速部署到 Vercel

1. 推送程式碼到 GitHub
2. 在 [Vercel](https://vercel.com/) 建立新專案
3. 設定環境變數
4. 部署完成！

## 專案階段

- ✅ **Phase 1-2**: LINE Bot 基礎設定與對話流程
- ✅ **Phase 3**: 資料庫儲存系統
- ✅ **Phase 4**: 後台登入與權限管理
- ✅ **Phase 5**: 對話列表與詳情頁面
- ✅ **Phase 6**: 搜尋、篩選與數據分析
- ✅ **Phase 7**: 部署準備與文件撰寫

## 相關文件

- [部署指南](./DEPLOYMENT.md)
- [測試與設定指南](./TESTING.md)
- [Phase 3 測試結果](./PHASE3_RESULTS.md)

## 授權

本專案為課程作業專案。
