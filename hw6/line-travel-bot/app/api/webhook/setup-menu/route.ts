import { NextResponse } from "next/server";
import { lineClient } from "@/lib/line-bot";

/**
 * API endpoint to set up LINE Bot Rich Menu (圖文選單)
 * This creates a menu that appears at the bottom of the chat interface
 * 
 * Usage: POST /api/webhook/setup-menu
 * 
 * Note: Rich Menu requires an image (2500x1686px or 2500x843px)
 * This endpoint only creates the menu structure. You need to upload an image separately.
 * 
 * For easier setup, use LINE Official Account Manager:
 * https://admin-official.line.me/
 */
export async function POST(req: Request) {
  // Check if LINE Bot is configured
  if (!lineClient) {
    return NextResponse.json(
      { 
        message: "LINE Bot is not configured. Please set LINE_CHANNEL_ACCESS_TOKEN and LINE_CHANNEL_SECRET.",
        error: "LINE_CHANNEL_ACCESS_TOKEN not set"
      },
      { status: 503 }
    );
  }

  try {
    // Define the rich menu structure (2x3 grid layout)
    // Image size should be 2500x1686px for 2x3 layout
    const menu = {
      size: {
        width: 2500,
        height: 1686
      },
      selected: true,
      name: "功能選單",
      chatBarText: "選單",
      areas: [
        // Row 1
        {
          bounds: { x: 0, y: 0, width: 833, height: 843 },
          action: {
            type: "message" as const,
            text: "旅遊推薦"
          }
        },
        {
          bounds: { x: 833, y: 0, width: 833, height: 843 },
          action: {
            type: "message" as const,
            text: "查詢偏好"
          }
        },
        {
          bounds: { x: 1666, y: 0, width: 834, height: 843 },
          action: {
            type: "message" as const,
            text: "查看上次行程"
          }
        },
        // Row 2
        {
          bounds: { x: 0, y: 843, width: 833, height: 843 },
          action: {
            type: "message" as const,
            text: "修改偏好"
          }
        },
        {
          bounds: { x: 833, y: 843, width: 833, height: 843 },
          action: {
            type: "message" as const,
            text: "功能"
          }
        },
        {
          bounds: { x: 1666, y: 843, width: 834, height: 843 },
          action: {
            type: "uri" as const,
            uri: "https://line.me/R/nv/recommendOA/@your-bot-id" // Replace with your bot's LINE ID
          }
        }
      ]
    };

    // Create the rich menu
    const richMenuId = await lineClient.createRichMenu(menu);

    // Note: You need to upload an image for the rich menu
    // Use: POST https://api-data.line.me/v2/bot/richmenu/{richMenuId}/content
    // Then set it as default

    return NextResponse.json({
      success: true,
      message: "Rich menu created successfully. You need to upload an image and set it as default.",
      richMenuId: richMenuId,
      nextSteps: [
        "1. Upload an image (2500x1686px) to the rich menu",
        "2. Set the rich menu as default using setDefaultRichMenu()",
        "3. Or use LINE Official Account Manager for easier setup"
      ]
    });
  } catch (error: any) {
    console.error("Error setting up rich menu:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to set up rich menu",
        error: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if menu is set up
 */
export async function GET() {
  if (!lineClient) {
    return NextResponse.json(
      { 
        message: "LINE Bot is not configured",
        configured: false
      },
      { status: 503 }
    );
  }

  try {
    const defaultRichMenuId = await lineClient.getDefaultRichMenuId();
    return NextResponse.json({
      configured: true,
      defaultRichMenuId: defaultRichMenuId || null
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        configured: false,
        error: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

