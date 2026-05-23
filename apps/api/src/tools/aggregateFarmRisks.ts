import type { Db } from "mongodb";

export async function aggregateFarmRisks(db: Db, farmId: string) {
  return db.collection("logs").aggregate([
    { $match: { farm_id: farmId } },
    { $sort: { date: -1 } },
    { $limit: 100 },
    { $unwind: "$risk_signals" },
    {
      $group: {
        _id: {
          field_id: "$field_id",
          field_name: "$field_name",
          risk: "$risk_signals"
        },
        count: { $sum: 1 },
        latest_date: { $max: "$date" }
      }
    },
    {
      $group: {
        _id: {
          field_id: "$_id.field_id",
          field_name: "$_id.field_name"
        },
        risks: {
          $push: {
            signal: "$_id.risk",
            count: "$count",
            latest_date: "$latest_date"
          }
        },
        risk_score: { $sum: "$count" }
      }
    },
    { $sort: { risk_score: -1 } },
    { $limit: 10 }
  ]).toArray();
}
