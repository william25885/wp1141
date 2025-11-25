# Phase 4 測試指南：後台管理與 Google 登入

本階段目標是設定 Google OAuth 登入並驗證受保護的後台介面。

## 1. 設定 Google OAuth

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)。
2. 建立一個新專案。
3. 進入 **APIs & Services** > **Credentials**。
4. 點擊 **Create Credentials** > **OAuth client ID**。
5. 選擇 **Web application**。
6. 設定 **Authorized JavaScript origins** (已授權的 JavaScript 來源)：
   - `http://localhost:3000`
7. 設定 **Authorized redirect URIs** (已授權的重新導向 URI)：
   - `http://localhost:3000/api/auth/callback/google`
8. 點擊 **Create**。
9. 複製 **Client ID** 與 **Client Secret**。

## 2. 設定環境變數

編輯 `.env` 檔案，填入步驟 1 取得的資訊：

```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-string" # 使用 `openssl rand -base64 32` 生成

GOOGLE_CLIENT_ID="你的 Client ID"
GOOGLE_CLIENT_SECRET="你的 Client Secret"
```

## 3. 執行測試

### 3.1 啟動開發伺服器

```bash
yarn dev
```

### 3.2 訪問受保護頁面

1. 在瀏覽器打開 `http://localhost:3000/admin`。
2. **預期結果**：因為尚未登入，系統應自動導向至 `http://localhost:3000/admin/login`。

### 3.3 進行登入

1. 在登入頁面點擊「使用 Google 帳號登入」。
2. 選擇您的 Google 帳號。
3. **預期結果**：登入成功後，系統應導向回 `http://localhost:3000/admin`。

### 3.4 驗證後台首頁

1. 確認頁面顯示「儀表板」。
2. 確認右上角顯示您的 Google 帳號名稱與 Email。
3. 確認數據卡片顯示目前的使用者數與對話數（如果您之前執行過 Phase 3 測試，應該會有數據）。
4. 確認「最近活動」列表顯示測試資料。

### 3.5 測試登出

1. 點擊右上角的「登出」按鈕。
2. **預期結果**：系統應登出並導向回登入頁面或首頁。
3. 再次訪問 `/admin`，確認需要重新登入。

## 常見問題

- **redirect_uri_mismatch**: 檢查 Google Console 中的 Redirect URI 是否完全匹配 `http://localhost:3000/api/auth/callback/google`。
- **Try signing in with a different account**: 確保測試用的 Google 帳號未被停用。

