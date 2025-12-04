// App.jsx (or app.js)
import React, { useState } from "react";

const WORKFLOWS = [
  {
    id: "w1",
    name: "Sector Risk Scan – East High",
    category: "Safety Intelligence",
    status: "Operational",
    description:
      "Continuously scans East High en-route sector for loss-of-separation risk, unstable altitudes, and non-conforming tracks.",
    nodes: [
      "Ingest ADS-B stream",
      "Merge flight plan data",
      "Predict sector density",
      "Score risk per track",
      "Push alerts to tower",
    ],
    metrics: {
      sector: "ZTL East High",
      update: "Every 3 seconds",
      nodes: 23,
      workflows: 9,
    },
  },
  {
    id: "w2",
    name: "Approach Stabilization Watch – KATL",
    category: "Terminal Operations",
    status: "Elevated",
    description:
      "Monitors arrival traffic for unstable approaches, late configuration, and rapid altitude changes inside the terminal area.",
    nodes: [
      "Terminal radar ingest",
      "Approach path model",
      "Glideslope deviation check",
      "Rate-of-descent anomaly check",
      "Generate safety advisory",
    ],
    metrics: {
      sector: "KATL TRACON",
      update: "Every 1 second",
      nodes: 31,
      workflows: 16,
    },
  },
  {
    id: "w3",
    name: "Surface Movement Guardian",
    category: "Ground / Surface",
    status: "Operational",
    description:
      "Surveillance over ground radar and clearances to detect runway incursions, conflicting taxi instructions, and late lineup.",
    nodes: [
      "ASDE-X ingest",
      "Runway occupancy model",
      "Taxi route prediction",
      "Incursion rule engine",
      "Dispatch tower alert",
    ],
    metrics: {
      sector: "KJFK Ground",
      update: "Every 2 seconds",
      nodes: 27,
      workflows: 21,
    },
  },
  {
    id: "w4",
    name: "Weather Impact Corridor Planner",
    category: "Flow Management",
    status: "Advisory",
    description:
      "Combines convective weather, jet stream, and traffic flows to propose safer, fuel-aware corridors for ATC and dispatch.",
    nodes: [
      "NOAA feed ingest",
      "SIGMET filter",
      "Traffic density map",
      "Route corridor optimizer",
      "Decision support summary",
    ],
    metrics: {
      sector: "US East Coast",
      update: "Every 5 minutes",
      nodes: 35,
      workflows: 18,
    },
  },
];

const AIRCRAFT_TRACKS = [
  {
    callsign: "DAL428",
    risk: "Medium",
    riskLevel: "medium",
    origin: "KATL",
    destination: "KJFK",
    fl: 340,
    speed: 462,
    heading: 47,
    phase: "En-route",
  },
  {
    callsign: "UAL731",
    risk: "Elevated",
    riskLevel: "elevated",
    origin: "KORD",
    destination: "KBOS",
    fl: 336,
    speed: 448,
    heading: 52,
    phase: "En-route",
  },
  {
    callsign: "SWA912",
    risk: "Low",
    riskLevel: "low",
    origin: "KMCO",
    destination: "KATL",
    fl: 290,
    speed: 430,
    heading: 318,
    phase: "Arrival",
  },
  {
    callsign: "JBU101",
    risk: "Low",
    riskLevel: "low",
    origin: "KBOS",
    destination: "KFLL",
    fl: 370,
    speed: 474,
    heading: 203,
    phase: "En-route",
  },
];

const AGENTS = [
  {
    id: "a1",
    name: "Sector Watch Agent",
    status: "Healthy",
    layer: "Layer 8 – Flight Tracking",
    role: "Monitors all tagged sectors and flags early signs of separation loss, altitude deviations, and track anomalies.",
    load: "41%",
    lastAction: "Re-scored 124 tracks in ZTL East High.",
  },
  {
    id: "a2",
    name: "Safety Intelligence Agent",
    status: "Healthy",
    layer: "Layer 7 – Safety Intelligence",
    role: "Converts raw events into safety intelligence, risk scores, and controller-friendly summaries.",
    load: "63%",
    lastAction: "Generated 4 high-priority advisories for terminal operations.",
  },
  {
    id: "a3",
    name: "Weather Impact Agent",
    status: "Elevated",
    layer: "Layer 6 – Prediction",
    role: "Merges convective weather, winds aloft, and traffic density into corridor and reroute suggestions.",
    load: "78%",
    lastAction:
      "Pushed corridor re-route options around developing CB line near ZNY.",
  },
  {
    id: "a4",
    name: "Workflow Orchestrator Agent",
    status: "Healthy",
    layer: "Layer 14 – Workflow Engine",
    role: "Keeps 1,600+ workflows synchronized, versioned, and coordinated across 30 AI layers and 3,000+ nodes.",
    load: "52%",
    lastAction:
      "Rebalanced safety vs. flow automation priority during peak push at ATL.",
  },
];

