# 測試與設定指南 (Phase 1 & 2 & 3)

本文件將引導您設定環境變數、準備資料庫，並使用 ngrok 測試 LINE Bot 的對話流程。

## 1. 環境準備

### 1.1 設定環境變數

1. 複製 `.env.example` 為 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 編輯 `.env` 檔案，填入以下資訊：
   - `DATABASE_URL`: 您的 Neon Postgres 連線字串。
     - 格式：`postgresql://user:password@host/database?sslmode=require`
   - `LINE_CHANNEL_ACCESS_TOKEN`: LINE Developers Console > Messaging API > Channel access token (long-lived)。
   - `LINE_CHANNEL_SECRET`: LINE Developers Console > Basic settings > Channel secret。
   - 其他欄位暫時留空即可。

### 1.2 初始化資料庫

確保 `DATABASE_URL` 正確後，執行以下指令將 Schema 部署到資料庫：

```bash
npx prisma migrate dev --name init
```

若指令成功，表示資料庫已就緒。

## 2. 啟動開發伺服器

在專案根目錄 (`hw6/line-travel-bot`) 執行：

```bash
yarn dev
```

伺服器將在 `http://localhost:3000` 啟動。

## 3. 設定 LINE Webhook (使用 ngrok)

為了讓 LINE 伺服器能傳送訊息到您的本機，我們使用 ngrok 建立公開網址。

1. 安裝 ngrok (若尚未安裝)：
   ```bash
   brew install ngrok/ngrok/ngrok
   ```

2. 啟動 ngrok：
   ```bash
   ngrok http 3000
   ```

3. 複製 ngrok 產生的 HTTPS 網址 (例如 `https://xxxx-xxxx.ngrok-free.app`)。

4. 前往 [LINE Developers Console](https://developers.line.biz/)。
   - 選擇您的 Provider 與 Channel。
   - 進入 **Messaging API** 頁面。
   - 找到 **Webhook URL** 欄位，點擊 Edit。
   - 貼上網址並加上 `/api/webhook/line`，例如：
     `https://xxxx-xxxx.ngrok-free.app/api/webhook/line`
   - 點擊 **Update**。
   - 點擊 **Verify**，應顯示 Success。
   - 開啟 **Use webhook** 開關。

5. 關閉 **Auto-reply messages** (自動回覆)：
   - 在 Messaging API 頁面下方找到 "LINE Official Account features"。
   - 點擊 Edit 進入 LINE Official Account Manager。
   - 在 Response settings 中，將 "Auto-response" 設為 Disabled。
   - 確保 "Webhook" 設為 Enabled。

## 4. 測試對話流程

現在您可以拿起手機，加入您的 LINE Bot 好友，並開始測試。

**測試劇本：**

1. **開始對話**：
   - 傳送任意訊息（或加入好友時的歡迎訊息）。
   - Bot 應回覆：「你想去哪個國家或地區呢？...」

2. **輸入國家**：
   - 輸入：`日本`
   - Bot 應回覆：「想玩幾天呢？」

3. **輸入天數**：
   - 輸入：`5天`
   - Bot 應回覆：「那預算大概多少呢？...」

4. **輸入預算**：
   - 輸入：`5萬`
   - Bot 應回覆：「你想以什麼主題為主？」並顯示按鈕選單。

5. **選擇主題**：
   - 點擊按鈕 `美食` 或輸入 `美食`。
   - Bot 應回覆：「預計哪個月份出發呢？...」

6. **輸入月份**：
   - 輸入：`3月`
   - Bot 應回覆：「太棒了～我已經獲得你的旅遊需求了！...」

7. **重新開始**：
   - 輸入：`重新開始`
   - Bot 應回覆：「你想去哪個國家或地區呢？...」 (回到步驟 1)

## 5. 驗證資料庫儲存 (Phase 3)

使用 Prisma Studio 查看資料是否正確寫入：

```bash
npx prisma studio
```

瀏覽器將打開 `http://localhost:5555`。請檢查以下 Tables：

- **LineUser**: 應有您的 User ID。
- **Conversation**: 應有一筆狀態為 `READY` (或 `COMPLETED`) 的紀錄。
- **TravelPreference**: 應有一筆紀錄包含您輸入的 `日本`, `5天`, `5萬`, `美食`, `3月`。
- **Message**: 應包含所有您傳送的訊息與 Bot 的回覆紀錄。

---

若遇到問題，請檢查 Terminal 的錯誤日誌。

