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

const rawLogPools = {
  "North Field": [
    "7:10am corn on the east edge is pale again, almost lemon yellow on the lower leaves. Irrigation ran 42 min last night.",
    "North corn center rows look ok but east low spot is still wet. Boots picked up mud, no standing water by noon.",
    "Skipped the planned water set. Soil probe on east edge still reads wet at 8 inches.",
    "Jose saw shallow roots in the sandy strip near row 14. Leaves pale, no chewing marks.",
    "Applied a tiny N test strip to rows 11-12 only. Marked stakes with blue tape.",
    "Corn color improved near the middle pivot track. East edge still behind the rest of the block.",
    "Irrigation ran 30 min before sunrise because wind was forecast. East low corner might be getting too much.",
    "No aphids or mites in corn. Yellowing is mostly nutrient/water related from what scout saw.",
    "Pressure check on north line was uneven, last two sprinklers weak. Need crew to flush tomorrow.",
    "Fertilizer tank was lower than expected after the last run. Need verify injection rate.",
    "East edge has yellow leaves plus a little leaf roll by 3pm. Warm afternoon, soil surface crusting.",
    "Two rows near the ditch are shorter. Could be compaction from last week's tractor pass.",
    "Morning scout counted no pests. Leaves pale between veins on 6 of 20 sample plants.",
    "Ran pump 20 min just to test pressure. West half looked fine; east line still sputtered.",
    "Rain gauge had trace only. We held irrigation because root zone was damp from prior set.",
    "Corn near row 18 has better color after N strip, but low area still patchy.",
    "Found a broken riser cap near east edge. Replaced it but soil there is saturated.",
    "Drone pass showed yellow patch shaped like irrigation pattern, not random pest spread.",
    "Crew noted fertilizer injector alarm at 6:40am, reset after 10 min. Need check if dose was missed.",
    "South wind dried the top fast but probe still says wet below. Do not overwater tomorrow.",
    "North Field smells sour in the low spot, maybe anaerobic. Plants there are stunted.",
    "Leaf tissue sample bagged from east edge and center rows for comparison.",
    "Irrigation valve stuck partly open for unknown time. Closed manually at 5pm.",
    "Corn overall ok but the east edge keeps showing the same yellow stress after every water event.",
    "Need a decision before more nitrogen: water issue, injector issue, or true deficiency?"
  ],
  "South Field": [
    "Soybeans by south road have leaf curl again. Found aphids under leaves in 4 of 10 checks.",
    "Warm dry wind all afternoon. South edge looks dusty and stressed, center rows less curled.",
    "Aphid count above threshold at two sample points near the road. Beneficials present but not enough yet.",
    "Irrigated 28 min after lunch. Leaves perked up a little but pests still visible.",
    "Scout text: aphids mostly underside lower canopy, row 6-9. No mildew spotted.",
    "Second pass this week, leaf curl spreading about 40 ft farther into the block.",
    "Lady beetles seen in center rows. Hold spray decision until morning count if weather allows.",
    "South road dust is heavy after trucks. Plants nearest road look worse than interior.",
    "No irrigation today because pump crew was on North line. Soybeans looked dry by 2pm.",
    "Aphid pressure lower after cool night but still active on south edge leaves.",
    "Sampled 20 plants: 7 had aphids, 5 had curling, 2 had both heavy.",
    "Irrigation filter had sand. Flow may have been low on the south lateral.",
    "Dry forecast tomorrow and wind from road side. Need scout before heat peak.",
    "Leaf curl in soybeans could be pest plus dry stress. Pods still forming normally.",
    "Crew saw ants farming aphids near the ditch. Marked hot spot with orange flag.",
    "Applied no treatment. Want one more count because beneficial insects are increasing.",
    "South Field canopy temp felt hotter than North on handheld check. Soil dry at 4 inches.",
    "Aphids clustered on new growth at south corner. Edge rows need priority.",
    "Irrigation ran 35 min, but pressure dropped halfway through. Check filter before next set.",
    "Some leaves have speckling, maybe early mite pressure mixed with aphids.",
    "Roadside plants still curled at sunset. Center rows recovered after water.",
    "Scouting note from Maya: count aphids before 10am, hot wind makes them harder to see later.",
    "Beneficials present: lacewing eggs on 3 plants. Still not enough to ignore the hotspot.",
    "South lateral #2 has uneven moisture. Could be clogged emitters.",
    "Need decision tomorrow: spot treat south road edge or wait for beneficials."
  ],
  "West Field": [
    "Lettuce harvest start slipped because the tractor was still in maintenance at 6am.",
    "Short crew today, only 7 cutters instead of 11. Finished half of west block before heat.",
    "Cooling trailer arrived 45 min late. Lettuce sat too long at loading area.",
    "West beds look firm after holding water. Good for harvest if crew is ready early.",
    "Packaging sleeves delayed, crew waited near west gate for 30 min.",
    "Harvest quality good in rows 1-12. Outer leaves a little warm after noon.",
    "Labor lead says two people out tomorrow. Need shift crew from wash station if possible.",
    "Tractor maintenance complete but forklift battery was low. Charge overnight.",
    "Irrigation held again to keep beds firm. Watch for wilt if harvest slips.",
    "Warm weather coming in two days. West lettuce needs priority before quality drops.",
    "Crew finished rows 13-20 but left north corner because bins ran short.",
    "Mud near gate slowed trailer turnarounds. Need gravel or alternate pickup route.",
    "Harvest knives were not all sharpened. Slowed first crew by 20 min.",
    "West Field looks market-ready. Delay risk is labor and cooling, not crop health.",
    "Truck appointment changed to 11am. Need harvest start before sunrise.",
    "Cooling unit alarm at 1pm, reset after filter clean. Monitor tomorrow.",
    "Rows near west fence have slight tip burn after warm afternoon.",
    "Crew packed 68 crates, target was 95. Labor shortage remains blocker.",
    "Irrigation set accidentally ran 12 min on west strip. Beds still mostly firm.",
    "Pallet jack stuck near loading pad. Equipment delay cost another 15 min.",
    "Quality check: heads dense, color good, no pest damage in sample crate.",
    "If we miss tomorrow morning window, warm weather could lower grade.",
    "Need assign harvest crew, cooling trailer, sleeves, and forklift before 5:30am.",
    "West gate area congested with fertilizer delivery. Keep harvest route clear.",
    "Manager note: prioritize lettuce first, then South soybean scouting."
  ]
} as const;

const baseLogs = Object.entries(rawLogPools).flatMap(([fieldName, logs]) => {
  return logs.map((rawText) => [fieldName, rawText] as const);
});

const start = new Date("2026-04-23T12:00:00Z");

for (const [index, [field_name, raw_text]] of baseLogs.entries()) {
  const date = new Date(start);
  date.setDate(start.getDate() + Math.floor(index / 3));
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
