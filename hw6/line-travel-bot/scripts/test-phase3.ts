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
  log: ["query", "error", "warn"],
});

async function testPhase3() {
  console.log("🧪 開始測試 Phase 3: 資料庫儲存系統\n");

  try {
    // 1. 測試資料庫連線
    console.log("1️⃣ 測試資料庫連線...");
    await prisma.$connect();
    console.log("✅ 資料庫連線成功\n");

    // 2. 測試建立 LineUser
    console.log("2️⃣ 測試建立 LineUser...");
    const testLineUserId = `test_user_${Date.now()}`;
    const lineUser = await prisma.lineUser.upsert({
      where: { lineUserId: testLineUserId },
      create: { lineUserId: testLineUserId },
      update: {},
    });
    console.log(`✅ LineUser 建立成功: ${lineUser.id}\n`);

    // 3. 測試建立 Conversation 與 TravelPreference
    console.log("3️⃣ 測試建立 Conversation 與 TravelPreference...");
    const conversation = await prisma.conversation.create({
      data: {
        lineUserId: testLineUserId,
        status: "ASK_COUNTRY",
        preference: {
          create: {},
        },
      },
      include: { preference: true },
    });
    console.log(`✅ Conversation 建立成功: ${conversation.id}`);
    console.log(`✅ TravelPreference 建立成功: ${conversation.preference?.id}\n`);

    // 4. 測試儲存使用者訊息
    console.log("4️⃣ 測試儲存使用者訊息...");
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: "日本",
      },
    });
    console.log(`✅ 使用者訊息儲存成功: ${userMessage.id} - "${userMessage.content}"\n`);

    // 5. 測試更新 TravelPreference
    console.log("5️⃣ 測試更新 TravelPreference...");
    if (conversation.preference) {
      await prisma.travelPreference.update({
        where: { id: conversation.preference.id },
        data: { country: "日本" },
      });
      console.log("✅ TravelPreference 更新成功\n");
    }

    // 6. 測試儲存 Bot 回覆
    console.log("6️⃣ 測試儲存 Bot 回覆...");
    const botMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "bot",
        content: "想玩幾天呢？",
      },
    });
    console.log(`✅ Bot 訊息儲存成功: ${botMessage.id} - "${botMessage.content}"\n`);

    // 7. 測試完整對話流程（模擬完整對話）
    console.log("7️⃣ 測試完整對話流程...");
    const fullConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: true,
        preference: true,
      },
    });

    if (fullConversation) {
      // 更新所有偏好
      if (fullConversation.preference) {
        await prisma.travelPreference.update({
          where: { id: fullConversation.preference.id },
          data: {
            country: "日本",
            days: "5天",
            budget: "5萬",
            themes: "美食",
            month: "3月",
          },
        });
      }

      // 更新狀態為 READY
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { status: "READY" },
      });

      // 建立推薦
      const recommendation = await prisma.travelRecommendation.create({
        data: {
          conversationId: conversation.id,
          content: "【測試】日本 5 天美食之旅推薦行程...",
        },
      });

      console.log(`✅ 完整對話流程測試成功`);
      console.log(`   - 對話 ID: ${conversation.id}`);
      console.log(`   - 狀態: READY`);
      console.log(`   - 訊息數量: ${fullConversation.messages.length + 2}`);
      console.log(`   - 推薦 ID: ${recommendation.id}\n`);
    }

    // 8. 驗證資料查詢
    console.log("8️⃣ 驗證資料查詢...");
    const verifyConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        preference: true,
        recommendations: true,
      },
    });

    if (verifyConversation) {
      console.log("✅ 資料查詢成功");
      console.log(`   - 對話狀態: ${verifyConversation.status}`);
      console.log(`   - 使用者訊息數: ${verifyConversation.messages.filter(m => m.role === "user").length}`);
      console.log(`   - Bot 訊息數: ${verifyConversation.messages.filter(m => m.role === "bot").length}`);
      console.log(`   - 國家: ${verifyConversation.preference?.country}`);
      console.log(`   - 天數: ${verifyConversation.preference?.days}`);
      console.log(`   - 預算: ${verifyConversation.preference?.budget}`);
      console.log(`   - 主題: ${verifyConversation.preference?.themes}`);
      console.log(`   - 月份: ${verifyConversation.preference?.month}`);
      console.log(`   - 推薦數量: ${verifyConversation.recommendations.length}\n`);
    }

    // 9. 清理測試資料（可選）
    console.log("9️⃣ 清理測試資料...");
    await prisma.travelRecommendation.deleteMany({
      where: { conversationId: conversation.id },
    });
    await prisma.message.deleteMany({
      where: { conversationId: conversation.id },
    });
    await prisma.travelPreference.deleteMany({
      where: { conversationId: conversation.id },
    });
    await prisma.conversation.deleteMany({
      where: { id: conversation.id },
    });
    await prisma.lineUser.deleteMany({
      where: { lineUserId: testLineUserId },
    });
    console.log("✅ 測試資料清理完成\n");

    console.log("🎉 Phase 3 測試全部通過！所有資料庫儲存功能正常運作。\n");

  } catch (error) {
    console.error("❌ 測試失敗:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 執行測試
testPhase3()
  .then(() => {
    console.log("測試完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("測試錯誤:", error);
    process.exit(1);
  });

