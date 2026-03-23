/* ── Cycling hero text ── */
const cycleEl = document.getElementById('cycle-text');
if (cycleEl) {
  const phrases = [
    'real-time pipelines',
    'sandboxed execution engines',
    'edge AI systems',
    'cloud-native platforms',
    'things that actually work'
  ];
  let i = 0;
  cycleEl.textContent = phrases[0];
  setInterval(() => {
    i = (i + 1) % phrases.length;
    cycleEl.textContent = phrases[i];
  }, 2500);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      document.querySelector('.nav').classList.remove('nav-open');
    }
  });
});

document.querySelector('.nav-toggle').addEventListener('click', () => {
  document.querySelector('.nav').classList.toggle('nav-open');
});

/* nav scroll class kept for compatibility but no visual change in brutalist theme */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 50);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(section => observer.observe(section));

const nodeData = {
  drone: {
    label: 'Input — Cloud Pipeline',
    title: 'Drone / Camera',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    desc: 'Video source pushing an H.264 RTSP stream over 5G to the cluster. During development, a laptop (ffmpeg) or iPhone (Larix Broadcaster) stood in for a real drone.',
    specs: [
      { key: 'Laptop',    val: 'ffmpeg + DirectShow' },
      { key: 'Mobile',    val: 'Larix Broadcaster (iOS)' },
      { key: 'Protocol',  val: 'RTSP / H.264 TCP' },
      { key: 'Transport', val: '5G → cluster' },
    ]
  },
  mediamtx: {
    label: 'Stream Relay — Cloud Pipeline',
    title: 'MediaMTX',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    desc: 'Open-source RTSP relay that accepts the incoming stream and exposes it for the inference service to pull. Configured via a Kubernetes ConfigMap with no custom build required.',
    specs: [
      { key: 'Mode',      val: 'RTSP relay, TCP only' },
      { key: 'Config',    val: 'Kubernetes ConfigMap' },
      { key: 'Paths',     val: 'Dynamic (e.g. /drone)' },
      { key: 'Image',     val: 'bluenviron/mediamtx' },
    ]
  },
  inference: {
    label: 'Core — Cloud Pipeline',
    title: 'video-ai-service',
    highlight: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg>`,
    desc: 'Custom Python service that pulls frames from MediaMTX via GStreamer, runs YOLO inference on the cluster GPU, and broadcasts annotated frames and detection data over WebSocket. A leaky queue ensures only the latest frame is processed — stale frames are dropped.',
    specs: [
      { key: 'Runtime',   val: 'Python / Ultralytics' },
      { key: 'Ingest',    val: 'GStreamer subprocess' },
      { key: 'Output',    val: 'WebSocket: JPEG + JSON' },
      { key: 'Inference', val: '~24 ms (GPU contention is bottleneck)' },
    ]
  },
  springboot: {
    label: 'MQTT Branch — Sensor Data',
    title: 'Spring Boot (Java)',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10A15 15 0 0112 2z"/></svg>`,
    desc: 'Java service for MQTT-based sensor ingestion and AI inference on IoT data. Runs as a separate branch alongside the video pipeline — built and tested independently.',
    specs: [
      { key: 'Language',  val: 'Java / Spring Boot' },
      { key: 'Role',      val: 'MQTT sensor ingestion' },
      { key: 'Status',    val: 'Built, not deployed' },
      { key: 'Reason',    val: 'No physical sensors available' },
    ]
  },
  dashboard: {
    label: 'Frontend — Cloud Pipeline',
    title: 'Dashboard',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    desc: 'Static frontend served by nginx. Connects to the inference service over WebSocket, renders frames on a canvas, overlays detection bounding boxes, and displays a live end-to-end latency view.',
    specs: [
      { key: 'Serving',   val: 'nginx (static)' },
      { key: 'Transport', val: 'WebSocket (video-ai-service)' },
      { key: 'Render',    val: 'Canvas + JSON overlay' },
      { key: 'Metrics',   val: 'End-to-end latency view' },
    ]
  },
  'jetson-camera': {
    label: 'Input — Jetson Edge',
    title: 'USB Camera',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></svg>`,
    desc: 'USB camera connected directly to the Jetson as a local v4l2 device, bypassing the entire network ingestion layer used in the cloud pipeline.',
    specs: [
      { key: 'Interface', val: 'USB (v4l2 device)' },
      { key: 'Transport', val: 'On-device only' },
      { key: 'vs Cloud',  val: 'No RTSP / 5G / MediaMTX' },
      { key: 'Source',    val: 'v4l2src in GStreamer' },
    ]
  },
  'jetson-gstreamer': {
    label: 'HW Pipeline — Jetson Edge',
    title: 'GStreamer',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 3l14 9-14 9V3z"/></svg>`,
    desc: 'Same GStreamer pipeline as the cloud service, with the source swapped from rtspsrc to v4l2src. Decode and colour conversion are handled by Jetson hardware-accelerated elements rather than the CPU.',
    specs: [
      { key: 'Source',    val: 'v4l2src (vs rtspsrc)' },
      { key: 'Decode',    val: 'nvv4l2decoder (HW)' },
      { key: 'Convert',   val: 'nvvidconv (HW)' },
      { key: 'Base image',val: 'ultralytics:jetson-jetpack6' },
    ]
  },
  'jetson-inference': {
    label: 'Core — Jetson Edge AI',
    title: 'YOLO on Jetson GPU',
    highlight: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg>`,
    desc: "Same YOLO model and WebSocket output interface as the cloud service, running on the Jetson's integrated GPU. The two deployments are directly comparable — same model, different hardware and ingestion path.",
    specs: [
      { key: 'Runtime',   val: 'Ultralytics (Jetson GPU)' },
      { key: 'Output',    val: 'WebSocket: JPEG + JSON' },
      { key: 'Compose',   val: 'docker-compose (no K8s)' },
      { key: 'vs Cloud',  val: 'Same interface, on-device' },
    ]
  },
  'jetson-websocket': {
    label: 'Transport — Jetson Edge',
    title: 'WebSocket Server',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
    desc: 'Same aiohttp WebSocket server as the cloud pipeline, broadcasting JPEG frames and JSON detection data on port 8080. Identical interface means the dashboard connects without any changes.',
    specs: [
      { key: 'Server',    val: 'aiohttp (Python)' },
      { key: 'Port',      val: '8080' },
      { key: 'Payload',   val: 'JPEG bytes + JSON' },
      { key: 'vs Cloud',  val: 'Identical interface' },
    ]
  },
  /* YOU WILL WIN — MVP nodes */
  'yw-react': {
    label: 'Frontend — YOU WILL WIN',
    title: 'React Frontend',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    desc: 'React 19 application with React Router, featuring a Monaco Editor (same engine as VS Code) for writing solutions. Includes question browsing with difficulty/tag filters, a stats dashboard with per-tag pass rates, and an admin panel for content management.',
    specs: [
      { key: 'Framework', val: 'React 19 + Vite' },
      { key: 'Editor',    val: 'Monaco Editor' },
      { key: 'Routing',   val: 'React Router 7' },
      { key: 'Pages',     val: 'List, Solve, Stats, Admin' },
    ]
  },
  'yw-spring': {
    label: 'Core — YOU WILL WIN',
    title: 'Spring Boot API',
    highlight: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10A15 15 0 0112 2z"/></svg>`,
    desc: 'Java 21 Spring Boot backend handling question management, code execution orchestration, attempt recording, and statistics aggregation. Five REST controllers cover questions, tags, execution, attempts, and stats endpoints.',
    specs: [
      { key: 'Runtime',    val: 'Java 21 + Spring Boot 3.5' },
      { key: 'ORM',        val: 'Spring Data JPA' },
      { key: 'Migrations', val: 'Flyway (versioned SQL)' },
      { key: 'Endpoints',  val: '12 REST routes' },
    ]
  },
  'yw-docker': {
    label: 'Execution — YOU WILL WIN',
    title: 'Docker Sandbox',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 4v16"/></svg>`,
    desc: 'Isolated execution environment running user-submitted Java code. Each submission spins up a disposable Docker container with strict resource limits and no network access. Code is compiled and run as a non-root user.',
    specs: [
      { key: 'Image',   val: 'eclipse-temurin:21-jdk-alpine' },
      { key: 'Memory',  val: '256MB limit' },
      { key: 'Timeout', val: '10 seconds' },
      { key: 'Network', val: 'Disabled (--network none)' },
    ]
  },
  'yw-postgres': {
    label: 'Storage — YOU WILL WIN',
    title: 'PostgreSQL',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,
    desc: 'PostgreSQL 17 running in Docker Compose. Stores questions, tags (14 topics, 13 patterns, 8 data structures), test cases with sample/hidden distinction, and full attempt history. Schema managed by Flyway migrations.',
    specs: [
      { key: 'Version', val: 'PostgreSQL 17' },
      { key: 'Tables',  val: 'questions, tags, test_cases, attempts' },
      { key: 'Tags',    val: '35 seeded (topic/pattern/DS)' },
      { key: 'Migrations', val: 'Flyway (3 versions)' },
    ]
  },
  /* YOU WILL WIN — Roadmap nodes */
  'yw-ollama': {
    label: 'Planned — YOU WILL WIN',
    title: 'AI Question Generation',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a4 4 0 014 4c0 1.1-.9 2-2 2h-4a2 2 0 01-2-2 4 4 0 014-4z"/><path d="M8 8v2a4 4 0 008 0V8"/><path d="M6 14a6 6 0 0012 0"/><path d="M12 18v4"/></svg>`,
    desc: 'Local LLM integration via Ollama to generate draft coding problems. Produces question text, starter code, test cases, and tag suggestions — reviewed and refined through the admin panel before publishing.',
    specs: [
      { key: 'Engine', val: 'Ollama (local LLM)' },
      { key: 'Output', val: 'Question + test cases' },
      { key: 'Review', val: 'Admin approval flow' },
      { key: 'Status', val: 'Planned' },
    ]
  },
  'yw-simulator': {
    label: 'Planned — YOU WILL WIN',
    title: 'Interview Simulator',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    desc: 'Timed coding sessions that simulate real interview conditions. No hints, strict time limits, and a performance report at the end covering speed, accuracy, and areas for improvement.',
    specs: [
      { key: 'Mode',   val: 'Timed, no hints' },
      { key: 'Output', val: 'Performance report' },
      { key: 'Metrics', val: 'Speed + accuracy' },
      { key: 'Status', val: 'Planned' },
    ]
  },
  'yw-spaced': {
    label: 'Planned — YOU WILL WIN',
    title: 'Spaced Repetition',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16v16H4z"/><path d="M4 10h16M10 4v16"/></svg>`,
    desc: 'Resurfaces previously solved problems at increasing intervals based on performance. Problems you struggled with come back sooner; easy solves are spaced further apart.',
    specs: [
      { key: 'Algorithm', val: 'Interval-based scheduling' },
      { key: 'Input',     val: 'Attempt history + pass rate' },
      { key: 'Goal',      val: 'Long-term retention' },
      { key: 'Status',    val: 'Planned' },
    ]
  },
  'yw-weakness': {
    label: 'Planned — YOU WILL WIN',
    title: 'Weakness Detection',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    desc: 'Analyzes per-tag pass rates to identify weak areas. Flags topics and patterns with consistently low scores and feeds recommendations to the training plan system.',
    specs: [
      { key: 'Input',  val: 'Per-tag pass rates' },
      { key: 'Output', val: 'Weak topic flags' },
      { key: 'Action', val: 'Training recommendations' },
      { key: 'Status', val: 'Planned' },
    ]
  },
  'yw-practice': {
    label: 'Planned — YOU WILL WIN',
    title: 'Practice Sessions',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>`,
    desc: 'Daily practice plans generated from weakness detection and spaced repetition data. Random problem sets filtered by topic and difficulty to target areas that need the most work.',
    specs: [
      { key: 'Source', val: 'Weakness + repetition data' },
      { key: 'Format', val: 'Random sets by topic' },
      { key: 'Goal',   val: 'Targeted daily practice' },
      { key: 'Status', val: 'Planned' },
    ]
  },
  'jetson-dashboard': {
    label: 'Frontend — Jetson Edge',
    title: 'Dashboard',
    highlight: false,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    desc: 'Identical to the cloud dashboard — no changes needed since the WebSocket interface is the same. Orchestrated with docker-compose instead of Kubernetes.',
    specs: [
      { key: 'Code',      val: 'Identical to cloud' },
      { key: 'Serving',   val: 'nginx (static)' },
      { key: 'Compose',   val: 'docker-compose' },
      { key: 'vs Cloud',  val: 'No K8s, no changes needed' },
    ]
  }
};

const modal    = document.getElementById('arch-modal');
const backdrop = modal.querySelector('.arch-modal-backdrop');
const panel    = modal.querySelector('.arch-modal-panel');
const closeBtn = modal.querySelector('.arch-modal-close');
const iconEl   = modal.querySelector('.arch-modal-icon');
const labelEl  = modal.querySelector('.arch-modal-label');
const titleEl  = modal.querySelector('.arch-modal-title');
const descEl   = modal.querySelector('.arch-modal-desc');
const specsEl  = modal.querySelector('.arch-modal-specs');

function openModal(nodeKey) {
  const d = nodeData[nodeKey];
  if (!d) return;

  iconEl.innerHTML    = d.icon;
  labelEl.textContent = d.label;
  titleEl.textContent = d.title;
  descEl.textContent  = d.desc;

  specsEl.innerHTML = d.specs.map(s =>
    `<div class="arch-spec">
      <span class="arch-spec-key">${s.key}</span>
      <span class="arch-spec-val">${s.val}</span>
    </div>`
  ).join('');

  panel.classList.toggle('highlight-modal', d.highlight);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.arch-node[data-node]').forEach(node => {
  node.addEventListener('click', () => openModal(node.dataset.node));
  node.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(node.dataset.node);
    }
  });
});

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

document.querySelectorAll('.arch-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.arch;
    const card = tab.closest('.project-card');
    card.querySelectorAll('.arch-tab').forEach(t => t.classList.toggle('active', t === tab));
    card.querySelectorAll('.arch-diagram[data-arch-diagram]').forEach(d => {
      d.hidden = d.dataset.archDiagram !== target;
    });
    card.querySelectorAll('.project-metrics[data-metrics]').forEach(m => {
      m.hidden = m.dataset.metrics !== target;
    });
  });
});

/* ── Chess Puzzle ── */
(function () {
  const boardEl = document.getElementById('chess-board');
  const feedbackEl = document.getElementById('chess-feedback');
  const resetBtn = document.getElementById('chess-reset');
  const successEl = document.getElementById('chess-success');
  if (!boardEl) return;

  // Piece symbols
  const PIECES = {
    K: '\u2654', Q: '\u2655', R: '\u2656', B: '\u2657', N: '\u2658', P: '\u2659',
    k: '\u265A', q: '\u265B', r: '\u265C', b: '\u265D', n: '\u265E', p: '\u265F'
  };

  // Starting position: smothered mate puzzle
  // FEN: 2b2r1k/p5pp/7N/3Q4/8/8/5PPP/6K1 w
  // Board stored as array of 64, index 0 = a8, 7 = h8, 56 = a1, 63 = h1
  function initialPosition() {
    const board = new Array(64).fill(null);
    // Rank 8 (row 0)
    board[2] = 'b';  // c8 bishop
    board[5] = 'r';  // f8 rook
    board[7] = 'k';  // h8 king
    // Rank 7 (row 1)
    board[8] = 'p';  // a7 pawn
    board[14] = 'p'; // g7 pawn
    board[15] = 'p'; // h7 pawn
    // Rank 6 (row 2)
    board[23] = 'N'; // h6 knight
    // Rank 5 (row 3)
    board[27] = 'Q'; // d5 queen
    // Rank 2 (row 6)
    board[53] = 'P'; // f2 pawn
    board[54] = 'P'; // g2 pawn
    board[55] = 'P'; // h2 pawn
    // Rank 1 (row 7)
    board[62] = 'K'; // g1 king
    return board;
  }

  let board = initialPosition();
  let selected = null; // index of selected square
  let solved = false;
  let animating = false;
  let phase = 0; // 0 = play Qg8+, 1 = play Nf7#

  const wrongMessages = [
    'Not quite.',
    'Try again.',
    'Interesting, but no.',
    'That\'s not it.',
    'Think deeper.',
    'Close, but no.',
    'Nope.'
  ];

  function isWhite(piece) { return piece && piece === piece.toUpperCase(); }

  function toCoord(index) {
    return { row: Math.floor(index / 8), col: index % 8 };
  }

  function toAlg(index) {
    const c = toCoord(index);
    return String.fromCharCode(97 + c.col) + (8 - c.row);
  }

  function render(highlights) {
    highlights = highlights || {};
    boardEl.innerHTML = '';
    for (let i = 0; i < 64; i++) {
      const sq = document.createElement('div');
      const { row, col } = toCoord(i);
      const isLight = (row + col) % 2 === 0;
      sq.className = 'chess-square ' + (isLight ? 'light' : 'dark');
      sq.dataset.index = i;

      if (board[i]) {
        sq.textContent = PIECES[board[i]];
        if (!solved && !animating && isWhite(board[i])) {
          sq.classList.add('has-piece');
        }
      }

      if (selected === i) sq.classList.add('selected');
      if (highlights.from === i || highlights.to === i) sq.classList.add('last-move');
      if (selected !== null && !board[i] && !solved) sq.classList.add('move-target');

      sq.addEventListener('click', () => handleClick(i));
      boardEl.appendChild(sq);
    }
  }

  function showFeedback(msg, cls) {
    feedbackEl.textContent = msg;
    feedbackEl.className = 'chess-feedback visible' + (cls ? ' ' + cls : '');
    if (!cls || cls !== 'correct') {
      setTimeout(() => { feedbackEl.classList.remove('visible'); }, 1800);
    }
  }

  function handleClick(i) {
    if (solved || animating) return;

    // If no piece selected, select a white piece
    if (selected === null) {
      if (board[i] && isWhite(board[i])) {
        selected = i;
        render();
      }
      return;
    }

    // Clicking the same square deselects
    if (selected === i) {
      selected = null;
      render();
      return;
    }

    // Clicking another white piece switches selection
    if (board[i] && isWhite(board[i])) {
      selected = i;
      render();
      return;
    }

    // Attempting a move: selected -> i
    const from = selected;
    const to = i;
    selected = null;

    if (phase === 0 && from === 27 && to === 6) {
      // Correct: Qg8+ (queen sacrifice)
      animating = true;
      movePiece(from, to);
      render({ from: from, to: to });
      showFeedback('Qg8+!!', 'correct');

      // Auto-play black's forced response after a beat
      setTimeout(() => {
        board[6] = 'r'; // Rxg8
        board[5] = null;
        render({ from: 5, to: 6 });
        showFeedback('Rxg8 — Your turn.', 'correct');
        phase = 1;
        animating = false;
      }, 1200);

    } else if (phase === 1 && from === 23 && to === 13) {
      // Correct: Nf7# (smothered mate)
      movePiece(from, to);
      render({ from: from, to: to });
      showFeedback('Nf7# \u2014 Smothered Mate!', 'correct');
      setTimeout(() => {
        solved = true;
        successEl.classList.add('visible');
      }, 1400);

    } else {
      showFeedback(wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);
      render();
    }
  }

  function movePiece(from, to) {
    board[to] = board[from];
    board[from] = null;
  }

  function reset() {
    board = initialPosition();
    selected = null;
    solved = false;
    animating = false;
    phase = 0;
    feedbackEl.className = 'chess-feedback';
    feedbackEl.textContent = '';
    successEl.classList.remove('visible');
    render();
  }

  resetBtn.addEventListener('click', reset);

  // CTA smooth scroll
  const cta = successEl.querySelector('.chess-success-cta');
  if (cta) {
    cta.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      reset();
    });
  }

  render();

  /* ── AI Detection Overlay ── */
  const overlayEl = document.getElementById('detection-overlay');
  if (!overlayEl) return;

  // Detections tied to board squares (row 0-7, col 0-7) and labels
  const detections = [
    { row: 0, col: 7, w: 1, h: 1, label: 'king (99%)', accent: false },
    { row: 2, col: 7, w: 1, h: 1, label: 'knight (87%)', accent: true },
    { row: 3, col: 3, w: 1, h: 1, label: 'queen (94%)', accent: true },
    { row: 0, col: 5, w: 1, h: 1, label: 'rook (91%)', accent: false },
    { row: 0, col: 2, w: 1, h: 1, label: 'bishop (83%)', accent: false },
    { row: 0, col: 7, w: 1, h: 1, label: 'human input', accent: false },
    { row: 2, col: 7, w: 1.1, h: 1.1, label: 'suspicious move', accent: true },
    { row: 0, col: 5, w: 2.2, h: 1, label: 'back rank (weak)', accent: false },
    { row: 6, col: 5, w: 3, h: 1, label: 'pawn shield (intact)', accent: false },
    { row: 3, col: 3, w: 1, h: 1, label: 'blunder (likely)', accent: false },
  ];

  let activeDetections = [];

  function spawnDetection() {
    if (solved) return;

    // Pick 1–2 random detections
    const count = Math.random() < 0.35 ? 2 : 1;
    const picks = [];
    const shuffled = detections.slice().sort(() => Math.random() - 0.5);
    for (let i = 0; i < count && i < shuffled.length; i++) {
      picks.push(shuffled[i]);
    }

    picks.forEach(det => {
      const box = document.createElement('div');
      box.className = 'detection-box' + (det.accent ? ' accent' : '');

      const sqSize = 100 / 8; // percentage per square
      // Random jitter for realism (±4% of a square)
      const jitterX = (Math.random() - 0.5) * 4;
      const jitterY = (Math.random() - 0.5) * 4;

      box.style.left = (det.col * sqSize + jitterX) + '%';
      box.style.top = (det.row * sqSize + jitterY) + '%';
      box.style.width = (det.w * sqSize) + '%';
      box.style.height = (det.h * sqSize) + '%';

      const label = document.createElement('span');
      label.className = 'detection-label';
      label.textContent = det.label;

      // Top-row detections: label goes below the box instead of above
      if (det.row === 0) {
        label.style.top = 'auto';
        label.style.bottom = '-1px';
        label.style.transform = 'translateY(100%)';
      }

      // Right-edge detections: anchor label from the right
      if (det.col >= 6) {
        label.style.left = 'auto';
        label.style.right = '-1px';
      }

      box.appendChild(label);

      overlayEl.appendChild(box);

      // Fade in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { box.classList.add('visible'); });
      });

      // Fade out and remove
      const duration = 900 + Math.random() * 600;
      setTimeout(() => {
        box.classList.remove('visible');
        setTimeout(() => { box.remove(); }, 300);
      }, duration);
    });
  }

  // Run detection cycle
  function detectionLoop() {
    spawnDetection();
    const next = 1400 + Math.random() * 1000;
    setTimeout(detectionLoop, next);
  }

  // Start after a short delay
  setTimeout(detectionLoop, 1500);

  /* ── Chess Mode Hover ── */
  const heroEl = document.querySelector('.hero');
  const puzzleEl = document.getElementById('chess-puzzle');
  const statusEl = document.getElementById('hero-status');
  const inferenceEl = document.querySelector('.chess-inference');

  const statusMessages = [
    'STATUS: CHESS MODE ACTIVATED',
    'EVALUATION: WINNING POSITION',
    'THINKING...',
    'ANALYZING BOARD STATE...',
    'STATUS: YOUR MOVE, HUMAN'
  ];
  let statusIdx = 0;

  if (puzzleEl && heroEl && statusEl) {
    puzzleEl.addEventListener('mouseenter', () => {
      heroEl.classList.add('chess-mode');
      statusEl.textContent = statusMessages[statusIdx % statusMessages.length];
      statusIdx++;
      if (inferenceEl) inferenceEl.lastChild.textContent = 'chess mode';
    });

    puzzleEl.addEventListener('mouseleave', () => {
      heroEl.classList.remove('chess-mode');
      if (inferenceEl) inferenceEl.lastChild.textContent = 'inference running';
    });
  }
})();
