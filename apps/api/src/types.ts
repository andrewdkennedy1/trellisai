import type { ObjectId } from "mongodb";

export type Priority = "low" | "medium" | "high";
export type RecommendationStatus = "pending_approval" | "approved" | "dismissed";
export type TaskStatus = "open" | "done" | "dismissed";

export interface FarmActivity {
  type: string;
  duration_minutes?: number;
  amount?: number;
  unit?: string;
}

export interface FarmObservation {
  type: string;
  signal: string;
  severity: Priority;
  location_hint?: string;
}

export interface ExtractedFarmLog {
  activities: FarmActivity[];
  observations: FarmObservation[];
  risk_signals: string[];
  embedding_text: string;
  extraction_provider: "gemini" | "deterministic";
}

export interface FarmField {
  _id: string;
  farm_id: string;
  name: string;
  crop: string;
  acres: number;
  soil_type: string;
  planting_date: string;
  status: "active" | "inactive";
}

export interface Recommendation {
  _id?: ObjectId;
  farm_id: string;
  field_id: string;
  field_name: string;
  priority: Priority;
  title: string;
  recommendation: string;
  reasoning_summary: string[];
  status: RecommendationStatus;
  created_at: Date;
}

export interface Task {
  _id?: ObjectId;
  farm_id: string;
  field_id: string;
  field_name: string;
  title: string;
  due_date: string;
  priority: Priority;
  status: TaskStatus;
  source: "agent_recommendation" | "manual";
  reason?: string;
  source_recommendation_id?: ObjectId;
  created_at: Date;
}
