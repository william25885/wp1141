# 測試指南

## 🚀 啟動步驟

### 1. 啟動後端 (Flask)

打開第一個終端視窗：

```bash
cd backend
python app.py
```

**預期輸出：**
```
 * Running on http://127.0.0.1:8800
 * Debug mode: on
```

✅ 如果看到這個訊息，表示後端啟動成功！

### 2. 啟動前端 (Vue.js)

打開第二個終端視窗：

```bash
cd frontend
npm run dev
```

**預期輸出：**
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ 如果看到這個訊息，表示前端啟動成功！

### 3. 訪問應用程式

在瀏覽器中打開：
```
http://localhost:5173
```

## 🧪 測試功能

### 基本功能測試

1. **用戶註冊**
   - 訪問註冊頁面
   - 填寫用戶資料
   - 提交註冊
   - ✅ 應該成功創建帳號

2. **用戶登入**
   - 使用註冊的帳號登入
   - ✅ 應該成功登入並跳轉

3. **查看聚會列表**
   - 登入後查看可用聚會
   - ✅ 應該顯示聚會列表（可能為空）

4. **創建聚會**
   - 創建一個新聚會
   - ✅ 應該成功創建並顯示在列表中

5. **加入聚會**
   - 加入一個聚會
   - ✅ 應該成功加入

### 檢查資料庫

如果需要檢查資料是否正確寫入 Neon 資料庫：

```bash
# 在後端目錄
cd backend
python -c "
from DB_utils import DatabaseManager
db = DatabaseManager()

# 檢查用戶數量
from psycopg2.extras import RealDictCursor
cur = db.conn.cursor(cursor_factory=RealDictCursor)
cur.execute('SELECT COUNT(*) as count FROM \"USER\"')
result = cur.fetchone()
print(f'用戶數量: {result[\"count\"]}')

# 檢查聚會數量
cur.execute('SELECT COUNT(*) as count FROM \"MEETING\"')
result = cur.fetchone()
print(f'聚會數量: {result[\"count\"]}')
"
```

## ⚠️ 常見問題

### 1. 後端啟動失敗

**錯誤：`DATABASE_URL 未設置`**
- 檢查 `backend/.env` 文件是否存在
- 確認 `DATABASE_URL` 已設置

**錯誤：`connection refused` 或 `SSL` 相關錯誤**
- 檢查 Neon 資料庫連接字符串是否正確
- 確認網路連接正常

**錯誤：`column "xxx" does not exist`**
- 這是 SQL 大小寫問題
- 需要修正對應的 SQL 查詢（添加引號）

### 2. 前端無法連接後端

**檢查：**
- 後端是否在 `http://127.0.0.1:8800` 運行
- 前端 API 配置是否正確（應該指向 `http://127.0.0.1:8800/api`）

### 3. CORS 錯誤

如果遇到 CORS 錯誤，檢查 `backend/app.py` 中的 CORS 配置：
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        ...
    }
})
```

## 📝 測試檢查清單

- [ ] 後端成功啟動（port 8800）
- [ ] 前端成功啟動（port 5173）
- [ ] 可以訪問首頁
- [ ] 可以註冊新用戶
- [ ] 可以登入
- [ ] 可以查看聚會列表
- [ ] 可以創建聚會
- [ ] 可以加入聚會
- [ ] 資料正確寫入資料庫

## 🎯 下一步

如果所有基本功能測試通過，可以繼續測試：
- 個人資料管理
- 聊天功能
- 管理員功能
- 其他進階功能

