# 🦕 小恐龍遊戲

一個基於React + TypeScript的網頁版小恐龍遊戲，靈感來自Google Chrome的離線小恐龍遊戲。

## 🎮 遊戲特色

- **經典玩法**：躲避障礙物，收集分數
- **夜晚主題**：美麗的夜空背景，包含月亮和閃爍星星
- **像素化泥土**：復古的像素藝術風格地面
- **背景音樂**：Web Audio API生成的愉快旋律
- **動態難度**：遊戲速度隨時間增加
- **Boss系統**：當速度達到6時，障礙物會有不同速度
- **勝利條件**：達到10000分即可獲勝

## 🎯 遊戲操作

- **空白鍵**：跳躍（按住持續上升，放開下降）
- **向下鍵** 或 **S鍵**：蹲下
- **音樂控制**：點擊右上角🔊/🔇按鈕開關背景音樂
- **目標**：躲避仙人掌和翼手龍，達到10000分

## 🛠️ 技術棧

- **前端框架**：React 19.1.1
- **語言**：TypeScript
- **建構工具**：Vite
- **套件管理**：Yarn
- **樣式**：CSS3 (漸層、動畫、像素藝術)
- **音頻**：Web Audio API (無需外部音頻文件)

## 🚀 快速開始

### 安裝依賴
```bash
yarn install
```

### 開發模式
```bash
yarn dev
```
遊戲將在 `http://localhost:5173` 開啟

### 建構生產版本
```bash
yarn build
```

### 預覽生產版本
```bash
yarn preview
```

### 程式碼檢查
```bash
yarn lint
```

## 📁 專案結構

```
src/
├── components/          # React組件
│   ├── Dinosaur.tsx    # 恐龍角色組件
│   ├── GameContainer.tsx # 遊戲容器
│   ├── GameUI.tsx      # 遊戲UI界面
│   └── Obstacle.tsx    # 障礙物組件
├── hooks/              # 自定義React Hooks
│   ├── useAudio.ts         # 音頻系統管理
│   ├── useBossSystem.ts    # Boss系統管理
│   ├── useCollisionDetection.ts # 碰撞檢測
│   ├── useDinosaur.ts      # 恐龍狀態管理
│   ├── useGameLoop.ts      # 遊戲主迴圈
│   ├── useGameState.ts     # 遊戲狀態管理
│   ├── useKeyboard.ts      # 鍵盤輸入處理
│   └── useObstacles.ts     # 障礙物管理
├── types/              # TypeScript類型定義
│   └── game.ts         # 遊戲相關類型
├── App.tsx             # 主應用組件
├── App.css             # 主樣式文件
└── main.tsx            # 應用入口
```

## 🎨 遊戲設計

### 視覺風格
- **夜晚主題**：深藍色夜空背景
- **像素藝術**：復古的像素化泥土紋理
- **動畫效果**：流暢的角色動畫和粒子效果
- **UI設計**：簡潔的遊戲界面

### 遊戲機制
- **跳躍系統**：按住空白鍵持續上升，放開自動下降
- **碰撞檢測**：精確的矩形碰撞檢測
- **障礙物生成**：智能生成避免過於密集
- **速度系統**：隨時間動態增加遊戲速度
- **音頻系統**：Web Audio API生成愉快背景音樂

## 🏆 遊戲目標

- **主要目標**：達到10000分
- **挑戰目標**：創造最高分記錄
- **技巧要求**：精確的時機控制和反應速度

## 🎵 遊戲特色

- **背景音樂**：Web Audio API生成的愉快旋律
- **音樂控制**：可手動開關背景音樂
- **流暢動畫**：60FPS的遊戲體驗
- **響應式設計**：適配不同螢幕尺寸
- **本地存儲**：自動保存最高分記錄

## 🐛 已知問題

- 無

## 📝 更新日誌

### v1.0.0
- 初始版本發布
- 基本遊戲機制實現
- 夜晚主題和像素化泥土紋理
- Boss系統和勝利條件
- Web Audio API背景音樂系統
- 音樂控制功能

## 🚀 可用的 yarn 命令

```bash
# 開發
yarn dev          # 啟動開發服務器
yarn start        # 同 yarn dev

# 建構
yarn build        # 建構生產版本
yarn preview      # 預覽生產版本
yarn serve        # 建構並預覽
yarn clean        # 清理建構文件

# 程式碼品質
yarn lint         # 檢查程式碼
yarn lint:fix     # 自動修復程式碼
yarn type-check   # TypeScript類型檢查
yarn format       # 格式化程式碼
yarn format:check # 檢查程式碼格式

# 分析
yarn analyze      # 分析建構包大小
yarn test         # 運行測試（目前無測試）

# 依賴管理
yarn install      # 安裝依賴
yarn add <pkg>    # 添加套件
yarn remove <pkg> # 移除套件
```

## 🤝 貢獻

歡迎提交Issue和Pull Request！

## 📄 授權

MIT License

---

**享受遊戲！** 🎮✨