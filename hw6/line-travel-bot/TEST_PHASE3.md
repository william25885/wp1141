# Phase 3 測試指南

## 測試方式

由於 Prisma 7 的配置問題，我們使用 Next.js API Route 來測試 Phase 3 的資料庫儲存功能。

## 步驟

### 1. 確保資料庫已同步

首先，您需要確保資料庫 schema 已經同步。請執行：

```bash
# 方法 1: 使用 db push (推薦，快速同步)
npx prisma db push

# 或方法 2: 使用 migrate (需要 migration 檔案)
npx prisma migrate dev --name init
```

### 2. 啟動開發伺服器

```bash
yarn dev
```

### 3. 訪問測試 API

在瀏覽器中打開或使用 curl：

```bash
# 使用瀏覽器
http://localhost:3000/api/test/phase3

# 或使用 curl
curl http://localhost:3000/api/test/phase3
```

### 4. 檢查測試結果

測試 API 會執行以下測試：

1. ✅ 資料庫連線測試
2. ✅ 建立 LineUser
3. ✅ 建立 Conversation 與 TravelPreference
4. ✅ 儲存使用者訊息
5. ✅ 更新 TravelPreference
6. ✅ 儲存 Bot 回覆
7. ✅ 建立 TravelRecommendation
8. ✅ 驗證資料查詢
9. ✅ 清理測試資料

如果所有測試通過，您會看到 JSON 回應：

```json
{
  "success": true,
  "message": "Phase 3 測試全部通過！",
  "data": {
    "conversationId": "...",
    "status": "READY",
    "userMessages": 1,
    "botMessages": 1,
    "preference": { ... },
    "recommendationsCount": 1
  }
}
```

## 預期結果

- ✅ 所有資料庫操作成功
- ✅ 資料正確儲存
- ✅ 關聯查詢正常
- ✅ 測試資料自動清理

## 如果遇到錯誤

1. 檢查 `.env` 中的 `DATABASE_URL` 是否正確
2. 確認資料庫已建立且可連線
3. 檢查 Terminal 中的錯誤訊息
4. 確認 Prisma Client 已生成：`npx prisma generate`

