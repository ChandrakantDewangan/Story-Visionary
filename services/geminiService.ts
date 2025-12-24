
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

/**
 * Generates an image based on a prompt and previous reference images.
 * Uses gemini-2.5-flash-image for image generation.
 */
export async function generateImageWithContext(
  prompt: string,
  previousImageBase64s: string[]
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // We limit to the last 2 images for consistency without overwhelming the model's context
  const referenceImages = previousImageBase64s.slice(-2);

  const parts: any[] = [];

  // Add reference images first
  referenceImages.forEach((base64) => {
    // Strip the data:image/png;base64, prefix if present
    const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
    parts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: "image/png",
      },
    });
  });

  // Add the text prompt
  parts.push({
    text: `Generate a high-quality illustration for this story segment: "${prompt}". 
    Maintain visual consistency with the provided reference images if they exist. 
    Focus on character, setting, and mood continuity. 
    Style: cinematic, detailed storybook illustration.`,
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts },
    });

    // Iterate through parts to find the image
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error("No parts found in response");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response parts");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
}
