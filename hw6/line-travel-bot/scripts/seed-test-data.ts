import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

// 測試資料
const testUsers = [
  {
    lineUserId: "U1234567890abcdef",
    displayName: "小明",
    pictureUrl: "https://example.com/avatar1.jpg",
  },
  {
    lineUserId: "U9876543210fedcba",
    displayName: "小華",
    pictureUrl: "https://example.com/avatar2.jpg",
  },
  {
    lineUserId: "Uabcdef1234567890",
    displayName: "小美",
    pictureUrl: "https://example.com/avatar3.jpg",
  },
  {
    lineUserId: "Ufedcba0987654321",
    displayName: "阿強",
    pictureUrl: null,
  },
  {
    lineUserId: "U1111222233334444",
    displayName: "小雯",
    pictureUrl: "https://example.com/avatar5.jpg",
  },
];

const conversationsData = [
  // 用戶 1 - 已完成規劃
  {
    lineUserId: "U1234567890abcdef",
    status: "READY",
    messages: [
      { role: "user", content: "我想去日本玩" },
      { role: "bot", content: "好的！想玩幾天呢？" },
      { role: "user", content: "5天" },
      { role: "bot", content: "預算大概多少呢？" },
      { role: "user", content: "5萬左右" },
      { role: "bot", content: "有什麼特別想體驗的主題嗎？" },
      { role: "user", content: "美食和溫泉" },
      { role: "bot", content: "預計幾月出發呢？" },
      { role: "user", content: "3月" },
    ],
    preference: {
      country: "日本",
      days: "5天",
      budget: "5萬",
      themes: "美食、溫泉",
      month: "3月",
    },
    recommendation: {
      content: `【日本 5 天美食溫泉之旅推薦】

📍 行程概覽
第1天：抵達東京 → 淺草寺 → 上野公園 → 晚餐：壽司大
第2天：新宿御苑 → 原宿 → 表參道 → 晚餐：銀座米其林餐廳
第3天：前往箱根 → 箱根溫泉 → 大涌谷 → 溫泉旅館住宿
第4天：箱根 → 返回東京 → 秋葉原 → 晚餐：居酒屋體驗
第5天：築地市場 → 銀座購物 → 返程

💰 預算分配
住宿：15,000元（溫泉旅館一晚）
餐飲：20,000元（包含米其林體驗）
交通：8,000元（JR Pass）
購物：7,000元

🍜 必吃美食
- 壽司大（築地市場）
- 銀座米其林餐廳
- 箱根溫泉料理
- 居酒屋體驗

♨️ 溫泉推薦
箱根強羅溫泉、大涌谷溫泉

希望這個行程符合您的需求！`,
    },
  },
  // 用戶 1 - 進行中
  {
    lineUserId: "U1234567890abcdef",
    status: "ASK_DAYS",
    messages: [
      { role: "user", content: "我想規劃韓國之旅" },
      { role: "bot", content: "好的！想玩幾天呢？" },
    ],
    preference: {
      country: "韓國",
      days: null,
      budget: null,
      themes: null,
      month: null,
    },
    recommendation: null,
  },
  // 用戶 2 - 已完成規劃
  {
    lineUserId: "U9876543210fedcba",
    status: "READY",
    messages: [
      { role: "user", content: "我想去歐洲" },
      { role: "bot", content: "好的！想去哪個國家呢？" },
      { role: "user", content: "法國" },
      { role: "bot", content: "想玩幾天呢？" },
      { role: "user", content: "10天" },
      { role: "bot", content: "預算大概多少呢？" },
      { role: "user", content: "15萬" },
      { role: "bot", content: "有什麼特別想體驗的主題嗎？" },
      { role: "user", content: "藝術、歷史、美食" },
      { role: "bot", content: "預計幾月出發呢？" },
      { role: "user", content: "6月" },
    ],
    preference: {
      country: "法國",
      days: "10天",
      budget: "15萬",
      themes: "藝術、歷史、美食",
      month: "6月",
    },
    recommendation: {
      content: `【法國 10 天藝術歷史美食之旅】

📍 行程概覽
第1-3天：巴黎
  - 羅浮宮、奧賽博物館
  - 艾菲爾鐵塔、塞納河遊船
  - 聖母院、蒙馬特高地
  - 米其林餐廳體驗

第4-5天：凡爾賽
  - 凡爾賽宮
  - 花園漫步
  - 返回巴黎

第6-7天：里昂
  - 老城區探索
  - 美食之都體驗
  - 里昂美術館

第8-10天：普羅旺斯
  - 薰衣草田
  - 亞維儂
  - 返回巴黎返程

💰 預算分配
住宿：60,000元
餐飲：50,000元（包含米其林）
交通：25,000元
門票與活動：15,000元

🎨 必訪景點
- 羅浮宮（世界三大博物館之一）
- 凡爾賽宮（巴洛克建築經典）
- 普羅旺斯薰衣草田
- 里昂老城區（UNESCO世界遺產）

🍷 美食體驗
- 米其林三星餐廳
- 傳統法式料理
- 里昂特色美食
- 普羅旺斯地方菜

希望您有個難忘的法國之旅！`,
    },
  },
  // 用戶 3 - 剛開始
  {
    lineUserId: "Uabcdef1234567890",
    status: "ASK_COUNTRY",
    messages: [
      { role: "user", content: "我想規劃旅行" },
      { role: "bot", content: "好的！想去哪個國家呢？" },
    ],
    preference: {
      country: null,
      days: null,
      budget: null,
      themes: null,
      month: null,
    },
    recommendation: null,
  },
  // 用戶 3 - 進行中
  {
    lineUserId: "Uabcdef1234567890",
    status: "ASK_BUDGET",
    messages: [
      { role: "user", content: "我想去泰國" },
      { role: "bot", content: "好的！想玩幾天呢？" },
      { role: "user", content: "7天" },
      { role: "bot", content: "預算大概多少呢？" },
    ],
    preference: {
      country: "泰國",
      days: "7天",
      budget: null,
      themes: null,
      month: null,
    },
    recommendation: null,
  },
  // 用戶 4 - 已完成規劃
  {
    lineUserId: "Ufedcba0987654321",
    status: "READY",
    messages: [
      { role: "user", content: "我想去冰島" },
      { role: "bot", content: "好的！想玩幾天呢？" },
      { role: "user", content: "14天" },
      { role: "bot", content: "預算大概多少呢？" },
      { role: "user", content: "20萬" },
      { role: "bot", content: "有什麼特別想體驗的主題嗎？" },
      { role: "user", content: "極光、自然景觀、攝影" },
      { role: "bot", content: "預計幾月出發呢？" },
      { role: "user", content: "12月" },
    ],
    preference: {
      country: "冰島",
      days: "14天",
      budget: "20萬",
      themes: "極光、自然景觀、攝影",
      month: "12月",
    },
    recommendation: {
      content: `【冰島 14 天極光自然之旅】

📍 行程概覽
第1-3天：雷克雅維克
  - 藍湖溫泉
  - 市區探索
  - 極光觀測

第4-7天：黃金圈
  - 間歇泉
  - 黃金瀑布
  - 辛格維利爾國家公園

第8-10天：南岸
  - 黑沙灘
  - 冰川健行
  - 冰河湖

第11-14天：環島
  - 東部峽灣
  - 米湖地區
  - 返回雷克雅維克

💰 預算分配
住宿：80,000元
餐飲：40,000元
交通（租車）：50,000元
活動（極光團、冰川健行）：30,000元

🌌 極光觀測
- 最佳時間：12月-2月
- 推薦地點：雷克雅維克郊區、米湖
- 建議參加專業極光團

📸 攝影景點
- 黑沙灘（玄武岩柱）
- 冰河湖（浮冰）
- 黃金瀑布
- 藍湖溫泉

希望您能捕捉到美麗的極光！`,
    },
  },
  // 用戶 5 - 進行中
  {
    lineUserId: "U1111222233334444",
    status: "ASK_THEMES",
    messages: [
      { role: "user", content: "我想去新加坡" },
      { role: "bot", content: "好的！想玩幾天呢？" },
      { role: "user", content: "4天" },
      { role: "bot", content: "預算大概多少呢？" },
      { role: "user", content: "3萬" },
      { role: "bot", content: "有什麼特別想體驗的主題嗎？" },
    ],
    preference: {
      country: "新加坡",
      days: "4天",
      budget: "3萬",
      themes: null,
      month: null,
    },
    recommendation: null,
  },
];

