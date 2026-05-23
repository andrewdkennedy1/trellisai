#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-trellisai-demo}"
REGION="${REGION:-us-central1}"

gcloud projects create "$PROJECT_ID" || true
gcloud config set project "$PROJECT_ID"
gcloud config set run/region "$REGION"

gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  secretmanager.googleapis.com

gcloud artifacts repositories create trellisai \
  --repository-format=docker \
  --location="$REGION" || true

echo "Google Cloud project bootstrap complete for $PROJECT_ID in $REGION."
