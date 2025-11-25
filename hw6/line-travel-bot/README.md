# LINE Travel Bot

一個基於 LINE Bot 的對話式旅遊規劃系統，結合 AI 推薦與後台管理功能。

## 專案連結

### 🌐 專案首頁
- **網址**：[https://wp1141-mrbm.vercel.app](https://wp1141-mrbm.vercel.app)
  - 包含專案介紹與後台管理入口

### 🤖 LINE Bot
- **LINE 好友資訊**：[@083lhmmz](https://line.me/R/ti/p/@083lhmmz)
  - 掃描 QR Code 或點擊連結即可加入 Bot 為好友

---

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
│   ├── conversation-state.ts # 對話狀態管理
│   ├── gemini.ts           # Gemini AI 整合
│   └── llm-prompts.ts      # LLM Prompt 模板
└── prisma/
    └── schema.prisma       # 資料庫 Schema
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
   在專案根目錄建立 `.env` 檔案，填入必要的環境變數（詳見下方）。

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

### 可選的環境變數（LINE Bot 與 LLM）

```bash
# LINE Bot（如果不需要 LINE Bot 功能，可以不設定）
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
LINE_CHANNEL_SECRET=your-line-channel-secret

# Google Generative AI (Gemini API) - 用於智能行程生成與自然語言解析
# 如果未設定，Bot 將使用規則式流程，無法理解自然語言或生成行程
GEMINI_API_KEY=your-gemini-api-key
```

> **注意**：
> - 後台管理功能不需要 LINE Bot 設定即可正常運作。只有在需要使用 LINE Bot 對話功能時才需要設定。
> - 如果未設定 `GEMINI_API_KEY`，Bot 仍可運作，但只能使用規則式對話流程，無法理解自然語言（如「我想去日本五天」）或生成詳細行程。建議設定以啟用完整的 AI 功能。

**如何取得 Gemini API Key**：
1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登入您的 Google 帳號
3. 點擊 **Create API Key**
4. 複製產生的 API Key

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

# 開啟 Prisma Studio（資料庫管理工具）
npx prisma studio
```

## 部署

詳細的部署指南請參考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

### 快速部署到 Vercel

1. 推送程式碼到 GitHub
2. 在 [Vercel](https://vercel.com/) 建立新專案
3. 設定環境變數
4. 部署完成！

## AI 功能說明

本專案整合了 **Google Gemini API**，提供以下智能功能：

### 自然語言理解
- **智能提取**：從使用者的自然語言輸入中自動提取旅遊偏好
  - 例如：「我想去日本五天」→ 自動提取 `country: "日本"`, `days: "5天"`
  - 例如：「幫我安排3月的海島行程」→ 自動提取 `month: "3月"`, `themes: "海島"`

### 行程生成
- **AI 行程規劃**：根據使用者的偏好自動生成詳細的每日行程
  - 包含景點、活動時間、餐飲推薦
  - 提供 Google Maps 連結
  - 包含旅遊小撇步

### 輸入驗證
- **格式檢查**：自動判斷使用者輸入是否符合預期格式
- **友善引導**：當輸入格式不符時，提供明確的範例引導使用者重新輸入

### 技術細節
- **模型**：使用 `gemini-2.0-flash-exp` 作為主要模型，`gemini-1.5-pro` 作為備用
- **Prompt Engineering**：使用結構化的 Prompt 模板確保輸出格式一致
- **錯誤處理**：包含重試機制和超時保護，確保穩定性

> **注意**：如果未設定 `GEMINI_API_KEY`，Bot 仍可運作，但只能使用規則式對話流程，無法理解自然語言或生成詳細行程。

## 相關文件

- [部署指南](./DEPLOYMENT.md) - 詳細的部署步驟與環境變數設定
- [LINE Bot 設定指南](./LINE_BOT_SETUP.md) - LINE Bot 串接與 Webhook 設定

## 授權

本專案為課程作業專案。
