# TrellisAI

TrellisAI is a MongoDB-powered farm operations agent that turns daily farm logs into structured field memory, risk signals, prioritized recommendations, and approval-ready tasks.

## Architecture

- `apps/api`: Cloud Run-ready TypeScript API for farm logs, field history, tasks, recommendations, Gemini extraction, embeddings, and MongoDB persistence.
- `apps/worker`: Cloudflare Worker public app and gateway to the Cloud Run API.
- `infra/mongodb`: seed data, MongoDB indexes, vector index definition, and MongoDB MCP server config.
- `infra/gcloud`: bootstrap and deploy scripts for Google Cloud Run.
- `docs`: architecture, demo script, and Devpost submission copy.

The runtime path is:

```text
Cloudflare Worker -> Cloud Run API -> Gemini + MongoDB Atlas -> MongoDB MCP tool layer
```

## Local Development

Start MongoDB locally, then seed demo data:

```bash
docker run --name trellisai-mongo -p 27017:27017 -d mongo:7
copy .env.example .env
npm install
npm run seed
npm run dev:api
```

Open `http://localhost:8080/health` to confirm the API is up.

For local Gemini calls, either set `GOOGLE_API_KEY` or use Vertex AI through `gcloud auth application-default login` with:

```bash
GOOGLE_GENAI_USE_VERTEXAI=true
GOOGLE_CLOUD_PROJECT=trellisai-497202
GOOGLE_CLOUD_LOCATION=us-central1
```

## API Smoke Test

```bash
curl -X POST http://localhost:8080/logs \
  -H "content-type: application/json" \
  -d '{"farm_id":"farm_demo","field_name":"North Field","raw_text":"Corn looks yellow near the east edge. Irrigated 45 minutes."}'

curl -X POST http://localhost:8080/agent/ask \
  -H "content-type: application/json" \
  -d '{"farm_id":"farm_demo","question":"What should I do tomorrow?"}'
```

## Google Cloud

Install and authenticate the Google Cloud CLI, then:

```bash
export PROJECT_ID=trellisai-demo
export REGION=us-central1

bash infra/gcloud/bootstrap.sh
bash infra/gcloud/deploy-api.sh
```

The Cloud Run deploy path uses Vertex AI auth from the Cloud Run service account, so no Gemini API key is required. Store the returned Cloud Run URL as the Cloudflare Worker `API_URL` secret:

```bash
cd apps/worker
npx wrangler secret put API_URL
npm run deploy
```

## Devpost

Submission copy is in `docs/devpost-submission.md`. The public app URL should be the deployed Cloudflare Worker URL, and the backend URL should be the Cloud Run service URL.

Current demo deployment:

- Public app: https://trellisai.andrewdkennedy1.workers.dev
- Cloud Run API: https://trellisai-api-699805652725.us-central1.run.app
- Google Cloud project used for deployment: `shibeai`
