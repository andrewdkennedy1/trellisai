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

    .metric-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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

    .feed {
      min-height: 360px;
      display: grid;
      gap: 12px;
      align-content: start;
    }

    .empty-state,
    .working-state,
    .error-state {
      border: 1px dashed #cbd8c5;
      border-radius: 8px;
      padding: 18px;
      background: #fafbf5;
      display: grid;
      gap: 6px;
    }

    .empty-state strong,
    .working-state strong,
    .error-state strong {
      font-size: 16px;
    }

    .empty-state span,
    .working-state span,
    .error-state span,
    .muted-text {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.45;
    }

    .error-state {
      border-color: #f2c4ae;
      background: #fff7ed;
      color: #9a3412;
    }

    .summary-card,
    .plan-card,
    .task-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfdf8;
      padding: 14px;
      display: grid;
      gap: 10px;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
    }

    .card-top h3 {
      margin: 0;
      font-size: 16px;
      line-height: 1.25;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .summary-item {
      border: 1px solid #dce5d7;
      border-radius: 8px;
      padding: 10px;
      background: #ffffff;
    }

    .summary-item span {
      display: block;
      color: var(--muted);
      font-size: 12px;
      margin-bottom: 3px;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .chip,
    .priority {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      border-radius: 999px;
      padding: 4px 9px;
      font-size: 12px;
      font-weight: 800;
      background: #e7eee2;
      color: #244a33;
    }

    .priority.high {
      background: #fee2e2;
      color: #991b1b;
    }

    .priority.medium {
      background: #fef3c7;
      color: #92400e;
    }

    .priority.low {
      background: #dbeafe;
      color: #1e40af;
    }

    .reason-list {
      margin: 0;
      padding-left: 18px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.45;
    }

    .small-button {
      width: auto;
      min-width: 116px;
      padding: 8px 10px;
      font-size: 13px;
    }

    .task-card {
      grid-template-columns: 1fr auto;
      align-items: center;
      background: #eef7f0;
    }

    .task-card strong {
      display: block;
      font-size: 14px;
    }

    .trace {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
    }

    .trace-step {
      border: 1px solid #dce5d7;
      border-radius: 8px;
      background: #ffffff;
      padding: 10px;
      display: grid;
      gap: 4px;
    }

    .trace-step strong {
      font-size: 13px;
    }

    .memory-card {
      border-left: 3px solid var(--accent);
    }

    .memory-row {
      border: 1px solid #dce5d7;
      border-radius: 8px;
      background: #ffffff;
      padding: 10px;
      display: grid;
      gap: 8px;
    }

    .score {
      color: var(--accent-strong);
      font-size: 12px;
      font-weight: 800;
    }

    .thread,
    .history-list {
      display: grid;
      gap: 10px;
      max-height: 300px;
      overflow: auto;
      padding-right: 2px;
    }

    .message {
      border-radius: 8px;
      padding: 10px;
      display: grid;
      gap: 6px;
      border: 1px solid var(--line);
      background: #ffffff;
    }

    .message.user {
      background: #eef7f0;
    }

    .message.agent {
      background: #f8fafc;
    }

    .message strong,
    .history-item strong {
      font-size: 13px;
    }

    .tool-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tool-call {
      border: 1px solid #cbd8c5;
      background: #ffffff;
      color: #244a33;
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 12px;
      font-weight: 800;
    }

    .history-item {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px;
      background: #fbfdf8;
      display: grid;
      gap: 6px;
    }

    @media (max-width: 860px) {
      main {
        grid-template-columns: 1fr;
      }

      .grid, .metric-row, .trace {
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
      <div class="status"><span id="statusDot" class="dot"></span><span id="statusText">Checking farm memory</span></div>
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
          <div class="metric"><strong id="logCount">0</strong><span>logs</span></div>
          <div class="metric"><strong id="taskCount">0</strong><span>open tasks</span></div>
          <div class="metric"><strong id="recCount">0</strong><span>recommendations</span></div>
        </div>
        <label for="question">Agent request</label>
        <textarea id="question" rows="3">What should I do tomorrow?</textarea>
        <div class="actions">
          <button type="button" onclick="askAgent()">Ask</button>
          <button type="button" class="secondary" onclick="loadState(true)">Refresh</button>
        </div>
      </aside>

      <aside>
        <h2>Agent Thread</h2>
        <div id="thread" class="thread">
          <div class="message agent">
            <strong>Turn 0 - TrellisAI</strong>
            <span class="muted-text">Ready to read field notes, remember similar past issues, check unfinished work, and draft tomorrow's plan.</span>
          </div>
        </div>
      </aside>

      <aside>
        <h2>What Trellis Checked</h2>
        <div id="output" class="feed">
          <div class="empty-state">
            <strong>Ready for the farm log.</strong>
            <span>Save a note or ask TrellisAI for tomorrow's plan.</span>
          </div>
        </div>
      </aside>

      <aside>
        <h2>Log History</h2>
        <div id="logHistory" class="history-list"></div>
      </aside>
    </div>
  </main>

  <script>
    const output = document.getElementById("output");
    const thread = document.getElementById("thread");
    const logHistory = document.getElementById("logHistory");
    const statusDot = document.getElementById("statusDot");
    const statusText = document.getElementById("statusText");
    let latestRecommendations = [];
    const conversation = [];

    async function api(path, options) {
      const response = await fetch(path, options);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Request failed");
      return body;
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function setWorking(title, detail) {
      output.innerHTML =
        '<div class="working-state">' +
          '<strong>' + escapeHtml(title) + '</strong>' +
          '<span>' + escapeHtml(detail || "TrellisAI is reading farm memory and updating the dashboard.") + '</span>' +
        '</div>';
    }

    function setError(error) {
      output.innerHTML =
        '<div class="error-state">' +
          '<strong>Something needs attention</strong>' +
          '<span>' + escapeHtml(error.message || error) + '</span>' +
        '</div>';
    }

    function priorityBadge(priority) {
      const normalized = String(priority || "medium").toLowerCase();
      return '<span class="priority ' + escapeHtml(normalized) + '">' + escapeHtml(normalized.toUpperCase()) + '</span>';
    }

    function plainToolName(name) {
      const value = String(name || "");
      if (value === "aggregateFarmRisks") return "Checked field risks";
      if (value === "retrieveFarmMemory") return "Found similar past notes";
      if (value === "findOpenTasks") return "Checked unfinished jobs";
      if (value === "saveRecommendations") return "Drafted tomorrow's plan";
      if (value.includes("extraction")) return "Understood the note";
      if (value.includes("insertOne")) return "Saved to field memory";
      if (value.includes("embedding")) return "Prepared future recall";
      if (value.includes("updateOne")) return "Marked plan approved";
      return value.replaceAll("_", " ");
    }

    function plainToolResult(tool) {
      const name = String(tool.name || "");
      const result = String(tool.result || "");
      if (name === "aggregateFarmRisks") return result.replace("field risk group(s) ranked", "fields reviewed");
      if (name === "retrieveFarmMemory") return result.replace("memory match(es) returned", "similar notes found");
      if (name === "findOpenTasks") return result.replace("open task(s) found", "unfinished jobs found");
      if (name === "saveRecommendations") return result.replace("recommendation(s) saved", "plan items drafted");
      return result;
    }

    function plainSentence(value) {
      return String(value || "")
        .replaceAll("MongoDB", "farm memory")
        .replaceAll("Gemini", "Trellis")
        .replaceAll("Cloud Run", "field service")
        .replaceAll("Agent Platform", "Trellis")
        .replaceAll("Vector Search", "similar-note search")
        .replaceAll("vector", "similar-note")
        .replaceAll("embedding", "memory")
        .replaceAll("MCP", "tool")
        .replaceAll("open task(s) are already in farm memory", "unfinished jobs are already on the farm");
    }

    function chips(items) {
      const list = Array.isArray(items) ? items.filter(Boolean) : [];
      if (!list.length) return '<span class="muted-text">No signals found.</span>';
      return '<div class="chips">' + list.map((item) => '<span class="chip">' + escapeHtml(item.signal || item.type || item) + '</span>').join("") + '</div>';
    }

    function pushTurn(role, title, detail, toolCalls) {
      conversation.push({ role, title, detail, toolCalls: Array.isArray(toolCalls) ? toolCalls : [] });
      renderThread();
    }

    function renderThread() {
      const visible = conversation.slice(-6);
      if (!visible.length) return;
      thread.innerHTML = visible.map((item, index) => {
        const tools = item.toolCalls.length
          ? '<div class="tool-strip">' + item.toolCalls.map((tool) => '<span class="tool-call">' + escapeHtml(plainToolName(tool.name || tool)) + '</span>').join("") + '</div>'
          : "";
        return '<div class="message ' + escapeHtml(item.role) + '">' +
          '<strong>Turn ' + escapeHtml(index + Math.max(1, conversation.length - visible.length + 1)) + ' - ' + escapeHtml(item.title) + '</strong>' +
          '<span class="muted-text">' + escapeHtml(item.detail) + '</span>' +
          tools +
        '</div>';
      }).join("");
      thread.scrollTop = thread.scrollHeight;
    }

    function renderLogHistory(logs) {
      const recent = Array.isArray(logs) ? logs.slice(0, 12) : [];
      if (!recent.length) {
        logHistory.innerHTML = '<div class="empty-state"><strong>No logs yet.</strong><span>Add a farm note to start building memory.</span></div>';
        return;
      }
      logHistory.innerHTML = recent.map((log) =>
        '<div class="history-item">' +
          '<div class="card-top">' +
            '<div><strong>' + escapeHtml(log.field_name || "Field") + '</strong><div class="muted-text">' + escapeHtml(log.date || "") + '</div></div>' +
            '<span class="chip">READ</span>' +
          '</div>' +
          '<div>' + escapeHtml(log.raw_text || "") + '</div>' +
          chips(log.risk_signals) +
        '</div>'
      ).join("");
    }

    function renderLog(body) {
      const log = body.log || body;
      const observations = Array.isArray(log.observations) ? log.observations : [];
      const activities = Array.isArray(log.activities) ? log.activities : [];
      output.innerHTML =
        '<div class="summary-card">' +
          '<div class="card-top">' +
            '<div>' +
              '<h3>Log saved to farm memory</h3>' +
              '<div class="muted-text">' + escapeHtml(log.field_name || "Field") + ' - ' + escapeHtml(log.date || "today") + '</div>' +
            '</div>' +
            '<span class="chip">Field memory updated</span>' +
          '</div>' +
          '<div class="summary-grid">' +
            '<div class="summary-item"><span>Activities</span>' + chips(activities.map((item) => item.duration_minutes ? item.type + " - " + item.duration_minutes + " min" : item.type)) + '</div>' +
            '<div class="summary-item"><span>Observations</span>' + chips(observations.map((item) => item.signal || item.type)) + '</div>' +
          '</div>' +
          '<div><div class="muted-text" style="margin-bottom:6px;">Risk signals</div>' + chips(log.risk_signals) + '</div>' +
          '<div class="muted-text">Memory summary: ' + escapeHtml(log.embedding_text || "Saved for future plans.") + '</div>' +
        '</div>';
    }

    function renderAgentTrace(trace) {
      const steps = Array.isArray(trace) ? trace : [];
      if (!steps.length) return "";
      return '<div class="summary-card">' +
        '<div class="card-top">' +
          '<div>' +
            '<h3>Planning steps</h3>' +
            '<div class="muted-text">Trellis shows what it checked before making the plan.</div>' +
          '</div>' +
          '<span class="chip">Live planning run</span>' +
        '</div>' +
        '<div class="trace">' + steps.map((step) =>
          '<div class="trace-step">' +
            '<strong>' + escapeHtml(plainStepName(step.step)) + '</strong>' +
            '<span class="muted-text">' + escapeHtml(plainStepDetail(step.step)) + '</span>' +
          '</div>'
        ).join("") + '</div>' +
      '</div>';
    }

    function plainStepDetail(step) {
      const value = String(step || "");
      if (value === "Perceive") return "Read recent notes, crop signals, and unfinished work.";
      if (value === "Remember") return "Looked for older notes that resemble today's problem.";
      if (value === "Use tools") return "Checked field history and open jobs before answering.";
      if (value === "Act") return "Drafted plan items the grower can approve.";
      return "Checked farm context before planning.";
    }

    function plainStepName(step) {
      const value = String(step || "");
      if (value === "Perceive") return "Read today's situation";
      if (value === "Remember") return "Remember similar issues";
      if (value === "Use tools") return "Check the work list";
      if (value === "Act") return "Draft the plan";
      return "Planning step";
    }

    function renderMemoryMatches(matches) {
      const memories = Array.isArray(matches) ? matches.slice(0, 3) : [];
      if (!memories.length) return "";
      return '<div class="summary-card">' +
        '<div class="card-top">' +
          '<div>' +
            '<h3>Similar Past Notes</h3>' +
            '<div class="muted-text">Older field notes Trellis remembered before planning.</div>' +
          '</div>' +
          '<span class="chip">Field memory</span>' +
        '</div>' +
        memories.map((memory) =>
          '<div class="memory-row memory-card">' +
            '<div class="card-top">' +
              '<div><strong>' + escapeHtml(memory.field_name || "Field") + '</strong><div class="muted-text">' + escapeHtml(memory.date || "") + '</div></div>' +
              '<span class="score">' + Math.max(0, Number(memory.score || 0)).toFixed(2) + ' similarity</span>' +
            '</div>' +
            '<div>' + escapeHtml(memory.raw_text || memory.embedding_text || "") + '</div>' +
            chips(memory.risk_signals) +
          '</div>'
        ).join("") +
      '</div>';
    }

    function renderReasoningSummary(items) {
      const reasons = Array.isArray(items) ? items : [];
      if (!reasons.length) return "";
      return '<div class="summary-card">' +
        '<div class="card-top">' +
          '<div>' +
            '<h3>Why This Plan</h3>' +
            '<div class="muted-text">A short explanation a grower can review.</div>' +
          '</div>' +
          '<span class="chip">plain summary</span>' +
        '</div>' +
        '<ul class="reason-list">' + reasons.map((reason) => '<li>' + escapeHtml(plainSentence(reason)) + '</li>').join("") + '</ul>' +
      '</div>';
    }

    function renderToolCalls(toolCalls) {
      const calls = Array.isArray(toolCalls) ? toolCalls : [];
      if (!calls.length) return "";
      return '<div class="summary-card">' +
        '<div class="card-top">' +
          '<div>' +
            '<h3>What Trellis Checked</h3>' +
            '<div class="muted-text">The work Trellis did before drafting the plan.</div>' +
          '</div>' +
          '<span class="chip">live checks</span>' +
        '</div>' +
        calls.map((tool) =>
          '<div class="memory-row">' +
            '<div class="card-top"><strong>' + escapeHtml(plainToolName(tool.name || "check")) + '</strong><span class="muted-text">' + escapeHtml(plainSentence(plainToolResult(tool))) + '</span></div>' +
            '<div class="muted-text">Completed before the plan was shown.</div>' +
          '</div>'
        ).join("") +
      '</div>';
    }

    function renderPlan(body) {
      latestRecommendations = Array.isArray(body.recommendations) ? body.recommendations : [];
      if (!latestRecommendations.length) {
        output.innerHTML =
          '<div class="empty-state">' +
            '<strong>No urgent recommendations.</strong>' +
            '<span>Add a fresh log to update field memory and regenerate the plan.</span>' +
          '</div>';
        return;
      }

      const cards = latestRecommendations.map((rec, index) => {
        const reasons = Array.isArray(rec.reasoning_summary) ? rec.reasoning_summary : [];
        const recId = escapeHtml(rec._id || "");
        const button = recId
          ? '<button type="button" class="small-button" onclick="approveRecommendation(\\'' + recId + '\\')">Approve task</button>'
          : '<span class="muted-text">Saved after refresh</span>';

        return '<div class="plan-card">' +
          '<div class="card-top">' +
            '<div>' +
              '<h3>' + escapeHtml(index + 1) + '. ' + escapeHtml(rec.title || "Field recommendation") + '</h3>' +
              '<div class="muted-text">' + escapeHtml(rec.field_name || "Farm") + '</div>' +
            '</div>' +
            priorityBadge(rec.priority) +
          '</div>' +
          '<div>' + escapeHtml(rec.recommendation || "") + '</div>' +
          '<ul class="reason-list">' + reasons.slice(0, 3).map((reason) => '<li>' + escapeHtml(plainSentence(reason)) + '</li>').join("") + '</ul>' +
          '<div class="card-top"><span class="muted-text">Status: ' + escapeHtml((rec.status || "pending_approval").replaceAll("_", " ")) + '</span>' + button + '</div>' +
        '</div>';
      }).join("");

      output.innerHTML =
        renderAgentTrace(body.agent_trace) +
        renderToolCalls(body.tool_calls) +
        renderMemoryMatches(body.memory_matches) +
        renderReasoningSummary(body.reasoning_summary) +
        '<div class="summary-card">' +
          '<div class="card-top">' +
            '<div>' +
              '<h3>Tomorrow\\'s action plan</h3>' +
              '<div class="muted-text">' + escapeHtml(body.target_date || "Next field day") + '</div>' +
            '</div>' +
            '<span class="chip">' + escapeHtml(latestRecommendations.length) + ' recommendations</span>' +
          '</div>' +
          '<div class="muted-text">' + escapeHtml(body.answer || "TrellisAI ranked the most important field work.") + '</div>' +
        '</div>' +
        cards;
    }

    function renderSnapshot(tasks, recs) {
      const pending = (recs.recommendations || []).filter((rec) => rec.status !== "approved").slice(0, 3);
      if (!pending.length) return;
      output.innerHTML =
        '<div class="summary-card">' +
          '<div class="card-top">' +
            '<div>' +
              '<h3>Current farm memory</h3>' +
              '<div class="muted-text">Recent recommendations are ready for grower review.</div>' +
            '</div>' +
            '<span class="chip">' + escapeHtml((tasks.tasks || []).filter((task) => task.status === "open").length) + ' open tasks</span>' +
          '</div>' +
        '</div>' +
        pending.map((rec) =>
          '<div class="plan-card">' +
            '<div class="card-top"><h3>' + escapeHtml(rec.title) + '</h3>' + priorityBadge(rec.priority) + '</div>' +
            '<div class="muted-text">' + escapeHtml(rec.field_name || "Farm") + '</div>' +
            '<div>' + escapeHtml(rec.recommendation || "") + '</div>' +
          '</div>'
        ).join("");
    }

    async function createLog() {
      pushTurn("user", "Field log", document.getElementById("field").value + ": " + document.getElementById("log").value, []);
      setWorking("Saving log", "Trellis is reading the note and updating field memory.");
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
        renderLog(body);
        pushTurn("agent", "Saved field note", "Trellis understood the note, found the important signals, and saved it for future plans.", [
          { name: "Understood the note" },
          { name: "Saved to field memory" },
          { name: "Prepared future recall" }
        ]);
        await loadState();
      } catch (error) {
        setError(error);
      }
    }

    async function askAgent() {
      pushTurn("user", "Question", document.getElementById("question").value, []);
      setWorking("Building action plan", "Trellis is checking recent notes, similar past issues, and unfinished jobs.");
      try {
        const body = await api("/api/agent/ask", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            farm_id: "farm_demo",
            question: document.getElementById("question").value
          })
        });
        renderPlan(body);
        pushTurn("agent", "Tomorrow's plan", (body.reasoning_summary || []).map(plainSentence).join(" "), body.tool_calls || []);
        await loadState();
      } catch (error) {
        setError(error);
      }
    }

    async function approveRecommendation(id) {
      if (!id) return;
      setWorking("Approving task", "Trellis is turning the approved plan item into a field job.");
      try {
        const body = await api("/api/recommendations/" + encodeURIComponent(id) + "/approve", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({})
        });
        const task = body.task && (body.task.task || body.task);
        output.innerHTML =
          '<div class="task-card">' +
            '<div>' +
              '<strong>' + escapeHtml(task.title || "Task created") + '</strong>' +
              '<span class="muted-text">' + escapeHtml(task.field_name || "Farm") + ' - due ' + escapeHtml(task.due_date || "tomorrow") + '</span>' +
            '</div>' +
            priorityBadge(task.priority) +
          '</div>';
        pushTurn("agent", "Approved field job", "Trellis added the approved work to tomorrow's job list.", [
          { name: "Marked plan approved" },
          { name: "Saved to field memory" }
        ]);
        await loadState();
      } catch (error) {
        setError(error);
      }
    }

    async function loadState(renderCurrent = false) {
      try {
        const [health, fields, tasks, recs, logs] = await Promise.all([
          api("/api/health"),
          api("/api/fields"),
          api("/api/tasks"),
          api("/api/recommendations"),
          api("/api/logs")
        ]);
        statusDot.classList.toggle("ready", Boolean(health.ok && health.mongo.ok));
        statusText.textContent = health.mongo.ok ? "Live farm memory ready" : "Farm memory unavailable";
        document.getElementById("fieldCount").textContent = fields.fields.length;
        document.getElementById("logCount").textContent = logs.logs.length;
        document.getElementById("taskCount").textContent = tasks.tasks.filter((task) => task.status === "open").length;
        document.getElementById("recCount").textContent = recs.recommendations.length;
        renderLogHistory(logs.logs);
        if (renderCurrent) renderSnapshot(tasks, recs);
      } catch (error) {
        statusDot.classList.remove("ready");
        statusText.textContent = "Farm memory unavailable";
      }
    }

    loadState(true);
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
