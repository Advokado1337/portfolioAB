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
    document.querySelectorAll('.arch-tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.arch-diagram[data-arch-diagram]').forEach(d => {
      d.hidden = d.dataset.archDiagram !== target;
    });
    document.querySelectorAll('.project-metrics[data-metrics]').forEach(m => {
      m.hidden = m.dataset.metrics !== target;
    });
  });
});
