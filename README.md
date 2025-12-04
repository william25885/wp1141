# 💬 Bello — 交友聚會邀約與即時聊天系統

🌐 **線上版本：** [https://bello-tw.vercel.app/](https://bello-tw.vercel.app/)

Bello 是一款以資料庫為核心設計的網頁交友系統，旨在提供一個輕鬆又安全的平台，讓使用者能夠發起或參與如午餐、咖啡、語言交換等實體聚會，並支援跨語言交流。

## 專案簡介

本系統具備以下核心功能：
- 🔐 用戶認證系統（支援一般註冊登入與 Google OAuth）
- 👥 好友系統（添加好友、查看在線狀態、私訊聊天）
- 🎉 聚會管理（創建、參與、管理聚會）
- 💬 即時聊天（聚會群組聊天、一對一私訊）
- 📝 個人資料管理（編輯個人資訊、上傳頭像）
- 👨‍💼 管理員後台（管理用戶、聚會、聊天記錄）

## 技術棧

- **前端：** Vue.js 3 + Vite + Bootstrap 5
- **後端：** Flask (Python) + PostgreSQL (Neon)
- **部署：** Vercel (Serverless Functions)
- **認證：** JWT + Google OAuth 2.0

## 專案結構

```
final-project/Bello_system/
├── frontend/          # Vue.js 前端應用
├── backend/          # Flask 後端 API
├── api/              # Vercel Serverless Functions
└── README.md         # 詳細文檔
```

詳細的開發環境設置和使用方法，請參考 [final-project/Bello_system/README.md](./final-project/Bello_system/README.md)

## 課程資訊

NTU Web Programming 114-1 期末專案
