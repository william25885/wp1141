import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("🧪 開始測試 Phase 3: 資料庫儲存系統\n");

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
    console.log(`✅ 使用者訊息儲存成功: ${userMessage.id}\n`);

    // 5. 測試更新 TravelPreference
    console.log("5️⃣ 測試更新 TravelPreference...");
    if (conversation.preference) {
      await prisma.travelPreference.update({
        where: { id: conversation.preference.id },
        data: { country: "日本", days: "5天", budget: "5萬", themes: "美食", month: "3月" },
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
    console.log(`✅ Bot 訊息儲存成功: ${botMessage.id}\n`);

    // 7. 測試建立推薦
    console.log("7️⃣ 測試建立 TravelRecommendation...");
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { status: "READY" },
    });
    const recommendation = await prisma.travelRecommendation.create({
      data: {
        conversationId: conversation.id,
        content: "【測試】日本 5 天美食之旅推薦行程...",
      },
    });
    console.log(`✅ 推薦建立成功: ${recommendation.id}\n`);

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

    const result = {
      success: true,
      message: "Phase 3 測試全部通過！",
      data: {
        conversationId: conversation.id,
        status: verifyConversation?.status,
        userMessages: verifyConversation?.messages.filter(m => m.role === "user").length || 0,
        botMessages: verifyConversation?.messages.filter(m => m.role === "bot").length || 0,
        preference: verifyConversation?.preference,
        recommendationsCount: verifyConversation?.recommendations.length || 0,
      },
    };

    // 9. 清理測試資料
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

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ 測試失敗:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

