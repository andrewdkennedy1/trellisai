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
      --muted: #657064;
      --panel: #fffdf7;
      --panel-strong: #f7f2e7;
      --field: #eef6ec;
      --line: #d8decf;
      --green: #276749;
      --green-strong: #1d4d36;
      --teal: #1f6f78;
      --amber: #bd6b14;
      --red: #a5402d;
      --blue: #315f9d;
      --shadow: 0 22px 80px rgba(35, 50, 35, 0.13);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-width: 320px;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f4f3ec;
      color: var(--ink);
    }

    button, input, textarea, select {
      font: inherit;
    }

    button {
      border: 0;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      border-bottom: 1px solid rgba(101, 112, 100, 0.22);
      background: rgba(255, 253, 247, 0.92);
      backdrop-filter: blur(18px);
    }

    .topbar-inner {
      max-width: 1380px;
      margin: 0 auto;
      padding: 14px 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      font-size: 21px;
      font-weight: 850;
      letter-spacing: 0;
    }

    .brand img {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 8px 20px rgba(39, 103, 73, 0.18);
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 34px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 7px 10px;
      background: #fff;
      color: var(--muted);
      font-size: 13px;
      font-weight: 760;
      white-space: nowrap;
    }

    .status-dot {
      width: 9px;
      height: 9px;
      border-radius: 99px;
      background: #9ca3af;
    }

    .status-dot.ready {
      background: #18a558;
      box-shadow: 0 0 0 4px rgba(24, 165, 88, 0.14);
    }

    main {
      max-width: 1380px;
      margin: 0 auto;
      padding: 22px 22px 46px;
    }

    .agent-shell {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.65fr);
      gap: 18px;
      align-items: stretch;
    }

    .agent-stage {
      position: relative;
      min-height: 548px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 8px;
      background:
        linear-gradient(105deg, rgba(15, 27, 20, 0.86), rgba(25, 53, 39, 0.68) 48%, rgba(93, 72, 35, 0.44)),
        url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=82");
      background-size: cover;
      background-position: center;
      color: #fff;
      box-shadow: var(--shadow);
    }

    .stage-grid {
      position: relative;
      z-index: 1;
      min-height: inherit;
      display: grid;
      grid-template-columns: minmax(0, 0.92fr) minmax(260px, 0.58fr);
      gap: 22px;
      padding: 28px;
    }

    .stage-copy {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
      gap: 28px;
    }

    .agent-kicker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
      border: 1px solid rgba(255, 255, 255, 0.28);
      border-radius: 8px;
      padding: 8px 10px;
      background: rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.88);
      font-size: 13px;
      font-weight: 780;
    }

    .agent-stage h1 {
      max-width: 780px;
      margin: 20px 0 12px;
      font-size: clamp(40px, 5.5vw, 80px);
      line-height: 0.95;
      letter-spacing: 0;
    }

    .agent-answer {
      max-width: 720px;
      color: rgba(255, 255, 255, 0.88);
      font-size: clamp(17px, 1.6vw, 21px);
      line-height: 1.5;
    }

    .run-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }

    .primary-action, .secondary-action, .icon-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 8px;
      min-height: 42px;
      padding: 10px 14px;
      cursor: pointer;
      font-weight: 820;
      letter-spacing: 0;
      transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
    }

    .primary-action {
      background: #ffffff;
      color: #123323;
      box-shadow: 0 16px 42px rgba(0, 0, 0, 0.24);
    }

    .primary-action:disabled {
      cursor: wait;
      opacity: 0.78;
    }

    .secondary-action {
      border: 1px solid var(--line);
      background: #edf3e9;
      color: #183322;
    }

    .ghost-action {
      border: 1px solid rgba(255, 255, 255, 0.28);
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }

    .icon-action {
      width: 42px;
      padding: 0;
      border: 1px solid var(--line);
      background: #fff;
      color: var(--green);
    }

    .stage-board {
      display: grid;
      gap: 12px;
      align-content: end;
    }

    .thought-card, .receipt-card, .panel, .mini-card, .log-card, .plan-card, .turn-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
    }

    .thought-card {
      display: grid;
      gap: 8px;
      padding: 14px;
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      backdrop-filter: blur(14px);
    }

    .thought-card span {
      color: rgba(255, 255, 255, 0.66);
      font-size: 12px;
      font-weight: 820;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .thought-card p {
      margin: 0;
      color: rgba(255, 255, 255, 0.92);
      line-height: 1.45;
      font-size: 15px;
    }

    .receipt-rail {
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 14px;
      min-height: 548px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
      background: #fffdf7;
      box-shadow: 0 18px 50px rgba(42, 53, 37, 0.08);
    }

    .panel-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin: 0 0 12px;
    }

    .panel-title h2, .panel-title h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 17px;
      line-height: 1.2;
      letter-spacing: 0;
    }

    .muted {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.4;
    }

    .receipt-list {
      display: grid;
      gap: 10px;
      align-content: start;
    }

    .receipt-card {
      position: relative;
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr);
      gap: 10px;
      padding: 12px;
      overflow: hidden;
    }

    .receipt-card.active {
      border-color: rgba(39, 103, 73, 0.48);
      box-shadow: 0 10px 24px rgba(39, 103, 73, 0.12);
    }

    .receipt-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      background: #edf5e9;
      color: var(--green);
    }

    .receipt-card.approval .receipt-icon {
      background: #fff1dc;
      color: var(--amber);
    }

    .receipt-card.watch .receipt-icon {
      background: #e9f3f5;
      color: var(--teal);
    }

    .receipt-card strong {
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
    }

    .receipt-card p {
      margin: 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.42;
    }

    .receipt-progress {
      height: 8px;
      overflow: hidden;
      border-radius: 8px;
      background: #e8e2d5;
    }

    .receipt-progress span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--green), var(--teal), var(--amber));
    }

    .workbench {
      display: grid;
      grid-template-columns: minmax(320px, 0.82fr) minmax(0, 1.18fr);
      gap: 18px;
      margin-top: 18px;
      align-items: start;
    }

    .stack {
      display: grid;
      gap: 18px;
    }

    .panel {
      padding: 18px;
      background: #fffdf7;
      box-shadow: 0 12px 36px rgba(42, 53, 37, 0.07);
    }

    label {
      display: block;
      margin: 13px 0 6px;
      color: #445243;
      font-size: 12px;
      font-weight: 820;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    select, textarea, input {
      width: 100%;
      border: 1px solid #cbd5c4;
      border-radius: 8px;
      background: #fffefa;
      color: var(--ink);
      padding: 11px 12px;
      outline: none;
    }

    textarea {
      min-height: 170px;
      resize: vertical;
      line-height: 1.48;
    }

    select:focus, textarea:focus, input:focus {
      border-color: var(--green);
      box-shadow: 0 0 0 4px rgba(39, 103, 73, 0.12);
    }

    .sample-row, .toolbar-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .sample-row button {
      border: 1px solid #d8decf;
      border-radius: 8px;
      background: #f3f7ef;
      color: #253a2b;
      padding: 8px 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 760;
    }

    .control-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 14px;
    }

    .mini-card {
      padding: 12px;
      min-height: 86px;
      background: #fbfaf4;
    }

    .mini-card span {
      display: block;
      color: var(--muted);
      font-size: 12px;
      font-weight: 780;
      margin-bottom: 7px;
    }

    .mini-card strong {
      font-size: 21px;
      letter-spacing: 0;
    }

    .sprinkler-panel {
      position: relative;
      overflow: hidden;
    }

    .sprinkler-layout {
      display: grid;
      grid-template-columns: minmax(0, 0.86fr) minmax(220px, 0.74fr);
      gap: 14px;
      align-items: stretch;
    }

    .field-map {
      position: relative;
      min-height: 254px;
      border: 1px solid #d3dbc9;
      border-radius: 8px;
      overflow: hidden;
      background:
        linear-gradient(90deg, rgba(39, 103, 73, 0.18) 1px, transparent 1px),
        linear-gradient(rgba(39, 103, 73, 0.12) 1px, transparent 1px),
        #eaf3e3;
      background-size: 34px 34px;
    }

    .field-map::before {
      content: "";
      position: absolute;
      inset: 18px;
      border: 1px solid rgba(39, 103, 73, 0.24);
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(255,255,255,0.46), rgba(255,255,255,0.06));
    }

    .spray-line {
      position: absolute;
      left: 12%;
      right: 12%;
      height: 10px;
      border-radius: 8px;
      background: rgba(31, 111, 120, 0.88);
      box-shadow: 0 0 0 8px rgba(31, 111, 120, 0.11);
    }

    .spray-line.one {
      top: 35%;
    }

    .spray-line.two {
      top: 58%;
      background: rgba(189, 107, 20, 0.88);
      box-shadow: 0 0 0 8px rgba(189, 107, 20, 0.12);
    }

    .sprinkler-badge {
      position: absolute;
      left: 18px;
      bottom: 18px;
      right: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      border-radius: 8px;
      padding: 12px;
      background: rgba(255, 253, 247, 0.92);
      color: var(--ink);
      box-shadow: 0 12px 30px rgba(42, 53, 37, 0.12);
    }

    .schedule-stack {
      display: grid;
      gap: 10px;
    }

    .schedule-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      background: #fbfaf4;
    }

    .schedule-card.after {
      border-color: rgba(39, 103, 73, 0.42);
      background: #f0f7ec;
    }

    .schedule-card small {
      display: block;
      color: var(--muted);
      font-weight: 820;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 8px;
    }

    .schedule-time {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: baseline;
      font-weight: 860;
      font-size: 24px;
    }

    .schedule-time span {
      color: var(--muted);
      font-size: 13px;
      font-weight: 760;
    }

    .approval-chip, .priority-chip, .state-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 8px;
      min-height: 28px;
      padding: 5px 8px;
      font-size: 12px;
      font-weight: 820;
      white-space: nowrap;
    }

    .approval-chip {
      background: #fff0d8;
      color: #85440a;
    }

    .state-chip {
      background: #edf5e9;
      color: var(--green-strong);
    }

    .priority-chip.high {
      background: #ffe7e0;
      color: var(--red);
    }

    .priority-chip.medium {
      background: #fff1dc;
      color: #8a4b0c;
    }

    .priority-chip.low {
      background: #e7f0fb;
      color: var(--blue);
    }

    .plan-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .plan-card {
      display: grid;
      gap: 10px;
      min-height: 210px;
      padding: 14px;
      background: #fffefa;
    }

    .plan-card-head {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 10px;
    }

    .plan-card h3 {
      margin: 0;
      font-size: 17px;
      line-height: 1.25;
      letter-spacing: 0;
    }

    .plan-card p {
      margin: 0;
      color: #485346;
      line-height: 1.45;
      font-size: 14px;
    }

    .reason-list {
      display: grid;
      gap: 7px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .reason-list li {
      display: grid;
      grid-template-columns: 18px minmax(0, 1fr);
      gap: 7px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.35;
    }

    .log-history {
      display: grid;
      gap: 10px;
      max-height: 492px;
      overflow: auto;
      padding-right: 4px;
    }

    .log-card {
      padding: 12px;
      background: #fffefa;
    }

    .log-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 7px;
    }

    .log-card strong {
      font-size: 14px;
    }

    .log-card p {
      margin: 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.4;
    }

    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 9px;
    }

    .tag {
      border-radius: 8px;
      background: #edf3e9;
      color: #38513e;
      padding: 4px 7px;
      font-size: 12px;
      font-weight: 750;
    }

    .turn-tape {
      display: grid;
      gap: 10px;
    }

    .turn-card {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr);
      gap: 10px;
      padding: 12px;
      background: #fffefa;
    }

    .turn-avatar {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      background: #eaf3e3;
      color: var(--green);
    }

    .turn-card p {
      margin: 4px 0 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.4;
    }

    .video-frame {
      aspect-ratio: 16 / 9;
      width: 100%;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #151915;
    }

    .video-frame iframe {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
    }

    .empty {
      border: 1px dashed #c9d1c0;
      border-radius: 8px;
      padding: 18px;
      color: var(--muted);
      background: #fbfaf4;
      line-height: 1.45;
    }

    .error-box {
      margin-top: 12px;
      border: 1px solid #f0b3a6;
      border-radius: 8px;
      padding: 11px;
      background: #fff0ec;
      color: #842c1d;
      font-size: 13px;
      line-height: 1.4;
    }

    @media (max-width: 1100px) {
      .agent-shell, .workbench, .stage-grid, .sprinkler-layout {
        grid-template-columns: 1fr;
      }

      .agent-stage, .receipt-rail {
        min-height: auto;
      }

      .stage-board {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (max-width: 760px) {
      .topbar-inner {
        padding: 12px 14px;
      }

      .status-pill {
        max-width: 46vw;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      main {
        padding: 14px 14px 34px;
      }

      .stage-grid {
        padding: 20px;
      }

      .agent-stage h1 {
        font-size: 42px;
      }

      .stage-board, .plan-grid, .control-grid {
        grid-template-columns: 1fr;
      }

      .panel {
        padding: 15px;
      }

      .run-row .primary-action, .run-row .secondary-action {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <img src="/trellisai-logo.png" alt="TrellisAI logo" />
        <span>TrellisAI</span>
      </div>
      <div class="status-pill">
        <span id="statusDot" class="status-dot"></span>
        <span id="statusText">Checking farm memory</span>
      </div>
    </div>
  </div>
  <main id="agentApp"></main>

  <script type="module">
    import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
    import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
    import { AnimatePresence, LayoutGroup, motion } from "https://esm.sh/framer-motion@11.18.2?deps=react@18.3.1";
    import { Activity, Check, CheckCircle2, ClipboardCheck, Droplets, History, ListChecks, Play, Radio, Send, Sparkles, Sprout, Youtube } from "https://esm.sh/lucide-react@0.468.0?deps=react@18.3.1";

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
      return new Date().toISOString().slice(0, 10);
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

    function priorityClass(value) {
      return value === "high" ? "high" : value === "low" ? "low" : "medium";
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
      const [error, setError] = useState("");
      const [turns, setTurns] = useState([
        {
          role: "agent",
          title: "Agent standing by",
          body: "Add a daily note, then let Trellis reorder tomorrow morning."
        }
      ]);

      useEffect(function() {
        refreshState();
      }, []);

      useEffect(function() {
        const statusDot = document.getElementById("statusDot");
        const statusText = document.getElementById("statusText");
        const ready = Boolean(health && health.ok && health.mongo && health.mongo.ok);
        if (statusDot) statusDot.classList.toggle("ready", ready);
        if (statusText) statusText.textContent = ready ? "Live farm memory ready" : "Farm memory warming up";
      }, [health]);

      useEffect(function() {
        const receipts = safeArray(plan && plan.agent_receipts);
        if (!receipts.length) return undefined;
        setActiveReceipt(0);
        const timer = window.setInterval(function() {
          setActiveReceipt(function(index) {
            return index >= receipts.length - 1 ? index : index + 1;
          });
        }, 760);
        return function() {
          window.clearInterval(timer);
        };
      }, [plan]);

      const openTasks = useMemo(function() {
        return tasks.filter(function(task) {
          return task.status === "open";
        });
      }, [tasks]);

      const visibleRecommendations = safeArray(plan && plan.recommendations).length
        ? safeArray(plan && plan.recommendations)
        : recommendations.slice(0, 4);

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
        setTurns(function(current) {
          return [
            {
              role: "user",
              title: "Daily field note",
              body: rawText
            }
          ].concat(current).slice(0, 5);
        });

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
          setTurns(function(current) {
            return [
              {
                role: "agent",
                title: "Tomorrow board updated",
                body: body.answer || "The agent prepared tomorrow's plan."
              }
            ].concat(current).slice(0, 5);
          });
          await refreshState();
        } catch (err) {
          setRunState("idle");
          setError(err.message || String(err));
        }
      }

      async function approveRecommendation(rec) {
        const id = compactId(rec && rec._id);
        if (!id) return;
        setError("");
        setApprovingId(id);
        try {
          const body = await api("/api/recommendations/" + encodeURIComponent(id) + "/approve", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({})
          });
          const task = body.task && (body.task.task || body.task);
          setTurns(function(current) {
            return [
              {
                role: "agent",
                title: "Crew job approved",
                body: task && task.title ? task.title : "Approved work was added to the field board."
              }
            ].concat(current).slice(0, 5);
          });
          await refreshState();
        } catch (err) {
          setError(err.message || String(err));
        } finally {
          setApprovingId("");
        }
      }

      function useSample(sample) {
        setFieldName(sample.field);
        setRawText(sample.text);
      }

      return h(LayoutGroup, null,
        h("div", { className: "agent-shell" },
          h(AgentStage, {
            plan: plan,
            runState: runState,
            runAgent: runAgent,
            question: question,
            setQuestion: setQuestion,
            openTasks: openTasks,
            logs: logs,
            recommendations: recommendations
          }),
          h(ReceiptRail, {
            plan: plan,
            activeReceipt: activeReceipt,
            runState: runState
          })
        ),
        h("div", { className: "workbench" },
          h("div", { className: "stack" },
            h(LogComposer, {
              fieldName: fieldName,
              setFieldName: setFieldName,
              date: date,
              setDate: setDate,
              rawText: rawText,
              setRawText: setRawText,
              samples: sampleLogs,
              useSample: useSample,
              runAgent: runAgent,
              runState: runState,
              error: error
            }),
            h(TurnTape, { turns: turns }),
            h(DemoVideo, null)
          ),
          h("div", { className: "stack" },
            h(SprinklerPanel, {
              plan: plan,
              sprinklerApproved: sprinklerApproved,
              setSprinklerApproved: setSprinklerApproved
            }),
            h(PlanCards, {
              recommendations: visibleRecommendations,
              approveRecommendation: approveRecommendation,
              approvingId: approvingId
            }),
            h(LogHistory, { logs: logs })
          )
        )
      );
    }

    function AgentStage(props) {
      const plan = props.plan;
      const thoughts = safeArray(plan && plan.reasoning_summary);
      const headline = plan ? "Trellis is driving tomorrow morning" : "Trellis is ready to run the farm board";
      const answer = plan && plan.answer
        ? plan.answer
        : "Drop in a messy daily note. The agent reads it, remembers similar field days, edits the sprinkler plan, and queues work for approval.";
      const running = props.runState === "saving" || props.runState === "thinking";
      const runLabel = props.runState === "saving" ? "Saving note" : props.runState === "thinking" ? "Thinking" : "Run Trellis agent";
      const approvalCount = safeArray(props.recommendations).length;
      const stats = [
        { label: "Logs", value: safeArray(props.logs).length },
        { label: "Open jobs", value: safeArray(props.openTasks).length },
        { label: "Approvals", value: approvalCount > 9 ? "9+" : approvalCount }
      ];

      return h(motion.section, {
        className: "agent-stage",
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.52, ease: "easeOut" }
      },
        h("div", { className: "stage-grid" },
          h("div", { className: "stage-copy" },
            h("div", null,
              h(motion.div, {
                className: "agent-kicker",
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.08 }
              }, h(Sparkles, { size: 16 }), "Live agent run"),
              h(motion.h1, {
                layout: true,
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.12, duration: 0.46 }
              }, headline),
              h(motion.p, {
                className: "agent-answer",
                key: answer,
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.18 }
              }, answer)
            ),
            h("div", null,
              h("div", { className: "run-row" },
                h(motion.button, {
                  className: "primary-action",
                  type: "button",
                  onClick: props.runAgent,
                  disabled: running,
                  whileHover: running ? {} : { y: -2, scale: 1.01 },
                  whileTap: running ? {} : { scale: 0.98 }
                }, running ? h(Activity, { size: 18 }) : h(Play, { size: 18 }), runLabel),
                h(motion.label, {
                  className: "primary-action ghost-action",
                  whileHover: { y: -2 },
                  htmlFor: "question"
                }, h(Send, { size: 17 }), "Ask")
              ),
              h("label", { htmlFor: "question", style: { color: "rgba(255,255,255,0.78)" } }, "Agent prompt"),
              h("input", {
                id: "question",
                value: props.question,
                onChange: function(event) { props.setQuestion(event.target.value); },
                style: { background: "rgba(255,255,255,0.94)" }
              })
            )
          ),
          h("div", { className: "stage-board" },
            stats.map(function(stat, index) {
              return h(motion.div, {
                className: "thought-card",
                key: stat.label,
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 0.16 + index * 0.08 }
              }, h("span", null, stat.label), h("p", null, String(stat.value)));
            }),
            h(AnimatePresence, { mode: "popLayout" },
              (thoughts.length ? thoughts : [
                "The agent will choose a first field, explain why, and keep approvals in your hands.",
                "Receipts show what changed: notes read, memories used, schedule edited, jobs queued."
              ]).slice(0, 4).map(function(thought, index) {
                return h(motion.div, {
                  className: "thought-card",
                  key: thought,
                  layout: true,
                  initial: { opacity: 0, x: 22 },
                  animate: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: 10 },
                  transition: { delay: 0.24 + index * 0.06 }
                }, h("span", null, "Thought " + String(index + 1)), h("p", null, thought));
              })
            )
          )
        )
      );
    }

    function ReceiptRail(props) {
      const receipts = safeArray(props.plan && props.plan.agent_receipts);
      const fallback = [
        { label: "Read the new log", detail: "Waiting for a daily field note.", state: "watch" },
        { label: "Remembered past context", detail: "Ready to compare this note with similar field days.", state: "watch" },
        { label: "Edited sprinkler schedule", detail: "Irrigation changes appear here after the run.", state: "approval" },
        { label: "Queued approvals", detail: "Crew actions will wait for grower approval.", state: "approval" }
      ];
      const visible = receipts.length ? receipts : fallback;
      const progress = visible.length ? ((props.activeReceipt + 1) / visible.length) * 100 : 0;

      return h(motion.aside, {
        className: "receipt-rail",
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.08, duration: 0.46 }
      },
        h("div", { className: "panel-title" },
          h("h2", null, h(ClipboardCheck, { size: 18 }), "Action receipts"),
          h("span", { className: "state-chip" }, props.runState === "thinking" ? "running" : receipts.length ? "ready" : "standby")
        ),
        h("div", { className: "receipt-list" },
          visible.map(function(receipt, index) {
            const active = receipts.length && index <= props.activeReceipt;
            const className = "receipt-card " + (receipt.state || "done") + (active ? " active" : "");
            return h(motion.div, {
              className: className,
              key: receipt.label + String(index),
              initial: { opacity: 0, x: 16 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.05 + index * 0.08 },
              whileHover: { y: -2 }
            },
              h("div", { className: "receipt-icon" }, active ? h(CheckCircle2, { size: 18 }) : h(Radio, { size: 18 })),
              h("div", null, h("strong", null, receipt.label), h("p", null, receipt.detail))
            );
          })
        ),
        h("div", { className: "receipt-progress", "aria-hidden": "true" },
          h(motion.span, {
            initial: { width: "0%" },
            animate: { width: String(progress) + "%" },
            transition: { duration: 0.42 }
          })
        )
      );
    }

    function LogComposer(props) {
      const running = props.runState === "saving" || props.runState === "thinking";
      return h(motion.section, {
        className: "panel",
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.12 }
      },
        h("div", { className: "panel-title" },
          h("h2", null, h(Sprout, { size: 18 }), "Daily log"),
          h("span", { className: "state-chip" }, props.fieldName)
        ),
        h("label", { htmlFor: "fieldName" }, "Field"),
        h("select", {
          id: "fieldName",
          value: props.fieldName,
          onChange: function(event) { props.setFieldName(event.target.value); }
        },
          ["South Field", "North Field", "West Field"].map(function(field) {
            return h("option", { key: field, value: field }, field);
          })
        ),
        h("label", { htmlFor: "logDate" }, "Date"),
        h("input", {
          id: "logDate",
          value: props.date,
          onChange: function(event) { props.setDate(event.target.value); }
        }),
        h("label", { htmlFor: "rawText" }, "Grower note"),
        h("textarea", {
          id: "rawText",
          value: props.rawText,
          onChange: function(event) { props.setRawText(event.target.value); }
        }),
        h("div", { className: "sample-row" },
          props.samples.map(function(sample) {
            return h(motion.button, {
              key: sample.name,
              type: "button",
              onClick: function() { props.useSample(sample); },
              whileHover: { y: -2 },
              whileTap: { scale: 0.98 }
            }, sample.name);
          })
        ),
        h("div", { className: "toolbar-row" },
          h(motion.button, {
            className: "primary-action",
            type: "button",
            onClick: props.runAgent,
            disabled: running,
            whileHover: running ? {} : { y: -2 },
            whileTap: running ? {} : { scale: 0.98 }
          }, running ? h(Activity, { size: 18 }) : h(Play, { size: 18 }), running ? "Running" : "Run agent")
        ),
        props.error ? h("div", { className: "error-box" }, props.error) : null
      );
    }

    function SprinklerPanel(props) {
      const sprinkler = props.plan && props.plan.sprinkler_plan;
      const before = sprinkler && sprinkler.before ? sprinkler.before : { start_time: "6:30 AM", duration_minutes: 25, mode: "standard morning cycle" };
      const after = sprinkler && sprinkler.after ? sprinkler.after : { start_time: "5:15 AM", duration_minutes: 42, mode: "agent-adjusted moisture recovery", status: "ready for approval" };
      const zone = sprinkler && sprinkler.zone ? sprinkler.zone : "South road edge / lateral 2";
      const decision = sprinkler && sprinkler.decision ? sprinkler.decision : "The schedule change appears after the agent reads the daily note.";

      return h(motion.section, {
        className: "panel sprinkler-panel",
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.16 }
      },
        h("div", { className: "panel-title" },
          h("h2", null, h(Droplets, { size: 18 }), "Smart sprinkler schedule"),
          h("span", { className: props.sprinklerApproved ? "state-chip" : "approval-chip" },
            props.sprinklerApproved ? "approved" : "ready for approval"
          )
        ),
        h("div", { className: "sprinkler-layout" },
          h("div", { className: "field-map" },
            h(motion.div, {
              className: "spray-line one",
              animate: { opacity: [0.62, 1, 0.62], scaleX: [0.92, 1, 0.92] },
              transition: { duration: 2.1, repeat: Infinity, ease: "easeInOut" }
            }),
            h(motion.div, {
              className: "spray-line two",
              animate: { opacity: [0.44, 0.95, 0.44], scaleX: [0.78, 1, 0.78] },
              transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }),
            h(motion.div, {
              className: "sprinkler-badge",
              initial: { y: 14, opacity: 0 },
              animate: { y: 0, opacity: 1 }
            },
              h("div", null, h("strong", null, zone), h("div", { className: "muted" }, decision)),
              h(Droplets, { size: 22 })
            )
          ),
          h("div", { className: "schedule-stack" },
            h(ScheduleCard, { label: "Before", data: before }),
            h(ScheduleCard, { label: "After", data: after, after: true }),
            h(motion.button, {
              className: props.sprinklerApproved ? "secondary-action" : "primary-action secondary-action",
              type: "button",
              onClick: function() { props.setSprinklerApproved(!props.sprinklerApproved); },
              whileHover: { y: -2 },
              whileTap: { scale: 0.98 }
            }, props.sprinklerApproved ? h(Check, { size: 17 }) : h(Droplets, { size: 17 }), props.sprinklerApproved ? "Sprinkler edit approved" : "Approve sprinkler edit")
          )
        )
      );
    }

    function ScheduleCard(props) {
      const data = props.data || {};
      return h(motion.div, {
        className: "schedule-card" + (props.after ? " after" : ""),
        layout: true,
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
      },
        h("small", null, props.label),
        h("div", { className: "schedule-time" },
          h("strong", null, data.start_time || "6:30 AM"),
          h("span", null, String(data.duration_minutes || 25) + " min")
        ),
        h("div", { className: "muted" }, data.mode || "standard")
      );
    }

    function PlanCards(props) {
      const items = safeArray(props.recommendations).slice(0, 6);
      return h(motion.section, {
        className: "panel",
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2 }
      },
        h("div", { className: "panel-title" },
          h("h2", null, h(ListChecks, { size: 18 }), "Crew approvals"),
          h("span", { className: "state-chip" }, String(items.length) + " ready")
        ),
        items.length ? h("div", { className: "plan-grid" },
          items.map(function(rec, index) {
            const id = compactId(rec._id);
            const reasons = safeArray(rec.reasoning_summary).slice(0, 3);
            return h(motion.article, {
              className: "plan-card",
              key: id || rec.title || String(index),
              layout: true,
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.05 },
              whileHover: { y: -3 }
            },
              h("div", { className: "plan-card-head" },
                h("div", null, h("h3", null, rec.title || "Review field"), h("div", { className: "muted" }, rec.field_name || "Farm")),
                h("span", { className: "priority-chip " + priorityClass(rec.priority) }, rec.priority || "medium")
              ),
              h("p", null, rec.recommendation || "Review this recommendation before assigning the crew."),
              h("ul", { className: "reason-list" },
                reasons.map(function(reason, reasonIndex) {
                  return h("li", { key: reason + String(reasonIndex) }, h(CheckCircle2, { size: 15 }), h("span", null, reason));
                })
              ),
              h(motion.button, {
                className: "secondary-action",
                type: "button",
                onClick: function() { props.approveRecommendation(rec); },
                disabled: props.approvingId === id || rec.status === "approved",
                whileHover: rec.status === "approved" ? {} : { y: -2 },
                whileTap: rec.status === "approved" ? {} : { scale: 0.98 }
              }, rec.status === "approved" ? h(Check, { size: 16 }) : h(ClipboardCheck, { size: 16 }), rec.status === "approved" ? "Approved" : props.approvingId === id ? "Approving" : "Approve job")
            );
          })
        ) : h("div", { className: "empty" }, "Run the agent to fill this board with approval-ready work.")
      );
    }

    function LogHistory(props) {
      const logs = safeArray(props.logs).slice(0, 12);
      return h(motion.section, {
        className: "panel",
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.24 }
      },
        h("div", { className: "panel-title" },
          h("h2", null, h(History, { size: 18 }), "Log history"),
          h("span", { className: "state-chip" }, String(logs.length) + " notes")
        ),
        logs.length ? h("div", { className: "log-history" },
          logs.map(function(log, index) {
            const signals = safeArray(log.risk_signals).slice(0, 5);
            return h(motion.article, {
              className: "log-card",
              key: compactId(log._id) || String(index),
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.035 }
            },
              h("div", { className: "log-meta" },
                h("strong", null, log.field_name || "Field"),
                h("span", { className: "muted" }, log.date || "")
              ),
              h("p", null, log.raw_text || log.embedding_text || "No note text available."),
              signals.length ? h("div", { className: "tag-row" },
                signals.map(function(signal) {
                  return h("span", { className: "tag", key: signal }, String(signal).replace(/_/g, " "));
                })
              ) : null
            );
          })
        ) : h("div", { className: "empty" }, "Daily notes will appear here after the first run.")
      );
    }

    function TurnTape(props) {
      return h(motion.section, {
        className: "panel",
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2 }
      },
        h("div", { className: "panel-title" },
          h("h2", null, h(Activity, { size: 18 }), "Multi-turn run"),
          h("span", { className: "state-chip" }, "live")
        ),
        h("div", { className: "turn-tape" },
          safeArray(props.turns).map(function(turn, index) {
            return h(motion.article, {
              className: "turn-card",
              key: turn.title + String(index),
              initial: { opacity: 0, x: -12 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: index * 0.05 }
            },
              h("div", { className: "turn-avatar" }, turn.role === "user" ? h(Send, { size: 17 }) : h(Sparkles, { size: 17 })),
              h("div", null, h("strong", null, turn.title), h("p", null, turn.body))
            );
          })
        )
      );
    }

    function DemoVideo() {
      return h(motion.section, {
        className: "panel",
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.24 }
      },
        h("div", { className: "panel-title" },
          h("h2", null, h(Youtube, { size: 18 }), "Demo reel"),
          h("a", { className: "muted", href: "https://youtu.be/EE6EDAMAjEI", target: "_blank", rel: "noreferrer" }, "Open on YouTube")
        ),
        h("div", { className: "video-frame" },
          h("iframe", {
            src: demoVideoUrl,
            title: "TrellisAI demo video",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowFullScreen: true
          })
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
