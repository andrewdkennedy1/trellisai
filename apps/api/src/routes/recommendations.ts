import { Router } from "express";
import { z } from "zod";
import { asyncHandler, HttpError, parseObjectId } from "../http.js";
import { getDb } from "../services/mongo.js";
import { createTask } from "../tools/createTask.js";

export const recommendationsRouter = Router();

const ApproveSchema = z.object({
  due_date: z.string().optional()
});

recommendationsRouter.get("/", asyncHandler(async (req, res) => {
  const farmId = String(req.query.farm_id || "farm_demo");
  const db = await getDb();
  const recommendations = await db.collection("recommendations").find({ farm_id: farmId })
    .sort({ created_at: -1 })
    .limit(50)
    .toArray();
  res.json({ recommendations });
}));

recommendationsRouter.post("/:id/approve", asyncHandler(async (req, res) => {
  const id = parseObjectId(String(req.params.id));
  const input = ApproveSchema.parse(req.body);
  const db = await getDb();
  const recommendation = await db.collection("recommendations").findOne({ _id: id });

  if (!recommendation) {
    throw new HttpError(404, "Recommendation not found");
  }

  await db.collection("recommendations").updateOne({ _id: id }, { $set: { status: "approved" } });

  const dueDate = input.due_date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const task = await createTask(db, {
    farm_id: recommendation.farm_id,
    field_name: recommendation.field_name,
    title: recommendation.title,
    due_date: dueDate,
    priority: recommendation.priority,
    reason: recommendation.recommendation,
    source: "agent_recommendation",
    source_recommendation_id: id
  });

  res.json({ recommendation_id: id, task });
}));
