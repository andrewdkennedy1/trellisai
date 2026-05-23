import type { Db } from "mongodb";
import { createEmbedding } from "../services/embeddings.js";

export interface MemoryMatch {
  field_name: string;
  date: string;
  raw_text: string;
  risk_signals: string[];
  embedding_text: string;
  score: number;
  source: "mongodb_vector_search" | "cosine_fallback";
}

export async function retrieveFarmMemory(db: Db, farmId: string, query: string, limit = 3): Promise<MemoryMatch[]> {
  const queryVector = await createEmbedding(query);

  try {
    const matches = await db.collection("logs").aggregate<MemoryMatch>([
      {
        $vectorSearch: {
          index: "farm_memory_vector_index",
          path: "embedding",
          queryVector,
          numCandidates: 100,
          limit,
          filter: { farm_id: farmId }
        }
      },
      {
        $project: {
          _id: 0,
          field_name: 1,
          date: 1,
          raw_text: 1,
          risk_signals: 1,
          embedding_text: 1,
          score: { $meta: "vectorSearchScore" },
          source: { $literal: "mongodb_vector_search" }
        }
      }
    ]).toArray();

    if (matches.length) {
      return matches;
    }
  } catch (error) {
    console.warn("MongoDB Vector Search unavailable, using local cosine fallback:", error);
  }

  const logs = await db.collection("logs").find({
    farm_id: farmId,
    embedding: { $type: "array" }
  }, {
    projection: {
      _id: 0,
      field_name: 1,
      date: 1,
      raw_text: 1,
      risk_signals: 1,
      embedding_text: 1,
      embedding: 1
    }
  }).sort({ date: -1 }).limit(100).toArray();

  return logs
    .map((log) => ({
      field_name: String(log.field_name || "Field"),
      date: String(log.date || ""),
      raw_text: String(log.raw_text || ""),
      risk_signals: Array.isArray(log.risk_signals) ? log.risk_signals.map(String) : [],
      embedding_text: String(log.embedding_text || ""),
      score: cosineSimilarity(queryVector, Array.isArray(log.embedding) ? log.embedding.map(Number) : []),
      source: "cosine_fallback" as const
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length) return 0;

  const length = Math.min(a.length, b.length);
  let dot = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;

  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    aMagnitude += a[i] * a[i];
    bMagnitude += b[i] * b[i];
  }

  if (!aMagnitude || !bMagnitude) return 0;
  return dot / (Math.sqrt(aMagnitude) * Math.sqrt(bMagnitude));
}
