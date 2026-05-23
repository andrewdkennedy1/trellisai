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
  <title>TrellisAI - Farm Operations Agent</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@400;500;600;700&display=swap" />
  <style>
    :root {
      color-scheme: dark;
      --bg-primary: #080d0a;
      --bg-secondary: #0f1813;
      --bg-tertiary: #16241c;
      --bg-card: rgba(22, 36, 28, 0.6);
      --accent-emerald: #10b981;
      --accent-emerald-glow: rgba(16, 185, 129, 0.15);
      --accent-emerald-strong: #059669;
      --accent-teal: #06b6d4;
      --accent-amber: #f59e0b;
      --accent-red: #ef4444;
      --text-primary: #f3f4f6;
      --text-secondary: #9ca3af;
      --text-muted: #6b7280;
      --border: rgba(16, 185, 129, 0.12);
      --border-focus: rgba(16, 185, 129, 0.4);
      --shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      --font-sans: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'Fira Code', 'Courier New', monospace;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-width: 320px;
      font-family: var(--font-sans);
      background: var(--bg-primary);
      color: var(--text-primary);
      overflow-x: hidden;
      line-height: 1.5;
    }

    button, input, textarea, select {
      font: inherit;
      color: inherit;
    }

    /* Scrollbar Styling */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: var(--bg-primary);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--bg-tertiary);
      border-radius: 99px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--accent-emerald);
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid var(--border);
      background: rgba(8, 13, 10, 0.8);
      backdrop-filter: blur(20px);
    }

    .topbar-inner {
      max-width: 1440px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .brand img {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      object-fit: cover;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
      border: 1.5px solid var(--accent-emerald);
    }

    .brand span {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #fff, #a7f3d0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      border: 1px solid var(--border);
      border-radius: 99px;
      padding: 6px 14px;
      background: var(--bg-secondary);
      font-size: 13px;
      font-weight: 600;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-muted);
      position: relative;
    }

    .status-dot.ready {
      background: var(--accent-emerald);
      box-shadow: 0 0 10px var(--accent-emerald);
    }

    .status-dot.ready::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 1px solid var(--accent-emerald);
      animation: ripple 2s infinite ease-out;
    }

    @keyframes ripple {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }

    main {
      max-width: 1440px;
      margin: 0 auto;
      padding: 24px;
    }

    .agent-layout {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 24px;
      align-items: start;
    }

    /* Glassmorphic Panel Base */
    .glass-panel {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(12px);
      position: relative;
      overflow: hidden;
    }

    .glass-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.2), transparent);
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 12px;
    }

    .panel-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
      letter-spacing: -0.2px;
    }

    .panel-header h2 svg {
      color: var(--accent-emerald);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-emerald {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
    }

    .badge-amber {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.2);
      color: var(--accent-amber);
    }

    /* Agent Console Inputs */
    .console-input-wrapper {
      position: relative;
      margin-bottom: 16px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .console-input-wrapper:focus-within {
      border-color: var(--border-focus);
      box-shadow: 0 0 15px var(--accent-emerald-glow);
    }

    .console-meta-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }

    .console-field-select {
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      outline: none;
      cursor: pointer;
      font-weight: 600;
      color: var(--text-primary);
    }

    .console-date-input {
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      outline: none;
      font-weight: 600;
      color: var(--text-primary);
      width: 130px;
    }

    .console-textarea {
      width: 100%;
      min-height: 100px;
      background: transparent;
      border: none;
      resize: vertical;
      outline: none;
      line-height: 1.5;
      font-size: 15px;
      color: var(--text-primary);
    }

    .presets-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }

    .preset-pill {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .preset-pill:hover {
      border-color: var(--accent-emerald);
      color: var(--text-primary);
      background: var(--bg-tertiary);
    }

    .console-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .primary-btn {
      background: var(--accent-emerald);
      border: 0;
      color: #060a07;
      font-weight: 700;
      border-radius: 8px;
      padding: 10px 20px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
    }

    .primary-btn:hover:not(:disabled) {
      background: var(--accent-emerald-strong);
      transform: translateY(-1px);
    }

    .primary-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      box-shadow: none;
    }

    .animate-spin {
      animation: spin 0.9s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Steps Stepper visualizer */
    .stepper-container {
      margin-bottom: 24px;
      border: 1px dashed var(--border);
      border-radius: 12px;
      padding: 16px;
      background: rgba(16, 185, 129, 0.02);
    }

    .stepper-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-muted);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      opacity: 0.4;
      transition: opacity 0.3s ease;
    }

    .step-item.active {
      opacity: 1;
    }

    .step-item.completed {
      opacity: 0.85;
    }

    .step-icon-box {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      border: 1px solid var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .step-item.active .step-icon-box {
      border-color: var(--accent-emerald);
      color: var(--accent-emerald);
      box-shadow: 0 0 8px var(--accent-emerald-glow);
    }

    .step-item.completed .step-icon-box {
      border-color: var(--accent-emerald);
      background: var(--accent-emerald);
      color: #060a07;
    }

    .step-content {
      font-size: 13.5px;
    }

    .step-content strong {
      display: block;
      color: var(--text-primary);
    }

    .step-content span {
      color: var(--text-secondary);
      font-size: 12.5px;
    }

    /* Terminal Thought Feed */
    .terminal-box {
      background: #040705;
      border: 1px solid rgba(16, 185, 129, 0.15);
      border-radius: 12px;
      padding: 16px;
      font-family: var(--font-mono);
      font-size: 13px;
      color: #a7f3d0;
      line-height: 1.6;
      margin-bottom: 24px;
      max-height: 200px;
      overflow-y: auto;
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.8);
    }

    .terminal-line {
      margin-bottom: 6px;
      display: flex;
      gap: 8px;
    }

    .terminal-prompt {
      color: var(--accent-emerald);
      user-select: none;
      flex-shrink: 0;
    }

    /* Field Sensor Map */
    .map-panel {
      position: relative;
      margin-bottom: 24px;
    }

    .field-svg-container {
      width: 100%;
      height: auto;
      background: #0b120e;
      border-radius: 12px;
      border: 1px solid var(--border);
      padding: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
    }

    .field-polygon {
      fill: rgba(16, 185, 129, 0.08);
      stroke: var(--accent-emerald);
      stroke-width: 1.5;
      stroke-dasharray: 4 4;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .field-polygon:hover, .field-polygon.active-scan {
      fill: rgba(16, 185, 129, 0.16);
      stroke-width: 2.5;
      stroke-dasharray: none;
      filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.4));
    }

    .field-polygon.warning {
      fill: rgba(245, 158, 11, 0.08);
      stroke: var(--accent-amber);
    }

    .field-polygon.warning:hover, .field-polygon.warning.active-scan {
      fill: rgba(245, 158, 11, 0.16);
      filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.4));
    }

    .scanning-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent-emerald), transparent);
      box-shadow: 0 0 12px var(--accent-emerald);
      animation: scan 3s infinite linear;
      pointer-events: none;
      opacity: 0;
    }

    .field-svg-container.scanning .scanning-line {
      opacity: 0.6;
    }

    @keyframes scan {
      0% { top: 0%; }
      100% { top: 100%; }
    }

    .map-telemetry {
      position: absolute;
      top: 24px;
      right: 24px;
      background: rgba(8, 13, 10, 0.85);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 14px;
      font-family: var(--font-mono);
      font-size: 11px;
      pointer-events: none;
      box-shadow: var(--shadow);
    }

    /* Approvals Hub */
    .approvals-deck {
      display: grid;
      gap: 16px;
    }

    .approval-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      transition: all 0.3s ease;
      position: relative;
    }

    .approval-card:hover {
      border-color: rgba(16, 185, 129, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 10px;
    }

    .card-title h4 {
      margin: 0 0 2px 0;
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .card-title span {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .card-body {
      font-size: 13.5px;
      color: var(--text-secondary);
      margin-bottom: 16px;
      line-height: 1.45;
    }

    .bullets-list {
      margin: 10px 0 0 0;
      padding-left: 0;
      list-style-type: none;
      display: grid;
      gap: 6px;
    }

    .bullets-list li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12.5px;
      color: var(--text-primary);
    }

    .bullets-list li svg {
      color: var(--accent-emerald);
      flex-shrink: 0;
    }

    /* Before vs After Switcher visual */
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
      background: var(--bg-tertiary);
      border-radius: 8px;
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.03);
    }

    .compare-side {
      font-size: 12px;
    }

    .compare-side strong {
      display: block;
      color: var(--text-secondary);
      margin-bottom: 4px;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.5px;
    }

    .compare-side p {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
    }

    .compare-side.after-side p {
      color: var(--accent-teal);
    }

    .approval-btn-row {
      display: flex;
      gap: 10px;
    }

    .approve-btn {
      flex: 1;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--accent-emerald);
      font-weight: 700;
      border-radius: 8px;
      padding: 8px 16px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 13px;
      transition: all 0.2s ease;
    }

    .approve-btn:hover {
      background: var(--accent-emerald);
      color: #060a07;
      border-color: var(--accent-emerald);
    }

    .approve-btn:disabled {
      opacity: 0.5;
      cursor: wait;
    }

    .dismiss-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-secondary);
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dismiss-btn:hover {
      border-color: var(--accent-red);
      color: var(--accent-red);
      background: rgba(239, 68, 68, 0.05);
    }

    .approved-state-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid var(--accent-emerald);
      color: var(--accent-emerald);
      font-weight: 700;
      font-size: 13px;
      border-radius: 8px;
      padding: 8px 16px;
      justify-content: center;
      width: 100%;
    }

    /* Logs History List */
    .timeline-container {
      margin-top: 24px;
    }

    .timeline-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
      max-height: 400px;
      overflow-y: auto;
      padding-right: 4px;
    }

    .timeline-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
      transition: border-color 0.2s ease;
    }

    .timeline-card:hover {
      border-color: rgba(16, 185, 129, 0.2);
    }

    .timeline-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 12px;
    }

    .timeline-meta strong {
      color: var(--text-primary);
      font-weight: 700;
    }

    .timeline-meta span {
      color: var(--text-muted);
    }

    .timeline-card p {
      margin: 0 0 10px 0;
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.45;
    }

    .timeline-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tag-chip {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.15);
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 11px;
      color: var(--accent-emerald);
      text-transform: capitalize;
    }

    .empty-state {
      border: 1.5px dashed var(--border);
      border-radius: 12px;
      padding: 30px 20px;
      text-align: center;
      color: var(--text-muted);
      font-size: 13.5px;
      background: rgba(16, 185, 129, 0.01);
    }

    .error-card {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-radius: 10px;
      color: #fca5a5;
      padding: 12px;
      font-size: 13px;
      margin-bottom: 16px;
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }

    .error-card svg {
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* Video Reel modal styled as clean minor tape expander */
    .demo-expander {
      border-top: 1px solid var(--border);
      margin-top: 40px;
      padding-top: 20px;
    }

    .demo-trigger {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
    }

    .demo-trigger:hover {
      color: var(--text-primary);
    }

    .demo-video-wrapper {
      margin-top: 12px;
      aspect-ratio: 16/9;
      width: 100%;
      max-width: 560px;
      border-radius: 10px;
      border: 1px solid var(--border);
      overflow: hidden;
      background: #000;
    }

    .demo-video-wrapper iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    @media (max-width: 1024px) {
      .agent-layout {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <img src="/trellisai-logo.png" alt="TrellisAI Logo" />
        <span>TrellisAI</span>
      </div>
      <div class="status-pill">
        <span id="statusDot" class="status-dot"></span>
        <span id="statusText">Scanning fields...</span>
      </div>
    </div>
  </div>

  <main id="agentApp"></main>

  <script>
    window.renderFallbackApp = function(renderError) {
      const root = document.getElementById("agentApp");
      if (!root || root.dataset.fallbackRendered === "true" || root.children.length) return;
      root.dataset.fallbackRendered = "true";

      const sampleLogs = [
        {
          name: "South Field morning pass",
          field: "South Field",
          text: "South road edge has aphids under the newest leaves, some leaf curl, and dry wind burn along lateral 2. Sprinkler pressure looked low after 6:30 AM. Scout before spraying and add water before the crew arrives."
        },
        {
          name: "North Field nutrient check",
          field: "North Field",
          text: "North Field looks uneven near the west gate. Yellowing on two rows, but soil is damp. Hold fertilizer until we compare against the last irrigation run and pull a quick tissue sample."
        },
        {
          name: "West Field labor note",
          field: "West Field",
          text: "West Field weeding fell behind after the tractor repair. Crew can finish the center rows tomorrow if the sprayer is not blocking the lane. No pest pressure seen."
        }
      ];

      const state = {
        fieldName: "South Field",
        date: todayIso(),
        rawText: sampleLogs[0].text,
        question: "What should I do tomorrow?",
        health: null,
        logs: [],
        recommendations: [],
        plan: null,
        running: false,
        approvingId: "",
        sprinklerApproved: false,
        error: renderError ? "Enhanced console did not load; using reliable demo mode." : ""
      };

      function todayIso() {
        const date = new Date();
        return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
      }

      function safeArray(value) {
        return Array.isArray(value) ? value : [];
      }

      function compactId(value) {
        if (!value) return "";
        if (typeof value === "string") return value;
        if (value.$oid) return value.$oid;
        return String(value);
      }

      function escapeHtml(value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function(char) {
          return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
        });
      }

      async function api(path, options) {
        const response = await fetch(path, options || {});
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || response.statusText);
        }
        return response.json();
      }

      function updateStatus() {
        const ready = Boolean(state.health && state.health.ok && state.health.mongo && state.health.mongo.ok);
        const statusDot = document.getElementById("statusDot");
        const statusText = document.getElementById("statusText");
        if (statusDot) statusDot.classList.toggle("ready", ready);
        if (statusText) statusText.textContent = ready ? "Trellis Sensor Array Online" : "Reliable demo mode";
      }

      async function refreshState() {
        try {
          const results = await Promise.all([
            api("/api/health"),
            api("/api/recommendations"),
            api("/api/logs")
          ]);
          state.health = results[0];
          state.recommendations = safeArray(results[1].recommendations);
          state.logs = safeArray(results[2].logs);
          state.error = "";
        } catch (err) {
          state.error = err.message || String(err);
        }
        updateStatus();
        render();
      }

      async function runAgent() {
        state.running = true;
        state.plan = null;
        state.sprinklerApproved = false;
        state.error = "";
        render();
        try {
          await api("/api/logs", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              farm_id: "farm_demo",
              field_name: state.fieldName,
              raw_text: state.rawText,
              date: state.date
            })
          });

          state.plan = await api("/api/agent/ask", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              farm_id: "farm_demo",
              question: state.question
            })
          });
          await refreshState();
        } catch (err) {
          state.error = err.message || String(err);
        } finally {
          state.running = false;
          render();
        }
      }

      async function approveRecommendation(rec) {
        const id = compactId(rec && rec._id);
        if (!id) return;
        state.approvingId = id;
        state.error = "";
        render();
        try {
          await api("/api/recommendations/" + encodeURIComponent(id) + "/approve", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({})
          });
          await refreshState();
        } catch (err) {
          state.error = err.message || String(err);
        } finally {
          state.approvingId = "";
          render();
        }
      }

      function renderRecommendation(rec, index) {
        const id = compactId(rec._id);
        const approved = rec.status === "approved";
        const reasons = safeArray(rec.reasoning_summary).slice(0, 2).map(function(reason) {
          return "<li><span>" + escapeHtml(reason) + "</span></li>";
        }).join("");
        return "<div class=\\"approval-card\\" data-rec-index=\\"" + index + "\\">" +
          "<div class=\\"card-top\\"><div class=\\"card-title\\"><h4>" + escapeHtml(rec.title || "Field Work Job") + "</h4><span>" + escapeHtml(rec.field_name || "Farm Area") + "</span></div>" +
          "<span class=\\"badge " + (approved ? "badge-emerald" : "badge-amber") + "\\">" + escapeHtml(rec.priority || "Medium") + "</span></div>" +
          "<div class=\\"card-body\\">" + escapeHtml(rec.recommendation || "Review this recommendation before assigning the crew.") + (reasons ? "<ul class=\\"bullets-list\\">" + reasons + "</ul>" : "") + "</div>" +
          (approved ? "<div class=\\"approved-state-badge\\">Crew Task Deployed</div>" : "<button type=\\"button\\" class=\\"approve-btn\\" data-rec-id=\\"" + escapeHtml(id) + "\\">" + (state.approvingId === id ? "Assigning..." : "Approve & Deploy Task") + "</button>") +
          "</div>";
      }

      function render() {
        const sprinkler = state.plan && state.plan.sprinkler_plan;
        const before = sprinkler && sprinkler.before ? sprinkler.before : {};
        const after = sprinkler && sprinkler.after ? sprinkler.after : {};
        const visibleRecommendations = state.recommendations.slice(0, 6);
        const pendingCount = state.recommendations.filter(function(rec) {
          return rec.status !== "approved" && rec.status !== "dismissed";
        }).length + (sprinkler && !state.sprinklerApproved ? 1 : 0);
        const logs = state.logs.slice(0, 10).map(function(log) {
          const signals = safeArray(log.risk_signals).slice(0, 4).map(function(signal) {
            return "<span class=\\"tag-chip\\">" + escapeHtml(String(signal).replace(/_/g, " ")) + "</span>";
          }).join("");
          return "<div class=\\"timeline-card\\"><div class=\\"timeline-meta\\"><strong>" + escapeHtml(log.field_name || "Field") + "</strong><span>" + escapeHtml(log.date || "") + "</span></div><p>" + escapeHtml(log.raw_text || log.embedding_text || "") + "</p><div class=\\"timeline-tags\\">" + signals + "</div></div>";
        }).join("");

        root.innerHTML =
          "<div class=\\"agent-layout\\">" +
            "<div style=\\"display:flex;flex-direction:column;gap:24px\\">" +
              "<div class=\\"glass-panel\\"><div class=\\"panel-header\\"><h2>Agent Control Console</h2><span class=\\"badge badge-emerald\\">" + (state.running ? "Running..." : "Standby") + "</span></div>" +
                (state.error ? "<div class=\\"error-card\\"><span>" + escapeHtml(state.error) + "</span></div>" : "") +
                "<div class=\\"console-input-wrapper\\"><div class=\\"console-meta-row\\"><select id=\\"fallbackField\\" class=\\"console-field-select\\"><option>South Field</option><option>North Field</option><option>West Field</option></select><input id=\\"fallbackDate\\" type=\\"date\\" class=\\"console-date-input\\" value=\\"" + escapeHtml(state.date) + "\\" /></div><textarea id=\\"fallbackText\\" class=\\"console-textarea\\">" + escapeHtml(state.rawText) + "</textarea></div>" +
                "<div><label style=\\"font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);display:block;margin-bottom:8px;font-weight:700\\">Preset Operations</label><div class=\\"presets-row\\">" + sampleLogs.map(function(sample, index) { return "<button type=\\"button\\" class=\\"preset-pill\\" data-sample=\\"" + index + "\\">" + escapeHtml(sample.name) + "</button>"; }).join("") + "</div></div>" +
                "<div class=\\"console-input-wrapper\\" style=\\"padding:8px 12px\\"><input id=\\"fallbackQuestion\\" style=\\"background:transparent;border:none;width:100%;outline:none;font-size:14px\\" value=\\"" + escapeHtml(state.question) + "\\" /></div>" +
                "<div class=\\"console-actions\\"><span style=\\"font-size:12px;color:var(--text-secondary)\\">Atlas persistent memory active</span><button id=\\"fallbackRun\\" type=\\"button\\" class=\\"primary-btn\\" " + (state.running ? "disabled" : "") + ">" + (state.running ? "Running Agent..." : "Run Operations Agent") + "</button></div>" +
              "</div>" +
              "<div class=\\"glass-panel timeline-container\\"><div class=\\"panel-header\\"><h2>Field memory log</h2><span class=\\"badge badge-emerald\\">" + state.logs.length + " saved</span></div><div class=\\"timeline-list\\">" + (logs || "<div class=\\"empty-state\\">No logged memories found yet.</div>") + "</div></div>" +
            "</div>" +
            "<div style=\\"display:flex;flex-direction:column;gap:24px\\">" +
              "<div class=\\"glass-panel map-panel\\"><div class=\\"panel-header\\"><h2>Interactive telemetry map</h2></div><div class=\\"field-svg-container\\"><svg viewBox=\\"0 0 400 240\\" width=\\"100%\\" height=\\"240\\"><polygon class=\\"field-polygon warning\\" points=\\"40,40 180,30 160,110 50,120\\"></polygon><text x=\\"90\\" y=\\"80\\" fill=\\"#fff\\" font-size=\\"11px\\" font-weight=\\"700\\">North Field</text><polygon class=\\"field-polygon warning\\" points=\\"190,40 350,50 330,130 200,120\\"></polygon><text x=\\"240\\" y=\\"85\\" fill=\\"#fff\\" font-size=\\"11px\\" font-weight=\\"700\\">South Field</text><polygon class=\\"field-polygon warning\\" points=\\"80,140 310,140 280,210 100,210\\"></polygon><text x=\\"170\\" y=\\"180\\" fill=\\"#fff\\" font-size=\\"11px\\" font-weight=\\"700\\">West Field</text></svg></div></div>" +
              "<div class=\\"glass-panel\\"><div class=\\"panel-header\\"><h2>Grower Approvals Queue</h2><span class=\\"badge badge-amber\\">" + pendingCount + " Pending</span></div><div class=\\"approvals-deck\\">" +
                (sprinkler ? "<div class=\\"approval-card\\"><div class=\\"card-top\\"><div class=\\"card-title\\"><h4>Smart Sprinkler Schedule Change</h4><span>" + escapeHtml(sprinkler.zone || state.fieldName) + "</span></div><span class=\\"badge " + (state.sprinklerApproved ? "badge-emerald" : "badge-amber") + "\\">" + (state.sprinklerApproved ? "approved" : "ready") + "</span></div><div class=\\"card-body\\">" + escapeHtml(sprinkler.decision || "The agent optimized tomorrow's water cycle.") + "<div class=\\"comparison-grid\\" style=\\"margin-top:12px\\"><div class=\\"compare-side\\"><strong>Before</strong><p>" + escapeHtml(before.start_time || "6:30 AM") + "</p><small>" + escapeHtml(before.duration_minutes || 25) + " minutes</small></div><div class=\\"compare-side after-side\\"><strong>After</strong><p>" + escapeHtml(after.start_time || "5:15 AM") + "</p><small>" + escapeHtml(after.duration_minutes || 42) + " minutes</small></div></div></div>" + (state.sprinklerApproved ? "<div class=\\"approved-state-badge\\">Sprinkler adjustment deployed</div>" : "<button id=\\"fallbackSprinkler\\" type=\\"button\\" class=\\"approve-btn\\">Deploy Irrigation Schedule</button>") + "</div>" : "") +
                (visibleRecommendations.length ? visibleRecommendations.map(renderRecommendation).join("") : "<div class=\\"empty-state\\">Run the agent to fill this queue with approval-ready work.</div>") +
              "</div></div>" +
            "</div>" +
          "</div>";

        const field = document.getElementById("fallbackField");
        if (field) field.value = state.fieldName;
        const date = document.getElementById("fallbackDate");
        if (date) date.onchange = function(event) { state.date = event.target.value; };
        const text = document.getElementById("fallbackText");
        if (text) text.oninput = function(event) { state.rawText = event.target.value; };
        const question = document.getElementById("fallbackQuestion");
        if (question) question.oninput = function(event) { state.question = event.target.value; };
        if (field) field.onchange = function(event) { state.fieldName = event.target.value; };
        const run = document.getElementById("fallbackRun");
        if (run) run.onclick = runAgent;
        const sprinklerButton = document.getElementById("fallbackSprinkler");
        if (sprinklerButton) sprinklerButton.onclick = function() { state.sprinklerApproved = true; render(); };
        Array.from(root.querySelectorAll("[data-sample]")).forEach(function(button) {
          button.onclick = function() {
            const sample = sampleLogs[Number(button.dataset.sample)];
            state.fieldName = sample.field;
            state.rawText = sample.text;
            render();
          };
        });
        Array.from(root.querySelectorAll("[data-rec-id]")).forEach(function(button) {
          button.onclick = function() {
            const rec = visibleRecommendations.find(function(item) { return compactId(item._id) === button.dataset.recId; });
            approveRecommendation(rec);
          };
        });
      }

      render();
      refreshState();
    };

    window.setTimeout(function() {
      const root = document.getElementById("agentApp");
      if (root && !root.children.length && window.renderFallbackApp) {
        window.renderFallbackApp(new Error("Enhanced console timed out"));
      }
    }, 3500);
  </script>

  <script type="module">
    import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
    import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
    import { 
      Activity, Check, CheckCircle2, ClipboardCheck, Cpu, Database, Droplets,
      History, Layers, Play, ShieldAlert, Sprout, Terminal, UserCheck, Youtube
    } from "https://esm.sh/lucide-react@0.468.0?deps=react@18.3.1";

    const h = React.createElement;
    const demoVideoUrl = "https://www.youtube.com/embed/EE6EDAMAjEI";
    
    const sampleLogs = [
      {
        name: "South Field morning pass",
        field: "South Field",
        text: "South road edge has aphids under the newest leaves, some leaf curl, and dry wind burn along lateral 2. Sprinkler pressure looked low after 6:30 AM. Scout before spraying and add water before the crew arrives."
      },
      {
        name: "North Field nutrient check",
        field: "North Field",
        text: "North Field looks uneven near the west gate. Yellowing on two rows, but soil is damp. Hold fertilizer until we compare against the last irrigation run and pull a quick tissue sample."
      },
      {
        name: "West Field labor note",
        field: "West Field",
        text: "West Field weeding fell behind after the tractor repair. Crew can finish the center rows tomorrow if the sprayer is not blocking the lane. No pest pressure seen."
      }
    ];

    function api(path, options) {
      return fetch(path, options || {}).then(async function(response) {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || response.statusText);
        }
        return response.json();
      });
    }

    function todayIso() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return year + "-" + month + "-" + day;
    }

    function compactId(value) {
      if (!value) return "";
      if (typeof value === "string") return value;
      if (value.$oid) return value.$oid;
      return String(value);
    }

    function safeArray(value) {
      return Array.isArray(value) ? value : [];
    }

    function App() {
      const [fieldName, setFieldName] = useState("South Field");
      const [date, setDate] = useState(todayIso());
      const [rawText, setRawText] = useState(sampleLogs[0].text);
      const [question, setQuestion] = useState("What should I do tomorrow?");
      const [health, setHealth] = useState(null);
      const [logs, setLogs] = useState([]);
      const [tasks, setTasks] = useState([]);
      const [recommendations, setRecommendations] = useState([]);
      const [plan, setPlan] = useState(null);
      const [runState, setRunState] = useState("idle");
      const [activeReceipt, setActiveReceipt] = useState(0);
      const [approvingId, setApprovingId] = useState("");
      const [sprinklerApproved, setSprinklerApproved] = useState(false);
      const [hoveredField, setHoveredField] = useState(null);
      const [error, setError] = useState("");
      const [showDemo, setShowDemo] = useState(false);
      const [terminalThoughts, setTerminalThoughts] = useState([
        "System initiated. TrellisAI farm agent standing by.",
        "Enter operations log or command above to command the system."
      ]);

      // Simulated agent steps visualizer
      const agentSteps = [
        { id: 1, title: "Farm Log Ingest", detail: "Extract observations & crop severity tags", state: "saving" },
        { id: 2, title: "Semantic Memory Lookup", detail: "Scan Atlas vector database for historical context", state: "thinking" },
        { id: 3, title: "Risk Prioritization", detail: "Calculate risk indicators across fields", state: "thinking" },
        { id: 4, title: "Human Approval Stage", detail: "Expose suggested schedules & crew tasks", state: "ready" }
      ];

      useEffect(function() {
        refreshState();
      }, []);

      useEffect(function() {
        const statusDot = document.getElementById("statusDot");
        const statusText = document.getElementById("statusText");
        const ready = Boolean(health && health.ok && health.mongo && health.mongo.ok);
        if (statusDot) statusDot.classList.toggle("ready", ready);
        if (statusText) statusText.textContent = ready ? "Trellis Sensor Array Online" : "Connecting sensor array...";
      }, [health]);

      async function refreshState() {
        try {
          const results = await Promise.all([
            api("/api/health"),
            api("/api/tasks"),
            api("/api/recommendations"),
            api("/api/logs")
          ]);
          setHealth(results[0]);
          setTasks(safeArray(results[1].tasks));
          setRecommendations(safeArray(results[2].recommendations));
          setLogs(safeArray(results[3].logs));
        } catch (err) {
          setError(err.message || String(err));
        }
      }

      async function runAgent() {
        setError("");
        setPlan(null);
        setSprinklerApproved(false);
        setRunState("saving");
        setTerminalThoughts(prev => [
          ...prev,
          "[" + new Date().toLocaleTimeString() + "] INGEST: Processing operations log for " + fieldName + "..."
        ]);

        try {
          await api("/api/logs", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              farm_id: "farm_demo",
              field_name: fieldName,
              raw_text: rawText,
              date: date
            })
          });

          setRunState("thinking");
          setTerminalThoughts(prev => [
            ...prev,
            "[" + new Date().toLocaleTimeString() + "] ATLAS: Querying historical field vector context...",
            "[" + new Date().toLocaleTimeString() + "] INTEL: Triggering Gemini core reasoning engine..."
          ]);

          const body = await api("/api/agent/ask", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              farm_id: "farm_demo",
              question: question
            })
          });

          setPlan(body);
          setRunState("ready");
          setTerminalThoughts(prev => [
            ...prev,
            "[" + new Date().toLocaleTimeString() + "] EXECUTION: Plan generated. Waiting for grower approval."
          ]);
          
          await refreshState();
        } catch (err) {
          setRunState("idle");
          setError(err.message || String(err));
          setTerminalThoughts(prev => [
            ...prev,
            "[" + new Date().toLocaleTimeString() + "] ERROR: Agent run failed: " + (err.message || String(err))
          ]);
        }
      }

      async function approveRecommendation(rec) {
        const id = compactId(rec && rec._id);
        if (!id) return;
        setError("");
        setApprovingId(id);
        setTerminalThoughts(prev => [
          ...prev,
          "[" + new Date().toLocaleTimeString() + "] APPROVAL: Deploying task: \"" + rec.title + "\"..."
        ]);
        try {
          await api("/api/recommendations/" + encodeURIComponent(id) + "/approve", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({})
          });
          setTerminalThoughts(prev => [
            ...prev,
            "[" + new Date().toLocaleTimeString() + "] SYSTEM: Task successfully assigned and logged to field crew."
          ]);
          await refreshState();
        } catch (err) {
          setError(err.message || String(err));
        } finally {
          setApprovingId("");
        }
      }

      function usePreset(sample) {
        setFieldName(sample.field);
        setRawText(sample.text);
        setTerminalThoughts(prev => [
          ...prev,
          "Preset operations log selected: \"" + sample.name + "\""
        ]);
      }

      const activePresetIndex = useMemo(() => {
        if (runState === "saving") return 0;
        if (runState === "thinking") return 1;
        if (runState === "ready") return 3;
        return -1;
      }, [runState, plan]);
      const sprinklerPlan = plan && plan.sprinkler_plan ? plan.sprinkler_plan : null;
      const sprinklerBefore = sprinklerPlan && sprinklerPlan.before ? sprinklerPlan.before : {};
      const sprinklerAfter = sprinklerPlan && sprinklerPlan.after ? sprinklerPlan.after : {};
      const visibleRecommendations = recommendations.slice(0, 6);
      const pendingCount = recommendations.filter(r => r.status !== "approved" && r.status !== "dismissed").length + (sprinklerPlan && !sprinklerApproved ? 1 : 0);

      return h("div", { className: "agent-layout" },
        // Left Column: Agent Console
        h("div", { style: { display: "flex", flexDirection: "column", gap: "24px" } },
          h("div", { className: "glass-panel" },
            h("div", { className: "panel-header" },
              h("h2", null, h(Cpu, { size: 18 }), "Agent Control Console"),
              h("span", { className: "badge badge-emerald" }, runState === "idle" ? "Standby" : runState + "...")
            ),

            error && h("div", { className: "error-card" },
              h(ShieldAlert, { size: 18 }),
              h("span", null, error)
            ),

            // Unified Inputs
            h("div", { className: "console-input-wrapper" },
              h("div", { className: "console-meta-row" },
                h("select", {
                  className: "console-field-select",
                  value: fieldName,
                  onChange: function(e) { setFieldName(e.target.value); }
                },
                  ["South Field", "North Field", "West Field"].map(f => h("option", { key: f, value: f }, f))
                ),
                h("input", {
                  type: "date",
                  className: "console-date-input",
                  value: date,
                  onChange: function(e) { setDate(e.target.value); }
                })
              ),
              h("textarea", {
                className: "console-textarea",
                placeholder: "Type natural farm observations or direct command for Trellis...",
                value: rawText,
                onChange: function(e) { setRawText(e.target.value); }
              })
            ),

            // Quick Preset Operations
            h("div", null,
              h("label", { style: { fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", display: "block", marginBottom: "8px", fontWeight: "700" } }, "Preset Operations"),
              h("div", { className: "presets-row" },
                sampleLogs.map(sample => 
                  h("button", {
                    key: sample.name,
                    type: "button",
                    className: "preset-pill",
                    onClick: () => usePreset(sample)
                  }, sample.name)
                )
              )
            ),

            // Agent Prompt Ask
            h("div", { style: { marginTop: "16px", marginBottom: "20px" } },
              h("label", { style: { fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", display: "block", marginBottom: "8px", fontWeight: "700" } }, "Agent Mission Prompt"),
              h("div", { className: "console-input-wrapper", style: { padding: "8px 12px" } },
                h("input", {
                  style: { background: "transparent", border: "none", width: "100%", outline: "none", fontSize: "14px" },
                  value: question,
                  onChange: function(e) { setQuestion(e.target.value); }
                })
              )
            ),

            // Action
            h("div", { className: "console-actions" },
              h("span", { style: { fontSize: "12px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" } },
                h(Database, { size: 14, color: "var(--accent-emerald)" }), "Atlas persistent memory active"
              ),
              h("button", {
                type: "button",
                className: "primary-btn",
                onClick: runAgent,
                disabled: runState === "saving" || runState === "thinking"
              },
                runState === "saving" || runState === "thinking" 
                  ? h(Activity, { size: 18, className: "animate-spin" })
                  : h(Play, { size: 18 }),
                runState === "idle" ? "Run Operations Agent" : "Running Agent..."
              )
            )
          ),

          // Stepper process visualizer
          (runState !== "idle" || plan) && h("div", { className: "glass-panel stepper-container" },
            h("div", { className: "stepper-title" },
              h(Layers, { size: 14 }), "Execution Pipeline Status"
            ),
            h("div", { className: "steps" },
              agentSteps.map((step, idx) => {
                const isActive = activePresetIndex === idx || (runState === "ready" && idx === 3);
                const isCompleted = activePresetIndex > idx || (runState === "ready");
                const itemClass = "step-item" + (isActive ? " active" : "") + (isCompleted ? " completed" : "");
                return h("div", { key: step.id, className: itemClass },
                  h("div", { className: "step-icon-box" },
                    isCompleted ? h(Check, { size: 12 }) : step.id
                  ),
                  h("div", { className: "step-content" },
                    h("strong", null, step.title),
                    h("span", null, step.detail)
                  )
                );
              })
            )
          ),

          // Terminal thoughts
          h("div", { className: "glass-panel", style: { padding: "20px" } },
            h("div", { className: "panel-header" },
              h("h2", null, h(Terminal, { size: 17 }), "Agent Reasoning Feed")
            ),
            h("div", { className: "terminal-box" },
              terminalThoughts.map((t, idx) => 
                h("div", { key: idx, className: "terminal-line" },
                  h("span", { className: "terminal-prompt" }, ">"),
                  h("span", null, t)
                )
              )
            )
          ),

          // Historical Logs
          h("div", { className: "glass-panel timeline-container" },
            h("div", { className: "panel-header" },
              h("h2", null, h(History, { size: 18 }), "Field memory log"),
              h("span", { className: "badge badge-emerald" }, logs.length + " saved")
            ),
            logs.length ? h("div", { className: "timeline-list" },
              logs.map((log, index) => {
                const signals = safeArray(log.risk_signals).slice(0, 5);
                return h("div", { key: compactId(log._id) || index, className: "timeline-card" },
                  h("div", { className: "timeline-meta" },
                    h("strong", null, log.field_name || "Field"),
                    h("span", null, log.date || "")
                  ),
                  h("p", null, log.raw_text || log.embedding_text),
                  signals.length ? h("div", { className: "timeline-tags" },
                    signals.map(s => h("span", { className: "tag-chip", key: s }, s.replace(/_/g, " ")))
                  ) : null
                );
              })
            ) : h("div", { className: "empty-state" }, "No logged memories found in this sector yet.")
          )
        ),

        // Right Column: Operations Center
        h("div", { style: { display: "flex", flexDirection: "column", gap: "24px" } },
          // Field Sensor Map
          h("div", { className: "glass-panel map-panel" },
            h("div", { className: "panel-header" },
              h("h2", null, h(Sprout, { size: 18 }), "Interactive telemetry map")
            ),
            h("div", { className: "field-svg-container" + (runState === "thinking" ? " scanning" : "") },
              h("div", { className: "scanning-line" }),
              h("svg", { viewBox: "0 0 400 240", width: "100%", height: "240" },
                // North Field
                h("polygon", {
                  className: "field-polygon" + (hoveredField === "North Field" ? " active-scan" : "") + (hoveredField !== "North Field" && ["North Field Nutrient Check", "Scout North Field for nitrogen stress"].some(t => recommendations.some(r => r.title === t && r.status === "pending_approval")) ? " warning" : ""),
                  points: "40,40 180,30 160,110 50,120",
                  onMouseEnter: () => setHoveredField("North Field"),
                  onMouseLeave: () => setHoveredField(null)
                }),
                h("text", { x: "90", y: "80", fill: "#fff", fontSize: "11px", fontWeight: "700", pointerEvents: "none" }, "North Field"),

                // South Field
                h("polygon", {
                  className: "field-polygon" + (hoveredField === "South Field" ? " active-scan" : "") + (hoveredField !== "South Field" && ["South Field Morning Pass"].some(t => recommendations.some(r => r.title === t && r.status === "pending_approval")) ? " warning" : ""),
                  points: "190,40 350,50 330,130 200,120",
                  onMouseEnter: () => setHoveredField("South Field"),
                  onMouseLeave: () => setHoveredField(null)
                }),
                h("text", { x: "240", y: "85", fill: "#fff", fontSize: "11px", fontWeight: "700", pointerEvents: "none" }, "South Field"),

                // West Field
                h("polygon", {
                  className: "field-polygon" + (hoveredField === "West Field" ? " active-scan" : "") + (hoveredField !== "West Field" && ["West Field Labor Note"].some(t => recommendations.some(r => r.title === t && r.status === "pending_approval")) ? " warning" : ""),
                  points: "80,140 310,140 280,210 100,210",
                  onMouseEnter: () => setHoveredField("West Field"),
                  onMouseLeave: () => setHoveredField(null)
                }),
                h("text", { x: "170", y: "180", fill: "#fff", fontSize: "11px", fontWeight: "700", pointerEvents: "none" }, "West Field")
              ),
              hoveredField && h("div", { className: "map-telemetry" },
                h("div", { style: { color: "var(--accent-emerald)", fontWeight: "700", marginBottom: "4px" } }, hoveredField),
                h("div", null, "Telemetry: Active"),
                h("div", null, hoveredField === "North Field" ? "Crop: Corn (42 Ac)" : hoveredField === "South Field" ? "Crop: Soybeans (35 Ac)" : "Crop: Wheat (50 Ac)"),
                h("div", null, hoveredField === "North Field" ? "Status: Nitrogen Stress Warning" : hoveredField === "South Field" ? "Status: Water Recovery Mode" : "Status: Weeding Delay")
              )
            )
          ),

          // Approvals Deck
          h("div", { className: "glass-panel" },
            h("div", { className: "panel-header" },
              h("h2", null, h(UserCheck, { size: 18 }), "Grower Approvals Queue"),
              h("span", { className: "badge badge-amber" }, 
                String(pendingCount) + " Pending"
              )
            ),

            h("div", { className: "approvals-deck" },
              // Smart Sprinkler Card
              sprinklerPlan && h("div", { className: "approval-card" },
                h("div", { className: "card-top" },
                  h("div", { className: "card-title" },
                    h("h4", null, "Smart Sprinkler Schedule Change"),
                    h("span", null, sprinklerPlan.zone || sprinklerPlan.controller || fieldName)
                  ),
                  h("span", { className: sprinklerApproved ? "badge badge-emerald" : "badge badge-amber" }, 
                    sprinklerApproved ? "approved" : "ready"
                  )
                ),
                h("div", { className: "card-body" },
                  sprinklerPlan.decision || "The agent optimized tomorrow's water cycle and queued it for approval.",
                  h("div", { className: "comparison-grid", style: { marginTop: "12px" } },
                    h("div", { className: "compare-side" },
                      h("strong", null, "Before"),
                      h("p", null, sprinklerBefore.start_time || "6:30 AM"),
                      h("small", null, String(sprinklerBefore.duration_minutes || 25) + " minutes")
                    ),
                    h("div", { className: "compare-side after-side" },
                      h("strong", null, "After"),
                      h("p", null, sprinklerAfter.start_time || "5:15 AM"),
                      h("small", null, String(sprinklerAfter.duration_minutes || 42) + " minutes")
                    )
                  ),
                  sprinklerPlan.reason ? h("div", { style: { marginTop: "8px" } }, sprinklerPlan.reason) : null
                ),
                h("div", null,
                  sprinklerApproved 
                    ? h("div", { className: "approved-state-badge" },
                        h(Check, { size: 16 }), "Sprinkler adjustment deployed"
                      )
                    : h("div", { className: "approval-btn-row" },
                        h("button", {
                          type: "button",
                          className: "approve-btn",
                          style: { width: "100%" },
                          onClick: () => {
                            setSprinklerApproved(true);
                            setTerminalThoughts(prev => [
                              ...prev,
                              "[" + new Date().toLocaleTimeString() + "] APPROVED: " + (sprinklerPlan.zone || "Irrigation zone") + " optimized starting at " + (sprinklerAfter.start_time || "5:15 AM") + "."
                            ]);
                          }
                        }, h(Droplets, { size: 16 }), "Deploy Irrigation Schedule")
                      )
                )
              ),

              // Recommendations / Crew tasks approvals
              visibleRecommendations.length ? visibleRecommendations.map((rec, index) => {
                const id = compactId(rec._id);
                const reasons = safeArray(rec.reasoning_summary).slice(0, 3);
                const isApproved = rec.status === "approved";
                
                return h("div", { key: id || index, className: "approval-card" },
                  h("div", { className: "card-top" },
                    h("div", { className: "card-title" },
                      h("h4", null, rec.title || "Field Work Job"),
                      h("span", null, rec.field_name || "Farm Area")
                    ),
                    h("span", { className: "badge" + (isApproved ? " badge-emerald" : " badge-amber") }, 
                      rec.priority || "Medium"
                    )
                  ),
                  h("div", { className: "card-body" },
                    rec.recommendation,
                    reasons.length ? h("ul", { className: "bullets-list" },
                      reasons.map((r, rIdx) => h("li", { key: rIdx }, h(CheckCircle2, { size: 14 }), h("span", null, r)))
                    ) : null
                  ),
                  h("div", null,
                    isApproved 
                      ? h("div", { className: "approved-state-badge" },
                          h(Check, { size: 16 }), "Crew Task Deployed"
                        )
                      : h("div", { className: "approval-btn-row" },
                          h("button", {
                            type: "button",
                            className: "approve-btn",
                            disabled: approvingId === id,
                            onClick: () => approveRecommendation(rec)
                          }, h(ClipboardCheck, { size: 16 }), approvingId === id ? "Assigning..." : "Approve & Deploy Task")
                        )
                  )
                );
              }) : h("div", { className: "empty-state" }, "No additional crew approvals queued.")
            )
          ),

          // Demo Video expander in right column footer
          h("div", { className: "demo-expander" },
            h("button", {
              className: "demo-trigger",
              onClick: () => setShowDemo(!showDemo)
            },
              h(Youtube, { size: 16 }),
              showDemo ? "Hide Narrative Reel" : "Watch Narrative Reel"
            ),
            showDemo && h("div", { className: "demo-video-wrapper" },
              h("iframe", {
                src: demoVideoUrl,
                title: "TrellisAI demo",
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                allowFullScreen: true
              })
            )
          )
        )
      );
    }

    createRoot(document.getElementById("agentApp")).render(h(App));
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
