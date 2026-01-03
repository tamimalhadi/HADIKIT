
import { GoogleGenAI, Type } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStylistAdvice = async (userPrompt: string, availableProducts: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is asking for jersey styling advice: "${userPrompt}". 
      Available store products are: ${availableProducts.join(', ')}.
      
      Act as a high-end sports stylist. 
      1. Suggest 1-2 jerseys from the list.
      2. Explain why they fit the user's request.
      3. Suggest what to pair them with (jeans, sneakers, shorts).
      Keep the response concise and friendly.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    // Use response.text property directly
    return response.text || "I'm sorry, I couldn't generate a recommendation right now. Try asking about a specific team or occasion!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI stylist is currently offline. Please browse our collection manually!";
  }
};
