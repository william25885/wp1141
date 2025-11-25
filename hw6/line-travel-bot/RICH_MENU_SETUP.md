# Rich Menu（圖文選單）設定指南

Rich Menu 是 LINE Bot 的底部選單功能，讓使用者可以在聊天介面下方看到功能列表，點擊即可使用。

## 方式一：使用 LINE 官方帳號管理後台（推薦）

這是最簡單的方式，不需要寫程式碼：

### 步驟 1: 登入管理後台

1. 前往 [LINE 官方帳號管理後台](https://admin-official.line.me/)
2. 使用您的 LINE 帳號登入
3. 選擇您的 Bot 帳號

### 步驟 2: 建立圖文選單

1. 在左側選單中，點擊 **「圖文選單」**
2. 點擊 **「建立新頁面」**
3. 設定選單內容：
   - **選單名稱**：功能選單（僅供管理使用）
   - **顯示方式**：選擇「預設展開」或「預設收起」
   - **選單按鈕**：新增以下按鈕
     - 旅遊推薦（發送訊息：`旅遊推薦`）
     - 查詢偏好（發送訊息：`查詢偏好`）
     - 查看上次行程（發送訊息：`查看上次行程`）
     - 修改偏好（發送訊息：`修改偏好`）

### 步驟 3: 設計選單外觀

- 可以選擇 LINE 提供的模板
- 或上傳自訂圖片（建議尺寸：2500x1686px 或 2500x843px）
- 設定每個按鈕的位置和文字

### 步驟 4: 發布選單

1. 完成設定後，點擊 **「儲存」**
2. 點擊 **「發布」**
3. 選單會立即生效，所有使用者都能看到

## 方式二：使用 API 設定（進階）

如果您想透過 API 自動設定 Rich Menu：

### 步驟 1: 準備圖片

- 圖片尺寸：2500x1686px（2x3 布局）或 2500x843px（1x3 布局）
- 格式：PNG 或 JPEG
- 檔案大小：小於 1MB

### 步驟 2: 建立 Rich Menu

```bash
# 呼叫 API 建立 Rich Menu 結構
curl -X POST https://your-domain.vercel.app/api/webhook/setup-menu \
  -H "Content-Type: application/json"
```

### 步驟 3: 上傳圖片

```bash
# 使用 LINE Messaging API 上傳圖片
curl -X POST \
  https://api-data.line.me/v2/bot/richmenu/{richMenuId}/content \
  -H "Authorization: Bearer {YOUR_CHANNEL_ACCESS_TOKEN}" \
  -H "Content-Type: image/png" \
  --data-binary @menu-image.png
```

### 步驟 4: 設定為預設選單

```bash
# 設定為預設 Rich Menu
curl -X POST \
  https://api.line.me/v2/bot/user/all/richmenu/{richMenuId} \
  -H "Authorization: Bearer {YOUR_CHANNEL_ACCESS_TOKEN}"
```

## 功能按鈕對應

Rich Menu 中的按鈕會發送以下訊息，Bot 會自動處理：

| 按鈕文字 | 發送訊息 | 功能說明 |
|---------|---------|---------|
| 旅遊推薦 | `旅遊推薦` | 開始旅遊規劃流程 |
| 查詢偏好 | `查詢偏好` | 查看已保存的旅遊偏好 |
| 查看上次行程 | `查看上次行程` | 查看最近的行程規劃記錄 |
| 修改偏好 | `修改偏好` | 重置偏好並重新開始規劃 |

## 注意事項

1. **圖片尺寸**：必須符合 LINE 的規格要求
2. **按鈕數量**：最多 6 個按鈕（2x3 或 1x6 布局）
3. **按鈕文字**：必須與 Bot 處理的訊息文字一致
4. **發布後生效**：選單發布後，所有使用者都能看到

## 測試

設定完成後，請測試：

1. 在 LINE App 中開啟與 Bot 的對話
2. 確認聊天介面下方有「選單」按鈕
3. 點擊「選單」展開功能列表
4. 測試每個按鈕是否正常運作

## 相關文件

- [LINE Rich Menu API 文件](https://developers.line.biz/en/docs/messaging-api/using-rich-menus/)
- [LINE 官方帳號管理後台](https://admin-official.line.me/)

