https://devpost.com/submit-to/29711-google-cloud-rapid-agent-hackathon/manage/submissions/1018592/project-overview install gcloud - i'll log you into my browser to do the devpost submission. we chose https://rapid-agent.devpost.com/details/mongodb-

&#x20; resources this is the contest: https://rapid-agent.devpost.com/ . 

install gcloud 

https://console.cloud.google.com/projectselector2/home/dashboard?creatingProject=true\&organizationId=0 



Yes — \*\*TrellisAI\*\* should lean hard into the MongoDB track.



The MongoDB resource page frames MongoDB Atlas as the \*\*operational foundation and persistent memory layer\*\* for AI agents, especially when combining operational, vector, and semantic data in one platform. It also points builders toward MongoDB data modeling, MongoDB MCP Server, and sample embedded/vector data patterns. That fits TrellisAI perfectly: farm logs are semi-structured operational data, and prior logs become agent memory. (\[Google Cloud Rapid Agent Hackathon]\[1])



The hackathon itself wants a \*\*Gemini / Google Cloud Agent Builder agent\*\* that integrates a partner MCP server and does more than chat: it should reason, plan, and take action. (\[Google Cloud Rapid Agent Hackathon]\[2])



\# TrellisAI technical spec



\## Product definition



\*\*TrellisAI\*\* is a MongoDB-powered farm operations agent that turns daily farm logs into structured field memory, risk signals, and prioritized action plans.



\*\*Core flow:\*\*



```text

Farmer logs daily notes

&#x20;       ↓

Gemini extracts structured farm events

&#x20;       ↓

MongoDB stores logs, field history, tasks, recommendations, embeddings

&#x20;       ↓

Agent queries MongoDB through MCP/tools

&#x20;       ↓

TrellisAI recommends tomorrow’s action plan

&#x20;       ↓

Farmer approves tasks

```



\## Recommended architecture



Use \*\*Google Cloud\*\* for the agent/backend and \*\*Cloudflare Workers\*\* for the public hosted app.



```text

Cloudflare Worker

\- Public app shell

\- Edge API gateway

\- Routes user requests to Cloud Run backend



Google Cloud Run

\- TrellisAI backend API

\- Gemini / Agent Builder integration

\- MongoDB MCP bridge or tool layer

\- Farm log extraction

\- Recommendations engine



MongoDB Atlas

\- Farm operational memory

\- Logs, fields, crops, tasks, recommendations

\- Vector search over historical farm logs



Google Cloud Agent Builder / Gemini Enterprise Agent Platform

\- Agent reasoning

\- Tool calling

\- Decision planning

```



This split is important because Cloudflare Workers are excellent for an edge app and gateway, while the MongoDB driver, MCP process, and agent orchestration are cleaner on Cloud Run.



Cloudflare’s Wrangler is the CLI used to build, test, and deploy Workers projects. (\[Cloudflare Docs]\[3]) Google’s Agent Platform is the managed platform for building, scaling, and governing Gemini-powered agents. (\[Google Cloud Documentation]\[4]) MongoDB’s MCP Server gives MCP-compatible clients tools for interacting with MongoDB data and deployments. (\[mongodb.com]\[5])



\---



\# Repo layout



```text

trellisai/

&#x20; apps/

&#x20;   worker/

&#x20;     src/

&#x20;       index.ts

&#x20;     public/

&#x20;     wrangler.jsonc

&#x20;     package.json



&#x20;   api/

&#x20;     src/

&#x20;       index.ts

&#x20;       routes/

&#x20;         logs.ts

&#x20;         fields.ts

&#x20;         recommendations.ts

&#x20;         tasks.ts

&#x20;         agent.ts

&#x20;       services/

&#x20;         mongo.ts

&#x20;         gemini.ts

&#x20;         extraction.ts

&#x20;         recommendations.ts

&#x20;         embeddings.ts

&#x20;       tools/

&#x20;         createFarmLog.ts

&#x20;         getFieldHistory.ts

&#x20;         aggregateFarmRisks.ts

&#x20;         createTask.ts

&#x20;         recommendDailyPlan.ts

&#x20;     Dockerfile

&#x20;     package.json

&#x20;     tsconfig.json



&#x20; infra/

&#x20;   gcloud/

&#x20;     bootstrap.sh

&#x20;     deploy-api.sh

&#x20;   mongodb/

&#x20;     seed.ts

&#x20;     indexes.ts

&#x20;     vector-index.json



&#x20; docs/

&#x20;   demo-script.md

&#x20;   devpost-submission.md

&#x20;   architecture.md



&#x20; README.md

&#x20; LICENSE

&#x20; .gitignore

```



