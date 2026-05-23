# Devpost Submission Copy

## Project Name

TrellisAI

## Tagline

MongoDB-powered farm memory that turns daily field logs into tomorrow's action plan.

## Project URL

https://trellisai.andrewdkennedy1.workers.dev

## Demo Video

https://youtu.be/pfQCDaUZ0Qg

## Repository

https://github.com/andrewdkennedy1/trellisai

## Inspiration

Farm teams make dozens of operational decisions from scattered notes: irrigation times, pest sightings, crop-health observations, equipment delays, labor constraints, and weather exposure. Those notes usually disappear into text threads or notebooks. We built TrellisAI so daily field logs become durable farm memory that an agent can reason over before recommending tomorrow's work.

## What It Does

TrellisAI lets a grower enter messy natural-language farm logs. Gemini extracts structured activities, observations, risk signals, and embedding text. MongoDB Atlas stores raw logs, structured events, field history, recommendations, tasks, and vector embeddings in one operational memory layer. The agent queries that memory through MongoDB tools/MCP, ranks current field risks, generates a daily action plan, and lets the user approve recommendations into tasks.

## How We Built It

The public app is a Cloudflare Worker that serves the dashboard and proxies API calls. The backend is a TypeScript API designed for Google Cloud Run. It uses Gemini through the Google Gen AI SDK for farm-log extraction, MongoDB Atlas for operational and vector memory, and MongoDB MCP Server as the agent-accessible data tool layer. MongoDB aggregation pipelines rank risks across fields, and approved recommendations are written back as tasks.

## MongoDB Track Fit

MongoDB Atlas is TrellisAI's persistent farm memory layer. We store raw logs, structured observations, field history, recommendations, tasks, and vector embeddings together so the agent can connect today's note to prior field context. MongoDB MCP gives the agent a real tool layer for inspecting collections, retrieving field history, aggregating risk signals, and writing approved recommendations/tasks back to MongoDB.

## Google Cloud / Gemini Use

TrellisAI is built around a Gemini on Vertex AI extraction and planning loop. Gemini turns messy farm notes into strict structured JSON that the backend stores in MongoDB. The Cloud Run API hosts the agent workflow, uses the Cloud Run service account for Vertex AI, and keeps MongoDB credentials in Google Cloud Secret Manager instead of the public Worker.

## Challenges

The main challenge was turning unstructured agricultural notes into a simple, auditable workflow instead of a chat-only demo. We needed the agent to preserve raw notes, create structured records, aggregate risk signals, and keep the grower in control before tasks are created.

## Accomplishments

We built an end-to-end farm-memory loop: daily logs are saved, structured, embedded, queried, ranked, and converted into recommendations. The project includes deployable Cloud Run and Cloudflare Worker surfaces, MongoDB indexes, seed data, a vector index definition, and MongoDB MCP configuration.

## What We Learned

Agentic farm workflows need memory more than conversation. MongoDB is useful here because operational records, semantic search vectors, and task state can live together and remain queryable by both the app and the agent tool layer.

## What's Next

Next steps are weather API integration, richer grower approval flows, photo-based scouting notes, field-specific thresholds, and real Atlas Vector Search retrieval for "have we seen this before?" questions.

## Built With

- Google Cloud Run
- Google Cloud Build
- Google Artifact Registry
- Google Secret Manager
- Google Cloud Text-to-Speech
- Gemini / Google Gen AI SDK
- MongoDB Atlas
- MongoDB MCP Server
- MongoDB Vector Search
- Cloudflare Workers
- TypeScript
- Node.js
