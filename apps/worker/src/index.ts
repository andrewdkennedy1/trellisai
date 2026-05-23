export interface Env {
  APP_NAME: string;
  API_URL?: string;
  ASSETS: Fetcher;
}

function html() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>TrellisAI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      color-scheme: light;
      --ink: #17211a;
      --muted: #5a665c;
      --line: #d9dfd4;
      --panel: #ffffff;
      --field: #eff5ec;
      --accent: #276749;
      --accent-strong: #1f5139;
      --alert: #b45309;
      --sky: #dfeef0;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f6f7f1;
      color: var(--ink);
    }

    header {
      border-bottom: 1px solid var(--line);
      background: #fbfcf7;
    }

    .topbar {
      max-width: 1180px;
      margin: 0 auto;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      letter-spacing: 0;
      font-size: 20px;
    }

    .mark {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      object-fit: cover;
      flex: 0 0 auto;
    }

    .status {
      display: flex;
      gap: 8px;
      align-items: center;
      color: var(--muted);
      font-size: 14px;
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 99px;
      background: #9ca3af;
    }

    .dot.ready {
      background: #16a34a;
    }

    main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 24px 20px 40px;
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(340px, .9fr);
      gap: 20px;
    }

    .visual {
      min-height: 220px;
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, .08), rgba(0, 0, 0, .05)),
        url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80");
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
      padding: 18px;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, .35);
    }

    .visual h1 {
      margin: 0;
      font-size: 32px;
      line-height: 1.05;
      letter-spacing: 0;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 12px;
    }

    section, aside {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
    }

    h2 {
      margin: 0 0 14px;
      font-size: 18px;
      letter-spacing: 0;
    }

    label {
      display: block;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      margin: 12px 0 6px;
    }

    input, textarea, select {
      width: 100%;
      border: 1px solid #cbd5c4;
      border-radius: 8px;
      background: #fbfdf8;
      color: var(--ink);
      font: inherit;
      padding: 10px 11px;
    }

    textarea {
      resize: vertical;
      min-height: 116px;
    }

    button {
      border: 0;
      border-radius: 8px;
      background: var(--accent);
      color: white;
      font: inherit;
      font-weight: 800;
      padding: 10px 12px;
      cursor: pointer;
    }

    button.secondary {
      background: #e7eee2;
      color: #183322;
      border: 1px solid #cbd8c5;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 12px;
    }

    .actions button {
      flex: 1;
    }

    .field-tile {
      background: var(--field);
      border: 1px solid #d4decf;
      border-radius: 8px;
      min-height: 92px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .field-tile strong {
      display: block;
      font-size: 15px;
    }

    .field-tile span {
      color: var(--muted);
      font-size: 13px;
    }

    .right-column {
      display: grid;
      gap: 20px;
      align-content: start;
    }

    pre {
      margin: 0;
      background: #121a14;
      color: #e7f6e9;
      border-radius: 8px;
      padding: 14px;
      min-height: 280px;
      overflow: auto;
      white-space: pre-wrap;
      font-size: 13px;
      line-height: 1.45;
    }

    .metric-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 14px;
    }

    .metric {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px;
      background: #fafbf5;
    }

    .metric strong {
      display: block;
      font-size: 20px;
      line-height: 1;
    }

    .metric span {
      color: var(--muted);
      font-size: 12px;
    }

    @media (max-width: 860px) {
      main {
        grid-template-columns: 1fr;
      }

      .grid, .metric-row {
        grid-template-columns: 1fr;
      }

      .visual h1 {
        font-size: 26px;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="topbar">
      <div class="brand"><img class="mark" src="/trellisai-logo.png" alt="" /><span>TrellisAI</span></div>
      <div class="status"><span id="statusDot" class="dot"></span><span id="statusText">Checking API</span></div>
    </div>
  </header>

  <main>
    <div>
      <div class="visual">
        <h1>Farm memory to field action</h1>
      </div>

      <div class="grid" aria-label="Demo fields">
        <div class="field-tile"><strong>North Field</strong><span>Corn, nitrogen and irrigation watch</span></div>
        <div class="field-tile"><strong>South Field</strong><span>Soybeans, aphid pressure</span></div>
        <div class="field-tile"><strong>West Field</strong><span>Lettuce, harvest timing</span></div>
      </div>

      <section style="margin-top: 20px;">
        <h2>Daily Log</h2>
        <label for="field">Field</label>
        <select id="field">
          <option>North Field</option>
          <option>South Field</option>
          <option>West Field</option>
        </select>

        <label for="log">Log note</label>
        <textarea id="log">North Field corn has yellowing near the east edge. Irrigated 45 minutes yesterday.</textarea>

        <div class="actions">
          <button type="button" onclick="createLog()">Save log</button>
          <button type="button" class="secondary" onclick="askAgent()">Generate plan</button>
        </div>
      </section>
    </div>

    <div class="right-column">
      <aside>
        <h2>Farm State</h2>
        <div class="metric-row">
          <div class="metric"><strong id="fieldCount">3</strong><span>fields</span></div>
          <div class="metric"><strong id="taskCount">0</strong><span>open tasks</span></div>
          <div class="metric"><strong id="recCount">0</strong><span>recommendations</span></div>
        </div>
        <label for="question">Agent request</label>
        <textarea id="question" rows="3">What should I do tomorrow?</textarea>
        <div class="actions">
          <button type="button" onclick="askAgent()">Ask</button>
          <button type="button" class="secondary" onclick="loadState()">Refresh</button>
        </div>
      </aside>

      <aside>
        <h2>Output</h2>
        <pre id="output">Ready.</pre>
      </aside>
    </div>
  </main>

  <script>
    const output = document.getElementById("output");
    const statusDot = document.getElementById("statusDot");
    const statusText = document.getElementById("statusText");

    async function api(path, options) {
      const response = await fetch(path, options);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Request failed");
      return body;
    }

    async function createLog() {
      output.textContent = "Saving log...";
      try {
        const body = await api("/api/logs", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            farm_id: "farm_demo",
            field_name: document.getElementById("field").value,
            raw_text: document.getElementById("log").value
          })
        });
        output.textContent = JSON.stringify(body, null, 2);
        await loadState();
      } catch (error) {
        output.textContent = error.message;
      }
    }

    async function askAgent() {
      output.textContent = "Thinking...";
      try {
        const body = await api("/api/agent/ask", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            farm_id: "farm_demo",
            question: document.getElementById("question").value
          })
        });
        output.textContent = JSON.stringify(body, null, 2);
        await loadState();
      } catch (error) {
        output.textContent = error.message;
      }
    }

    async function loadState() {
      try {
        const [health, fields, tasks, recs] = await Promise.all([
          api("/api/health"),
          api("/api/fields"),
          api("/api/tasks"),
          api("/api/recommendations")
        ]);
        statusDot.classList.toggle("ready", Boolean(health.ok && health.mongo.ok));
        statusText.textContent = health.mongo.ok ? "API and MongoDB ready" : "API ready, MongoDB not connected";
        document.getElementById("fieldCount").textContent = fields.fields.length;
        document.getElementById("taskCount").textContent = tasks.tasks.filter((task) => task.status === "open").length;
        document.getElementById("recCount").textContent = recs.recommendations.length;
      } catch (error) {
        statusDot.classList.remove("ready");
        statusText.textContent = "API unavailable";
      }
    }

    loadState();
  </script>
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/trellisai-logo.png") {
      return env.ASSETS.fetch(request);
    }

    if (url.pathname.startsWith("/api/")) {
      if (!env.API_URL) {
        return Response.json({ error: "API_URL is not configured" }, { status: 503 });
      }

      const upstream = new URL(url.pathname.replace(/^\/api/, "") + url.search, env.API_URL);
      const proxied = new Request(upstream.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: "manual"
      });

      return fetch(proxied);
    }

    return new Response(html(), {
      headers: {
        "content-type": "text/html; charset=utf-8"
      }
    });
  }
};
