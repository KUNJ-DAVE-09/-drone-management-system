/* =====================================================
   IADMS — Missions Page
   ===================================================== */

async function loadMissions() {
  try {
    const missions = await apiGet('/missions');
    const container = document.getElementById('missions-list');

    if (missions.length === 0) {
      container.innerHTML = '<div class="card" style="text-align:center;color:var(--text-muted);padding:32px;">No missions found.</div>';
      return;
    }

    const priorityColor = { CRITICAL: 'var(--red)', HIGH: 'var(--orange)', MEDIUM: 'var(--yellow)', LOW: 'var(--green)' };
    const threatSegs = (level) => {
      const levels = ['LOW','MODERATE','HIGH','CRITICAL'];
      const idx = levels.indexOf(level);
      return levels.map((l, i) => `<div class="threat-segment ${i <= idx ? 'active ' + l.toLowerCase() : ''}"></div>`).join('');
    };

    container.innerHTML = missions.map(m => {
      const elapsed = m.startTime ? Math.floor((Date.now() - new Date(m.startTime)) / 60000) : 0;
      const progress = m.estimatedDuration > 0 ? Math.min(100, Math.round((elapsed / m.estimatedDuration) * 100)) : 0;
      return `
        <div class="mission-card">
          <div class="mission-header">
            <div>
              <div class="mission-name">${m.name}</div>
              <div class="mission-type">${m.type.replace(/_/g,' ')} &nbsp;|&nbsp; ${m.classification}</div>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <span style="font-size:12px;font-weight:700;color:${priorityColor[m.priority] || '#fff'};">${m.priority}</span>
              ${statusBadge(m.status)}
              ${m.status === 'ACTIVE' || m.status === 'PLANNED'
                ? `<button class="btn-sm btn-resolve" style="border-color:var(--red);color:var(--red);" onclick="abortMission('${m.id}','${m.name}')">Abort</button>`
                : ''}
            </div>
          </div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">
            📍 ${m.sector || 'N/A'} &nbsp;|&nbsp; 👤 ${m.commandingOfficer || 'N/A'} &nbsp;|&nbsp; 🪖 ${m.regiment || 'N/A'}
          </div>
          <div style="font-size:13px;color:var(--text-dim);margin-bottom:10px;">${m.objective || ''}</div>
          <div class="mission-details">
            <div class="mission-detail"><div class="d-label">Drones</div><div class="d-val">${(m.assignedDrones||[]).length}</div></div>
            <div class="mission-detail"><div class="d-label">Pilots</div><div class="d-val">${(m.assignedPilots||[]).length}</div></div>
            <div class="mission-detail"><div class="d-label">Duration</div><div class="d-val">${m.estimatedDuration} min</div></div>
            <div class="mission-detail"><div class="d-label">Waypoints</div><div class="d-val">${(m.waypoints||[]).length}</div></div>
            <div class="mission-detail"><div class="d-label">Started</div><div class="d-val">${m.startTime ? timeAgo(m.startTime) : '—'}</div></div>
            <div class="mission-detail"><div class="d-label">Threat</div><div class="d-val">${m.threatLevel || '—'}</div></div>
          </div>
          ${m.status === 'ACTIVE' ? `
            <div class="mission-progress"><div class="fill" style="width:${progress}%"></div></div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">Progress: ${progress}% (${elapsed}/${m.estimatedDuration} min)</div>
          ` : ''}
          <div class="threat-bar">${threatSegs(m.threatLevel || 'LOW')}</div>
          ${m.notes ? `<div style="font-size:11px;color:var(--text-muted);margin-top:8px;font-style:italic;">📝 ${m.notes}</div>` : ''}
        </div>`;
    }).join('');
  } catch (err) {
    console.error('Missions load error:', err);
  }
}

function openAddMissionModal() {
  document.getElementById('form-add-mission').reset();
  openModal('modal-add-mission');
}

document.getElementById('form-add-mission').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd.entries());
  body.estimatedDuration = Number(body.estimatedDuration);
  body.startTime = new Date().toISOString();
  body.assignedDrones = [];
  body.assignedPilots = [];
  body.waypoints = [];
  try {
    await apiPost('/missions', body);
    closeModal('modal-add-mission');
    loadMissions();
  } catch (err) {
    alert('Failed to create mission: ' + err.message);
  }
});

async function abortMission(id, name) {
  if (!confirm(`Abort mission "${name}"? This action cannot be undone.`)) return;
  try {
    await apiPut(`/missions/${id}/abort`, {});
    loadMissions();
  } catch (err) {
    // fallback: update directly
    try {
      await apiPut(`/missions/${id}`, { status: 'ABORTED', endTime: new Date().toISOString() });
      loadMissions();
    } catch (e2) {
      alert('Failed to abort mission: ' + e2.message);
    }
  }
}
