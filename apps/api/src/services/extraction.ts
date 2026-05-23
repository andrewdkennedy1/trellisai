import { z } from "zod";
import type { ExtractedFarmLog, FarmActivity, FarmObservation, Priority } from "../types.js";
import { generateJsonWithGemini, hasGeminiConfig } from "./gemini.js";

const ExtractedFarmLogSchema = z.object({
  activities: z.array(z.object({
    type: z.string(),
    duration_minutes: z.number().optional(),
    amount: z.number().optional(),
    unit: z.string().optional()
  })).default([]),
  observations: z.array(z.object({
    type: z.string(),
    signal: z.string(),
    severity: z.enum(["low", "medium", "high"]).default("medium"),
    location_hint: z.string().optional()
  })).default([]),
  risk_signals: z.array(z.string()).default([]),
  embedding_text: z.string().min(1)
});

const schemaInstruction = `
Extract a daily farm log into strict JSON.

Return only JSON with:
{
  "activities": [{ "type": string, "duration_minutes"?: number, "amount"?: number, "unit"?: string }],
  "observations": [{ "type": string, "signal": string, "severity": "low" | "medium" | "high", "location_hint"?: string }],
  "risk_signals": string[],
  "embedding_text": string
}

Prefer concise agricultural terms. Do not add markdown.
`;

export async function extractFarmLog(rawText: string): Promise<ExtractedFarmLog> {
  if (hasGeminiConfig() && process.env.TRELLISAI_FORCE_DETERMINISTIC !== "true") {
    try {
      const parsed = ExtractedFarmLogSchema.parse(await generateJsonWithGemini([
        schemaInstruction,
        `Farm log: ${rawText}`
      ].join("\n\n")));

      return {
        ...parsed,
        extraction_provider: "gemini"
      };
    } catch (error) {
      console.warn("Gemini extraction failed, falling back to deterministic parser:", error);
    }
  }

  return deterministicExtractFarmLog(rawText);
}

export function deterministicExtractFarmLog(rawText: string): ExtractedFarmLog {
  const text = rawText.toLowerCase();
  const activities: FarmActivity[] = [];
  const observations: FarmObservation[] = [];
  const riskSignals = new Set<string>();

  const duration = text.match(/(\d+)\s*(minute|minutes|min)\b/);
  if (/\birrigat|water|watering\b/.test(text)) {
    activities.push({
      type: "irrigation",
      duration_minutes: duration ? Number(duration[1]) : undefined
    });
  }

  if (/\bfertiliz|nitrogen|compost|spray\b/.test(text)) {
    activities.push({ type: "input_application" });
  }

  if (/\bharvest|picked|cut\b/.test(text)) {
    activities.push({ type: "harvest" });
  }

  if (/\byellow|chlorosis|pale\b/.test(text)) {
    observations.push(observation("crop_health", "yellowing leaves", "medium", locationHint(text)));
    riskSignals.add("possible nutrient deficiency");
  }

  if (/\baphid|mite|beetle|worm|pest\b/.test(text)) {
    observations.push(observation("pest_pressure", "pest sighting", "high", locationHint(text)));
    riskSignals.add("pest pressure");
  }

  if (/\bcurl|wilting|wilt\b/.test(text)) {
    observations.push(observation("crop_health", "leaf stress", "medium", locationHint(text)));
    riskSignals.add("crop stress");
  }

  if (/\bdry|drought|hot|heat\b/.test(text)) {
    observations.push(observation("weather", "dry weather exposure", "medium", locationHint(text)));
    riskSignals.add("weather exposure");
    riskSignals.add("missed irrigation");
  }

  if (/\bdelay|delayed|broken|maintenance|tractor|labor shortage|short crew\b/.test(text)) {
    observations.push(observation("operations", "operational delay", "medium", locationHint(text)));
    riskSignals.add("unresolved tasks");
  }

  if (/\boverwater|standing water|saturated|muddy\b/.test(text)) {
    observations.push(observation("irrigation", "over-irrigation signal", "medium", locationHint(text)));
    riskSignals.add("over-irrigation");
  }

  if (activities.length === 0 && observations.length === 0) {
    observations.push(observation("general", rawText.slice(0, 90), "low", locationHint(text)));
  }

  const embeddingText = [
    rawText,
    ...activities.map((item) => item.type),
    ...observations.map((item) => item.signal),
    ...riskSignals
  ].join(" ").replace(/\s+/g, " ").trim();

  return {
    activities,
    observations,
    risk_signals: Array.from(riskSignals),
    embedding_text: embeddingText,
    extraction_provider: "deterministic"
  };
}

function observation(type: string, signal: string, severity: Priority, hint?: string): FarmObservation {
  return hint
    ? { type, signal, severity, location_hint: hint }
    : { type, signal, severity };
}

function locationHint(text: string): string | undefined {
  const match = text.match(/\b(north|south|east|west|center|road|edge|corner)\b(?:\s+\w+)?/);
  return match?.[0];
}