Use \*\*TypeScript everywhere\*\* for speed and consistency.



\---



\# MongoDB collections



\## `farms`



```json

{

&#x20; "\_id": "farm\_demo",

&#x20; "name": "Trellis Demo Farm",

&#x20; "location": {

&#x20;   "city": "Salinas",

&#x20;   "state": "CA",

&#x20;   "lat": 36.6777,

&#x20;   "lng": -121.6555

&#x20; },

&#x20; "timezone": "America/Los\_Angeles"

}

```



\## `fields`



```json

{

&#x20; "\_id": "field\_north",

&#x20; "farm\_id": "farm\_demo",

&#x20; "name": "North Field",

&#x20; "crop": "Corn",

&#x20; "acres": 42,

&#x20; "soil\_type": "sandy loam",

&#x20; "planting\_date": "2026-04-01",

&#x20; "status": "active"

}

```



\## `logs`



```json

{

&#x20; "\_id": "log\_001",

&#x20; "farm\_id": "farm\_demo",

&#x20; "field\_id": "field\_north",

&#x20; "date": "2026-05-21",

&#x20; "raw\_text": "North Field corn has yellowing near east edge. Irrigated 45 minutes.",

&#x20; "activities": \[

&#x20;   {

&#x20;     "type": "irrigation",

&#x20;     "duration\_minutes": 45

&#x20;   }

&#x20; ],

&#x20; "observations": \[

&#x20;   {

&#x20;     "type": "crop\_health",

&#x20;     "signal": "yellowing leaves",

&#x20;     "severity": "medium",

&#x20;     "location\_hint": "east edge"

&#x20;   }

&#x20; ],

&#x20; "risk\_signals": \[

&#x20;   "possible nutrient deficiency",

&#x20;   "possible overwatering"

&#x20; ],

&#x20; "embedding\_text": "North Field corn yellowing east edge irrigated 45 minutes possible nutrient deficiency",

&#x20; "embedding": \[]

}

```



\## `recommendations`



```json

{

&#x20; "\_id": "rec\_001",

&#x20; "farm\_id": "farm\_demo",

&#x20; "field\_id": "field\_north",

&#x20; "priority": "high",

&#x20; "title": "Scout North Field for nitrogen stress",

&#x20; "recommendation": "Inspect the east edge before applying more nitrogen.",

&#x20; "reasoning\_summary": \[

&#x20;   "Yellowing was reported in recent logs",

&#x20;   "Irrigation occurred yesterday",

&#x20;   "Nutrient leaching is possible after heavy water events"

&#x20; ],

&#x20; "status": "pending\_approval",

&#x20; "created\_at": "2026-05-22T09:00:00Z"

}

```



\## `tasks`



```json

{

&#x20; "\_id": "task\_001",

&#x20; "farm\_id": "farm\_demo",

&#x20; "field\_id": "field\_north",

&#x20; "title": "Scout east edge of North Field",

&#x20; "due\_date": "2026-05-23",

&#x20; "priority": "high",

&#x20; "status": "open",

&#x20; "source": "agent\_recommendation",

&#x20; "source\_recommendation\_id": "rec\_001"

}

```



\---



\# MongoDB indexes



Create normal indexes first:



```js

db.logs.createIndex({ farm\_id: 1, field\_id: 1, date: -1 });

db.logs.createIndex({ farm\_id: 1, "observations.type": 1, date: -1 });

db.logs.createIndex({ farm\_id: 1, risk\_signals: 1, date: -1 });



db.tasks.createIndex({ farm\_id: 1, status: 1, due\_date: 1 });

db.recommendations.createIndex({ farm\_id: 1, status: 1, created\_at: -1 });

```



Then add vector search for farm memory. MongoDB Vector Search supports indexes and vector search over embeddings in MongoDB. (\[mongodb.com]\[6])



Example vector index concept:



```json

{

&#x20; "fields": \[

&#x20;   {

&#x20;     "type": "vector",

&#x20;     "path": "embedding",

&#x20;     "numDimensions": 768,

&#x20;     "similarity": "cosine"

&#x20;   },

&#x20;   {

&#x20;     "type": "filter",

&#x20;     "path": "farm\_id"

&#x20;   },

&#x20;   {

&#x20;     "type": "filter",

&#x20;     "path": "field\_id"

&#x20;   }

&#x20; ]

}

```



Use this for questions like:



> “Have we seen this yellowing problem before?”



\---



\# Agent tools