const TECH_FAQ = [
  {
    q: "How old is the codebase and what standards does it follow?",
    a: "Development begins in 2025 using modern Node.js, React, Python ML services, containerized microservices, and a clean monorepo structure. No legacy baggage, no deprecated frameworks, and no external contributors.",
  },
  {
    q: "How is the architecture organized for audits?",
    a: "OmniFlight AI is structured as Layers → Modules → Workflows → Nodes. 30 layers, 425+ modules, 1,600+ workflows, and 3,000+ nodes are all documented and traceable for code, security, and scaling audits.",
  },
  {
    q: "Can this be commercialized as a SaaS platform?",
    a: "Yes. The system is ready for tenant-based SaaS or on-prem deployments, with Dockerized services, API gateways, and separation of concerns between data, AI, workflows, and the UI.",
  },
  {
    q: "What about IP ownership and licensing?",
    a: "The platform is built entirely in-house, using only MIT / Apache-style permissive OSS. No GPL, no third-party agencies, no proprietary datasets. It is clean IP that can be transferred safely to a buyer.",
  },
  {
    q: "Does it require live aviation data to operate?",
    a: "No. OmniFlight AI can run in simulation mode, against replayed recordings, or plugged into live ADS-B, METAR/TAF, and weather APIs when the buyer is ready.",
  },
  {
    q: "Is the project ready for deep technical due-diligence?",
    a: "Yes. It includes architecture diagrams, workflow maps, module breakdowns, deployment guides, environment examples, and a full technical due-diligence FAQ prepared specifically for buyers, CTOs, and safety leads.",
  },
];

