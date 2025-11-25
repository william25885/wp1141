import { prisma } from "@/lib/prisma";
import { messagingApi } from "@line/bot-sdk";

type Message = messagingApi.Message;

export type ConversationStatus = 
  | "ASK_COUNTRY"
  | "ASK_DAYS"
  | "ASK_BUDGET"
  | "ASK_THEMES"
  | "ASK_MONTH"
  | "READY"
  | "COMPLETED";

export async function getOrCreateConversation(lineUserId: string) {
  // Find active conversation (not completed)
  let conversation = await prisma.conversation.findFirst({
    where: {
      lineUserId,
      status: { not: "COMPLETED" },
    },
    include: { preference: true },
    orderBy: { createdAt: 'desc' }, // Get the most recent conversation
  });

  if (!conversation) {
    // Ensure LineUser exists
    await prisma.lineUser.upsert({
      where: { lineUserId },
      create: { lineUserId },
      update: {},
    });

    conversation = await prisma.conversation.create({
      data: {
        lineUserId,
        status: "ASK_COUNTRY",
        preference: {
          create: {},
        },
      },
      include: { preference: true },
    });
  }

  return conversation;
}

export async function handleUserMessage(lineUserId: string, text: string): Promise<Message[]> {
  const conversation = await getOrCreateConversation(lineUserId);
  const status = conversation.status as ConversationStatus;
  const preferenceId = conversation.preference?.id;

  if (!preferenceId) {
    throw new Error("Preference record missing for conversation");
  }

  // Check if this is the first message in the conversation
  const messageCount = await prisma.message.count({
    where: { conversationId: conversation.id },
  });

  // If this is the first message and status is ASK_COUNTRY, send the first question instead of processing the input
  if (messageCount === 0 && status === "ASK_COUNTRY") {
    const responseMessages = getResponseMessages("ASK_COUNTRY");
    
    // Store Bot Messages
    for (const msg of responseMessages) {
      let contentToStore = "";
      if (msg.type === "text") {
        contentToStore = msg.text;
      } else if (msg.type === "template") {
        contentToStore = `[Template: ${msg.altText}]`;
      } else {
        contentToStore = `[${msg.type}]`;
      }

      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "bot",
          content: contentToStore,
        },
      });
    }

    return responseMessages;
  }

  // 1. Store User Message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: text,
    },
  });

  // Process input based on CURRENT status
  // Transition to NEXT status
  let nextStatus: ConversationStatus = status;
  
  if (status === "ASK_COUNTRY") {
    await prisma.travelPreference.update({
      where: { id: preferenceId },
      data: { country: text },
    });
    nextStatus = "ASK_DAYS";
  } else if (status === "ASK_DAYS") {
    await prisma.travelPreference.update({
      where: { id: preferenceId },
      data: { days: text },
    });
    nextStatus = "ASK_BUDGET";
  } else if (status === "ASK_BUDGET") {
    await prisma.travelPreference.update({
      where: { id: preferenceId },
      data: { budget: text },
    });
    nextStatus = "ASK_THEMES";
  } else if (status === "ASK_THEMES") {
    await prisma.travelPreference.update({
      where: { id: preferenceId },
      data: { themes: text },
    });
    nextStatus = "ASK_MONTH";
  } else if (status === "ASK_MONTH") {
    await prisma.travelPreference.update({
      where: { id: preferenceId },
      data: { month: text },
    });
    nextStatus = "READY";
  } else if (status === "READY" || status === "COMPLETED") {
     if (text === "重新開始") {
         await prisma.conversation.update({
             where: { id: conversation.id },
             data: { status: "COMPLETED" }
         });
         // Restart logic by recursion (will create new conversation)
         return handleUserMessage(lineUserId, text); 
     }
     
     const reply: Message = { type: "text", text: "行程規劃中... 如需重新開始請輸入「重新開始」" };
     
     // Store Bot Message
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "bot",
          content: reply.text as string,
        },
      });

     return [reply];
  }

  // Update status in DB if changed
  if (nextStatus !== status) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { status: nextStatus },
    });
  }

  // Create placeholder recommendation if status becomes READY
  if (nextStatus === "READY") {
    // Check if recommendation already exists to avoid duplicates (though status transition happens once)
    const existingRec = await prisma.travelRecommendation.findFirst({
      where: { conversationId: conversation.id }
    });
    
    if (!existingRec) {
      await prisma.travelRecommendation.create({
        data: {
          conversationId: conversation.id,
          content: "【系統自動生成】正在為您規劃行程... (此為模擬資料，尚未串接 LLM)",
        }
      });
    }
  }

  // Get Bot Response
  const responseMessages = getResponseMessages(nextStatus);

  // 2. Store Bot Messages
  for (const msg of responseMessages) {
    let contentToStore = "";
    if (msg.type === "text") {
      contentToStore = msg.text;
    } else if (msg.type === "template") {
      contentToStore = `[Template: ${msg.altText}]`;
    } else {
      contentToStore = `[${msg.type}]`;
    }

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "bot",
        content: contentToStore,
      },
    });
  }

  // Return message for the NEW status
  return responseMessages;
}

export function getResponseMessages(status: ConversationStatus): Message[] {
  switch (status) {
    case "ASK_COUNTRY":
      return [{
        type: "text",
        text: "你想去哪個國家或地區呢？\n例如：日本、韓國、泰國、歐洲、海島等。",
      }];
    case "ASK_DAYS":
      return [{
        type: "text",
        text: "想玩幾天呢？",
      }];
    case "ASK_BUDGET":
      return [{
         type: "text",
         text: "那預算大概多少呢？（可回答區間）",
      }];
    case "ASK_THEMES":
      return [
        {
          type: "template",
          altText: "你想以什麼主題為主？",
          template: {
            type: "buttons",
            text: "你想以什麼主題為主？",
            actions: [
              { label: "美食", type: "message", text: "美食" },
              { label: "自然", type: "message", text: "自然" },
              { label: "購物", type: "message", text: "購物" },
              { label: "海島放鬆", type: "message", text: "海島放鬆" },
            ]
          }
        },
        {
          type: "text",
          text: "或是輸入其他主題（如：文化/博物館）",
          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "message",
                  label: "文化/博物館",
                  text: "文化/博物館"
                }
              }
            ]
          }
        }
      ];
    case "ASK_MONTH":
      return [{
        type: "text",
        text: "預計哪個月份出發呢？\n（例如：3 月、7 月）",
      }];
    case "READY":
      return [{
        type: "text",
        text: "太棒了～我已經獲得你的旅遊需求了！\n我正在幫你規劃專屬行程，請稍候 2 秒",
      }];
    default:
      return [{ type: "text", text: "發生錯誤，請稍後再試。" }];
  }
}
