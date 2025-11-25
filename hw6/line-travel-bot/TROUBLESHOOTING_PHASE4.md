# Phase 4 錯誤排除指南

## 問題：JWT Session Error

### 錯誤訊息
```
[next-auth][error][JWT_SESSION_ERROR] 
Invalid Compact JWE
```

### 原因分析

這個錯誤通常發生在以下情況：

1. **NEXTAUTH_SECRET 未正確設定或格式錯誤**
   - NextAuth 需要一個有效的 secret 來加密/解密 JWT token
   - Secret 應該是至少 32 字元的隨機字串

2. **瀏覽器中有舊的 session cookie**
   - 如果之前測試時使用了不同的 secret，瀏覽器中可能存有舊的加密 cookie
   - 新的 secret 無法解密舊的 cookie，導致錯誤

3. **環境變數未正確載入**
   - Next.js 需要重新啟動才能載入新的環境變數

### 解決步驟

#### 步驟 1: 確認 NEXTAUTH_SECRET 已正確設定

檢查 `.env` 檔案中是否有：
```bash
NEXTAUTH_SECRET="your-secret-here"
```

如果沒有或格式不正確，生成一個新的：

```bash
# 在終端機執行
openssl rand -base64 32
```

將結果複製到 `.env` 檔案中。

#### 步驟 2: 清除瀏覽器 Cookie

1. 打開瀏覽器開發者工具 (F12)
2. 進入 **Application** (Chrome) 或 **Storage** (Firefox) 標籤
3. 在左側找到 **Cookies** > `http://localhost:3000`
4. 刪除所有與 `next-auth` 相關的 cookie（例如 `next-auth.session-token`）
5. 或直接清除所有 localhost 的 cookies

#### 步驟 3: 重新啟動開發伺服器

```bash
# 停止目前的伺服器 (Ctrl+C)
# 然後重新啟動
yarn dev
```

#### 步驟 4: 重新測試登入

1. 訪問 `http://localhost:3000/admin`
2. 應該會導向到登入頁面
3. 點擊「使用 Google 帳號登入」
4. 完成 OAuth 流程

### 驗證配置

確認以下環境變數都已正確設定：

```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="至少32字元的隨機字串"
GOOGLE_CLIENT_ID="你的 Google Client ID"
GOOGLE_CLIENT_SECRET="你的 Google Client Secret"
```

### 如果問題持續

1. **檢查終端機輸出**：確認沒有其他錯誤訊息
2. **檢查 Google OAuth 設定**：
   - 確認 Redirect URI 正確設定為 `http://localhost:3000/api/auth/callback/google`
   - 確認 Client ID 和 Secret 正確
3. **檢查 Prisma Adapter**：確認資料庫連線正常，NextAuth 需要建立 User、Account、Session 等表格

### 預期行為

修正後，您應該能夠：
- ✅ 訪問 `/admin` 時自動導向到 `/admin/login`
- ✅ 點擊登入按鈕後跳轉到 Google 登入頁面
- ✅ 登入成功後回到 `/admin` 並看到儀表板
- ✅ 右上角顯示您的 Google 帳號資訊

