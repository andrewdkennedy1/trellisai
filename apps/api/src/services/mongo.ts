import "dotenv/config";
import { Db, MongoClient } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export async function getDb(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "trellisai";

  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  return db;
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
  }

  client = null;
  db = null;
}

export async function checkMongo(): Promise<{ configured: boolean; ok: boolean; error?: string }> {
  if (!isMongoConfigured()) {
    return { configured: false, ok: false, error: "MONGODB_URI is not set" };
  }

  try {
    const database = await getDb();
    await database.command({ ping: 1 });
    return { configured: true, ok: true };
  } catch (error) {
    return {
      configured: true,
      ok: false,
      error: error instanceof Error ? error.message : "Unknown MongoDB error"
    };
  }
}
