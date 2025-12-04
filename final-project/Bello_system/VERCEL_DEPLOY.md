# Vercel 部署指南

## 📋 部署前準備

### 1. 環境變數設置

在 Vercel 專案設置中添加以下環境變數：

1. **DATABASE_URL**
   - 你的 Neon PostgreSQL 連接字符串
   - 格式：`postgresql://user:password@host:port/database?sslmode=require`

2. **VERCEL_URL**（自動設置）
   - Vercel 會自動設置，無需手動添加

3. **CUSTOM_DOMAIN**（可選）
   - 如果你有自定義域名，設置此變數

### 2. 專案結構

確保專案結構如下：
```
Bello_system/
├── api/
│   └── index.py          # Vercel Serverless Function 入口
├── backend/
│   ├── app.py            # Flask 應用
│   ├── actions/          # API 路由
│   ├── DB_utils.py       # 資料庫工具
│   └── requirements.txt  # Python 依賴
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── vercel.json           # Vercel 配置文件
```

## 🚀 部署步驟

### 方法 1：使用 Vercel CLI（推薦）

1. **安裝 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   cd /path/to/Bello_system
   vercel
   ```

4. **設置環境變數**
   ```bash
   vercel env add DATABASE_URL
   # 輸入你的 Neon 資料庫連接字符串
   ```

5. **生產環境部署**
   ```bash
   vercel --prod
   ```

### 方法 2：使用 Vercel Dashboard

1. **連接 GitHub/GitLab/Bitbucket**
   - 登入 [Vercel Dashboard](https://vercel.com/dashboard)
   - 點擊 "Add New Project"
   - 選擇你的 Git 倉庫

2. **配置專案**
   - Framework Preset: Other
   - Root Directory: `/`（根目錄）
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`

3. **設置環境變數**
   - 在專案設置中添加 `DATABASE_URL`

4. **部署**
   - 點擊 "Deploy"

## ⚙️ 配置說明

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### 前端 API 配置

前端使用 `src/config/api.js` 來管理 API 基礎 URL：
- 開發環境：使用 `http://localhost:8800`
- 生產環境：使用相對路徑 `/api`（同域）

可以通過環境變數 `VITE_API_URL` 自定義。

## 🔧 本地測試 Vercel 配置

1. **安裝 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **本地運行**
   ```bash
   vercel dev
   ```

3. **訪問**
   - 前端：http://localhost:3000
   - API：http://localhost:3000/api/...

## ⚠️ 注意事項

1. **資料庫連接**
   - 確保 Neon 資料庫允許來自 Vercel 的連接
   - 檢查防火牆和 IP 白名單設置

2. **CORS 配置**
   - 後端已自動配置支持 Vercel 域名
   - 如果使用自定義域名，設置 `CUSTOM_DOMAIN` 環境變數

3. **環境變數**
   - 所有敏感資訊（如 DATABASE_URL）都應設置為環境變數
   - 不要在程式碼中硬編碼

4. **構建時間限制**
   - Vercel 免費版構建時間限制為 45 秒
   - 如果構建時間過長，考慮優化構建過程

5. **函數執行時間**
   - Serverless Functions 執行時間限制：
     - Hobby 計劃：10 秒
     - Pro 計劃：60 秒
   - 確保 API 請求在時間限制內完成

## 🐛 常見問題

### 1. 構建失敗

**問題**：`@vercel/python` 找不到模組
**解決**：確保 `requirements.txt` 在 `backend/` 目錄中，Vercel 會自動找到

### 2. API 路由 404

**問題**：API 請求返回 404
**解決**：
- 檢查 `vercel.json` 中的路由配置
- 確認 `api/index.py` 路徑正確
- 檢查 Flask 藍圖註冊是否正確

### 3. CORS 錯誤

**問題**：前端無法訪問 API
**解決**：
- 檢查 `backend/app.py` 中的 CORS 配置
- 確認 Vercel 域名已添加到允許的來源列表

### 4. 資料庫連接失敗

**問題**：無法連接到 Neon 資料庫
**解決**：
- 檢查 `DATABASE_URL` 環境變數是否正確設置
- 確認 Neon 資料庫允許外部連接
- 檢查 SSL 設置（Neon 要求 SSL）

## 📝 部署後檢查清單

- [ ] 環境變數已設置（DATABASE_URL）
- [ ] 前端構建成功
- [ ] API 路由正常響應
- [ ] 資料庫連接正常
- [ ] CORS 配置正確
- [ ] 所有功能測試通過

## 🔗 相關資源

- [Vercel 文檔](https://vercel.com/docs)
- [Vercel Python 運行時](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python)
- [Neon 文檔](https://neon.tech/docs)

