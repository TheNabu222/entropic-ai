import { GoogleGenAI } from "@google/genai";
import { AiCapability } from "../types";

const SYSTEM_INSTRUCTION = "You are a Neocities expert and web development assistant. You help organize, analyze, and improve static websites.";

export const generateAiResponse = async (
  apiKey: string,
  prompt: string,
  capability: AiCapability,
  imageData?: string // Base64 string
) => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  
  let modelName = 'gemini-2.5-flash-preview-09-2025'; // Default fast
  let config: any = {
    systemInstruction: SYSTEM_INSTRUCTION,
  };

  if (capability === 'THINKING') {
    modelName = 'gemini-3-pro-preview';
    config = {
        ...config,
        thinkingConfig: { thinkingBudget: 32768 },
    };
    // Note: maxOutputTokens must NOT be set when using thinkingBudget logic implicitly or we rely on default. 
    // Guidelines say: "If you need to set it, you must set a smaller thinkingBudget... By default you do not need to set thinkingBudget" 
    // BUT Prompt says: "MUST set thinkingBudget to 32768 (max)".
  } else if (capability === 'VISION') {
    modelName = 'gemini-3-pro-preview';
    // Vision doesn't necessarily need thinking, but 3-pro is best for it.
  }

  try {
    const parts: any[] = [];
    
    if (imageData) {
        // Strip data:image/png;base64, prefix if present for the API call if SDK doesn't handle it, 
        // but usually SDK helpers or manual construction handle it. 
        // We will construct the part manually as per guidelines.
        const base64Data = imageData.split(',')[1] || imageData;
        const mimeType = imageData.substring(imageData.indexOf(':') + 1, imageData.indexOf(';')) || 'image/png';
        
        parts.push({
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: config
    });

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate AI response");
  }
};