The agent should expose these tools.



\## `create\_farm\_log`



Input:



```json

{

&#x20; "farm\_id": "farm\_demo",

&#x20; "field\_name": "North Field",

&#x20; "raw\_text": "Corn looks yellow near the east edge. Irrigated 45 minutes."

}

```



Behavior:



1\. Use Gemini to extract structured data.

2\. Store raw + structured log in MongoDB.

3\. Generate `embedding\_text`.

4\. Store embedding.

5\. Return saved log summary.



\## `get\_field\_history`



Input:



```json

{

&#x20; "farm\_id": "farm\_demo",

&#x20; "field\_name": "North Field",

&#x20; "days": 14

}

```



Behavior:



Fetch recent logs, observations, input usage, and task history.



\## `aggregate\_farm\_risks`



Behavior:



Run MongoDB aggregations to rank fields by current risk.



Example risk signals:



```text

pest sightings

crop stress

missed irrigation

over-irrigation

fertilizer events

weather exposure

unresolved tasks

repeated observations

```



\## `recommend\_daily\_plan`



Input:



```json

{

&#x20; "farm\_id": "farm\_demo",

&#x20; "target\_date": "2026-05-23"

}

```



Behavior:



1\. Pull open tasks.

2\. Pull recent logs.

3\. Aggregate risk signals.

4\. Retrieve similar historical issues.

5\. Produce ranked recommendations.

6\. Save recommendations to MongoDB.



\## `create\_task`



Input:



```json

{

&#x20; "farm\_id": "farm\_demo",

&#x20; "field\_name": "South Field",

&#x20; "title": "Scout soybeans for aphids",

&#x20; "due\_date": "2026-05-23",

&#x20; "priority": "high",

&#x20; "reason": "Aphids were logged twice in 3 days."

}

```



\---



\# Google Cloud bootstrap



\## 1. Create project



```bash

export PROJECT\_ID=trellisai-demo

export REGION=us-central1



gcloud projects create $PROJECT\_ID

gcloud config set project $PROJECT\_ID

gcloud config set run/region $REGION

```



\## 2. Enable APIs



```bash

gcloud services enable \\

&#x20; run.googleapis.com \\

&#x20; cloudbuild.googleapis.com \\

&#x20; artifactregistry.googleapis.com \\

&#x20; aiplatform.googleapis.com \\

&#x20; secretmanager.googleapis.com

```



The Agent Platform API is served through `aiplatform.googleapis.com`. (\[Google Cloud Documentation]\[7])



\## 3. Create Artifact Registry repo



```bash

gcloud artifacts repositories create trellisai \\

&#x20; --repository-format=docker \\

&#x20; --location=$REGION

```



\## 4. Store secrets



```bash

printf "%s" "$MONGODB\_URI" | gcloud secrets create MONGODB\_URI --data-file=-

printf "%s" "$GOOGLE\_API\_KEY" | gcloud secrets create GOOGLE\_API\_KEY --data-file=-

printf "%s" "$JWT\_SECRET" | gcloud secrets create JWT\_SECRET --data-file=-

```



For MongoDB MCP, MongoDB documents environment-based config such as `MDB\_MCP\_CONNECTION\_STRING`, plus Atlas service account values if using Atlas tools. (\[mongodb.com]\[8])



Optional MCP secrets:



```bash

printf "%s" "$MDB\_MCP\_CONNECTION\_STRING" | gcloud secrets create MDB\_MCP\_CONNECTION\_STRING --data-file=-

printf "%s" "$MDB\_MCP\_API\_CLIENT\_ID" | gcloud secrets create MDB\_MCP\_API\_CLIENT\_ID --data-file=-

printf "%s" "$MDB\_MCP\_API\_CLIENT\_SECRET" | gcloud secrets create MDB\_MCP\_API\_CLIENT\_SECRET --data-file=-

```



\---



\# Cloud Run backend



\## `apps/api/package.json`



```json

{

&#x20; "name": "trellisai-api",

&#x20; "type": "module",

&#x20; "scripts": {

&#x20;   "dev": "tsx src/index.ts",

&#x20;   "build": "tsc",

&#x20;   "start": "node dist/index.js",

&#x20;   "seed": "tsx ../../infra/mongodb/seed.ts"

&#x20; },

&#x20; "dependencies": {

&#x20;   "@google/generative-ai": "latest",

&#x20;   "cors": "latest",

&#x20;   "dotenv": "latest",

&#x20;   "express": "latest",

&#x20;   "mongodb": "latest",

&#x20;   "zod": "latest"

&#x20; },

&#x20; "devDependencies": {

&#x20;   "@types/express": "latest",

&#x20;   "@types/node": "latest",

&#x20;   "tsx": "latest",

&#x20;   "typescript": "latest"

&#x20; }

}

```



