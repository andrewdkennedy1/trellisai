import { createHash } from "node:crypto";
import { embedTextWithGemini } from "./gemini.js";

export const EMBEDDING_DIMENSIONS = 768;

export async function createEmbedding(text: string): Promise<number[]> {
  if (process.env.TRELLISAI_FORCE_DETERMINISTIC !== "true") {
    try {
      const embedding = await embedTextWithGemini(text);
      if (embedding?.length) {
        return normalizeDimensions(embedding);
      }
    } catch (error) {
      console.warn("Gemini embedding failed, using deterministic embedding:", error);
    }
  }

  return deterministicEmbedding(text);
}

function normalizeDimensions(values: number[]): number[] {
  if (values.length === EMBEDDING_DIMENSIONS) return values;
  if (values.length > EMBEDDING_DIMENSIONS) return values.slice(0, EMBEDDING_DIMENSIONS);
  return [...values, ...Array(EMBEDDING_DIMENSIONS - values.length).fill(0)];
}

function deterministicEmbedding(text: string): number[] {
  const values: number[] = [];
  let seed = createHash("sha256").update(text).digest("hex");

  while (values.length < EMBEDDING_DIMENSIONS) {
    seed = createHash("sha256").update(seed).digest("hex");
    for (let i = 0; i < seed.length && values.length < EMBEDDING_DIMENSIONS; i += 2) {
      values.push((parseInt(seed.slice(i, i + 2), 16) / 127.5) - 1);
    }
  }

  return values;
}
