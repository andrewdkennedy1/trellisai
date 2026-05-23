import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

export function hasGeminiConfig(): boolean {
  return Boolean(process.env.GOOGLE_API_KEY) || isVertexConfigured();
}

function getClient(): GoogleGenAI {
  if (client) return client;

  if (isVertexConfigured()) {
    client = new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1"
    });
    return client;
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY or Vertex AI configuration");
  }

  client = new GoogleGenAI({ apiKey });
  return client;
}

function isVertexConfigured(): boolean {
  return /^true$/i.test(process.env.GOOGLE_GENAI_USE_VERTEXAI || "")
    && Boolean(process.env.GOOGLE_CLOUD_PROJECT)
    && Boolean(process.env.GOOGLE_CLOUD_LOCATION);
}

export async function generateJsonWithGemini(prompt: string): Promise<unknown> {
  const ai = getClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = (response as any).text;
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  const cleaned = text.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned);
}

export async function embedTextWithGemini(text: string): Promise<number[] | null> {
  if (!hasGeminiConfig()) return null;

  const ai = getClient();
  const model = process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004";
  const response = await ai.models.embedContent({
    model,
    contents: text
  } as never);

  const values = (response as any).embeddings?.[0]?.values || (response as any).embedding?.values;
  return Array.isArray(values) ? values.map(Number) : null;
}
