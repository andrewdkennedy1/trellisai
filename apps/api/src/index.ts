import "dotenv/config";
import cors from "cors";
import express from "express";
import { ZodError } from "zod";
import { HttpError } from "./http.js";
import { agentRouter } from "./routes/agent.js";
import { fieldsRouter } from "./routes/fields.js";
import { logsRouter } from "./routes/logs.js";
import { recommendationsRouter } from "./routes/recommendations.js";
import { tasksRouter } from "./routes/tasks.js";
import { checkMongo } from "./services/mongo.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", async (_req, res) => {
  res.json({
    ok: true,
    service: "trellisai-api",
    mongo: await checkMongo(),
    gemini_configured: Boolean(process.env.GOOGLE_API_KEY) || /^true$/i.test(process.env.GOOGLE_GENAI_USE_VERTEXAI || ""),
    mongodb_mcp_configured: Boolean(process.env.MDB_MCP_CONNECTION_STRING || process.env.MONGODB_URI)
  });
});

app.use("/logs", logsRouter);
app.use("/fields", fieldsRouter);
app.use("/recommendations", recommendationsRouter);
app.use("/tasks", tasksRouter);
app.use("/agent", agentRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({ error: "Invalid request", details: error.flatten() });
  }

  console.error(error);
  return res.status(500).json({
    error: error instanceof Error ? error.message : "Internal server error"
  });
});

const port = Number(process.env.PORT || 8080);

app.listen(port, () => {
  console.log(`TrellisAI API listening on ${port}`);
});
