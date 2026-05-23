# TrellisAI Demo Script

1. Open the Cloudflare-hosted TrellisAI app.
2. Confirm the API status shows API and MongoDB ready.
3. Save this North Field log:

```text
North Field corn has yellowing near the east edge. Irrigated 45 minutes yesterday.
```

4. Show the response with structured activities, observations, risk signals, embedding text, and an embedding vector stored in MongoDB.
5. Save this South Field log:

```text
Aphids are back on soybean leaves near the south road. Leaf curling is worse in the dry corner.
```

6. Ask:

```text
What should I do tomorrow?
```

7. Show TrellisAI returning a ranked, field-specific action plan.
8. Open the recommendations endpoint or database view to show recommendations saved in MongoDB.
9. Approve a recommendation and show the generated task in the dashboard.

Core success criteria:

```text
messy log -> MongoDB memory -> action plan -> saved recommendation -> approved task
```
