import type { Db } from "mongodb";
import type { Priority, Recommendation } from "../types.js";
import { aggregateFarmRisks } from "../tools/aggregateFarmRisks.js";

export async function generateDailyPlan(db: Db, farmId: string, targetDate = tomorrowIsoDate()) {
  const [riskRows, openTasks] = await Promise.all([
    aggregateFarmRisks(db, farmId),
    db.collection("tasks").find({
      farm_id: farmId,
      status: "open"
    }).sort({ priority: 1, due_date: 1 }).limit(20).toArray()
  ]);

  const recommendations: Recommendation[] = riskRows.map((item, index) => {
    const topRisk = item.risks[0];
    const priority: Priority = index === 0 || item.risk_score >= 4 ? "high" : "medium";

    return {
      farm_id: farmId,
      field_id: item._id.field_id,
      field_name: item._id.field_name,
      priority,
      title: titleForRisk(item._id.field_name, topRisk.signal),
      recommendation: recommendationForRisk(item._id.field_name, topRisk.signal),
      reasoning_summary: item.risks.map((risk: any) => {
        return `${risk.signal} appeared ${risk.count} time(s), most recently ${risk.latest_date}`;
      }),
      status: "pending_approval",
      created_at: new Date()
    };
  });

  if (openTasks.length) {
    recommendations.push({
      farm_id: farmId,
      field_id: String(openTasks[0].field_id),
      field_name: openTasks[0].field_name,
      priority: openTasks[0].priority || "medium",
      title: `Close open task: ${openTasks[0].title}`,
      recommendation: `Resolve or update ${openTasks[0].title} before adding new work to ${openTasks[0].field_name}.`,
      reasoning_summary: [
        `There are ${openTasks.length} open task(s) on the farm.`,
        `The oldest visible task is due ${openTasks[0].due_date}.`
      ],
      status: "pending_approval",
      created_at: new Date()
    });
  }

  if (!recommendations.length) {
    const field = await db.collection("fields").findOne({ farm_id: farmId, status: "active" });
    if (field) {
      recommendations.push({
        farm_id: farmId,
        field_id: String(field._id),
        field_name: field.name,
        priority: "low",
        title: `Scout ${field.name}`,
        recommendation: `Walk ${field.name} and add a fresh log so TrellisAI can update the farm memory.`,
        reasoning_summary: [
          "No recent risk signals were found.",
          "Fresh field observations improve tomorrow's plan quality."
        ],
        status: "pending_approval",
        created_at: new Date()
      });
    }
  }

  if (recommendations.length > 0) {
    await db.collection<Recommendation>("recommendations").insertMany(recommendations);
  }

  return {
    answer: "Here is tomorrow's TrellisAI action plan.",
    target_date: targetDate,
    recommendations,
    open_tasks: openTasks
  };
}

function tomorrowIsoDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function titleForRisk(fieldName: string, risk: string): string {
  if (/pest/.test(risk)) return `Scout ${fieldName} for pest pressure`;
  if (/nutrient|yellow/.test(risk)) return `Check ${fieldName} for nutrient stress`;
  if (/irrigation|water/.test(risk)) return `Verify irrigation on ${fieldName}`;
  if (/task|delay/.test(risk)) return `Clear blockers on ${fieldName}`;
  return `Review ${fieldName}`;
}

function recommendationForRisk(fieldName: string, risk: string): string {
  if (/pest/.test(risk)) {
    return `Inspect ${fieldName}, confirm pest density, and approve treatment only if scouting crosses your threshold.`;
  }

  if (/nutrient|yellow/.test(risk)) {
    return `Inspect ${fieldName} before applying more nitrogen and compare against recent irrigation logs.`;
  }

  if (/irrigation|water|dry/.test(risk)) {
    return `Check soil moisture on ${fieldName} and adjust irrigation before the next heat window.`;
  }

  if (/task|delay/.test(risk)) {
    return `Review labor and equipment constraints for ${fieldName} before tomorrow's field work starts.`;
  }

  return `Review ${fieldName} because recent logs show ${risk}.`;
}
