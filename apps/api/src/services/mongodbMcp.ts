export function getMongoMcpLaunchConfig() {
  return {
    server: "mongodb-mcp-server",
    command: "npx",
    args: ["-y", "mongodb-mcp-server"],
    env: {
      MDB_MCP_CONNECTION_STRING: process.env.MDB_MCP_CONNECTION_STRING || process.env.MONGODB_URI || "",
      MDB_MCP_API_CLIENT_ID: process.env.MDB_MCP_API_CLIENT_ID || "",
      MDB_MCP_API_CLIENT_SECRET: process.env.MDB_MCP_API_CLIENT_SECRET || ""
    }
  };
}

export function describeMongoMcpIntegration() {
  return {
    purpose: "MongoDB MCP is TrellisAI's farm-memory tool layer.",
    agent_capabilities: [
      "inspect MongoDB collections",
      "retrieve field history",
      "query recent farm logs",
      "aggregate risk signals",
      "write approved recommendations and tasks"
    ],
    launch: getMongoMcpLaunchConfig()
  };
}
