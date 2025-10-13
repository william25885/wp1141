# 🥗 Healthy Care - 健康餐食規劃系統

一個基於 React + TypeScript + Material UI 的現代化健康餐食規劃應用程式，幫助用戶瀏覽食材、規劃菜單並追蹤營養資訊。你可以透過按照 csv 的資料格式新增你的食材選項！

## ✨ 主要功能

### 🍎 食材瀏覽 (Browse Ingredients)
- **智能搜尋**：即時搜尋食材名稱
- **多維度篩選**：
  - 飲食標籤 (素食、無麩質、高蛋白等)
  - 過敏原排除 (堅果、乳製品、大豆等)
  - 營養成分篩選
- **響應式卡片佈局**：固定尺寸的食材卡片，支援水平排列
- **詳細營養資訊**：每100g的營養成分、價格、卡路里等
- **動態數據載入**：支援 CSV 格式數據擴充，新增食材時介面自動更新

### 🍽️ 我的菜單 (My Menu)
- **食材管理**：添加/移除食材，調整份量
- **即時營養統計**：
  - 總卡路里、總成本
  - 蛋白質、脂肪、碳水化合物、纖維
  - 固定尺寸卡片，支援5位數字顯示
- **巨量營養素分佈圖**：
  - 互動式圓餅圖
  - 詳細圖例說明
  - 響應式佈局
- **智能營養建議**：基於營養成分的個性化建議
- **份量調整**：支援數字輸入，智能 backspace 處理

### 📊 營養摘要 (Nutrition Summary)
- **完整營養報告**：詳細的營養統計和建議
- **食材清單**：包含份量、卡路里、成本的完整表格
- **匯出功能**：支援 CSV 格式匯出
- **響應式設計**：適配不同螢幕尺寸

## 🛠️ 技術架構

### 前端技術棧
- **React 18** - 現代化 UI 框架
- **TypeScript** - 類型安全的 JavaScript
- **Material UI (MUI)** - Google Material Design 組件庫
- **Vite** - 快速建構工具
- **CSS-in-JS** - 使用 MUI 的 `sx` prop 進行樣式管理

### 核心功能模組
- **CSV 解析器** (`csvParser.ts`) - 智能處理食材數據，支援動態載入
- **營養計算器** (`nutritionCalculator.ts`) - 營養成分計算
- **圓餅圖組件** (`NutritionChart.tsx`) - SVG 繪製營養分佈圖
- **響應式佈局** - 支援桌面和行動裝置
- **動態介面更新** - 根據 CSV 數據自動生成篩選選項和食材卡片

## 🚀 快速開始

### 環境需求
- Node.js 16+ 
- npm 或 yarn

### 安裝與執行

```bash
# 進入專案目錄
cd "Healthy Care"

# 安裝依賴 (首次運行時執行)
npm install

# 啟動開發伺服器
npm run dev

# 或使用 yarn
yarn install
yarn dev
```

> **💡 重要提醒**：`node_modules` 資料夾已透過 `.gitignore` 排除，不會上傳到版本控制系統。其他開發者只需執行 `npm install` 即可自動安裝所有依賴。

### 建構生產版本

```bash
# 建構
npm run build

# 預覽建構結果
npm run preview
```

## 📁 專案結構

```
src/
├── components/           # React 組件
│   ├── App.tsx          # 主應用程式
│   ├── Navigation.tsx   # 導航組件
│   ├── BrowseView.tsx   # 食材瀏覽頁面
│   ├── MenuView.tsx     # 我的菜單頁面
│   ├── SummaryView.tsx  # 營養摘要頁面
│   ├── FilterPanel.tsx  # 篩選面板
│   ├── IngredientCard.tsx # 食材卡片
│   └── NutritionChart.tsx # 營養分佈圖
├── utils/               # 工具函數
│   ├── csvParser.ts     # CSV 數據解析
│   └── nutritionCalculator.ts # 營養計算
├── types/               # TypeScript 類型定義
├── public/              # 靜態資源
│   └── Healthy_Meal_Plannerfoods.csv # 食材數據
└── App.css             # 全域樣式
```

## 🎨 設計特色

### Material UI 主題
- **自定義主題**：基於 Material Design 3**
- **色彩系統**：現代化漸層和配色
- **字體**：Google Fonts 整合
- **動畫**：流暢的過渡效果

