import type { Db } from "mongodb";
import { HttpError } from "../http.js";
import { farmIsoDateOffset } from "../services/dates.js";

export interface GetFieldHistoryInput {
  farm_id: string;
  field_name: string;
  days: number;
}

export async function getFieldHistory(db: Db, input: GetFieldHistoryInput) {
  const field = await db.collection("fields").findOne({
    farm_id: input.farm_id,
    name: input.field_name
  });

  if (!field) {
    throw new HttpError(404, "Field not found");
  }

  const sinceDate = farmIsoDateOffset(-input.days);

  const [logs, tasks, recommendations] = await Promise.all([
    db.collection("logs").find({
      farm_id: input.farm_id,
      field_id: field._id,
      date: { $gte: sinceDate }
    }).sort({ date: -1 }).limit(100).toArray(),
    db.collection("tasks").find({
      farm_id: input.farm_id,
      field_id: field._id
    }).sort({ due_date: 1 }).limit(50).toArray(),
    db.collection("recommendations").find({
      farm_id: input.farm_id,
      field_id: field._id
    }).sort({ created_at: -1 }).limit(20).toArray()
  ]);

  return {
    field,
    since: sinceDate,
    logs,
    tasks,
    recommendations
  };
}