\## `apps/api/src/index.ts`



```ts

import express from "express";

import cors from "cors";

import { logsRouter } from "./routes/logs.js";

import { recommendationsRouter } from "./routes/recommendations.js";

import { tasksRouter } from "./routes/tasks.js";

import { agentRouter } from "./routes/agent.js";



const app = express();



app.use(cors());

app.use(express.json({ limit: "2mb" }));



app.get("/health", (\_req, res) => {

&#x20; res.json({ ok: true, service: "trellisai-api" });

});



app.use("/logs", logsRouter);

app.use("/recommendations", recommendationsRouter);

app.use("/tasks", tasksRouter);

app.use("/agent", agentRouter);



const port = Number(process.env.PORT || 8080);



app.listen(port, () => {

&#x20; console.log(`TrellisAI API listening on ${port}`);

});

```



\## `apps/api/src/services/mongo.ts`



```ts

import { MongoClient, Db } from "mongodb";



let client: MongoClient | null = null;

let db: Db | null = null;



export async function getDb(): Promise<Db> {

&#x20; if (db) return db;



&#x20; const uri = process.env.MONGODB\_URI;

&#x20; const dbName = process.env.MONGODB\_DB || "trellisai";



&#x20; if (!uri) {

&#x20;   throw new Error("Missing MONGODB\_URI");

&#x20; }



&#x20; client = new MongoClient(uri);

&#x20; await client.connect();



&#x20; db = client.db(dbName);

&#x20; return db;

}

```



\## `apps/api/src/routes/logs.ts`



```ts

import { Router } from "express";

import { z } from "zod";

import { getDb } from "../services/mongo.js";

import { extractFarmLog } from "../services/extraction.js";



export const logsRouter = Router();



const CreateLogSchema = z.object({

&#x20; farm\_id: z.string().default("farm\_demo"),

&#x20; field\_name: z.string(),

&#x20; raw\_text: z.string().min(3),

&#x20; date: z.string().optional()

});



logsRouter.post("/", async (req, res) => {

&#x20; const input = CreateLogSchema.parse(req.body);

&#x20; const db = await getDb();



&#x20; const field = await db.collection("fields").findOne({

&#x20;   farm\_id: input.farm\_id,

&#x20;   name: input.field\_name

&#x20; });



&#x20; if (!field) {

&#x20;   return res.status(404).json({ error: "Field not found" });

&#x20; }



&#x20; const extracted = await extractFarmLog(input.raw\_text);



&#x20; const doc = {

&#x20;   farm\_id: input.farm\_id,

&#x20;   field\_id: field.\_id,

&#x20;   field\_name: input.field\_name,

&#x20;   date: input.date || new Date().toISOString().slice(0, 10),

&#x20;   raw\_text: input.raw\_text,

&#x20;   ...extracted,

&#x20;   created\_at: new Date()

&#x20; };



&#x20; const result = await db.collection("logs").insertOne(doc);



&#x20; res.json({

&#x20;   id: result.insertedId,

&#x20;   log: doc

&#x20; });

});

```



\## `apps/api/src/services/extraction.ts`



````ts

import { GoogleGenerativeAI } from "@google/generative-ai";



const schemaInstruction = `

Extract a farm log into strict JSON.



Return only JSON with:

{

&#x20; "activities": \[{ "type": string, "duration\_minutes"?: number, "amount"?: number, "unit"?: string }],

&#x20; "observations": \[{ "type": string, "signal": string, "severity": "low" | "medium" | "high", "location\_hint"?: string }],

&#x20; "risk\_signals": string\[],

&#x20; "embedding\_text": string

}

`;



export async function extractFarmLog(rawText: string) {

&#x20; const apiKey = process.env.GOOGLE\_API\_KEY;



&#x20; if (!apiKey) {

&#x20;   throw new Error("Missing GOOGLE\_API\_KEY");

&#x20; }



&#x20; const genAI = new GoogleGenerativeAI(apiKey);

&#x20; const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



&#x20; const result = await model.generateContent(\[

&#x20;   schemaInstruction,

&#x20;   `Farm log: ${rawText}`

&#x20; ]);



&#x20; const text = result.response.text().trim();

&#x20; const cleaned = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();



&#x20; return JSON.parse(cleaned);

}

````



\## `apps/api/Dockerfile`



