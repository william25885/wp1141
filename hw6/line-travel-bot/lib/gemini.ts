import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  EXTRACTION_SYSTEM_PROMPT, 
  GENERATION_SYSTEM_PROMPT, 
  REFINEMENT_SYSTEM_PROMPT,
  getExtractionPrompt,
  getGenerationPrompt,
  getRefinementPrompt
} from "./llm-prompts";

// Initialize Gemini API client
// Note: GEMINI_API_KEY needs to be set in environment variables
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Use gemini-2.5-flash as requested (Standard model post-Sep 2025)
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

// Helper to clean JSON response from LLM
function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks
  let cleaned = text.replace(/^```json\n|\n```$/g, "").replace(/^```\n|\n```$/g, "").trim();
  
  // Attempt to extract just the JSON object if there's extra text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  return cleaned;
}

/**
 * 解析使用者輸入，提取旅遊偏好
 */
export async function extractTravelPreferences(userInput: string, currentContext?: any) {
  if (!model) {
    console.warn("Gemini API Key not configured");
    return null;
  }

  try {
    const prompt = getExtractionPrompt(userInput, currentContext);
    
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: EXTRACTION_SYSTEM_PROMPT }] },
        { role: "user", parts: [{ text: prompt }] }
      ],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const responseText = result.response.text();
    console.log("Gemini extraction raw response:", responseText);
    return JSON.parse(cleanJsonResponse(responseText));
  } catch (error) {
    console.error("Error calling Gemini API (extraction):", error);
    return null;
  }
}

/**
 * 根據偏好生成行程
 */
export async function generateItinerary(preferences: {
  country: string;
  days: string;
  budget?: string;
  themes?: string;
  month?: string;
}) {
  if (!model) {
    console.warn("Gemini API Key not configured");
    return null;
  }

  try {
    const prompt = getGenerationPrompt(preferences);
    
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: GENERATION_SYSTEM_PROMPT }] },
        { role: "user", parts: [{ text: prompt }] }
      ],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const responseText = result.response.text();
    console.log("Gemini generation raw response:", responseText);
    return JSON.parse(cleanJsonResponse(responseText));
  } catch (error) {
    console.error("Error calling Gemini API (generation):", error);
    return null;
  }
}

/**
 * 根據使用者回饋微調行程
 */
export async function refineItinerary(currentItinerary: any, userFeedback: string) {
  if (!model) {
    console.warn("Gemini API Key not configured");
    return null;
  }

  try {
    const prompt = getRefinementPrompt(currentItinerary, userFeedback);
    
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: REFINEMENT_SYSTEM_PROMPT }] },
        { role: "user", parts: [{ text: prompt }] }
      ],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const responseText = result.response.text();
    return JSON.parse(cleanJsonResponse(responseText));
  } catch (error) {
    console.error("Error calling Gemini API (refinement):", error);
    return null;
  }
}
