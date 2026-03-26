import { GoogleGenAI } from "@google/genai";

async function generateWithRetry(ai: GoogleGenAI, title: string, attempt = 0): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a productivity assistant. Given a task title, write a concise, actionable description (2-3 sentences) for what needs to be done. Task title: "${title}". Reply with only the description, no extra text.`,
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function suggestTaskDescription(title: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set in your .env file.");

  const ai = new GoogleGenAI({ apiKey });

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await generateWithRetry(ai, title, attempt);
    } catch (err: any) {
      const is429 = err?.status === 429 || err?.message?.includes("429");
      if (is429 && attempt < 2) {
        await new Promise((res) => setTimeout(res, 2000 * (attempt + 1)));
        continue;
      }
      if (is429) throw new Error("Rate limit reached. Please wait a moment and try again.");
      throw err;
    }
  }
  return "";
}
