# Phase 7: 部署準備與文件撰寫

本階段目標是準備專案的部署文件，並更新 README.md 以包含完整的專案說明與設定指南。

## 1. 部署準備

1. **環境變數檢查**：
   - 確保 `.env.example` 包含所有必要的環境變數。
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `LINE_CHANNEL_SECRET`

2. **Build 腳本檢查**：
   - 確認 `package.json` 中的 `build` 腳本正確。
   - `prisma generate` 應在 build 前執行。

## 2. 建立部署文件 (DEPLOYMENT.md)

建立一份詳細的部署指南，包含：
- Vercel 部署步驟
- 資料庫設定 (Neon/Postgres)
- 環境變數設定
- LINE Bot Webhook 設定
- Google OAuth 設定

## 3. 更新專案文件 (README.md)

更新 README.md，包含：
- 專案簡介 (LINE Travel Bot)
- 功能列表 (對話式旅遊規劃、後台管理、數據分析)
- 技術堆疊 (Next.js, Prisma, Tailwind CSS, Line Bot SDK)
- 本地開發指南
- 測試指南

## 4. 最終檢查

- 執行 `yarn build` 確保專案可正常編譯。
- 執行 `yarn lint` 檢查程式碼品質。

