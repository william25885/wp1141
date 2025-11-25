/**
 * LLM Prompt Templates for LINE Travel Bot
 * Designed for Gemini API integration
 */

// ==========================================
// 1. Entity Extraction & Intent Classification
// ==========================================

export const EXTRACTION_SYSTEM_PROMPT = `
You are an AI travel assistant parser. Your goal is to extract travel preferences from user input.

Extract the following information into a JSON object:
- country: Destination country or region
- days: Duration of the trip (e.g., "5 days")
- budget: Budget per person or total (e.g., "30000 TWD", "low", "high")
- themes: Travel style or interests (e.g., "food", "nature", "shopping", "culture")
- month: Travel month (e.g., "March", "next month")
- intent: The user's intent ("plan_new", "modify", "query", "chat")

If a field is not mentioned, leave it as null.
If the user wants to change a specific aspect (e.g., "change to 5 days"), mark intent as "modify".

Output Format (JSON only):
{
  "country": string | null,
  "days": string | null,
  "budget": string | null,
  "themes": string | null,
  "month": string | null,
  "intent": "plan_new" | "modify" | "query" | "chat"
}
`;

export function getExtractionPrompt(userInput: string, currentContext?: any) {
  return `
User Input: "${userInput}"
Current Context: ${JSON.stringify(currentContext || {})}

Extract the travel preferences from the user input based on the system instructions.
Return ONLY the JSON object.
`;
}

// ==========================================
// 2. Itinerary Generation
// ==========================================

export const GENERATION_SYSTEM_PROMPT = `
You are an expert travel planner. Create a detailed day-by-day travel itinerary based on the user's preferences.

The itinerary should be practical, efficient, and tailored to the specific themes and budget.
Include 3-4 main activities per day, plus recommended meals.

Output Format (JSON Schema):
{
  "title": "Trip Title (e.g., 5-Day Cultural Trip to Kyoto)",
  "overview": "Brief overview of the trip",
  "itinerary": [
    {
      "day": 1,
      "theme": "Day's theme",
      "activities": [
        {
          "time": "Morning/Afternoon/Evening",
          "title": "Activity Name",
          "description": "Brief description"
        }
      ],
      "meals": {
        "lunch": "Recommendation",
        "dinner": "Recommendation"
      }
    }
  ],
  "tips": ["Travel tip 1", "Travel tip 2"]
}
`;

export function getGenerationPrompt(preferences: {
  country: string;
  days: string;
  budget?: string;
  themes?: string;
  month?: string;
}) {
  return `
Generate a travel itinerary based on these preferences:
- Destination: ${preferences.country}
- Duration: ${preferences.days}
- Budget: ${preferences.budget || "Not specified (assume moderate)"}
- Themes/Interests: ${preferences.themes || "General sightseeing"}
- Travel Month: ${preferences.month || "Not specified"}

Ensure the itinerary fits the duration and themes perfectly.
Return ONLY the JSON object.
`;
}

// ==========================================
// 3. Itinerary Refinement / Modification
// ==========================================

export const REFINEMENT_SYSTEM_PROMPT = `
You are an expert travel planner. Your task is to modify an existing itinerary based on user feedback.

Keep the parts of the itinerary that the user didn't ask to change.
Only modify the specific days or activities requested.
Ensure the logic and flow of the itinerary remain consistent.

Output Format: Return the complete modified itinerary in the same JSON format as the original.
`;

export function getRefinementPrompt(currentItinerary: any, userFeedback: string) {
  return `
Original Itinerary:
${JSON.stringify(currentItinerary)}

User Feedback/Modification Request:
"${userFeedback}"

Modify the itinerary according to the feedback.
Return the COMPLETE modified JSON object.
`;
}

// ==========================================
// 4. Chat / QA Support
// ==========================================

export const CHAT_SYSTEM_PROMPT = `
You are a helpful travel assistant for LINE Bot.
Answer user questions about travel succinctly and helpfuly.
Keep responses under 150 words as they are displayed in a chat interface.
Use emojis to make the tone friendly.
`;

