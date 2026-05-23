import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../http.js";
import { describeMongoMcpIntegration } from "../services/mongodbMcp.js";
import { getDb } from "../services/mongo.js";
import { aggregateFarmRisks } from "../tools/aggregateFarmRisks.js";
import { getFieldHistory } from "../tools/getFieldHistory.js";
import { recommendDailyPlan } from "../tools/recommendDailyPlan.js";

export const agentRouter = Router();

const AskSchema = z.object({
  farm_id: z.string().default("farm_demo"),
  question: z.string()
});

agentRouter.get("/tools", (_req, res) => {
  res.json({
    tools: [
      "create_farm_log",
      "get_field_history",
      "aggregate_farm_risks",
      "recommend_daily_plan",
      "create_task"
    ],
    mongodb_mcp: describeMongoMcpIntegration()
  });
});

agentRouter.post("/ask", asyncHandler(async (req, res) => {
  const input = AskSchema.parse(req.body);
  const db = await getDb();

  if (/what should i do|tomorrow|today|action plan|daily plan/i.test(input.question)) {
    return res.json(await recommendDailyPlan(db, {
      farm_id: input.farm_id
    }));
  }

  const historyMatch = input.question.match(/history.*?(north field|south field|west field)/i);
  if (historyMatch) {
    return res.json(await getFieldHistory(db, {
      farm_id: input.farm_id,
      field_name: titleCase(historyMatch[1]),
      days: 14
    }));
  }

  if (/risk|risks|priority/i.test(input.question)) {
    return res.json({
      answer: "Here are the current field risk signals from MongoDB farm memory.",
      risks: await aggregateFarmRisks(db, input.farm_id)
    });
  }

  return res.json({
    answer: "I can generate daily action plans, summarize field history, and rank farm risks from MongoDB farm memory.",
    examples: [
      "What should I do tomorrow?",
      "Show history for North Field",
      "What are the highest risks?"
    ]
  });
}));

function titleCase(value: string): string {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}
