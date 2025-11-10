# X-Clone

製作個Twitter / X 複製版專案

---

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

環境變數設定

在專案根目錄建立 `.env`：

```env
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET