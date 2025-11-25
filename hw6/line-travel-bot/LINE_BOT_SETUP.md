# LINE Bot 串接指南

本文件說明如何將 LINE Travel Bot 串接到 LINE Messaging API。

## 前置需求

1. ✅ 專案已部署到 Vercel
2. ✅ 資料庫已設定並可正常連線
3. ✅ LINE Developers Console 帳號

## 步驟 1: 在 LINE Developers Console 建立 Bot

### 1.1 建立 Provider（如果還沒有）

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 登入您的 LINE 帳號
3. 如果還沒有 Provider，點擊 **Create** 建立新的 Provider
4. 輸入 Provider 名稱（例如：`Travel Bot Provider`）

### 1.2 建立 Messaging API Channel

1. 在 Provider 頁面，點擊 **Create a channel**
2. 選擇 **Messaging API**
3. 填寫 Channel 資訊：
   - **Channel name**: `Travel Bot`（或您喜歡的名稱）
   - **Channel description**: `智能旅遊規劃助手`
   - **Category**: 選擇適當的分類（例如：Travel）
   - **Subcategory**: 選擇子分類
   - **Email address**: 您的聯絡信箱
4. 同意服務條款並點擊 **Create**

## 步驟 2: 取得 Channel Access Token 和 Channel Secret

### 2.1 取得 Channel Secret

1. 在 Channel 頁面，進入 **Basic settings** 標籤
2. 找到 **Channel secret** 欄位
3. 點擊 **Issue** 或複製現有的 Channel secret
4. **重要**：將此值儲存，稍後需要在 Vercel 設定

### 2.2 取得 Channel Access Token

1. 在 Channel 頁面，進入 **Messaging API** 標籤
2. 找到 **Channel access token** 區塊
3. 點擊 **Issue** 建立新的 Token
4. 選擇 **Long-lived token**（長期有效）
5. 複製產生的 Token
6. **重要**：將此值儲存，稍後需要在 Vercel 設定

> **注意**：Channel Access Token 只會顯示一次，請務必妥善保存。如果遺失，需要重新建立。

## 步驟 3: 在 Vercel 設定環境變數

1. 前往您的 Vercel 專案頁面
2. 進入 **Settings** > **Environment Variables**
3. 新增以下兩個環境變數：

   **變數 1:**
   - **Name**: `LINE_CHANNEL_ACCESS_TOKEN`
   - **Value**: 貼上步驟 2.2 取得的 Channel Access Token
   - **Environment**: 選擇 `Production`, `Preview`, `Development`（建議全選）

   **變數 2:**
   - **Name**: `LINE_CHANNEL_SECRET`
   - **Value**: 貼上步驟 2.1 取得的 Channel Secret
   - **Environment**: 選擇 `Production`, `Preview`, `Development`（建議全選）

4. 點擊 **Save** 儲存

5. **重要**：設定環境變數後，需要重新部署才能生效
   - 前往 **Deployments** 頁面
   - 點擊最新部署旁邊的 **...** > **Redeploy**

## 步驟 4: 設定 Webhook URL

### 4.1 取得您的 Vercel 部署 URL

您的部署 URL 格式應該是：`https://your-project-name.vercel.app`

### 4.2 在 LINE Developers Console 設定 Webhook

1. 在 LINE Developers Console，進入您的 Channel
2. 進入 **Messaging API** 標籤
3. 找到 **Webhook URL** 區塊
4. 點擊 **Edit** 或 **Update**
5. 輸入您的 Webhook URL：
   ```
   https://your-project-name.vercel.app/api/webhook/line
   ```
   > 將 `your-project-name` 替換為您的實際 Vercel 專案名稱

6. 點擊 **Update** 儲存

### 4.3 驗證 Webhook

1. 在 **Webhook URL** 區塊，點擊 **Verify** 按鈕
2. 如果顯示 **Success**，表示 Webhook 設定成功
3. 如果顯示錯誤，請檢查：
   - Webhook URL 是否正確
   - Vercel 部署是否成功
   - 環境變數是否已正確設定並重新部署

### 4.4 啟用 Webhook

1. 在 **Messaging API** 頁面，找到 **Use webhook** 開關
2. 將開關切換為 **Enabled**（啟用）

### 4.5 關閉自動回覆（重要）

1. 在 **Messaging API** 頁面，找到 **Auto-reply messages** 區塊
2. 將 **Auto-reply messages** 開關切換為 **Disabled**（關閉）

> **為什麼要關閉？** 如果啟用自動回覆，LINE 會自動回覆所有訊息，這會與我們的 Bot 邏輯衝突。

## 步驟 5: 測試 LINE Bot

### 5.1 加入 Bot 為好友

1. 在 LINE Developers Console，進入 **Messaging API** 標籤
2. 找到 **QR code** 區塊
3. 使用 LINE App 掃描 QR code 加入 Bot 為好友

### 5.2 測試對話流程

發送以下訊息測試 Bot 功能：

1. **發送任意訊息**（例如：`你好`）
   - Bot 應該回覆：`你想去哪個國家或地區呢？\n例如：日本、韓國、泰國、歐洲、海島等。`

2. **回答國家**（例如：`日本`）
   - Bot 應該回覆：`想玩幾天呢？`

3. **回答天數**（例如：`5天`）
   - Bot 應該回覆：`那預算大概多少呢？（可回答區間）`

4. **繼續對話流程**，直到完成所有問題

5. **檢查後台**：
   - 登入後台管理系統：`https://your-project-name.vercel.app/admin`
   - 進入「對話紀錄」頁面
   - 應該能看到剛才的對話紀錄

## 步驟 6: 設定 Rich Menu（圖文選單）

Rich Menu 是 LINE Bot 的底部選單功能，讓使用者可以在聊天介面下方看到功能列表。

### 方式一：使用 LINE 官方帳號管理後台（推薦）

1. 前往 [LINE 官方帳號管理後台](https://admin-official.line.me/)
2. 登入並選擇您的 Bot 帳號
3. 在左側選單中，點擊 **「圖文選單」**
4. 點擊 **「建立新頁面」**
5. 設定選單內容：
   - **選單名稱**：功能選單
   - **顯示方式**：選擇「預設展開」或「預設收起」
   - **選單按鈕**：新增以下按鈕
     - 旅遊推薦（發送訊息：`旅遊推薦`）
     - 查詢偏好（發送訊息：`查詢偏好`）
     - 查看上次行程（發送訊息：`查看上次行程`）
     - 修改偏好（發送訊息：`修改偏好`）
6. 完成設定後，點擊 **「儲存」** 並 **「發布」**

詳細說明請參考 [RICH_MENU_SETUP.md](./RICH_MENU_SETUP.md)

## 步驟 7: 驗證後台功能

1. **登入後台**：`https://your-project-name.vercel.app/admin`
2. **查看對話列表**：`/admin/conversations`
   - 應該能看到所有使用者的對話
   - 包含剛才測試的對話
3. **查看對話詳情**：點擊任一對話
   - 應該能看到完整的對話內容
   - 旅遊偏好資訊
   - 推薦結果（如果已完成）
4. **測試搜尋與篩選**：
   - 使用搜尋功能找到特定使用者
   - 使用狀態篩選查看不同階段的對話
5. **查看數據分析**：`/admin/analytics`
   - 應該能看到熱門目的地統計
   - 對話狀態分佈

## 常見問題排除

### 問題 1: Webhook 驗證失敗

**可能原因：**
- Webhook URL 不正確
- Vercel 部署失敗
- 環境變數未正確設定

**解決方法：**
1. 確認 Webhook URL 格式正確：`https://your-domain.vercel.app/api/webhook/line`
2. 檢查 Vercel 部署日誌，確認沒有錯誤
3. 確認環境變數已設定並重新部署
4. 檢查 Vercel Function Logs 查看是否有錯誤訊息

### 問題 2: Bot 沒有回應

**可能原因：**
- Webhook 未啟用
- 自動回覆功能未關閉
- 環境變數未正確設定

**解決方法：**
1. 確認 **Use webhook** 已啟用
2. 確認 **Auto-reply messages** 已關閉
3. 檢查 Vercel 環境變數是否正確
4. 檢查 Vercel Function Logs 查看錯誤訊息

### 問題 3: 後台看不到對話紀錄

**可能原因：**
- 資料庫連線問題
- 對話未正確儲存

**解決方法：**
1. 檢查 Vercel 環境變數中的 `DATABASE_URL` 是否正確
2. 檢查 Vercel Function Logs 查看資料庫錯誤
3. 使用 Prisma Studio 直接查看資料庫：
   ```bash
   npx prisma studio
   ```

### 問題 4: 環境變數設定後仍無法使用

**重要**：設定環境變數後，必須重新部署才能生效！

**解決方法：**
1. 在 Vercel 專案頁面，進入 **Deployments**
2. 點擊最新部署旁邊的 **...** > **Redeploy**
3. 等待部署完成後再測試

## 檢查清單

完成以下項目後，LINE Bot 即可正常運作：

- [ ] 在 LINE Developers Console 建立 Messaging API Channel
- [ ] 取得並儲存 Channel Access Token
- [ ] 取得並儲存 Channel Secret
- [ ] 在 Vercel 設定 `LINE_CHANNEL_ACCESS_TOKEN` 環境變數
- [ ] 在 Vercel 設定 `LINE_CHANNEL_SECRET` 環境變數
- [ ] 重新部署 Vercel 專案（讓環境變數生效）
- [ ] 在 LINE Developers Console 設定 Webhook URL
- [ ] 驗證 Webhook 連線成功
- [ ] 啟用 **Use webhook**
- [ ] 關閉 **Auto-reply messages**
- [ ] 測試 Bot 對話功能
- [ ] 驗證後台可以看到對話紀錄

## 後續維護

### 更新 Channel Access Token

如果 Token 過期或需要重新建立：

1. 在 LINE Developers Console 建立新的 Token
2. 在 Vercel 更新 `LINE_CHANNEL_ACCESS_TOKEN` 環境變數
3. 重新部署專案

### 監控 Bot 使用情況

1. 在 LINE Developers Console 的 **Messaging API** 頁面可以查看：
   - 訊息發送統計
   - Webhook 事件記錄
   - 錯誤日誌

2. 在 Vercel 的 **Functions** 頁面可以查看：
   - Webhook 端點的呼叫次數
   - 回應時間
   - 錯誤記錄

## 相關文件

- [LINE Messaging API 官方文件](https://developers.line.biz/en/docs/messaging-api/)
- [部署指南](./DEPLOYMENT.md)
- [專案 README](./README.md)

