import { NextResponse } from "next/server";
import { lineClient } from "@/lib/line-bot";

/**
 * 設定 Rich Menu（固定選單）
 * 這個端點用於建立和設定 Rich Menu，讓功能選單一直顯示在聊天室底部
 * 
 * 使用方式：
 * 1. 部署後訪問：https://your-domain.vercel.app/api/webhook/setup-menu
 * 2. 或使用 curl: curl -X POST https://your-domain.vercel.app/api/webhook/setup-menu
 */
export async function POST() {
  if (!lineClient) {
    return NextResponse.json(
      { 
        message: "LINE Bot is not configured. Please set LINE_CHANNEL_ACCESS_TOKEN and LINE_CHANNEL_SECRET.",
        error: "LINE_CLIENT_NOT_INITIALIZED"
      },
      { status: 503 }
    );
  }

  try {
    // Rich Menu 設定
    // 使用 2x3 的 Rich Menu（2 列 3 行）
    const richMenu = {
      size: {
        width: 2500,
        height: 1686
      },
      selected: true, // 設為預設選單
      name: "Travel Bot Feature Menu",
      chatBarText: "選單",
      areas: [
        // 第一列
        {
          bounds: {
            x: 0,
            y: 0,
            width: 833,
            height: 843
          },
          action: {
            type: "message",
            text: "旅遊推薦"
          }
        },
        {
          bounds: {
            x: 833,
            y: 0,
            width: 833,
            height: 843
          },
          action: {
            type: "message",
            text: "查詢偏好"
          }
        },
        {
          bounds: {
            x: 1666,
            y: 0,
            width: 834,
            height: 843
          },
          action: {
            type: "message",
            text: "查看上次行程"
          }
        },
        // 第二列
        {
          bounds: {
            x: 0,
            y: 843,
            width: 833,
            height: 843
          },
          action: {
            type: "message",
            text: "修改偏好"
          }
        },
        {
          bounds: {
            x: 833,
            y: 843,
            width: 833,
            height: 843
          },
          action: {
            type: "message",
            text: "功能"
          }
        },
        {
          bounds: {
            x: 1666,
            y: 843,
            width: 834,
            height: 843
          },
          action: {
            type: "uri",
            uri: "https://line.me/R/nv/more"
          }
        }
      ]
    };

    // 建立 Rich Menu
    const richMenuId = await lineClient.createRichMenu(richMenu);
    
    // 設定為預設 Rich Menu（所有使用者都會看到）
    await lineClient.setDefaultRichMenu(richMenuId);

    return NextResponse.json({
      success: true,
      message: "Rich Menu 設定成功！",
      richMenuId: richMenuId,
      info: "功能選單現在會一直顯示在聊天室底部，使用者可以隨時點擊使用。"
    });
  } catch (error: any) {
    console.error("設定 Rich Menu 時發生錯誤:", error);
    return NextResponse.json(
      {
        success: false,
        message: "設定 Rich Menu 失敗",
        error: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * GET 方法：查看目前的 Rich Menu 設定
 */
export async function GET() {
  if (!lineClient) {
    return NextResponse.json(
      { 
        message: "LINE Bot is not configured.",
        error: "LINE_CLIENT_NOT_INITIALIZED"
      },
      { status: 503 }
    );
  }

  try {
    // 取得預設 Rich Menu ID
    const defaultRichMenuId = await lineClient.getDefaultRichMenuId();
    
    if (!defaultRichMenuId) {
      return NextResponse.json({
        message: "目前沒有設定 Rich Menu",
        hasRichMenu: false
      });
    }

    // 取得 Rich Menu 資訊
    const richMenu = await lineClient.getRichMenu(defaultRichMenuId);

    return NextResponse.json({
      message: "Rich Menu 已設定",
      hasRichMenu: true,
      richMenuId: defaultRichMenuId,
      richMenu: richMenu
    });
  } catch (error: any) {
    console.error("取得 Rich Menu 資訊時發生錯誤:", error);
    return NextResponse.json(
      {
        message: "取得 Rich Menu 資訊失敗",
        error: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

