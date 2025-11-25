# 部署指南 (Deployment Guide)

本文件說明如何將 LINE Travel Bot 部署到 Vercel 平台。

## 前置需求

1. **GitHub 帳號**：用於版本控制
2. **Vercel 帳號**：用於部署 Next.js 應用
3. **Neon 帳號**（或其他 PostgreSQL 服務）：用於資料庫
4. **Google Cloud Console 帳號**：用於 OAuth 登入
5. **LINE Developers Console 帳號**：用於 LINE Bot（可選，後台功能不需要）

## 步驟 1: 準備資料庫 (PostgreSQL)

### 使用 Neon (推薦)

1. 前往 [Neon](https://neon.tech/) 註冊帳號
2. 建立新專案
3. 複製連線字串（格式：`postgresql://user:password@host/database?sslmode=require`）
4. 儲存此連線字串，稍後會用到

## 步驟 2: 設定 Google OAuth

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 **Google+ API**
4. 進入 **APIs & Services** > **Credentials**
5. 點擊 **Create Credentials** > **OAuth client ID**
6. 選擇 **Web application**
7. 設定 **Authorized JavaScript origins**：
   - 開發環境：`http://localhost:3000`
   - 生產環境：`https://your-domain.vercel.app`
8. 設定 **Authorized redirect URIs**：
   - 開發環境：`http://localhost:3000/api/auth/callback/google`
   - 生產環境：`https://your-domain.vercel.app/api/auth/callback/google`
9. 複製 **Client ID** 與 **Client Secret**

## 步驟 3: 設定 LINE Bot（可選）

如果您要啟用 LINE Bot 功能：

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 建立新 Provider 和 Channel
3. 在 **Messaging API** 頁面：
   - 複製 **Channel access token (long-lived)**
   - 複製 **Channel secret**
4. 設定 Webhook URL（部署後再設定）：
   - `https://your-domain.vercel.app/api/webhook/line`

## 步驟 4: 部署到 Vercel

### 4.1 推送程式碼到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 4.2 在 Vercel 建立專案

1. 前往 [Vercel](https://vercel.com/) 並登入
2. 點擊 **Add New Project**
3. 選擇您的 GitHub repository
4. 設定專案：
   - **Framework Preset**: Next.js
   - **Root Directory**: `hw6/line-travel-bot`（如果專案在子資料夾）
   - **Build Command**: `yarn build`（或 `npm run build`）
   - **Output Directory**: `.next`
   - **Install Command**: `yarn install`（或 `npm install`）

### 4.3 設定環境變數

在 Vercel 專案設定中，加入以下環境變數：

#### 必須設定的環境變數：

```bash
# 資料庫連線
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# NextAuth 設定
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-random-secret-string  # 使用 `openssl rand -base64 32` 生成

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### 可選的環境變數（LINE Bot）：

```bash
# LINE Bot（如果不需要 LINE Bot 功能，可以不設定）
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
LINE_CHANNEL_SECRET=your-line-channel-secret
```

### 4.4 執行資料庫遷移

部署後，需要在 Vercel 的環境中執行 Prisma 遷移：

1. 在 Vercel 專案中，進入 **Settings** > **Functions**
2. 或使用 Vercel CLI：

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 連結專案
vercel link

# 執行遷移（使用 Vercel 的環境變數）
vercel env pull .env.production
npx prisma migrate deploy
```

或者，您可以在 Vercel 的 **Deployments** 頁面中，點擊部署旁邊的 **...** > **Redeploy**，確保 `package.json` 中的 `build` 腳本包含 `prisma migrate deploy`。

## 步驟 5: 驗證部署

1. 訪問您的 Vercel URL：`https://your-domain.vercel.app`
2. 測試後台登入：`https://your-domain.vercel.app/admin`
3. 確認 Google OAuth 登入正常運作
4. 測試後台功能（對話列表、詳情、搜尋、數據分析）

## 步驟 6: 設定 LINE Webhook（如果啟用 LINE Bot）

1. 在 LINE Developers Console 中，進入您的 Channel
2. 在 **Messaging API** 頁面，找到 **Webhook URL**
3. 輸入：`https://your-domain.vercel.app/api/webhook/line`
4. 點擊 **Verify** 確認連線
5. 啟用 **Use webhook**

## 常見問題

### 問題 1: 資料庫連線失敗

- 確認 `DATABASE_URL` 格式正確
- 確認資料庫允許來自 Vercel IP 的連線（Neon 預設允許）
- 檢查 SSL 模式設定

### 問題 2: NextAuth 錯誤

- 確認 `NEXTAUTH_SECRET` 已設定且長度足夠（至少 32 字元）
- 確認 `NEXTAUTH_URL` 與實際部署的 URL 一致
- 清除瀏覽器 cookies 後重試

### 問題 3: Google OAuth 錯誤

- 確認 Redirect URI 在 Google Console 中正確設定
- 確認 Client ID 和 Secret 正確
- 檢查 Authorized JavaScript origins 是否包含您的域名

### 問題 4: Build 失敗

- 確認 `package.json` 中的 `build` 腳本包含 `prisma generate`
- 檢查 Vercel 的 Build Logs 查看詳細錯誤
- 確認 Node.js 版本（建議 18.x 或以上）

## 環境變數檢查清單

部署前，確認以下環境變數都已設定：

- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `LINE_CHANNEL_ACCESS_TOKEN`（可選）
- [ ] `LINE_CHANNEL_SECRET`（可選）

## 後續維護

- **資料庫備份**：定期備份 Neon 資料庫
- **環境變數更新**：如需更新環境變數，在 Vercel 設定中修改後重新部署
- **監控**：使用 Vercel Analytics 監控應用效能

