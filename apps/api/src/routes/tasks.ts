import { Router } from "express";
import { z } from "zod";
import { asyncHandler, parseObjectId } from "../http.js";
import { getDb } from "../services/mongo.js";
import { createTask } from "../tools/createTask.js";

export const tasksRouter = Router();

const CreateTaskSchema = z.object({
  farm_id: z.string().default("farm_demo"),
  field_name: z.string(),
  title: z.string(),
  due_date: z.string(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  reason: z.string().optional()
});

const UpdateTaskSchema = z.object({
  status: z.enum(["open", "done", "dismissed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  due_date: z.string().optional()
});

tasksRouter.get("/", asyncHandler(async (req, res) => {
  const farmId = String(req.query.farm_id || "farm_demo");
  const db = await getDb();
  const tasks = await db.collection("tasks").find({ farm_id: farmId }).sort({ due_date: 1 }).limit(100).toArray();
  res.json({ tasks });
}));

tasksRouter.post("/", asyncHandler(async (req, res) => {
  const input = CreateTaskSchema.parse(req.body);
  const db = await getDb();
  res.status(201).json(await createTask(db, input));
}));

tasksRouter.patch("/:id", asyncHandler(async (req, res) => {
  const id = parseObjectId(String(req.params.id));
  const update = UpdateTaskSchema.parse(req.body);
  const db = await getDb();
  const result = await db.collection("tasks").findOneAndUpdate(
    { _id: id },
    { $set: update },
    { returnDocument: "after" }
  );
  res.json({ task: result });
}));
