#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-trellisai-demo}"
REGION="${REGION:-us-central1}"
FARM_TIME_ZONE="${FARM_TIME_ZONE:-America/Los_Angeles}"
IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/trellisai/api:latest"

gcloud config set project "$PROJECT_ID"
gcloud config set run/region "$REGION"

pushd apps/api >/dev/null
gcloud builds submit --tag "$IMAGE"
popd >/dev/null

gcloud run deploy trellisai-api \
  --image "$IMAGE" \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars MONGODB_DB=trellisai,FARM_TIME_ZONE="$FARM_TIME_ZONE",GOOGLE_GENAI_USE_VERTEXAI=true,GOOGLE_CLOUD_PROJECT="$PROJECT_ID",GOOGLE_CLOUD_LOCATION="$REGION",GEMINI_MODEL=gemini-2.5-flash \
  --set-secrets MONGODB_URI=MONGODB_URI:latest,JWT_SECRET=JWT_SECRET:latest

gcloud run services describe trellisai-api \
  --region="$REGION" \
  --format='value(status.url)'