async function seedTestData() {
  console.log("🌱 開始插入測試資料...\n");

  try {
    // 1. 建立 LineUser
    console.log("1️⃣ 建立 LineUser...");
    for (const user of testUsers) {
      await prisma.lineUser.upsert({
        where: { lineUserId: user.lineUserId },
        create: user,
        update: user,
      });
    }
    console.log(`✅ 已建立 ${testUsers.length} 個使用者\n`);

    // 2. 建立 Conversation 及相關資料
    console.log("2️⃣ 建立 Conversation 及相關資料...");
    let conversationCount = 0;

    for (const convData of conversationsData) {
      // 建立 Conversation
      const conversation = await prisma.conversation.create({
        data: {
          lineUserId: convData.lineUserId,
          status: convData.status,
          preference: {
            create: convData.preference,
          },
        },
      });

      // 建立 Messages
      for (const msg of convData.messages) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: msg.role,
            content: msg.content,
          },
        });
      }

      // 建立 Recommendation（如果有）
      if (convData.recommendation) {
        await prisma.travelRecommendation.create({
          data: {
            conversationId: conversation.id,
            content: convData.recommendation.content,
          },
        });
      }

      conversationCount++;
    }
    console.log(`✅ 已建立 ${conversationCount} 個對話\n`);

    // 3. 驗證資料
    console.log("3️⃣ 驗證資料...");
    const totalUsers = await prisma.lineUser.count();
    const totalConversations = await prisma.conversation.count();
    const readyConversations = await prisma.conversation.count({
      where: { status: "READY" },
    });
    const totalMessages = await prisma.message.count();
    const totalRecommendations = await prisma.travelRecommendation.count();

    console.log(`✅ 資料驗證完成：`);
    console.log(`   - 使用者數：${totalUsers}`);
    console.log(`   - 對話數：${totalConversations}`);
    console.log(`   - 已完成規劃：${readyConversations}`);
    console.log(`   - 訊息數：${totalMessages}`);
    console.log(`   - 推薦數：${totalRecommendations}\n`);

    console.log("🎉 測試資料插入完成！\n");
    console.log("💡 提示：現在可以訪問 http://localhost:3000/admin/conversations 查看對話列表\n");

  } catch (error) {
    console.error("❌ 插入資料時發生錯誤:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 執行插入
seedTestData()
  .then(() => {
    console.log("✅ 腳本執行完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ 腳本執行錯誤:", error);
    process.exit(1);
  });

