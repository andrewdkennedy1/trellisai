# Agent Platform Runtime

TrellisAI has a deployed Google Cloud Agent Platform Runtime wrapper in the `shibeai` project:

```text
projects/699805652725/locations/us-central1/reasoningEngines/9126389063970979840
```

The runtime object lives in `apps/agent`. It exposes these operations:

- `ask`: generate a daily plan through the Cloud Run tool API.
- `save_log`: save an unstructured farm log and extract memory signals.
- `log_history`: fetch recent MongoDB farm-memory logs.
- `approve_recommendation`: approve a recommendation and write it back as a task.

The Agent Platform wrapper delegates tool execution to the Cloud Run API, which uses Gemini on Vertex AI, MongoDB aggregations, MongoDB Vector Search/fallback retrieval, and MongoDB persistence.
