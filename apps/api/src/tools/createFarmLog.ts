import type { Db } from "mongodb";
import { HttpError } from "../http.js";
import { createEmbedding } from "../services/embeddings.js";
import { extractFarmLog } from "../services/extraction.js";

export interface CreateFarmLogInput {
  farm_id: string;
  field_name: string;
  raw_text: string;
  date?: string;
}

export async function createFarmLog(db: Db, input: CreateFarmLogInput) {
  const field = await db.collection("fields").findOne({
    farm_id: input.farm_id,
    name: input.field_name
  });

  if (!field) {
    throw new HttpError(404, "Field not found");
  }

  const extracted = await extractFarmLog(input.raw_text);
  const embedding = await createEmbedding(extracted.embedding_text);

  const doc = {
    farm_id: input.farm_id,
    field_id: field._id,
    field_name: input.field_name,
    date: input.date || new Date().toISOString().slice(0, 10),
    raw_text: input.raw_text,
    ...extracted,
    embedding,
    created_at: new Date()
  };

  const result = await db.collection("logs").insertOne(doc);

  return {
    id: result.insertedId,
    log: doc
  };
}
