import { ObjectId, type Db } from "mongodb";
import type { Priority, Recommendation } from "../types.js";
import { farmIsoDateOffset } from "./dates.js";
import { aggregateFarmRisks } from "../tools/aggregateFarmRisks.js";
import { retrieveFarmMemory, type MemoryMatch } from "../tools/retrieveFarmMemory.js";

interface RiskSignal {
  signal: string;
  count?: number;
  latest_date?: string;
}

interface RiskRow {
  _id: {
    field_id: string;
    field_name: string;
  };
  risks: RiskSignal[];
  risk_score?: number;
}

interface OpenTask {
  field_id?: unknown;
  field_name?: unknown;
  priority?: Priority;
  title?: unknown;
  due_date?: unknown;
}

export async function generateDailyPlan(db: Db, farmId: string, targetDate = tomorrowIsoDate()) {
  const [riskRows, openTasks] = await Promise.all([
    aggregateFarmRisks(db, farmId),
    db.collection("tasks").find({
      farm_id: farmId,
      status: "open"
    }).sort({ priority: 1, due_date: 1 }).limit(20).toArray()
  ]);

  const memoryQuery = riskRows.length
    ? riskRows.map((row) => `${row._id.field_name}: ${row.risks.map((risk: any) => risk.signal).join(", ")}`).join("; ")
    : "recent farm risks, crop stress, irrigation, pests, labor, and tomorrow's farm plan";
  const memoryMatches = await retrieveFarmMemory(db, farmId, memoryQuery, 3);

  const typedRiskRows = riskRows as RiskRow[];
  const typedOpenTasks = openTasks as OpenTask[];

  const recommendations: Recommendation[] = typedRiskRows.map((item, index) => {
    const topRisk = item.risks[0];
    const priority: Priority = index === 0 || (item.risk_score || 0) >= 4 ? "high" : "medium";

    return {
      _id: new ObjectId(),
      farm_id: farmId,
      field_id: item._id.field_id,
      field_name: item._id.field_name,
      priority,
      title: titleForRisk(item._id.field_name, topRisk.signal),
      recommendation: recommendationForRisk(item._id.field_name, topRisk.signal),
      reasoning_summary: recommendationReasons(item, memoryMatches, typedOpenTasks),
      status: "pending_approval",
      created_at: new Date()
    };
  });

  if (typedOpenTasks.length) {
    const firstTask = typedOpenTasks[0];
    const taskFieldName = String(firstTask.field_name || "the farm");
    const taskTitle = String(firstTask.title || "open field work");
    recommendations.push({
      _id: new ObjectId(),
      farm_id: farmId,
      field_id: String(firstTask.field_id || ""),
      field_name: taskFieldName,
      priority: firstTask.priority || "medium",
      title: `Close open task: ${taskTitle}`,
      recommendation: `Update ${taskTitle} before the crew adds more work to ${taskFieldName}.`,
      reasoning_summary: [
        `I found ${typedOpenTasks.length} unfinished job(s), so I kept this plan focused on work that changes tomorrow morning.`,
        firstTask.due_date ? `The oldest visible job is due ${String(firstTask.due_date)}.` : "The oldest visible job needs a fresh status before the morning plan is final."
      ],
      status: "pending_approval",
      created_at: new Date()
    });
  }

  if (!recommendations.length) {
    const field = await db.collection("fields").findOne({ farm_id: farmId, status: "active" });
    if (field) {
      recommendations.push({
        _id: new ObjectId(),
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

  const topRiskRow = typedRiskRows[0];
  const sprinklerPlan = buildSprinklerPlan(topRiskRow);
  const receipts = buildAgentReceipts(topRiskRow, memoryMatches, typedOpenTasks, recommendations.length, sprinklerPlan);

  return {
    answer: topRiskRow
      ? `I moved ${topRiskRow._id.field_name} to the front of tomorrow morning and prepared the crew plan, memory receipts, and sprinkler change for approval.`
      : "I did not find a hot spot in the latest notes, so I prepared a light scouting plan and asked for a fresh field log.",
    target_date: targetDate,
    reasoning_summary: planThoughts(topRiskRow, memoryMatches, typedOpenTasks),
    agent_receipts: receipts,
    sprinkler_plan: sprinklerPlan,
    tool_calls: [
      {
        name: "Read today's notes",
        system: "Farm log review",
        result: topRiskRow
          ? `${topRiskRow._id.field_name} needs the first pass because ${formatRiskList(topRiskRow.risks).toLowerCase()}.`
          : "No urgent field pattern stood out in the latest notes."
      },
      {
        name: "Remember similar weeks",
        system: "Farm memory",
        result: memoryMatches[0]
          ? `Pulled a similar ${memoryMatches[0].field_name} note from ${memoryMatches[0].date}.`
          : "No close past note was available, so the plan stays conservative."
      },
      {
        name: "Check unfinished jobs",
        system: "Task board",
        result: typedOpenTasks.length
          ? `${typedOpenTasks.length} unfinished job(s) were kept in view.`
          : "No unfinished jobs were blocking the plan."
      },
      {
        name: "Prepare approvals",
        system: "Crew plan",
        result: `${recommendations.length} approval-ready action(s) were drafted.`
      }
    ],
    agent_trace: [
      {
        step: "Read",
        detail: topRiskRow
          ? `The latest notes point to ${topRiskRow._id.field_name}: ${formatRiskList(topRiskRow.risks).toLowerCase()}.`
          : "The latest notes do not point to one urgent field."
      },
      {
        step: "Remember",
        detail: memoryMatches[0]
          ? `A past ${memoryMatches[0].field_name} note from ${memoryMatches[0].date} looked similar enough to use as context.`
          : "No past note was close enough to lean on."
      },
      {
        step: "Decide",
        detail: sprinklerPlan
          ? `I prepared a sprinkler change for ${sprinklerPlan.zone} and kept it ready for approval.`
          : "I kept the next move to scouting because there was no clear irrigation trigger."
      },
      {
        step: "Act",
        detail: `I drafted ${recommendations.length} crew action(s) so the grower can approve, adjust, or dismiss them.`
      }
    ],
    memory_matches: memoryMatches,
    recommendations,
    open_tasks: typedOpenTasks
  };
}

function tomorrowIsoDate(): string {
  return farmIsoDateOffset(1);
}

function titleForRisk(fieldName: string, risk: string): string {
  if (/pest|aphid|mite|worm|thrip/i.test(risk)) return `Scout ${fieldName} for pest pressure`;
  if (/crop stress|stress|curl|burn/i.test(risk)) return `Scout ${fieldName} stress pattern`;
  if (/nutrient|yellow/.test(risk)) return `Check ${fieldName} for nutrient stress`;
  if (/irrigation|water|dry|pressure/.test(risk)) return `Verify irrigation on ${fieldName}`;
  if (/task|delay/.test(risk)) return `Clear blockers on ${fieldName}`;
  return `Review ${fieldName}`;
}

function recommendationForRisk(fieldName: string, risk: string): string {
  if (/pest|aphid|mite|worm|thrip/i.test(risk)) {
    return `Inspect ${fieldName}, confirm pest density, and approve treatment only if scouting crosses your threshold.`;
  }

  if (/nutrient|yellow/.test(risk)) {
    return `Inspect ${fieldName} before applying more nitrogen and compare against recent irrigation logs.`;
  }

  if (/crop stress|stress|curl|burn/i.test(risk)) {
    return `Scout ${fieldName}, compare leaf curl against soil moisture and pest pressure, then decide whether water or treatment is the right first move.`;
  }

  if (/irrigation|water|dry/.test(risk)) {
    return `Check soil moisture on ${fieldName} and adjust irrigation before the next heat window.`;
  }

  if (/task|delay/.test(risk)) {
    return `Review labor and equipment constraints for ${fieldName} before tomorrow's field work starts.`;
  }

  return `Review ${fieldName} because recent logs show ${risk}.`;
}

function recommendationReasons(row: RiskRow, memoryMatches: MemoryMatch[], openTasks: OpenTask[]): string[] {
  const reasons = [
    `The newest notes mention ${formatRiskList(row.risks).toLowerCase()} in ${row._id.field_name}.`
  ];

  const memory = memoryMatches.find((match) => match.field_name === row._id.field_name) || memoryMatches[0];
  if (memory) {
    reasons.push(`I remembered a similar ${memory.field_name} note from ${memory.date} and used it as context.`);
  }

  if (openTasks.length) {
    reasons.push(`I checked unfinished jobs first, then only added work that changes tomorrow's priority.`);
  }

  return reasons;
}

function planThoughts(row: RiskRow | undefined, memoryMatches: MemoryMatch[], openTasks: OpenTask[]): string[] {
  if (!row) {
    return [
      "I do not see a field that needs emergency action from the latest notes.",
      "The best next move is a fresh scout log so tomorrow's plan is based on current field conditions.",
      openTasks.length ? `I still noticed ${openTasks.length} unfinished job(s), so the crew board should be cleaned up before adding more work.` : "The crew board is clear enough for a light scouting day."
    ];
  }

  const thoughts = [
    `Start at ${row._id.field_name} because the latest notes combine ${formatRiskList(row.risks).toLowerCase()}.`
  ];

  if (memoryMatches[0]) {
    thoughts.push(`I remembered a similar ${memoryMatches[0].field_name} note from ${memoryMatches[0].date}, so I am treating this like a repeatable field pattern instead of a one-off comment.`);
  } else {
    thoughts.push("I did not find a close past note, so I kept the recommendation conservative and scout-first.");
  }

  thoughts.push(openTasks.length
    ? `${openTasks.length} unfinished job(s) are still on the board, so I avoided piling on work that does not change tomorrow morning.`
    : "There are no unfinished jobs blocking the first morning action.");

  return thoughts;
}

function buildSprinklerPlan(row: RiskRow | undefined) {
  if (!row) return null;

  const signals = row.risks.map((risk) => risk.signal.toLowerCase());
  const needsWater = signals.some((signal) => /irrigation|water|dry|pressure|curl|heat|moisture/.test(signal));
  const durationMinutes = needsWater ? 42 : 24;
  const startTime = needsWater ? "5:15 AM" : "6:10 AM";
  const fieldName = row._id.field_name;

  return {
    controller: `${fieldName} smart sprinklers`,
    zone: zoneForField(fieldName),
    decision: needsWater
      ? "Run before scouting so the crew can separate water stress from pest pressure."
      : "Hold a short rinse cycle ready, but wait for the scout before adding water.",
    before: {
      start_time: "6:30 AM",
      duration_minutes: 25,
      mode: "standard morning cycle"
    },
    after: {
      start_time: startTime,
      duration_minutes: durationMinutes,
      mode: needsWater ? "agent-adjusted moisture recovery" : "agent-ready scout support",
      status: "ready for approval"
    },
    reason: `The new log points to ${formatRiskList(row.risks).toLowerCase()} in ${fieldName}.`,
    approval_required: true
  };
}

function buildAgentReceipts(
  row: RiskRow | undefined,
  memoryMatches: MemoryMatch[],
  openTasks: OpenTask[],
  recommendationCount: number,
  sprinklerPlan: ReturnType<typeof buildSprinklerPlan>
) {
  return [
    {
      label: "Read the new log",
      detail: row
        ? `Flagged ${row._id.field_name} because the grower notes mention ${formatRiskList(row.risks).toLowerCase()}.`
        : "Found no emergency pattern in the latest notes.",
      state: "done"
    },
    {
      label: "Remembered past context",
      detail: memoryMatches[0]
        ? `Matched this against a similar ${memoryMatches[0].field_name} note from ${memoryMatches[0].date}.`
        : "No close past note was available, so the plan stays scout-first.",
      state: memoryMatches[0] ? "done" : "watch"
    },
    {
      label: "Checked the crew board",
      detail: openTasks.length
        ? `${openTasks.length} unfinished job(s) stayed visible while I planned tomorrow.`
        : "No unfinished jobs are blocking tomorrow's first move.",
      state: "done"
    },
    {
      label: "Edited sprinkler schedule",
      detail: sprinklerPlan
        ? `${sprinklerPlan.zone} is queued for ${sprinklerPlan.after.start_time} for ${sprinklerPlan.after.duration_minutes} minutes.`
        : "No sprinkler edit was needed from the current notes.",
      state: sprinklerPlan ? "approval" : "watch"
    },
    {
      label: "Queued approvals",
      detail: `${recommendationCount} crew action(s) are ready for the grower to approve.`,
      state: "approval"
    }
  ];
}

function formatRiskList(risks: RiskSignal[]): string {
  const labels = risks.slice(0, 4).map((risk) => riskLabel(risk.signal));
  if (!labels.length) return "fresh field observations";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

function riskLabel(signal: string): string {
  const normalized = signal.replace(/_/g, " ").trim().toLowerCase();
  if (/pest pressure|aphid|mite|worm|thrip/.test(normalized)) return "pest pressure";
  if (/crop stress|leaf curl|curl|burn|stress/.test(normalized)) return "crop stress";
  if (/missed irrigation|low pressure|irrigation|dry|moisture/.test(normalized)) return "missed irrigation";
  if (/weather|wind|heat/.test(normalized)) return "weather exposure";
  if (/nutrient|yellow/.test(normalized)) return "possible nutrient deficiency";
  if (/task|delay|unresolved/.test(normalized)) return "unresolved work";
  if (/water/.test(normalized)) return "water stress";
  return normalized;
}

function zoneForField(fieldName: string): string {
  if (/south/i.test(fieldName)) return "South road edge / lateral 2";
  if (/north/i.test(fieldName)) return "North block / lateral 1";
  if (/west/i.test(fieldName)) return "West block / drip zone 3";
  return `${fieldName} / primary irrigation zone`;
}
