import { NextResponse } from "next/server";
import { lineClient } from "@/lib/line-bot";
import { messagingApi } from "@line/bot-sdk";

type RichMenuRequest = messagingApi.RichMenuRequest;
type MessageAction = messagingApi.MessageAction;

/**
 * 設定 Rich Menu（圖文選單）
 * 這個 endpoint 可以用來設定或更新 Rich Menu
 * 呼叫方式：POST /api/webhook/setup-menu
 * 
 * 注意：Rich Menu 需要先上傳圖片，然後建立 Rich Menu 物件，最後設定為預設選單
 */
export async function POST(req: Request) {
  if (!lineClient) {
    return NextResponse.json(
      { message: "LINE Bot is not configured" },
      { status: 503 }
    );
  }

  try {
    // 建立 Rich Menu 設定
    // 注意：這裡使用文字型 Rich Menu，不需要上傳圖片
    // 如果需要更美觀的設計，可以上傳圖片後使用圖片型 Rich Menu
    
    const richMenu: RichMenuRequest = {
      size: {
        width: 2500,
        height: 1686
      },
      selected: false,
      name: "功能選單",
      chatBarText: "選單",
      areas: [
        // 左上角：旅遊推薦
        {
          bounds: {
            x: 0,
            y: 0,
            width: 1250,
            height: 843
          },
          action: {
            type: "message",
            text: "旅遊推薦"
          } as MessageAction
        },
        // 右上角：查詢偏好
        {
          bounds: {
            x: 1250,
            y: 0,
            width: 1250,
            height: 843
          },
          action: {
            type: "message",
            text: "查詢偏好"
          } as MessageAction
        },
        // 左下角：查看上次行程
        {
          bounds: {
            x: 0,
            y: 843,
            width: 1250,
            height: 843
          },
          action: {
            type: "message",
            text: "查看上次行程"
          } as MessageAction
        },
        // 右下角：修改偏好
        {
          bounds: {
            x: 1250,
            y: 843,
            width: 1250,
            height: 843
          },
          action: {
            type: "message",
            text: "修改偏好"
          } as MessageAction
        }
      ]
    };

    // 建立 Rich Menu
    const richMenuId = await lineClient.createRichMenu(richMenu);

    // 設定 Rich Menu 為預設選單（所有使用者都會看到）
    await lineClient.setDefaultRichMenu(richMenuId);

    return NextResponse.json({
      success: true,
      message: "Rich Menu 設定成功",
      richMenuId: richMenuId
    });

  } catch (error) {
    console.error("Error setting up Rich Menu:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "設定 Rich Menu 時發生錯誤",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * 取得目前的 Rich Menu 資訊
 */
export async function GET() {
  if (!lineClient) {
    return NextResponse.json(
      { message: "LINE Bot is not configured" },
      { status: 503 }
    );
  }

  try {
    const defaultRichMenuId = await lineClient.getDefaultRichMenuId();
    
    if (!defaultRichMenuId) {
      return NextResponse.json({
        hasRichMenu: false,
        message: "目前沒有設定 Rich Menu"
      });
    }

    const richMenu = await lineClient.getRichMenu(defaultRichMenuId);

    return NextResponse.json({
      hasRichMenu: true,
      richMenuId: defaultRichMenuId,
      richMenu: richMenu
    });

  } catch (error) {
    console.error("Error getting Rich Menu:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "取得 Rich Menu 時發生錯誤",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