### 響應式設計
- **桌面版**：水平佈局，最佳化大螢幕體驗
- **行動版**：垂直佈局，適配小螢幕
- **彈性網格**：動態調整元件大小

### 用戶體驗優化
- **智能輸入**：份量輸入支援完整 backspace 操作
- **數字格式化**：超過5位數自動顯示省略號
- **固定尺寸**：防止元件因內容變化而變形
- **即時反饋**：輸入即時更新營養統計

## 📊 數據格式

### 食材數據 (CSV)
```csv
id,name,category,calories_per_100g,cost_per_100g_usd,protein_g,fat_g,carbs_g,fiber_g,sodium_mg,potassium_mg,iron_mg,diet_tags,allergens,default_unit,serving_size_g
```

### 動態數據擴充功能
- **自動解析**：系統會自動解析 CSV 中的 `diet_tags` 和 `allergens` 欄位
- **動態篩選**：新增食材時，篩選選項會自動更新
- **智能標籤**：支援逗號分隔的多標籤格式，自動處理引號和特殊字符
- **即時更新**：修改 CSV 檔案後，介面會即時反映新的篩選選項和食材卡片

### 支援的篩選標籤
- **飲食標籤**：vegan, vegetarian, gluten_free, high_protein, low_carb
- **過敏原**：nuts, dairy, soy, gluten, eggs, shellfish
- **自定義標籤**：可透過 CSV 數據動態添加新的標籤類別

## 🔧 開發指南

### 添加新功能
1. 在 `src/components/` 創建新組件
2. 使用 Material UI 組件和 `sx` prop 進行樣式設計
3. 遵循 TypeScript 類型定義
4. 確保響應式設計

### 擴充食材數據
1. **修改 CSV 檔案**：在 `public/Healthy_Meal_Plannerfoods.csv` 中添加新食材
2. **格式要求**：確保遵循現有的 CSV 格式，特別是 `diet_tags` 和 `allergens` 欄位
3. **標籤格式**：使用逗號分隔多個標籤，如 `"vegan,vegetarian,gluten_free"`
4. **自動更新**：系統會自動解析新數據並更新篩選選項

### 版本控制最佳實踐
- **排除檔案**：`node_modules/`、`dist/`、`.DS_Store` 等已透過 `.gitignore` 排除
- **依賴管理**：使用 `package.json` 和 `yarn.lock` 管理依賴版本
- **環境一致性**：確保所有開發者使用相同的 Node.js 版本

### 樣式指南
- 使用 MUI 的 `sx` prop 而非外部 CSS
- 遵循 Material Design 原則
- 確保無障礙性 (accessibility)
- 測試不同螢幕尺寸

### 性能優化
- 使用 React.memo 優化重渲染
- 實現虛擬化長列表 (如需要)
- 優化圖片載入
- 使用 React.lazy 進行代碼分割

## 🐛 已知問題與解決方案

### 常見問題
1. **份量輸入問題**：已實現智能輸入處理
2. **數字溢出**：已限制顯示位數並添加省略號
3. **響應式佈局**：已實現彈性佈局系統
4. **CSV 解析**：已處理引號和逗號問題

### 調試技巧
- 使用瀏覽器開發者工具檢查元件
- 查看控制台錯誤訊息
- 檢查 Material UI 主題配置
- 驗證 TypeScript 類型定義

## 📈 未來規劃

### 計劃功能
- [ ] 用戶認證系統
- [ ] 食譜收藏功能
- [ ] 營養目標設定
- [ ] 數據視覺化增強
- [ ] 多語言支援
- [ ] PWA 支援
- [ ] 動態 CSV 上傳功能
- [ ] 食材數據管理後台

### 技術改進
- [ ] 單元測試覆蓋
- [ ] E2E 測試
- [ ] 性能監控
- [ ] 錯誤邊界處理
- [ ] 國際化 (i18n)

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

此專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 文件。

## 👥 作者

- **開發者**：健康餐食規劃系統開發團隊
- **設計**：基於 Material Design 3 原則
- **數據來源**：Healthy Meal Planner 食材數據庫

---

**享受健康飲食規劃的樂趣！** 🥗✨