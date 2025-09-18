
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Added FileInfo and ChatMessage to the import list.
import type { Correction, FileInfo, ChatMessage } from '../types';
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from '../constants';

let ai: GoogleGenAI | null = null;

/**
 * Initializes the Gemini AI client with the provided API key.
 * @param apiKey The user's Google Gemini API key.
 * @returns true if the client was set, false otherwise.
 */
export const initializeGeminiClient = (apiKey: string): boolean => {
  if (!apiKey) {
    ai = null;
    return false;
  }
  // FIX: API key must be provided in an object with the apiKey property.
  // Using process.env.API_KEY is a hard requirement.
  try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY || apiKey });
    return true;
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
    ai = null;
    return false;
  }
};

/**
 * Checks if the Gemini client is ready to make API calls.
 * @returns boolean
 */
export const isGeminiClientInitialized = (): boolean => {
  return ai !== null;
};


const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            incorrect: {
                type: Type.STRING,
                description: 'মূল লেখা থেকে নেওয়া সঠিক ভুল শব্দটি বা বাক্যাংশ।',
            },
            correct: {
                type: Type.STRING,
                description: 'ভুল শব্দ বা বাক্যাংশের জন্য প্রস্তাবিত সঠিক সংস্করণ।',
            },
            explanation: {
                type: Type.STRING,
                description: 'মূল লেখাটি কেন ভুল ছিল তার একটি সংক্ষিপ্ত ব্যাখ্যা (যেমন, বানান ভুল, ব্যাকরণগত ত্রুটি)।',
            },
        },
        required: ["incorrect", "correct", "explanation"],
    },
};

/**
 * Checks Bengali text for spelling and grammar errors using the Gemini API.
 * @param text The Bengali text to check.
 * @returns A promise that resolves to an array of Correction objects.
 */
export const checkBengaliText = async (text: string): Promise<Correction[]> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized.");
  }

  if (!text.trim()) {
    return [];
  }

  const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Please check the following Bengali text for errors: "${text}"`,
      config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.2,
      }
  });

  const jsonText = response.text.trim();
  if (!jsonText) {
    return [];
  }
  
  try {
    const parsedResponse = JSON.parse(jsonText);
  
    if (Array.isArray(parsedResponse)) {
      // Basic validation
      return parsedResponse.filter(item => 
        item && typeof item.incorrect === 'string' && typeof item.correct === 'string' && typeof item.explanation === 'string'
      );
    }
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonText);
  }

  return [];
};

// FIX: Added missing getGuidance function to resolve import error in ChatPanel.
/**
 * Gets guidance from Gemini for file analysis based on file info and chat history.
 * @param fileInfo The basic information about the file.
 * @param history The history of the chat conversation.
 * @param prompt The latest user prompt (note: this is already part of history).
 * @returns A promise that resolves to the assistant's response string.
 */
export const getGuidance = async (fileInfo: FileInfo, history: ChatMessage[], prompt: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized.");
  }

  const systemInstructionForGuidance = `You are an expert reverse engineering assistant. Your role is to help users understand executable files based on extracted metadata and strings. Be helpful, informative, and cautious. Always remind the user to perform analysis in a safe, isolated environment. Do not execute or suggest executing the file. Your analysis should be based solely on the provided information. Provide your answers in Markdown format.`;
  
  const conversation = history.map(message => `**${message.role}**: ${message.content}`).join('\n\n');

  const fullPrompt = `
Based on the file context and conversation history below, provide a helpful response as the assistant.

**File Context:**
*   **Name:** \`${fileInfo.name}\`
*   **Size:** ${fileInfo.size} bytes
*   **Type:** \`${fileInfo.type || 'unknown'}\`
*   **Extracted Strings (first 50 lines):** 
    \`\`\`
${fileInfo.extractedStrings.slice(0, 50).join('\n')}
    \`\`\`

**Conversation History:**
---
${conversation}
---
`;
  
  try {
    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: fullPrompt,
        config: {
            systemInstruction: systemInstructionForGuidance,
            temperature: 0.5,
        }
    });

    return response.text;
  } catch (error) {
      console.error("Error getting guidance from Gemini:", error);
      return "Sorry, I encountered an error trying to process your request. Please check the console for details and ensure your API key is valid.";
  }
};
