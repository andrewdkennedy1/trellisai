import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../http.js";
import { getDb } from "../services/mongo.js";
import { createFarmLog } from "../tools/createFarmLog.js";

export const logsRouter = Router();

const CreateLogSchema = z.object({
  farm_id: z.string().default("farm_demo"),
  field_name: z.string().min(1),
  raw_text: z.string().min(3),
  date: z.string().optional()
});

logsRouter.get("/", asyncHandler(async (req, res) => {
  const farmId = String(req.query.farm_id || "farm_demo");
  const db = await getDb();
  const logs = await db.collection("logs").find({ farm_id: farmId }).sort({ date: -1 }).limit(50).toArray();
  res.json({ logs });
}));

logsRouter.post("/", asyncHandler(async (req, res) => {
  const input = CreateLogSchema.parse(req.body);
  const db = await getDb();
  res.json(await createFarmLog(db, input));
}));