function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(WORKFLOWS[0].id);
  const [demoStep, setDemoStep] = useState(1);
  const [lastCommand, setLastCommand] = useState(null);
  const [commandLog, setCommandLog] = useState([]);
  const [techDrawerOpen, setTechDrawerOpen] = useState(false);

  const selectedWorkflow =
    WORKFLOWS.find((wf) => wf.id === selectedWorkflowId) || WORKFLOWS[0];

  function issueCommand(type, text) {
    const time = formatTime();
    const entry = { time, type, text };
    setLastCommand(entry);
    setCommandLog((prev) => [entry, ...prev].slice(0, 8));
  }

  function renderNav() {
    const pages = [
      { id: "dashboard", label: "Dashboard" },
      { id: "workflows", label: "Workflows" },
      { id: "radar", label: "Live Radar" },
      { id: "demo", label: "Demo Mode" },
      { id: "agents", label: "AI Agents" },
      { id: "settings", label: "Settings" },
      { id: "techfaq", label: "Technical FAQ" },
      { id: "legal", label: "Legal & Ownership" },
    ];

    return (
      <header className="top-nav">
        <div className="top-nav-left">
          <div className="brand-mark">OFAI</div>
          <div>
            <div className="brand-name">OmniFlight AI</div>
            <div className="brand-subtitle">
              Multi-Layer Air-Traffic Intelligence • 30 Layers • 1,600+
              Workflows
            </div>
          </div>
        </div>
        <div className="top-nav-right">
          {pages.map((p) => (
            <button
              key={p.id}
              className={"nav-link" + (activePage === p.id ? " active" : "")}
              onClick={() => setActivePage(p.id)}
            >
              {p.label}
            </button>
          ))}
          <button className="nav-link" onClick={() => setTechDrawerOpen(true)}>
            Due-Diligence Drawer
          </button>
        </div>
      </header>
    );
  }

  function renderDashboard() {
    return (
      <div className="page">
        <div className="page-header">
          <h1>ATC Operations Dashboard</h1>
          <p>
            FAA-style operational view of layers, workflows, and active sectors.
            Built to give supervisors, CTOs, and safety leads a clean overview
            of a 30-layer aviation AI stack.
          </p>
        </div>

        {/* Hero panel */}
        <section className="section hero-panel">
          <div className="hero-main">
            <h2>A Clean, Multi-Layer Air-Traffic Intelligence Platform</h2>
            <p>
              OmniFlight AI is designed as an end-to-end air-traffic
              intelligence engine: 30 AI layers, 425+ modules, 1,600+ workflows,
              and 3,000+ nodes dedicated to monitoring, prediction, safety, and
              automation.
            </p>
            <ul className="hero-bullets">
              <li>
                Unified view of en-route, terminal, and surface operations.
              </li>
              <li>
                Predictive safety scores before controllers see visible risk.
              </li>
              <li>
                Multi-agent automation that complements human ATC, not replaces
                it.
              </li>
            </ul>
          </div>
          <div className="hero-side">
            <div className="hero-metric-pill">
              <span className="hero-metric-label">Architecture Scale</span>
              <span className="hero-metric-value">
                30 Layers • 425+ Modules
              </span>
            </div>
            <div className="hero-grid-metrics">
              <div className="hero-mini-metric">
                <div className="hero-mini-value">1,600+</div>
                <div className="hero-mini-label">ATC Workflows</div>
              </div>
              <div className="hero-mini-metric">
                <div className="hero-mini-value">3,000+</div>
                <div className="hero-mini-label">Automation Nodes</div>
              </div>
              <div className="hero-mini-metric">
                <div className="hero-mini-value">24/7</div>
                <div className="hero-mini-label">Multi-Agent Monitoring</div>
              </div>
            </div>
            <div className="hero-side-status">
              <div className="status-label-row">
                <span className="status-label">OmniFlight AI Runtime</span>
                <span className="status-pill status-operational">
                  Simulated • Green
                </span>
              </div>
              <ul className="hero-status-list">
                <li>
                  <span>En-route:</span>
                  <span>Sector risk scoring every 3s</span>
                </li>
                <li>
                  <span>Terminal:</span>
                  <span>Approach stability & runway safety checks</span>
                </li>
                <li>
                  <span>Surface:</span>
                  <span>Ground movement & incursion watch</span>
                </li>
              </ul>
              <div className="hero-timestamp">
                Last simulated update: {formatTime()}
              </div>
            </div>
          </div>
        </section>

        {/* Architecture stats */}
        <section className="section stats-section">
          <div className="section-header">
            <h2>Architecture Summary</h2>
            <p>
              Enterprise-scale blueprint using your standard pattern: Layers →
              Modules → Workflows → Nodes.
            </p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">AI Layers</div>
              <div className="stat-value">30</div>
              <div className="stat-description">
                From monorepo & data to safety, monitoring, DevOps, and
                governance.
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Modules</div>
              <div className="stat-value">425+</div>
              <div className="stat-description">
                Flight tracking, prediction, weather, safety scoring, DevOps, &
                more.
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Workflows</div>
              <div className="stat-value">1,600+</div>
              <div className="stat-description">
                ATC operations, safety automation, reporting, and system health.
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Nodes</div>
              <div className="stat-value">3,000+</div>
              <div className="stat-description">
                n8n, Docker, API, and ML nodes orchestrated across the full
                stack.
              </div>
            </div>
          </div>
        </section>

        {/* Strips + mini radar */}
        <section className="section strip-radar-layout">
          <div className="strip-panel">
            <div className="section-header">
              <h2>Active Flight Progress Strips (Simulated)</h2>
              <p>
                Digital flight strips for the four sample flights tracked in the
                radar view. Controllers see at-a-glance phase, route, and AI
                annotations.
              </p>
            </div>
            <div className="strip-scroll">
              {AIRCRAFT_TRACKS.map((ac) => (
                <div key={ac.callsign} className="strip-card">
                  <div className="strip-row-primary">
                    <div>
                      <div className="strip-callsign">{ac.callsign}</div>
                      <div className="strip-phase">{ac.phase}</div>
                    </div>
                    <span className="strip-ai-tag">AI Risk: {ac.risk}</span>
                  </div>
                  <div className="strip-row-secondary">
                    <span>
                      {ac.origin} → {ac.destination}
                    </span>
                    <span>
                      FL{ac.fl} · {ac.speed} KT
                    </span>
                  </div>
                  <div className="strip-row-footer">
                    <span>HDG {ac.heading}°</span>
                    <span>Monitored by Sector Watch Agent</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mini-radar-panel">
            <div className="section-header">
              <h2>Mini Sector Radar – East High</h2>
              <p>
                FAA-style sector picture with AI risk overlays. Buyers can wire
                this directly to their own feeds on day one.
              </p>
            </div>
            <div className="mini-radar-screen">
              <div className="mini-radar-grid" />
              <div className="mini-radar-sweep" />
              <div className="mini-radar-blip mini-radar-blip-one" />
              <div className="mini-radar-blip mini-radar-blip-two" />
              <div className="mini-radar-blip mini-radar-blip-three" />
            </div>
            <div className="mini-radar-caption">
              Simulated radar using sector geometry. AI adds risk color, trend
              indicators, and early warning before human-visible events.
            </div>
          </div>
        </section>
      </div>
    );
  }

  function renderWorkflows() {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Workflow Engine – 1,600+ ATC Workflows</h1>
          <p>
            Each workflow is a named, documented automation chain: safety
            checks, congestion prediction, documentation, reporting, and more.
            All organized for buyers to audit and extend.
          </p>
        </div>

        <section className="section workflows-layout">
          <div className="workflows-list">
            <div className="workflow-filter-row">
              <span className="sim-tag">
                Filter by: Terminal • En-route • Surface
              </span>
            </div>
            {WORKFLOWS.map((wf) => (
              <div
                key={wf.id}
                className={
                  "workflow-list-item" +
                  (wf.id === selectedWorkflowId ? " selected" : "")
                }
                onClick={() => setSelectedWorkflowId(wf.id)}
              >
                <div className="workflow-list-title">{wf.name}</div>
                <div className="workflow-list-meta">
                  <span>{wf.category}</span>
                  <span>Status: {wf.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="workflow-detail">
            <div className="workflow-detail-header">
              <div>
                <h2>{selectedWorkflow.name}</h2>
                <p>{selectedWorkflow.description}</p>
              </div>
              <div className="workflow-detail-header-actions">
                <button
                  className="primary-button"
                  onClick={() =>
                    issueCommand(
                      "Simulation",
                      `Run simulation: ${selectedWorkflow.name}`
                    )
                  }
                >
                  Run Simulation
                </button>
                <button
                  className="secondary-button"
                  onClick={() =>
                    issueCommand(
                      "Snapshot",
                      `Export workflow snapshot: ${selectedWorkflow.name}`
                    )
                  }
                >
                  Export Snapshot
                </button>
              </div>
            </div>

            <div className="workflow-detail-meta">
              <div className="meta-item">
                <div className="meta-label">Category</div>
                <div className="meta-value">{selectedWorkflow.category}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Status</div>
                <div className="meta-value">{selectedWorkflow.status}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Sector / Context</div>
                <div className="meta-value">
                  {selectedWorkflow.metrics.sector}
                </div>
              </div>
            </div>

            <div className="node-chain-visual">
              {selectedWorkflow.nodes.map((node, idx) => (
                <React.Fragment key={node}>
                  <span
                    className={
                      "node-pill" + (idx === 0 ? " node-pill-active" : "")
                    }
                  >
                    {node}
                  </span>
                  {idx < selectedWorkflow.nodes.length - 1 && (
                    <span className="node-arrow">➜</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="node-chain-raw">
              Node chain: {selectedWorkflow.nodes.join(" → ")}
            </div>

            <div className="workflow-graph">
              <div className="workflow-graph-row">
                <div className="workflow-graph-node">
                  <div className="workflow-graph-node-label">ADS-B ingest</div>
                </div>
                <div className="workflow-graph-connector">
                  <span className="workflow-graph-connector-line" />
                </div>
                <div className="workflow-graph-node">
                  <div className="workflow-graph-node-label">
                    Risk model &amp; scoring
                  </div>
                </div>
                <div className="workflow-graph-connector">
                  <span className="workflow-graph-connector-line" />
                </div>
                <div className="workflow-graph-node">
                  <div className="workflow-graph-node-label">
                    Alert &amp; documentation
                  </div>
                </div>
              </div>
            </div>

            <div className="workflow-metrics-grid">
              <div className="workflow-metric-card">
                <div className="workflow-metric-label">Update cadence</div>
                <div className="workflow-metric-value">
                  {selectedWorkflow.metrics.update}
                </div>
              </div>
              <div className="workflow-metric-card">
                <div className="workflow-metric-label">Nodes in chain</div>
                <div className="workflow-metric-value">
                  {selectedWorkflow.metrics.nodes}
                </div>
              </div>
              <div className="workflow-metric-card">
                <div className="workflow-metric-label">Related workflows</div>
                <div className="workflow-metric-value">
                  {selectedWorkflow.metrics.workflows}
                </div>
              </div>
              <div className="workflow-metric-card">
                <div className="workflow-metric-label">Layer coverage</div>
                <div className="workflow-metric-value">
                  Layers 6–9: Prediction &amp; Tracking
                </div>
              </div>
            </div>

            <div className="simulation-layout">
              <div className="simulation-tags">
                <span className="sim-tag">Simulation-ready</span>
                <span className="sim-tag">Exportable to training mode</span>
                <span className="sim-tag">Documented for auditors</span>
              </div>
              <button
                className="secondary-button"
                onClick={() => setActivePage("demo")}
              >
                Open Buyer Demo Mode
              </button>
            </div>

            <div className="workflow-footnote">
              Buyers see exactly how risks are detected, scored, and surfaced —
              every step is audit-visible, not a black box.
            </div>
          </div>
        </section>
      </div>
    );
  }

  function renderRadar() {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Live Airspace Radar (Simulated)</h1>
          <p>
            FAA-style tactical radar screen for East High sector. AI overlays
            risk scoring on top of the picture controllers already know —
            tracks, altitude, heading, and separation.
          </p>
        </div>

        <section className="section radar-layout">
          <div className="radar-screen-card">
            <div className="radar-header-row">
              <div>
                <div className="radar-title">Sector View: East High</div>
                <div className="radar-subtitle">
                  AI-assisted conflict detection for high-altitude en-route
                  traffic.
                </div>
              </div>
              <div className="radar-mode-toggle">
                <button className="chip-button chip-button-active">
                  En-route
                </button>
                <button className="chip-button">Terminal</button>
                <button className="chip-button">Surface</button>
              </div>
            </div>

            <div className="mode-description-bar">
              <span className="mode-label">Mode:</span>
              <span className="mode-text">
                En-route focuses on high-altitude separation, sector load, and
                crossing restrictions. Terminal and Surface modes reconfigure
                the same engine around approach stability and runway/taxi
                safety.
              </span>
            </div>

            <div className="radar-screen">
              <div className="radar-grid" />
              <div className="radar-sweep" />

              <div
                className="radar-blip radar-blip-elevated"
                style={{ top: "40%", left: "65%" }}
              >
                <div className="radar-conflict-ring" />
                <span className="radar-blip-label">
                  UAL731
                  <span className="radar-blip-alt">FL336</span>
                </span>
                <div className="radar-trajectory-line" />
              </div>

              <div
                className="radar-blip radar-blip-medium"
                style={{ top: "28%", left: "48%" }}
              >
                <span className="radar-blip-label">
                  DAL428
                  <span className="radar-blip-alt">FL340</span>
                </span>
              </div>

              <div
                className="radar-blip radar-blip-low"
                style={{ top: "68%", left: "38%" }}
              >
                <span className="radar-blip-label">
                  SWA912
                  <span className="radar-blip-alt">FL290</span>
                </span>
              </div>

              <div
                className="radar-blip radar-blip-low"
                style={{ top: "53%", left: "30%" }}
              >
                <span className="radar-blip-label">
                  JBU101
                  <span className="radar-blip-alt">FL370</span>
                </span>
              </div>
            </div>

            <div className="radar-caption">
              Radar + ADS-B + AI: controllers still work from the same radar,
              but the system pre-scores risk using separation, weather,
              procedures, and sector workload.
            </div>

            <div className="atc-command-bar">
              <div className="atc-command-label">
                ATC Command Bar – Simulated tower/center actions powered by
                OmniFlight AI.
              </div>
              <div className="atc-command-buttons">
                <button
                  className="atc-command-button atc-command-button-alert"
                  onClick={() =>
                    issueCommand(
                      "Alert",
                      "Issue traffic alert and vector UAL731 for crossing conflict."
                    )
                  }
                >
                  Trigger UAL731 Traffic Alert
                </button>
                <button
                  className="atc-command-button"
                  onClick={() =>
                    issueCommand(
                      "Flow",
                      "Propose reroute for DAL428 to reduce sector complexity."
                    )
                  }
                >
                  Suggest DAL428 Reroute
                </button>
                <button
                  className="atc-command-button"
                  onClick={() =>
                    issueCommand(
                      "Safety",
                      "Generate safety snapshot for current sector state."
                    )
                  }
                >
                  Generate Safety Snapshot
                </button>
                <button
                  className="atc-command-button"
                  onClick={() =>
                    issueCommand(
                      "Training",
                      "Export current scenario to training replay deck."
                    )
                  }
                >
                  Export to Training Scenario
                </button>
              </div>

              <div className="atc-command-meta-row">
                <div className="atc-command-last">
                  <div className="atc-command-last-label">
                    Last simulated command:
                  </div>
                  <div className="atc-command-last-text">
                    {lastCommand ? (
                      <>
                        [{lastCommand.time}] {lastCommand.type}:{" "}
                        {lastCommand.text}
                      </>
                    ) : (
                      <span className="atc-command-last-placeholder">
                        No commands issued yet – use the buttons above to
                        simulate ATC actions.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="command-log">
                <div className="command-log-header">Recent command log</div>
                {commandLog.length === 0 ? (
                  <div className="command-log-empty">
                    Log will populate as soon as you trigger a simulated ATC
                    action.
                  </div>
                ) : (
                  <ul className="command-log-list">
                    {commandLog.map((entry, idx) => (
                      <li key={idx}>
                        <span className="command-log-time">{entry.time}</span>
                        <span className="command-log-type">{entry.type}</span>
                        <span>{entry.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <aside className="radar-sidebar-card">
            <h2>Tracked Aircraft Snapshot</h2>
            <p>
              Each track carries a live risk score based on separation, weather,
              procedure conformance, and sector workload.
            </p>

            <ul className="radar-list">
              {AIRCRAFT_TRACKS.map((ac) => (
                <li key={ac.callsign} className="radar-list-item">
                  <div className="radar-list-main">
                    <span className="radar-list-callsign">{ac.callsign}</span>
                    <span
                      className={
                        "radar-risk-pill " +
                        (ac.riskLevel === "low"
                          ? "radar-risk-low"
                          : ac.riskLevel === "medium"
                          ? "radar-risk-medium"
                          : "radar-risk-elevated")
                      }
                    >
                      {ac.risk} risk
                    </span>
                  </div>
                  <div className="radar-list-meta">
                    <span>
                      {ac.origin} → {ac.destination}
                    </span>
                    <span>
                      FL{ac.fl} · {ac.speed} KT · HDG {ac.heading}°
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="strip-rack-panel">
              <h3>Strip Rack – Sector East High</h3>
              <p>
                Compact digital strip view mirroring what controllers work with
                on paper or electronic strips today.
              </p>
              <div className="strip-rack">
                {AIRCRAFT_TRACKS.map((ac) => (
                  <div key={ac.callsign} className="strip-rack-strip">
                    <div className="strip-rack-top-row">
                      <span className="strip-rack-callsign">{ac.callsign}</span>
                      <span className="strip-rack-route">
                        {ac.origin} → {ac.destination}
                      </span>
                    </div>
                    <div className="strip-rack-mid-row">
                      <span>FL{ac.fl}</span>
                      <span>{ac.speed} KT</span>
                      <span>HDG {ac.heading}°</span>
                    </div>
                    <div className="strip-rack-bottom-row">
                      <span>{ac.phase}</span>
                      <span className="strip-rack-tag">
                        AI: {ac.risk} • normalized
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="radar-ops-block">
              <h3>Technology-Based Monitoring</h3>
              <p>
                OmniFlight AI sits on top of the same core technologies used in
                ATC today, but it fuses and automates them:
              </p>
              <ul className="ops-list">
                <li>
                  Radar and ADS-B targets for position, altitude, and airspeed.
                </li>
                <li>
                  Flight progress strip logic for sequencing, coordination, and
                  hand-offs.
                </li>
                <li>
                  Computer displays integrating radar, ADS-B, flight plans, and
                  weather into one unified picture.
                </li>
              </ul>
              <div className="radar-note">
                The buyer can plug in their own radar/ADS-B sources and flight
                plan feeds without changing the UI – it is already wired for
                that future.
              </div>
            </div>
          </aside>
        </section>
      </div>
    );
  }

  function renderDemo() {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Buyer Demo Mode</h1>
          <p>
            A guided narrative you can walk a buyer through in 5–10 minutes:
            architecture, live radar, workflows, and technical due-diligence in
            one smooth story.
          </p>
        </div>

        <section className="section demo-section">
          <div className="demo-controls-row">
            <button
              className={
                "chip-button" + (demoStep === 1 ? " chip-button-active" : "")
              }
              onClick={() => setDemoStep(1)}
            >
              Step 1 – Architecture
            </button>
            <button
              className={
                "chip-button" + (demoStep === 2 ? " chip-button-active" : "")
              }
              onClick={() => setDemoStep(2)}
            >
              Step 2 – Radar & Strips
            </button>
            <button
              className={
                "chip-button" + (demoStep === 3 ? " chip-button-active" : "")
              }
              onClick={() => setDemoStep(3)}
            >
              Step 3 – Workflows & Agents
            </button>
            <button
              className={
                "chip-button" + (demoStep === 4 ? " chip-button-active" : "")
              }
              onClick={() => setDemoStep(4)}
            >
              Step 4 – Technical Due-Diligence
            </button>
          </div>

          <div className="demo-layout">
            <div className="demo-step-panel">
              <div className="demo-step-header">
                <div className="demo-step-index">
                  Active demo step: {demoStep} of 4
                </div>
                <h2>
                  {demoStep === 1 && "Show them the architecture scale first"}
                  {demoStep === 2 &&
                    "Then show them the radar and strip realism"}
                  {demoStep === 3 &&
                    "Next: workflows and AI agents doing the work"}
                  {demoStep === 4 &&
                    "Finish with the due-diligence and IP story"}
                </h2>
              </div>
              {demoStep === 1 && (
                <p className="demo-step-detail">
                  Start on the Dashboard. Emphasize 30 layers, 425+ modules,
                  1,600+ workflows, and 3,000+ nodes. Explain that everything is
                  structured as Layers → Modules → Workflows → Nodes so their
                  internal teams can extend, audit, and commercialize it as
                  SaaS.
                </p>
              )}
              {demoStep === 2 && (
                <p className="demo-step-detail">
                  Move to the Radar page. Point out how the picture mirrors the
                  way controllers already work — radar targets, flight strips,
                  and sector views — but with AI risk overlays on top. The
                  system doesn't replace ATC, it makes their job safer and
                  lighter.
                </p>
              )}
              {demoStep === 3 && (
                <p className="demo-step-detail">
                  Open the Workflows page and show a concrete automation chain:
                  ingest data, analyze patterns, score risk, generate alerts,
                  and write documentation. Then highlight the AI Agents page
                  where you can explain that different agents watch safety,
                  weather, workflows, and system health.
                </p>
              )}
              {demoStep === 4 && (
                <p className="demo-step-detail">
                  Open the Technical FAQ and the Due-Diligence Drawer. Tell them
                  the system is clean IP, built in-house, with a modern
                  monorepo, Docker, Kubernetes-ready layout, and full
                  documentation: architecture diagrams, deployment guides,
                  workflows, and buyer packet.
                </p>
              )}
              <div className="demo-hint">
                Hint: you can jump between tabs live while talking through these
                points. The UI is scripted for your story.
              </div>
            </div>

            <div className="demo-steps-list">
              <h3>Suggested talk-track for a live call</h3>
              <ol>
                <li
                  className={
                    demoStep === 1
                      ? "demo-step-item demo-step-item-active"
                      : "demo-step-item"
                  }
                >
                  Open the Dashboard • explain the architecture & scale.
                </li>
                <li
                  className={
                    demoStep === 2
                      ? "demo-step-item demo-step-item-active"
                      : "demo-step-item"
                  }
                >
                  Jump to Radar • walk them through East High and the risk
                  overlays.
                </li>
                <li
                  className={
                    demoStep === 3
                      ? "demo-step-item demo-step-item-active"
                      : "demo-step-item"
                  }
                >
                  Show Workflows & AI Agents • prove automation and
                  explainability.
                </li>
                <li
                  className={
                    demoStep === 4
                      ? "demo-step-item demo-step-item-active"
                      : "demo-step-item"
                  }
                >
                  End on Technical FAQ & Due-Diligence Drawer • answer every CTO
                  / safety question before they ask it.
                </li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    );
  }

  function renderAgents() {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Multi-Agent AI Operations</h1>
          <p>
            OmniFlight AI runs a fleet of cooperating agents: monitoring,
            safety, prediction, documentation, and workflow orchestration
            working together across all 30 layers.
          </p>
        </div>

        <section className="section">
          <div className="section-header">
            <h2>Autonomous Agents Watching the Sky 24/7</h2>
            <p>
              Each agent has a clear role, layer, and scope. Buyers can add more
              using the same node and workflow catalog.
            </p>
          </div>
          <div className="agents-grid">
            {AGENTS.map((agent) => (
              <div key={agent.id} className="agent-card">
                <div className="agent-card-header">
                  <div className="agent-name">{agent.name}</div>
                  <span
                    className={
                      "agent-status-pill " +
                      (agent.status === "Healthy"
                        ? "agent-status-healthy"
                        : "agent-status-elevated")
                    }
                  >
                    {agent.status}
                  </span>
                </div>
                <div className="agent-layer">{agent.layer}</div>
                <div className="agent-role">{agent.role}</div>
                <div className="agent-footer">
                  <span>Current load</span>
                  <span className="agent-load-value">{agent.load}</span>
                </div>
                <div className="agent-last-action">
                  Last action: <span>{agent.lastAction}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Integration & Settings Overview</h1>
          <p>
            Static integration map explaining how OmniFlight AI can plug into an
            existing ANSP, airline, or airport environment using standard APIs
            and feeds.
          </p>
        </div>

        <section className="section">
          <div className="section-header">
            <h2>Model Providers</h2>
            <p>
              AI engines that can be wired into OmniFlight AI for prediction and
              NLU.
            </p>
          </div>
          <ul className="settings-list">
            <li>
              <strong>Internal Aviation Models</strong>
              <span>
                Python-based models for risk scoring, trajectory analysis, and
                approach stability, trained on aviation-style data.
              </span>
            </li>
            <li>
              <strong>LLM Providers (optional)</strong>
              <span>
                Used for explanation, documentation drafts, and supervisor-level
                summaries – not for core safety decisions.
              </span>
            </li>
          </ul>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Data Sources</h2>
            <p>
              Designed around standard aviation feeds, all replaceable by buyer
              equivalents.
            </p>
          </div>
          <ul className="settings-list">
            <li>
              <strong>Radar & ADS-B</strong>
              <span>
                Track position, altitude, heading, and speed from standard
                en-route and terminal radars plus ADS-B streams.
              </span>
            </li>
            <li>
              <strong>Flight Plans</strong>
              <span>
                Route, requested FL, and schedule from existing flight plan
                systems to support conformance checks and prediction.
              </span>
            </li>
            <li>
              <strong>Weather (METAR/TAF / NOAA)</strong>
              <span>
                Weather feeds for crosswinds, visibility, storms, and convective
                SIGMET regions affecting approach and en-route safety.
              </span>
            </li>
          </ul>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Node Types (Examples)</h2>
            <p>
              Out of 3,000+ nodes, these are the key families a buyer will see
              in the catalog.
            </p>
          </div>
          <ul className="settings-list">
            <li>
              <strong>Ingest Nodes</strong>
              <span>
                Radar, ADS-B, flight plan, weather, and log ingestion.
              </span>
            </li>
            <li>
              <strong>Safety & Risk Nodes</strong>
              <span>
                Separation checks, approach stability, altitude/heading anomaly
                detection, runway incursion detection.
              </span>
            </li>
            <li>
              <strong>Automation Nodes</strong>
              <span>
                Alert generation, supervisor dashboards, incident reports, and
                training replay exports.
              </span>
            </li>
            <li>
              <strong>DevOps & Health Nodes</strong>
              <span>
                Service health checks, autoscaling hints, and
                logging/correlation nodes across the 30-layer stack.
              </span>
            </li>
          </ul>
        </section>
      </div>
    );
  }

  function renderTechFaq() {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Technical Due-Diligence FAQ</h1>
          <p>
            Pre-answers to the questions every serious buyer, CTO, or safety
            lead will ask before they sign. This mirrors the written technical
            FAQ in your buyer packet.
          </p>
        </div>

        <section className="section faq-section">
          <div className="faq-grid">
            {TECH_FAQ.map((item, idx) => (
              <div key={idx} className="faq-card">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
          <div className="faq-footnote">
            The live codebase includes: monorepo layout, backend services,
            workflow definitions, n8n flows, Docker files, Kubernetes manifests,
            documentation, and a full IP transfer-ready folder structure.
          </div>
        </section>
      </div>
    );
  }

  function renderLegal() {
    const year = new Date().getFullYear();
    return (
      <div className="page">
        <div className="page-header">
          <h1>Legal & Ownership Notice</h1>
          <p>
            Formal documentation of authorship, intellectual property ownership,
            licensing terms, and transfer conditions for the OmniFlight AI
            system.
          </p>
        </div>

        <section className="section legal-section">
          <div className="legal-block">
            <h2>Software Ownership Statement</h2>
            <p>
              OmniFlight AI is an original software product independently
              conceptualized, architected, designed, and authored by{" "}
              <strong>Maria Robles</strong>. All source code, architecture
              definitions, workflow catalogs, UI components, AI logic
              descriptions, documentation, graphics, system design, and
              supporting materials were created exclusively by the owner without
              contribution from any third-party developers, contractors, or
              agencies.
            </p>
          </div>

          <div className="legal-block">
            <h2>Intellectual Property Rights</h2>
            <p>
              All rights, title, and interest in OmniFlight AI — including but
              not limited to the user interface, underlying architectural
              framework, workflow engine, radar simulation logic, visual
              components, documentation, diagrams, workflow definitions, and
              supporting code — are fully owned by <strong>Maria Robles</strong>
              .
            </p>
            <ul className="legal-list">
              <li>100% proprietary ownership</li>
              <li>No external contributors</li>
              <li>No shared IP, licensed code, or third-party claims</li>
              <li>No outsourced development or contractor involvement</li>
              <li>All material authored in-house by the owner</li>
            </ul>
          </div>

          <div className="legal-block">
            <h2>Copyright Notice</h2>
            <p>
              © {year} <strong>Maria Robles</strong>. All rights reserved.
            </p>
            <p>
              Reproduction, distribution, modification, or public display of
              this software or any of its components is strictly prohibited
              without explicit written permission from the owner.
            </p>
          </div>

          <div className="legal-block">
            <h2>Permitted Use</h2>
            <p>
              A buyer may only use this software in accordance with a valid
              purchase, transfer agreement, or license contract signed by the
              owner. Until such transfer occurs, all rights remain solely with
              Maria Robles.
            </p>
          </div>

          <div className="legal-block">
            <h2>IP Transfer Conditions</h2>
            <p>Upon sale or transfer, the buyer receives:</p>
            <ul className="legal-list">
              <li>Full exclusive ownership rights</li>
              <li>Complete source code and asset package</li>
              <li>
                Documentation, diagrams, workflows, and technical materials
              </li>
              <li>
                Usage rights for commercial deployment, modification, and resale
              </li>
            </ul>
            <p>
              The seller retains no rights after transfer unless specifically
              outlined in the signed agreement.
            </p>
          </div>

          <div className="legal-block">
            <h2>Warranty & Liability Limitations</h2>
            <p>
              This software is provided “as-is” without warranty or guarantee.
              The owner assumes no liability for operational decisions, system
              integration, third-party data sources, or real-world aviation
              outcomes. It is the responsibility of the acquiring organization
              to validate all operational use cases.
            </p>
          </div>

          <div className="legal-block">
            <h2>Contact</h2>
            <p>
              For licensing, acquisition, legal questions, or transfer
              arrangements, please contact:
              <br />
              <strong>Maria Robles</strong>
              <br />
              Primary Owner &amp; Creator — OmniFlight AI
            </p>
          </div>
        </section>
      </div>
    );
  }

  function renderTechDrawer() {
    if (!techDrawerOpen) return null;

    return (
      <div
        className="tech-drawer-backdrop"
        onClick={() => setTechDrawerOpen(false)}
      >
        <aside className="tech-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="tech-drawer-header">
            <div>
              <div className="tech-drawer-title">
                Technical Due-Diligence Drawer
              </div>
              <div className="tech-drawer-subtitle">
                Snapshot of code age, authorship, licensing, architecture, and
                deployment.
              </div>
            </div>
            <button
              className="secondary-button tech-drawer-close"
              onClick={() => setTechDrawerOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="tech-drawer-body">
            <div className="tech-drawer-section">
              <h3>Codebase & Authorship</h3>
              <p>
                Development began in 2025 using modern standards: Node.js,
                React, Python ML, containerized microservices, and a clean
                monorepo. The entire system was authored by a single internal
                architect — no agencies, no freelancers, no external commit
                history.
              </p>
            </div>
            <div className="tech-drawer-section">
              <h3>Architecture Traceability</h3>
              <p>
                Everything is structured as Layers → Modules → Workflows →
                Nodes. Auditors can inspect each layer independently:
              </p>
              <ul>
                <li>Layer 1–5: Monorepo, data, APIs, AI engine, monitoring.</li>
                <li>
                  Layer 6–12: Prediction, safety intelligence, flight tracking,
                  dashboards.
                </li>
                <li>
                  Layer 13–20: Integrations, workflow engine, orchestration,
                  security, DevOps.
                </li>
                <li>
                  Layer 21–30: Logs, reporting, admin, workers, cron, health,
                  governance.
                </li>
              </ul>
            </div>
            <div className="tech-drawer-section">
              <h3>Deployment Model</h3>
              <p>
                Fully containerized and cloud-ready: Docker, Docker Compose,
                Kubernetes-ready specs, and environment examples for PostgreSQL
                and Redis based deployments.
              </p>
            </div>
            <div className="tech-drawer-section">
              <h3>Licensing & IP Cleanliness</h3>
              <p>
                All dependencies use MIT/Apache 2.0 style licensing. No GPL, no
                proprietary datasets. The project is designed from day one as an
                IP-safe acquisition asset with a clean, transferrable history.
              </p>
            </div>
            <div className="tech-tags-row">
              <span className="tech-tag">30 layers</span>
              <span className="tech-tag">425+ modules</span>
              <span className="tech-tag">1,600+ workflows</span>
              <span className="tech-tag">3,000+ nodes</span>
              <span className="tech-tag">Monorepo</span>
              <span className="tech-tag">Docker</span>
              <span className="tech-tag">Kubernetes-ready</span>
            </div>
          </div>
        </aside>
      </div>
    );
  }

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return renderDashboard();
      case "workflows":
        return renderWorkflows();
      case "radar":
        return renderRadar();
      case "demo":
        return renderDemo();
      case "agents":
        return renderAgents();
      case "settings":
        return renderSettings();
      case "techfaq":
        return renderTechFaq();
      case "legal":
        return renderLegal();
      default:
        return renderDashboard();
    }
  }

  const year = new Date().getFullYear();

  return (
    <div className="app-root">
      {renderNav()}
      <main className="app-main">{renderPage()}</main>
      {renderTechDrawer()}
      <footer className="app-footer">
        <span>OmniFlight AI • Air-Traffic Intelligence Demo UI</span>
        <span className="dot-separator">•</span>
        <span>
          30 AI Layers • 425+ Modules • 1,600+ Workflows • 3,000+ Nodes
        </span>
        <span className="dot-separator">•</span>
        <span>Built for buyer demos, audits, and integration discussions.</span>
        <span className="dot-separator">•</span>
        <span>© {year} Maria Robles — All Rights Reserved</span>
      </footer>
    </div>
  );
}
