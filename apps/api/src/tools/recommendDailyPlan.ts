import type { Db } from "mongodb";
import { generateDailyPlan } from "../services/recommendations.js";

export interface RecommendDailyPlanInput {
  farm_id: string;
  target_date?: string;
}

export async function recommendDailyPlan(db: Db, input: RecommendDailyPlanInput) {
  return generateDailyPlan(db, input.farm_id, input.target_date);
}