```dockerfile

FROM node:22-slim



WORKDIR /app



COPY package\*.json ./

RUN npm install



COPY tsconfig.json ./

COPY src ./src



RUN npm run build



ENV NODE\_ENV=production

EXPOSE 8080



CMD \["npm", "start"]

```



\## Deploy API to Cloud Run



```bash

export PROJECT\_ID=trellisai-demo

export REGION=us-central1

export IMAGE=$REGION-docker.pkg.dev/$PROJECT\_ID/trellisai/api:latest



cd apps/api



gcloud builds submit --tag $IMAGE



gcloud run deploy trellisai-api \\

&#x20; --image $IMAGE \\

&#x20; --region $REGION \\

&#x20; --allow-unauthenticated \\

&#x20; --set-env-vars MONGODB\_DB=trellisai \\

&#x20; --set-secrets MONGODB\_URI=MONGODB\_URI:latest,GOOGLE\_API\_KEY=GOOGLE\_API\_KEY:latest,JWT\_SECRET=JWT\_SECRET:latest

```



After deploy, save the Cloud Run URL:



```bash

export API\_URL=$(gcloud run services describe trellisai-api \\

&#x20; --region=$REGION \\

&#x20; --format='value(status.url)')



echo $API\_URL

```



\---



\# Cloudflare Worker app



Use the Worker as:



1\. Hosted public project URL for Devpost.

2\. Lightweight frontend.

3\. Gateway to Cloud Run API.



Cloudflare supports environment variables as bindings exposed through the Worker `env` object, and secrets should be stored as encrypted secrets rather than plain vars. (\[Cloudflare Docs]\[9])



\## `apps/worker/package.json`



```json

{

&#x20; "name": "trellisai-worker",

&#x20; "type": "module",

&#x20; "scripts": {

&#x20;   "dev": "wrangler dev",

&#x20;   "deploy": "wrangler deploy"

&#x20; },

&#x20; "dependencies": {},

&#x20; "devDependencies": {

&#x20;   "wrangler": "latest",

&#x20;   "typescript": "latest"

&#x20; }

}

```



\## `apps/worker/wrangler.jsonc`



```jsonc

{

&#x20; "name": "trellisai",

&#x20; "main": "src/index.ts",

&#x20; "compatibility\_date": "2026-05-22",

&#x20; "vars": {

&#x20;   "APP\_NAME": "TrellisAI"

&#x20; }

}

```



Wrangler supports config files such as `wrangler.json`, `wrangler.jsonc`, and `wrangler.toml`. (\[Cloudflare Docs]\[10])



\## `apps/worker/src/index.ts`



```ts

export interface Env {

&#x20; APP\_NAME: string;

&#x20; API\_URL: string;

}



function html() {

&#x20; return `<!doctype html>

<html>

<head>

&#x20; <meta charset="utf-8" />

&#x20; <title>TrellisAI</title>

&#x20; <meta name="viewport" content="width=device-width, initial-scale=1" />

&#x20; <style>

&#x20;   body {

&#x20;     font-family: Inter, system-ui, sans-serif;

&#x20;     margin: 0;

&#x20;     background: #f7f4ec;

&#x20;     color: #1f2a1f;

&#x20;   }

&#x20;   main {

&#x20;     max-width: 960px;

&#x20;     margin: 0 auto;

&#x20;     padding: 48px 20px;

&#x20;   }

&#x20;   .card {

&#x20;     background: white;

&#x20;     border-radius: 20px;

&#x20;     padding: 24px;

&#x20;     box-shadow: 0 10px 30px rgba(0,0,0,.08);

&#x20;     margin-bottom: 20px;

&#x20;   }

&#x20;   textarea, input, button {

&#x20;     width: 100%;

&#x20;     font: inherit;

&#x20;     box-sizing: border-box;

&#x20;     margin-top: 10px;

&#x20;   }

&#x20;   textarea, input {

&#x20;     padding: 12px;

&#x20;     border: 1px solid #ddd;

&#x20;     border-radius: 12px;

&#x20;   }

&#x20;   button {

&#x20;     padding: 12px 16px;

&#x20;     border: 0;

&#x20;     border-radius: 12px;

&#x20;     background: #254d32;

&#x20;     color: white;

&#x20;     cursor: pointer;

&#x20;     font-weight: 700;

&#x20;   }

&#x20;   pre {

&#x20;     white-space: pre-wrap;

&#x20;     background: #f2f2f2;

&#x20;     padding: 16px;

&#x20;     border-radius: 12px;

&#x20;   }

&#x20; </style>

</head>

