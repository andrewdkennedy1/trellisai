import "dotenv/config";
import { closeDb, getDb } from "../../apps/api/src/services/mongo.js";
import { createFarmLog } from "../../apps/api/src/tools/createFarmLog.js";

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb://localhost:27017/trellisai";
}

process.env.TRELLISAI_FORCE_DETERMINISTIC = process.env.TRELLISAI_FORCE_DETERMINISTIC || "true";

const db = await getDb();
const farmId = "farm_demo";

await Promise.all([
  db.collection("farms").deleteMany({ _id: farmId }),
  db.collection("fields").deleteMany({ farm_id: farmId }),
  db.collection("logs").deleteMany({ farm_id: farmId }),
  db.collection("tasks").deleteMany({ farm_id: farmId }),
  db.collection("recommendations").deleteMany({ farm_id: farmId })
]);

await db.collection("farms").insertOne({
  _id: farmId,
  name: "Trellis Demo Farm",
  location: {
    city: "Salinas",
    state: "CA",
    lat: 36.6777,
    lng: -121.6555
  },
  timezone: "America/Los_Angeles"
});

await db.collection("fields").insertMany([
  {
    _id: "field_north",
    farm_id: farmId,
    name: "North Field",
    crop: "Corn",
    acres: 42,
    soil_type: "sandy loam",
    planting_date: "2026-04-01",
    status: "active"
  },
  {
    _id: "field_south",
    farm_id: farmId,
    name: "South Field",
    crop: "Soybeans",
    acres: 36,
    soil_type: "silt loam",
    planting_date: "2026-04-08",
    status: "active"
  },
  {
    _id: "field_west",
    farm_id: farmId,
    name: "West Field",
    crop: "Lettuce",
    acres: 18,
    soil_type: "clay loam",
    planting_date: "2026-03-15",
    status: "active"
  }
]);

const baseLogs = [
  ["North Field", "Corn has yellowing near the east edge. Irrigated 45 minutes."],
  ["North Field", "More yellow leaves after yesterday's watering. No pests spotted."],
  ["North Field", "North Field east edge still pale. Soil is muddy in the low corner."],
  ["North Field", "Applied light nitrogen test strip on two corn rows."],
  ["North Field", "Corn color improved in center rows, yellowing remains at the east edge."],
  ["North Field", "Irrigation ran 35 minutes before sunrise."],
  ["North Field", "Standing water near east edge after irrigation."],
  ["North Field", "No new pests in corn. Yellow leaves still visible."],
  ["North Field", "Scout found pale leaves and shallow roots in sandy section."],
  ["North Field", "Skipped irrigation because soil was saturated."],
  ["South Field", "Aphids found on soybean leaves near the south road. Leaf curling on several plants."],
  ["South Field", "Second aphid sighting this week. Conditions are warm and dry."],
  ["South Field", "Soybean leaves curling on south road side. No irrigation today."],
  ["South Field", "Aphids visible on underside of leaves in five sample spots."],
  ["South Field", "Dry wind all afternoon. Soybean canopy looks stressed."],
  ["South Field", "Irrigated 30 minutes after dry weather and pest scouting."],
  ["South Field", "Aphid pressure lower in center rows but still active near road."],
  ["South Field", "Leaf curling continued on three soybean rows."],
  ["South Field", "Beneficial insects seen but aphids still above threshold near south edge."],
  ["South Field", "Warm dry weather forecast for tomorrow."],
  ["West Field", "Lettuce harvest delayed because tractor maintenance ran long."],
  ["West Field", "Short crew today; west lettuce harvest slipped another day."],
  ["West Field", "Cooling trailer was late and harvest start moved to afternoon."],
  ["West Field", "Equipment delay blocked lettuce pickup near west gate."],
  ["West Field", "Harvest timing is tight before warm weather arrives."],
  ["West Field", "Crew finished half the west lettuce block before sunset."],
  ["West Field", "Tractor maintenance complete but labor shortage remains."],
  ["West Field", "Lettuce quality looks good; prioritize harvest tomorrow morning."],
  ["West Field", "Packaging supplies delayed at the loading area."],
  ["West Field", "Irrigation held to keep lettuce beds firm for harvest."]
] as const;

const start = new Date("2026-04-23T12:00:00Z");

for (const [index, [field_name, raw_text]] of baseLogs.entries()) {
  const date = new Date(start);
  date.setDate(start.getDate() + index);
  await createFarmLog(db, {
    farm_id: farmId,
    field_name,
    raw_text,
    date: date.toISOString().slice(0, 10)
  });
}

await db.collection("tasks").insertMany([
  {
    farm_id: farmId,
    field_id: "field_south",
    field_name: "South Field",
    title: "Confirm aphid density on south road edge",
    due_date: "2026-05-23",
    priority: "high",
    status: "open",
    source: "manual",
    reason: "Aphids were logged repeatedly this week.",
    created_at: new Date()
  },
  {
    farm_id: farmId,
    field_id: "field_west",
    field_name: "West Field",
    title: "Line up morning harvest crew",
    due_date: "2026-05-23",
    priority: "medium",
    status: "open",
    source: "manual",
    reason: "Labor shortage and harvest timing risk.",
    created_at: new Date()
  }
]);

await Promise.all([
  db.collection("logs").createIndex({ farm_id: 1, field_id: 1, date: -1 }),
  db.collection("logs").createIndex({ farm_id: 1, "observations.type": 1, date: -1 }),
  db.collection("logs").createIndex({ farm_id: 1, risk_signals: 1, date: -1 }),
  db.collection("tasks").createIndex({ farm_id: 1, status: 1, due_date: 1 }),
  db.collection("recommendations").createIndex({ farm_id: 1, status: 1, created_at: -1 })
]);

console.log(`Seeded ${baseLogs.length} logs across 3 fields for ${farmId}.`);
await closeDb();
