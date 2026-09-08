/* =====================================================
   IADMS — Alerts Page
   ===================================================== */

let allAlerts = [];
let alertFilter = 'ALL';

async function loadAlerts() {
  try {
    allAlerts = await apiGet('/alerts');
    renderAlerts();
  } catch (err) {
    console.error('Alerts load error:', err);
  }
}

function filterAlerts(f) {
  alertFilter = f;
  renderAlerts();
}

function renderAlerts() {
  const container = document.getElementById('alerts-list');
  const filtered = alertFilter === 'ALL'
    ? allAlerts
    : allAlerts.filter(a => a.severity === alertFilter);

  if (filtered.length === 0) {
    container.innerHTML = '<div class="card" style="text-align:center;color:var(--text-muted);padding:32px;">No alerts found.</div>';
    return;
  }

  const icon = { CRITICAL: '🔴', HIGH: '🟠', MEDIUM: '🟡', LOW: '🟢' };
  const typeIcon = {
    HOSTILE_DETECTION: '⚔️', LOW_BATTERY: '🔋', SIGNAL_LOSS: '📡',
    GEOFENCE_BREACH: '🚧', WEATHER: '🌩️', MECHANICAL: '🔧',
    CYBER_THREAT: '💻', BORDER_VIOLATION: '🚨',
  };

  container.innerHTML = filtered.map(a => `
    <div class="alert-item ${a.severity.toLowerCase()}">
      <div class="alert-icon">${icon[a.severity] || '⚠️'} ${typeIcon[a.type] || ''}</div>
      <div class="alert-body">
        <h4>${a.title}</h4>
        <p>${a.message}</p>
        <div class="alert-meta">
          ${severityBadge(a.severity)}
          &nbsp;|&nbsp; ${a.type.replace(/_/g,' ')}
          &nbsp;|&nbsp; ${a.sector || ''}
          &nbsp;|&nbsp; ${timeAgo(a.timestamp)}
          ${a.droneId  ? `&nbsp;|&nbsp; 🚁 ${a.droneId}`  : ''}
          ${a.missionId? `&nbsp;|&nbsp; 🎯 ${a.missionId}` : ''}
          ${a.acknowledged
            ? `&nbsp;|&nbsp; <span style="color:var(--green);">✓ Acknowledged</span>`
            : ''}
          ${a.resolved
            ? `&nbsp;|&nbsp; <span style="color:var(--text-muted);">✓ Resolved</span>`
            : ''}
        </div>
      </div>
      <div class="alert-actions">
        ${!a.acknowledged
          ? `<button class="btn-sm btn-ack" onclick="acknowledgeAlert('${a.id}')">Acknowledge</button>`
          : ''}
        ${!a.resolved
          ? `<button class="btn-sm btn-resolve" onclick="resolveAlert('${a.id}')">Resolve</button>`
          : ''}
      </div>
    </div>
  `).join('');
}

async function acknowledgeAlert(id) {
  try {
    await apiPost(`/alerts/${id}/acknowledge`, {});
    await loadAlerts();
  } catch (err) {
    alert('Failed to acknowledge alert: ' + err.message);
  }
}

async function resolveAlert(id) {
  try {
    await apiPost(`/alerts/${id}/resolve`, {});
    await loadAlerts();
  } catch (err) {
    alert('Failed to resolve alert: ' + err.message);
  }
}