<body>

&#x20; <main>

&#x20;   <h1>TrellisAI</h1>

&#x20;   <p>From daily farm logs to tomorrow’s action plan.</p>



&#x20;   <section class="card">

&#x20;     <h2>Add a farm log</h2>

&#x20;     <input id="field" value="North Field" />

&#x20;     <textarea id="log" rows="5">North Field corn has yellowing near the east edge. Irrigated 45 minutes yesterday.</textarea>

&#x20;     <button onclick="createLog()">Save log</button>

&#x20;   </section>



&#x20;   <section class="card">

&#x20;     <h2>Ask TrellisAI</h2>

&#x20;     <textarea id="question" rows="3">What should I do tomorrow?</textarea>

&#x20;     <button onclick="askAgent()">Generate action plan</button>

&#x20;   </section>



&#x20;   <section class="card">

&#x20;     <h2>Output</h2>

&#x20;     <pre id="output">Ready.</pre>

&#x20;   </section>

&#x20; </main>



&#x20; <script>

&#x20;   async function createLog() {

&#x20;     const output = document.getElementById("output");

&#x20;     output.textContent = "Saving log...";



&#x20;     const response = await fetch("/api/logs", {

&#x20;       method: "POST",

&#x20;       headers: { "content-type": "application/json" },

&#x20;       body: JSON.stringify({

&#x20;         farm\_id: "farm\_demo",

&#x20;         field\_name: document.getElementById("field").value,

&#x20;         raw\_text: document.getElementById("log").value

&#x20;       })

&#x20;     });



&#x20;     output.textContent = JSON.stringify(await response.json(), null, 2);

&#x20;   }



&#x20;   async function askAgent() {

&#x20;     const output = document.getElementById("output");

&#x20;     output.textContent = "Thinking...";



&#x20;     const response = await fetch("/api/agent/ask", {

&#x20;       method: "POST",

&#x20;       headers: { "content-type": "application/json" },

&#x20;       body: JSON.stringify({

&#x20;         farm\_id: "farm\_demo",

&#x20;         question: document.getElementById("question").value

&#x20;       })

&#x20;     });



&#x20;     output.textContent = JSON.stringify(await response.json(), null, 2);

&#x20;   }

&#x20; </script>

</body>

</html>`;

}



export default {

&#x20; async fetch(request: Request, env: Env): Promise<Response> {

&#x20;   const url = new URL(request.url);



&#x20;   if (url.pathname.startsWith("/api/")) {

&#x20;     const upstream = new URL(url.pathname.replace(/^\\/api/, ""), env.API\_URL);



&#x20;     const proxied = new Request(upstream.toString(), {

&#x20;       method: request.method,

&#x20;       headers: request.headers,

&#x20;       body: request.body

&#x20;     });



&#x20;     return fetch(proxied);

&#x20;   }



&#x20;   return new Response(html(), {

&#x20;     headers: {

&#x20;       "content-type": "text/html; charset=utf-8"

&#x20;     }

&#x20;   });

&#x20; }

};

```



\## Deploy Worker



```bash

cd apps/worker



npm install



npx wrangler secret put API\_URL

\# paste your Cloud Run URL, for example:

\# https://trellisai-api-xxxxx-uc.a.run.app



npm run deploy

```



\---



\# Agent `/ask` endpoint



\## `apps/api/src/routes/agent.ts`



```ts

import { Router } from "express";

import { z } from "zod";

import { getDb } from "../services/mongo.js";

import { generateDailyPlan } from "../services/recommendations.js";



export const agentRouter = Router();



const AskSchema = z.object({

&#x20; farm\_id: z.string().default("farm\_demo"),

&#x20; question: z.string()

});



agentRouter.post("/ask", async (req, res) => {

&#x20; const input = AskSchema.parse(req.body);

&#x20; const db = await getDb();



&#x20; if (/what should i do|tomorrow|today|action plan/i.test(input.question)) {

&#x20;   const plan = await generateDailyPlan(db, input.farm\_id);

&#x20;   return res.json(plan);

&#x20; }



&#x20; return res.json({

&#x20;   answer: "I can currently generate daily action plans from farm logs. Try: What should I do tomorrow?"

&#x20; });

});

```



\## `apps/api/src/services/recommendations.ts`



