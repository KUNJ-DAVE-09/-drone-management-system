/* =====================================================
   IADMS — Dashboard Page
   ===================================================== */

async function refreshDashboard() {
  try {
    const [droneStats, alertStats, missions, alerts, drones] = await Promise.all([
      apiGet('/drones/stats'),
      apiGet('/alerts/stats'),
      apiGet('/missions'),
      apiGet('/alerts'),
      apiGet('/drones'),
    ]);

    // Stats cards
    document.getElementById('stat-total').textContent       = droneStats.total;
    document.getElementById('stat-active').textContent      = droneStats.active;
    document.getElementById('stat-mission').textContent     = droneStats.mission;
    document.getElementById('stat-maintenance').textContent = droneStats.maintenance;
    document.getElementById('stat-charging').textContent    = droneStats.charging;
    document.getElementById('stat-crit-alerts').textContent = alertStats.critical;

    // Active missions
    const activeMissions = missions.filter(m => m.status === 'ACTIVE').slice(0, 4);
    const mEl = document.getElementById('dashboard-missions');
    if (activeMissions.length === 0) {
      mEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:12px 0;">No active missions.</p>';
    } else {
      mEl.innerHTML = activeMissions.map(m => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:13px;font-weight:600;">${m.name}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${m.sector || ''}</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            ${severityBadge(m.priority)}
            ${statusBadge(m.status)}
          </div>
        </div>
      `).join('');
    }

    // Recent alerts
    const recentAlerts = alerts.slice(0, 4);
    const aEl = document.getElementById('dashboard-alerts');
    if (recentAlerts.length === 0) {
      aEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:12px 0;">No alerts.</p>';
    } else {
      aEl.innerHTML = recentAlerts.map(a => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:13px;font-weight:600;">${a.title}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${timeAgo(a.timestamp)}</div>
          </div>
          ${severityBadge(a.severity)}
        </div>
      `).join('');
    }

    // Fleet status table
    document.getElementById('dashboard-fleet').innerHTML = `
      <table class="data-table">
        <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Status</th><th>Battery</th><th>Altitude</th><th>Regiment</th></tr></thead>
        <tbody>
          ${drones.map(d => `
            <tr>
              <td><code style="color:var(--accent);font-size:12px;">${d.id}</code></td>
              <td><strong>${d.name}</strong></td>
              <td><span style="font-size:11px;color:var(--text-muted);">${d.type}</span></td>
              <td>${statusBadge(d.status)}</td>
              <td>${batteryBar(d.batteryLevel)}</td>
              <td style="font-family:monospace;">${d.altitude > 0 ? d.altitude.toFixed(0) + ' m' : '—'}</td>
              <td style="font-size:12px;color:var(--text-muted);">${d.regiment || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;

    // Update drones nav badge
    document.getElementById('nav-drones-count').textContent = droneStats.total;

  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

// Map page
let mapDrones = [];
let mapFilter = 'ALL';

async function loadMap() {
  try {
    mapDrones = await apiGet('/drones');
    renderMap();
    // Auto-refresh map every 10s
    clearInterval(window._mapInterval);
    window._mapInterval = setInterval(async () => {
      if (currentPage === 'map') {
        mapDrones = await apiGet('/drones');
        renderMap();
      }
    }, 10000);
  } catch (err) { console.error('Map error:', err); }
}

function filterMapDrones(f) {
  mapFilter = f;
  renderMap();
}

function refreshMap() { loadMap(); }

function renderMap() {
  const svg = document.getElementById('tactical-map');
  const W = 900, H = 500;

  // Lat/lng bounds for Northern India
  const LAT_MIN = 28, LAT_MAX = 36;
  const LNG_MIN = 72, LNG_MAX = 80;

  function project(lat, lng) {
    const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
    const y = H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;
    return { x, y };
  }

  const colorMap = {
    ACTIVE: '#00ff9d', MISSION: '#00d4ff', IDLE: '#64748b',
    CHARGING: '#ffd700', MAINTENANCE: '#ff6b2b', OFFLINE: '#ff3b3b',
  };

  const filtered = mapFilter === 'ALL' ? mapDrones : mapDrones.filter(d => d.status === mapFilter);

  // Build grid lines
  let gridLines = '';
  for (let lat = 28; lat <= 36; lat += 1) {
    const { y } = project(lat, LNG_MIN);
    gridLines += `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" class="grid-line"/>`;
  }
  for (let lng = 72; lng <= 80; lng += 1) {
    const { x } = project(LAT_MIN, lng);
    gridLines += `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${H}" class="grid-line"/>`;
  }

  // Region labels
  const labels = [
    { label: 'KASHMIR', lat: 34.5, lng: 74.5 },
    { label: 'PUNJAB', lat: 31.0, lng: 75.5 },
    { label: 'HP', lat: 32.0, lng: 77.0 },
    { label: 'LADAKH', lat: 34.0, lng: 77.5 },
  ];
  const labelsSvg = labels.map(l => {
    const { x, y } = project(l.lat, l.lng);
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="Courier New" font-size="11" fill="rgba(0,212,255,0.18)" text-anchor="middle">${l.label}</text>`;
  }).join('');

  // Drone markers
  const markers = filtered.map(d => {
    const { x, y } = project(d.latitude, d.longitude);
    const color = colorMap[d.status] || '#64748b';
    const r = d.status === 'ACTIVE' || d.status === 'MISSION' ? 8 : 6;
    const pulse = (d.status === 'ACTIVE' || d.status === 'MISSION')
      ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="none" stroke="${color}" stroke-width="1" opacity="0.3">
           <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite"/>
           <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
         </circle>`
      : '';
    return `
      <g class="drone-marker" onclick="showDroneInfo('${d.id}')">
        ${pulse}
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${color}" opacity="0.9"/>
        <text x="${(x+12).toFixed(1)}" y="${(y-6).toFixed(1)}" class="drone-label">${d.name}</text>
        <text x="${(x+12).toFixed(1)}" y="${(y+6).toFixed(1)}" class="drone-label" opacity="0.7">${d.id}</text>
      </g>`;
  }).join('');

  // Heading arrows for active drones
  const arrows = filtered.filter(d => d.status === 'ACTIVE' || d.status === 'MISSION').map(d => {
    const { x, y } = project(d.latitude, d.longitude);
    const rad = (d.heading * Math.PI) / 180;
    const len = 20;
    const ex = x + Math.sin(rad) * len;
    const ey = y - Math.cos(rad) * len;
    return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#00d4ff" stroke-width="1.5" opacity="0.5" stroke-dasharray="4,2"/>`;
  }).join('');

  svg.innerHTML = `
    <rect width="${W}" height="${H}" fill="#0a0e1a"/>
    ${gridLines}
    ${labelsSvg}
    ${arrows}
    ${markers}
    <text x="10" y="20" font-family="Courier New" font-size="10" fill="rgba(0,212,255,0.4)">NORTHERN THEATRE — TACTICAL OVERLAY</text>
    <text x="${W - 10}" y="${H - 8}" font-family="Courier New" font-size="9" fill="rgba(0,212,255,0.3)" text-anchor="end">GRID: ${new Date().toLocaleTimeString('en-IN', {hour12:false})} IST</text>
  `;
}

function showDroneInfo(id) {
  const d = mapDrones.find(x => x.id === id);
  if (!d) return;
  alert(`${d.name} (${d.id})\nStatus: ${d.status}\nAlt: ${d.altitude.toFixed(0)}m  Speed: ${d.speed.toFixed(0)}kph\nBattery: ${d.batteryLevel.toFixed(0)}%\nPosition: ${d.latitude.toFixed(4)}°N, ${d.longitude.toFixed(4)}°E`);
}

// Telemetry page
let telemInterval = null;

async function refreshTelemetry() {
  try {
    const data = await apiGet('/telemetry');
    const grid = document.getElementById('telemetry-grid');
    grid.innerHTML = data.map(d => `
      <div class="card">
        <div class="card-header">
          <span class="card-title">📡 ${d.name}</span>
          ${statusBadge(d.status)}
        </div>
        <div class="telem-grid">
          <div class="telem-item"><div class="t-val">${d.altitude.toFixed(0)}</div><div class="t-label">Alt (m)</div></div>
          <div class="telem-item"><div class="t-val">${d.speed.toFixed(0)}</div><div class="t-label">Speed (kph)</div></div>
          <div class="telem-item"><div class="t-val">${d.batteryLevel.toFixed(0)}%</div><div class="t-label">Battery</div></div>
          <div class="telem-item"><div class="t-val">${d.heading.toFixed(0)}°</div><div class="t-label">Heading</div></div>
        </div>
        <div style="margin-top:10px;font-size:11px;color:var(--text-muted);">
          📍 ${d.latitude.toFixed(4)}°N, ${d.longitude.toFixed(4)}°E &nbsp;|&nbsp; Updated: ${timeAgo(d.timestamp)}
        </div>
      </div>
    `).join('');
  } catch (err) { console.error('Telemetry error:', err); }
}
