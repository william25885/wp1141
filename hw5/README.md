# X-Clone

製作個Twitter / X 複製版專案

---

## 🌐 部署連結

[Live Demo](https://wp1141-black.vercel.app/)

技術

- [Next.js 14 / App Router](https://nextjs.org/)
- TypeScript
- [NextAuth.js](https://next-auth.js.org/)（Google Provider, Prisma Adapter）
- [Prisma](https://www.prisma.io/)
- PostgreSQL（建議使用 [Neon](https://neon.tech/)）
- Tailwind CSS（透過 className 實作樣式）

---

專案功能說明

1. 登入流程

1. 進入 `/login`
2. 可選擇：
   - 直接點擊 **Continue with Google** 使用 Google 帳號登入
   - （預留）輸入既有 `userId` 以支援 userID 登入邏輯
3. 第一次使用該 Google 帳號登入時，會被導向 `/setup` 設定 `userId`
4. 設定完成後導回 `/` 首頁

實作檔案：

- `app/api/auth/[...nextauth]/route.ts`
- `app/login/page.tsx`
- `app/setup/page.tsx`
- `lib/prisma.ts`

2. userID 設定（/setup）

- 僅登入後且尚未設定 `userId` 的使用者可進入
- 填寫欲使用的 ID，例如 `jensenbolt`
- 會檢查是否已被使用（Prisma unique 保證）
- 儲存到 `User.userId` 後導回 `/`

3. 首頁 Home（/）

- 僅登入使用者可進入，未登入會 redirect `/login`
- 若尚未設定 `userId`，會 redirect `/setup`
- 顯示：
  - 左側 Sidebar：Logo、Home / Profile 連結、目前登入帳號＋登出按鈕
  - 中間主欄：
    - 發文區塊 `<NewPostForm />`
    - 最新 50 筆貼文列表（`prisma.post.findMany`，依 `createdAt desc`）
    - 每則貼文展示：
      - 作者頭貼 / 名稱 / userId / 時間
      - 貼文內容
      - 底部統計列：
        -  回覆數（僅顯示數字）
        -  Repost 數（僅顯示數字）
        -  Like：使用 `<LikeButton />`，可點擊切換狀態與數量

實作檔案：

- `app/page.tsx`
- `app/_components/NewPostForm.tsx`
- `app/_components/LikeButton.tsx`
- `app/_components/LogoutButton.tsx` (signOut)

 4. 個人頁面（/[userId]）

- 透過動態路由 `app/[userId]/page.tsx`
- 依網址中的 `userId` 查詢 `User`
- 顯示：
  - 使用者名稱 / userId
  - bio（如有）
  - 貼文數 / Followers / Following（根據 Prisma schema 的 `_count`）
  - 該使用者的貼文列表（時間排序）

---

資料庫 Schema

使用 Prisma 定義，包含：

- `User`：Google 帳號
- `Account`, `Session`, `VerificationToken`：NextAuth 
- `Post`：貼文，支援回覆
- `Like`：貼文按讚
- `Repost`：轉發
- `Follow`：追蹤關係


---

## 🚀 開始使用

### 環境需求

- Node.js 18+ 和 npm/yarn
- PostgreSQL 資料庫（建議使用 [Neon](https://neon.tech/)）

### 安裝步驟

1. **安裝 Node.js**（如果尚未安裝）：
   - 前往 [Node.js 官網](https://nodejs.org/) 下載並安裝
   - 安裝完成後，在終端執行 `node --version` 確認安裝成功

2. **安裝 Yarn**（可選，專案使用 yarn）：
   ```bash
   npm install -g yarn
   ```

3. **安裝專案依賴**：
   ```bash
   yarn install
   # 或使用 npm
   npm install
   ```

4. **設定資料庫**：
   - 執行 Prisma migration：
     ```bash
     npx prisma migrate dev
     # 或使用 yarn
     yarn prisma migrate dev
     ```

5. **啟動開發伺服器**：
   ```bash
   yarn dev
   # 或使用 npm
   npm run dev
   ```

6. 開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

---

## ⚙️ 環境變數設定

在專案根目錄建立 `.env` 檔案，可參考 `.env.example` 範例檔案。

**本地開發環境：**

1. 複製範例檔案：
   ```bash
   cp .env.example .env
   ```

2. 填入以下環境變數：

```env
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**取得資料庫連線字串 (DATABASE_URL)：**

1. **使用 Neon（推薦）：**
   - 前往 [Neon](https://neon.tech/) 註冊帳號
   - 建立新的 PostgreSQL 專案
   - 在專案 Dashboard 中找到 **Connection string**
   - 複製連線字串，格式類似：`postgresql://user:password@host/database?sslmode=require`
   - 將連線字串貼到 `.env` 檔案的 `DATABASE_URL` 欄位

2. **使用其他 PostgreSQL 服務：**
   - 建立 PostgreSQL 資料庫後，取得連線字串
   - 格式：`postgresql://username:password@host:port/database?sslmode=require`
   - 將連線字串貼到 `.env` 檔案的 `DATABASE_URL` 欄位

**取得 OAuth 憑證：**

- **Google OAuth**: 前往 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 建立 OAuth 2.0 憑證
  - 在 OAuth 憑證設定中，需要設定以下內容：
    - **已授權的 JavaScript 來源**：
      - `http://localhost:3000`（本地開發用）
      - `https://your-domain.vercel.app`（生產環境用）
    - **已授權的重新導向 URI**：
      - `http://localhost:3000/api/auth/callback/google`（本地開發用）
      - `https://your-domain.vercel.app/api/auth/callback/google`（生產環境用）

- **GitHub OAuth**: 前往 [GitHub Developer Settings](https://github.com/settings/developers) 建立 OAuth App
  - 在 OAuth App 設定中，需要設定以下內容：
    - **Authorization callback URL**：
      - `http://localhost:3000/api/auth/callback/github`（本地開發用）
      - `https://your-domain.vercel.app/api/auth/callback/github`（生產環境用）

**產生 NEXTAUTH_SECRET：**

**Linux / macOS：**
```bash
openssl rand -base64 32
```

**Windows PowerShell：**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**或使用線上工具：**
- 前往 [generate-secret.vercel.app](https://generate-secret.vercel.app/32) 產生隨機密鑰

**Vercel 部署：**

在 Vercel 專案設定中的 Environment Variables 頁面設定上述所有環境變數。