```ts

import type { Db } from "mongodb";



export async function generateDailyPlan(db: Db, farmId: string) {

&#x20; const recentRisks = await db.collection("logs").aggregate(\[

&#x20;   { $match: { farm\_id: farmId } },

&#x20;   { $sort: { date: -1 } },

&#x20;   { $limit: 50 },

&#x20;   { $unwind: "$risk\_signals" },

&#x20;   {

&#x20;     $group: {

&#x20;       \_id: {

&#x20;         field\_id: "$field\_id",

&#x20;         field\_name: "$field\_name",

&#x20;         risk: "$risk\_signals"

&#x20;       },

&#x20;       count: { $sum: 1 },

&#x20;       latest\_date: { $max: "$date" }

&#x20;     }

&#x20;   },

&#x20;   {

&#x20;     $group: {

&#x20;       \_id: {

&#x20;         field\_id: "$\_id.field\_id",

&#x20;         field\_name: "$\_id.field\_name"

&#x20;       },

&#x20;       risks: {

&#x20;         $push: {

&#x20;           signal: "$\_id.risk",

&#x20;           count: "$count",

&#x20;           latest\_date: "$latest\_date"

&#x20;         }

&#x20;       },

&#x20;       risk\_score: { $sum: "$count" }

&#x20;     }

&#x20;   },

&#x20;   { $sort: { risk\_score: -1 } },

&#x20;   { $limit: 5 }

&#x20; ]).toArray();



&#x20; const recommendations = recentRisks.map((item, index) => {

&#x20;   const topRisk = item.risks\[0];



&#x20;   return {

&#x20;     priority: index === 0 ? "high" : "medium",

&#x20;     field\_id: item.\_id.field\_id,

&#x20;     field\_name: item.\_id.field\_name,

&#x20;     title: `Review ${item.\_id.field\_name}`,

&#x20;     recommendation: `Check ${item.\_id.field\_name} because recent logs show ${topRisk.signal}.`,

&#x20;     reasoning\_summary: item.risks.map((risk: any) => {

&#x20;       return `${risk.signal} appeared ${risk.count} time(s), most recently ${risk.latest\_date}`;

&#x20;     }),

&#x20;     status: "pending\_approval",

&#x20;     created\_at: new Date()

&#x20;   };

&#x20; });



&#x20; if (recommendations.length > 0) {

&#x20;   await db.collection("recommendations").insertMany(

&#x20;     recommendations.map((rec) => ({

&#x20;       farm\_id: farmId,

&#x20;       ...rec

&#x20;     }))

&#x20;   );

&#x20; }



&#x20; return {

&#x20;   answer: "Here is tomorrow’s TrellisAI action plan.",

&#x20;   recommendations

&#x20; };

}

```



\---



\# MongoDB MCP incorporation



For the hackathon story, say:



\*\*TrellisAI uses MongoDB MCP as the agent’s farm-memory tool layer. The agent can inspect collections, retrieve field history, query recent logs, analyze risk signals, and write approved recommendations/tasks back to MongoDB.\*\*



Minimum viable MCP usage:



```text

Gemini / Agent Builder

&#x20; → MongoDB MCP Server

&#x20;   → read logs

&#x20;   → inspect schema

&#x20;   → aggregate risks

&#x20;   → write recommendations

```



MongoDB says the MCP Server can connect to Atlas or other MongoDB deployments, and a connection string grants database access; Atlas service account credentials unlock Atlas-specific tools. (\[mongodb.com]\[11])



For local/dev MCP config:



```bash

export MDB\_MCP\_CONNECTION\_STRING="$MONGODB\_URI"

export MDB\_MCP\_LOG\_PATH="./mcp-logs"

```



If using Atlas tools:



```bash

export MDB\_MCP\_API\_CLIENT\_ID="..."

export MDB\_MCP\_API\_CLIENT\_SECRET="..."

```



\---



\# Seed data spec



Create 3 demo fields:



```text

North Field — Corn

\- yellowing leaves

\- irrigation logs

\- nitrogen concern



South Field — Soybeans

\- aphid sightings

\- leaf curling

\- dry weather



West Field — Lettuce

\- harvest timing

\- labor shortage

\- equipment delay

```



Create 20–40 logs so the agent has enough memory to aggregate.



Example seed logs:



```json

\[

&#x20; {

&#x20;   "field\_name": "North Field",

&#x20;   "raw\_text": "Corn has yellowing near the east edge. Irrigated 45 minutes."

&#x20; },

&#x20; {

&#x20;   "field\_name": "North Field",

&#x20;   "raw\_text": "More yellow leaves after yesterday's watering. No pests spotted."

&#x20; },

&#x20; {

&#x20;   "field\_name": "South Field",

&#x20;   "raw\_text": "Aphids found on soybean leaves near the south road. Leaf curling on several plants."

&#x20; },

&#x20; {

&#x20;   "field\_name": "South Field",

&#x20;   "raw\_text": "Second aphid sighting this week. Conditions are warm and dry."

&#x20; },

&#x20; {

&#x20;   "field\_name": "West Field",

&#x20;   "raw\_text": "Lettuce harvest delayed because tractor maintenance ran long."

&#x20; }

]

```



