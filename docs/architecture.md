# TrellisAI Architecture

TrellisAI is organized around a farm-memory loop:

```text
Farmer log -> Agent Platform Runtime -> Gemini extraction -> MongoDB Atlas vector memory -> agent tools/MCP -> ranked plan -> approved tasks
```

## Components

- Cloudflare Worker hosts the public app and proxies `/api/*` to the backend.
- Google Cloud Agent Platform Runtime hosts the TrellisAI agent wrapper and exposes multi-turn planning, log history, save-log, and task-approval operations.
- Cloud Run hosts the TypeScript API and isolates MongoDB/Gemini credentials.
- Gemini on Vertex AI extracts structured activities, observations, risk signals, and embedding text from messy logs.
- MongoDB Atlas stores raw logs, structured logs, fields, tasks, recommendations, and vectors.
- MongoDB Vector Search retrieves prior field-memory matches before the planner creates tomorrow's recommendations. The demo also includes a cosine fallback for the self-hosted MongoDB instance.
- MongoDB MCP Server exposes the farm memory to MCP-compatible agent runtimes for schema inspection, queries, aggregation, and writes.

## MongoDB MCP

The MCP config lives at `infra/mongodb/mcp-config.json` and launches the official MongoDB MCP server with `npx -y mongodb-mcp-server`. TrellisAI uses the same farm collections from the API, so the agent can inspect schema, retrieve field history, aggregate risk signals, and write approved tasks back to MongoDB.

## Collections

- `farms`: farm profile and location metadata.
- `fields`: active field inventory and crop metadata.
- `logs`: raw notes, structured events, observations, risk signals, embedding text, and vector embeddings.
- `recommendations`: generated action-plan recommendations awaiting approval.
- `tasks`: approved or manually created field work.

## Deployment

1. Create a Google Cloud project and enable Run, Cloud Build, Artifact Registry, Vertex AI, Agent Platform Runtime, and Secret Manager.
2. Create a MongoDB Atlas cluster and store `MONGODB_URI` as a Google Secret Manager secret.
3. Build and deploy the API with `infra/gcloud/deploy-api.sh`.
4. Store the Cloud Run URL in the Cloudflare Worker `API_URL` secret.
5. Deploy `apps/worker` with Wrangler.

The Cloud Run deployment uses `GOOGLE_GENAI_USE_VERTEXAI=true`, `GOOGLE_CLOUD_PROJECT`, and `GOOGLE_CLOUD_LOCATION` so Gemini usage bills through the Google Cloud project.

Current Agent Platform Runtime resource:

```text
projects/699805652725/locations/us-central1/reasoningEngines/9126389063970979840
```
