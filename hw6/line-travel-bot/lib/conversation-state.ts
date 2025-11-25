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

  // Handle special commands and feature menu
  // TODO: 未來可整合 Gemini API 來處理這些指令，提供更智能的回應
  if (text === "功能" || text === "選單" || text === "功能列表" || text === "menu") {
    // Show feature menu
    const menuMessages = getFeatureMenuMessage();
    
    // Store Bot Messages
    for (const msg of menuMessages) {
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

    return menuMessages;
  } else if (text === "旅遊推薦") {
    // Start the travel planning flow
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
  } else if (text === "查詢偏好") {
    // Query user's saved preferences
    const preference = conversation.preference;
    const quickReply = getFeatureQuickReply();
    
    if (preference && (preference.country || preference.days || preference.budget || preference.themes || preference.month)) {
      const preferenceText = `你目前的旅遊偏好：\n${preference.country ? `📍 目的地：${preference.country}\n` : ''}${preference.days ? `📅 天數：${preference.days}\n` : ''}${preference.budget ? `💰 預算：${preference.budget}\n` : ''}${preference.themes ? `🎯 主題：${preference.themes}\n` : ''}${preference.month ? `📆 月份：${preference.month}\n` : ''}\n要開始規劃嗎？直接告訴我你的需求即可！`;
      
      const reply: Message = { type: "text", text: preferenceText, quickReply: quickReply };
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "bot",
          content: preferenceText,
        },
      });
      return [reply];
    } else {
      const reply: Message = { type: "text", text: "目前還沒有保存的偏好設定。\n點擊「旅遊推薦」開始規劃你的行程吧！", quickReply: quickReply };
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "bot",
          content: reply.text as string,
        },
      });
      return [reply];
    }
  } else if (text === "查看上次行程") {
    // View last recommendation
    const quickReply = getFeatureQuickReply();
    const lastRecommendation = await prisma.travelRecommendation.findFirst({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'desc' },
    });

    if (lastRecommendation) {
      const reply: Message = { type: "text", text: `上次的行程規劃：\n\n${lastRecommendation.content}\n\n要重新規劃嗎？點擊「旅遊推薦」或輸入「重新開始」`, quickReply: quickReply };
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "bot",
          content: lastRecommendation.content,
        },
      });
      return [reply];
    } else {
      const reply: Message = { type: "text", text: "目前還沒有行程規劃記錄。\n點擊「旅遊推薦」開始規劃你的行程吧！", quickReply: quickReply };
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "bot",
          content: reply.text as string,
        },
      });
      return [reply];
    }
  } else if (text === "修改偏好") {
    // Reset preferences and start over
    await prisma.travelPreference.update({
      where: { id: preferenceId },
      data: {
        country: null,
        days: null,
        budget: null,
        themes: null,
        month: null,
      },
    });
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { status: "ASK_COUNTRY" },
    });

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
     
     const quickReply = getFeatureQuickReply();
     const reply: Message = { type: "text", text: "行程規劃中... 如需重新開始請輸入「重新開始」", quickReply: quickReply };
     
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

/**
 * 取得 Quick Reply 選單（用於附加在訊息下方）
 * 這會讓功能選單在每條訊息下方都顯示，使用者可以隨時點擊
 * TODO: 未來可整合 Gemini API 來動態生成更個人化的功能列表
 */
export function getFeatureQuickReply() {
  return {
    items: [
      {
        type: "action" as const,
        action: {
          type: "message" as const,
          label: "旅遊推薦",
          text: "旅遊推薦"
        }
      },
      {
        type: "action" as const,
        action: {
          type: "message" as const,
          label: "查詢偏好",
          text: "查詢偏好"
        }
      },
      {
        type: "action" as const,
        action: {
          type: "message" as const,
          label: "查看上次行程",
          text: "查看上次行程"
        }
      },
      {
        type: "action" as const,
        action: {
          type: "message" as const,
          label: "修改偏好",
          text: "修改偏好"
        }
      }
    ]
  };
}

/**
 * 取得功能列表訊息（使用 Button Template）
 * 適合作為功能選單，使用者可以隨時查看
 * TODO: 未來可整合 Gemini API 來動態生成更個人化的功能列表
 */
export function getFeatureMenuMessage(): Message[] {
  return [
    {
      type: "template",
      altText: "功能選單",
      template: {
        type: "buttons",
        text: "請選擇功能：",
        actions: [
          {
            type: "message",
            label: "旅遊推薦",
            text: "旅遊推薦"
          },
          {
            type: "message",
            label: "查詢偏好",
            text: "查詢偏好"
          },
          {
            type: "message",
            label: "查看上次行程",
            text: "查看上次行程"
          },
          {
            type: "message",
            label: "修改偏好",
            text: "修改偏好"
          }
        ]
      }
    }
  ];
}

/**
 * 取得歡迎訊息（用於使用者加入好友時）
 * 包含功能介紹和使用範例，並提供 Quick Reply 選單
 * TODO: 未來可整合 Gemini API 來動態生成更個人化的歡迎訊息
 */
export function getWelcomeMessage(): Message[] {
  const quickReply = getFeatureQuickReply();
  return [
    {
      type: "text",
      text: "嗨~很高興認識你！我是你的AI旅遊規劃助理 🌍\n\n我可以根據你的喜好推薦旅遊國家、景點、每日行程。\n\n你可以跟我說：\n• 我想去日本五天\n• 幫我安排3月的海島行程\n• 推薦歐洲的文化旅遊",
      quickReply: quickReply,
    }
  ];
}

export function getResponseMessages(status: ConversationStatus): Message[] {
  const quickReply = getFeatureQuickReply();
  
  switch (status) {
    case "ASK_COUNTRY":
      return [{
        type: "text",
        text: "你想去哪個國家或地區呢？\n例如：日本、韓國、泰國、歐洲、海島等。",
        quickReply: quickReply,
      }];
    case "ASK_DAYS":
      return [{
        type: "text",
        text: "想玩幾天呢？",
        quickReply: quickReply,
      }];
    case "ASK_BUDGET":
      return [{
         type: "text",
         text: "那預算大概多少呢？（可回答區間）",
         quickReply: quickReply,
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
        quickReply: quickReply,
      }];
    case "READY":
      return [
        {
          type: "text",
          text: "太棒了～我已經獲得你的旅遊需求了！\n我正在幫你規劃專屬行程，請稍候 2 秒",
          quickReply: quickReply,
        }
      ];
    default:
      return [{ type: "text", text: "發生錯誤，請稍後再試。" }];
  }
}
