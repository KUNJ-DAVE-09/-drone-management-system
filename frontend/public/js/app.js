/* =====================================================
   IADMS — Core App: Auth, Routing, API helpers
   ===================================================== */

const API = '/api';
let currentUser = null;
let authToken = null;
let currentPage = 'dashboard';
let alertPollInterval = null;

/* ── API helpers ── */
async function apiFetch(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const res = await fetch(API + path, { headers, ...opts });
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`);
  return res.json();
}
const apiGet    = (path)       => apiFetch(path);
const apiPost   = (path, body) => apiFetch(path, { method: 'POST',   body: JSON.stringify(body) });
const apiPut    = (path, body) => apiFetch(path, { method: 'PUT',    body: JSON.stringify(body) });
const apiDelete = (path)       => apiFetch(path, { method: 'DELETE' });

/* ── Clock ── */
function startClock() {
  const tick = () => {
    document.getElementById('clock').textContent =
      new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
  };
  tick();
  setInterval(tick, 1000);
}

/* ── Auth ── */
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl    = document.getElementById('login-error');
  errEl.style.display = 'none';
  try {
    const data = await apiPost('/auth/login', { username, password });
    authToken   = data.token;
    currentUser = data.user;
    localStorage.setItem('iadms_token', authToken);
    localStorage.setItem('iadms_user',  JSON.stringify(currentUser));
    showApp();
  } catch {
    errEl.style.display = 'block';
  }
});

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  const app = document.getElementById('app');
  app.style.display        = 'flex';
  app.style.flexDirection  = 'column';
  document.getElementById('user-name').textContent   = currentUser.name;
  document.getElementById('user-avatar').textContent = currentUser.name.charAt(0);
  startClock();
  navigate('dashboard');
  startAlertPolling();
}

function logout() {
  authToken   = null;
  currentUser = null;
  localStorage.removeItem('iadms_token');
  localStorage.removeItem('iadms_user');
  clearInterval(alertPollInterval);
  document.getElementById('app').style.display          = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-password').value = '';
}

/* ── Routing ── */
function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');
  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  switch (page) {
    case 'dashboard': refreshDashboard(); break;
    case 'drones':    loadDrones();       break;
    case 'missions':  loadMissions();     break;
    case 'map':       loadMap();          break;
    case 'pilots':    loadPilots();       break;
    case 'alerts':    loadAlerts();       break;
    case 'telemetry': refreshTelemetry(); break;
  }
}

/* ── Alert badge polling ── */
async function startAlertPolling() {
  const update = async () => {
    try {
      const stats = await apiGet('/alerts/stats');
      const count = stats.unacknowledged || 0;
      document.getElementById('alert-badge-count').textContent = count;
      document.getElementById('nav-alerts-count').textContent  = count;
    } catch { /* silent */ }
  };
  update();
  alertPollInterval = setInterval(update, 15000);
}

/* ── Modal helpers ── */
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

/* ── UI helper functions ── */
function statusBadge(status) {
  const map = {
    ACTIVE: 'badge-active', IDLE: 'badge-idle', MISSION: 'badge-mission',
    MAINTENANCE: 'badge-maintenance', CHARGING: 'badge-charging', OFFLINE: 'badge-offline',
    PLANNED: 'badge-planned', COMPLETED: 'badge-completed', ABORTED: 'badge-aborted',
    BRIEFING: 'badge-mission', STANDBY: 'badge-idle', ON_MISSION: 'badge-mission',
    OFF_DUTY: 'badge-offline',
  };
  return `<span class="badge ${map[status] || 'badge-idle'}">${status.replace(/_/g,' ')}</span>`;
}

function severityBadge(sev) {
  return `<span class="badge badge-${(sev||'').toLowerCase()}">${sev}</span>`;
}

function batteryBar(pct) {
  const cls = pct > 50 ? 'high' : pct > 20 ? 'medium' : 'low';
  return `<div style="display:flex;align-items:center;gap:6px;">
    <div class="battery-bar"><div class="battery-fill ${cls}" style="width:${Math.round(pct)}%"></div></div>
    <span style="font-size:11px;color:var(--text-muted)">${Math.round(pct)}%</span>
  </div>`;
}

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (diff < 1)  return 'just now';
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff/60)}h ${diff%60}m ago`;
}

/* ── Auto-login from localStorage ── */
window.addEventListener('DOMContentLoaded', () => {
  const savedToken = localStorage.getItem('iadms_token');
  const savedUser  = localStorage.getItem('iadms_user');
  if (savedToken && savedUser) {
    authToken   = savedToken;
    currentUser = JSON.parse(savedUser);
    showApp();
  }
});
