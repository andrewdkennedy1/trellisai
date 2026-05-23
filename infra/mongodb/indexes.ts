import "dotenv/config";
import { closeDb, getDb } from "../../apps/api/src/services/mongo.js";

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb://localhost:27017/trellisai";
}

const db = await getDb();

await Promise.all([
  db.collection("logs").createIndex({ farm_id: 1, field_id: 1, date: -1 }),
  db.collection("logs").createIndex({ farm_id: 1, "observations.type": 1, date: -1 }),
  db.collection("logs").createIndex({ farm_id: 1, risk_signals: 1, date: -1 }),
  db.collection("tasks").createIndex({ farm_id: 1, status: 1, due_date: 1 }),
  db.collection("recommendations").createIndex({ farm_id: 1, status: 1, created_at: -1 })
]);

console.log("MongoDB operational indexes are ready.");
await closeDb();
