import type { Db, ObjectId } from "mongodb";
import { HttpError } from "../http.js";
import type { Priority, Task } from "../types.js";

export interface CreateTaskInput {
  farm_id: string;
  field_name: string;
  title: string;
  due_date: string;
  priority: Priority;
  reason?: string;
  source?: "agent_recommendation" | "manual";
  source_recommendation_id?: ObjectId;
}

export async function createTask(db: Db, input: CreateTaskInput) {
  const field = await db.collection("fields").findOne({
    farm_id: input.farm_id,
    name: input.field_name
  });

  if (!field) {
    throw new HttpError(404, "Field not found");
  }

  const doc: Task = {
    farm_id: input.farm_id,
    field_id: String(field._id),
    field_name: input.field_name,
    title: input.title,
    due_date: input.due_date,
    priority: input.priority,
    status: "open",
    source: input.source || "manual",
    reason: input.reason,
    source_recommendation_id: input.source_recommendation_id,
    created_at: new Date()
  };

  const result = await db.collection<Task>("tasks").insertOne(doc);
  return {
    id: result.insertedId,
    task: doc
  };
}