\---



\# Required env vars



\## Cloud Run API



```bash

MONGODB\_URI=

MONGODB\_DB=trellisai

GOOGLE\_API\_KEY=

JWT\_SECRET=

MDB\_MCP\_CONNECTION\_STRING=

MDB\_MCP\_API\_CLIENT\_ID=

MDB\_MCP\_API\_CLIENT\_SECRET=

```



\## Cloudflare Worker



```bash

API\_URL=https://your-cloud-run-url

```



Use `wrangler secret put API\_URL` for the Worker.



\---



\# Devpost positioning



Use this in the submission:



> TrellisAI is a MongoDB-powered farm operations agent that turns messy daily farm logs into tomorrow’s action plan. Farmers enter natural-language logs about irrigation, pests, crop health, labor, equipment, and input usage. TrellisAI extracts structured events with Gemini, stores them in MongoDB Atlas as operational memory, uses MongoDB MCP to let the agent query and update farm data, and generates prioritized recommendations under grower oversight.



\## MongoDB track language



> MongoDB Atlas is TrellisAI’s persistent farm memory layer. We store raw logs, structured observations, field history, recommendations, tasks, and vector embeddings in one place. The agent uses MongoDB MCP tools and aggregation pipelines to reason over farm history, retrieve similar past issues, and create approved tasks.



\## Demo flow



1\. Open Cloudflare-hosted TrellisAI.

2\. Enter messy farm logs.

3\. Show logs converted to structured MongoDB documents.

4\. Ask: “What should I do tomorrow?”

5\. Agent queries MongoDB history.

6\. Agent returns prioritized recommendations.

7\. User approves tasks.

8\. Dashboard updates.



\---



\# Build order



Do it in this order:



```text

1\. Create MongoDB Atlas cluster

2\. Create collections and seed demo farm data

3\. Build Cloud Run API

4\. Implement log extraction

5\. Implement risk aggregation

6\. Implement recommendation generation

7\. Add MongoDB MCP integration

8\. Deploy API to Cloud Run

9\. Deploy Cloudflare Worker

10\. Record demo

```



The core MVP is done once this works:



```text

User enters messy farm log

→ log saved to MongoDB

→ user asks “What should I do tomorrow?”

→ agent returns field-specific action plan

→ recommendations are saved

```



That is enough for a compelling hackathon submission.



\[1]: https://rapid-agent.devpost.com/details/mongodb-resources?utm\_source=chatgpt.com "Google Cloud Rapid Agent Hackathon - rapid-agent.devpost.com"

\[2]: https://rapid-agent.devpost.com/?utm\_source=chatgpt.com "Google Cloud Rapid Agent Hackathon: Building Agents for Real-World ..."

\[3]: https://developers.cloudflare.com/workers/wrangler/?utm\_source=chatgpt.com "Wrangler · Cloudflare Workers docs"

\[4]: https://docs.cloud.google.com/gemini-enterprise-agent-platform?utm\_source=chatgpt.com "Gemini Enterprise Agent Platform | Google Cloud Documentation"

\[5]: https://www.mongodb.com/docs/mcp-server/overview/?utm\_source=chatgpt.com "MongoDB MCP Server Overview"

\[6]: https://www.mongodb.com/docs/vector-search/?utm\_source=chatgpt.com "MongoDB Vector Search Overview"

\[7]: https://docs.cloud.google.com/gemini-enterprise-agent-platform/reference/rest?utm\_source=chatgpt.com "Agent Platform API | Gemini Enterprise Agent Platform | Google Cloud ..."

\[8]: https://www.mongodb.com/docs/mcp-server/configuration/methods/?utm\_source=chatgpt.com "MongoDB MCP Server Configuration Methods"

\[9]: https://developers.cloudflare.com/workers/configuration/environment-variables/?utm\_source=chatgpt.com "Environment variables · Cloudflare Workers docs"

\[10]: https://developers.cloudflare.com/workers/wrangler/configuration/?utm\_source=chatgpt.com "Configuration - Wrangler · Cloudflare Workers docs"

\[11]: https://www.mongodb.com/products/tools/mcp-server?utm\_source=chatgpt.com "MongoDB MCP Server"

&#x20;

