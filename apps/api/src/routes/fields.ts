import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../http.js";
import { getDb } from "../services/mongo.js";
import { getFieldHistory } from "../tools/getFieldHistory.js";

export const fieldsRouter = Router();

const FieldSchema = z.object({
  _id: z.string(),
  farm_id: z.string().default("farm_demo"),
  name: z.string(),
  crop: z.string(),
  acres: z.number().positive(),
  soil_type: z.string(),
  planting_date: z.string(),
  status: z.enum(["active", "inactive"]).default("active")
});

fieldsRouter.get("/", asyncHandler(async (req, res) => {
  const farmId = String(req.query.farm_id || "farm_demo");
  const db = await getDb();
  const fields = await db.collection("fields").find({ farm_id: farmId }).sort({ name: 1 }).toArray();
  res.json({ fields });
}));

fieldsRouter.post("/", asyncHandler(async (req, res) => {
  const input = FieldSchema.parse(req.body);
  const db = await getDb();
  await db.collection<any>("fields").updateOne({ _id: input._id }, { $set: input }, { upsert: true });
  res.status(201).json({ field: input });
}));

fieldsRouter.get("/:name/history", asyncHandler(async (req, res) => {
  const farmId = String(req.query.farm_id || "farm_demo");
  const days = Number(req.query.days || 14);
  const db = await getDb();
  res.json(await getFieldHistory(db, {
    farm_id: farmId,
    field_name: String(req.params.name),
    days
  }));
}));
