import { GoogleGenAI, Type } from "@google/genai";
import { BusinessCard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractBusinessCardData(base64Image: string, mimeType: string): Promise<Partial<BusinessCard>> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        "Extract the business card information from this image. If a field is not found, leave it empty. Return JSON.",
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Full name of the person" },
            company: { type: Type.STRING, description: "Company name" },
            title: { type: Type.STRING, description: "Job title or position" },
            phone: { type: Type.STRING, description: "Phone number (mobile or work)" },
            email: { type: Type.STRING, description: "Email address" },
            memo: { type: Type.STRING, description: "Any other notable information like address or website" },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Error extracting business card data:", error);
    throw error;
  }
}
