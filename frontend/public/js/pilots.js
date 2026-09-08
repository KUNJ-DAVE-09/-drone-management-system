/* =====================================================
   IADMS — Pilots Page
   ===================================================== */

async function loadPilots() {
  try {
    const pilots = await apiGet('/pilots');
    const container = document.getElementById('pilots-list');

    if (pilots.length === 0) {
      container.innerHTML = '<div class="card" style="text-align:center;color:var(--text-muted);padding:32px;">No pilots registered.</div>';
      return;
    }

    const clearanceColor = { TOP_SECRET: 'var(--red)', SECRET: 'var(--yellow)', CONFIDENTIAL: 'var(--green)' };

    container.innerHTML = pilots.map(p => `
      <div class="pilot-card">
        <div class="pilot-avatar">${p.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}</div>
        <div class="pilot-info" style="flex:1;">
          <div class="pilot-name">${p.name}</div>
          <div class="pilot-rank">${p.rank} &nbsp;|&nbsp; ${p.regiment || '—'}</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px;">
            ${statusBadge(p.status)}
            <span style="font-size:11px;color:${clearanceColor[p.clearanceLevel]||'var(--text-muted)'};">
              🔐 ${(p.clearanceLevel||'').replace(/_/g,' ')}
            </span>
            <span style="font-size:11px;color:var(--text-muted);">📋 ${p.licenseNumber||'—'}</span>
          </div>
          <div class="pilot-stats">
            <div class="pilot-stat">
              <div class="ps-val">${p.totalFlightHours}</div>
              <div class="ps-label">Flight Hrs</div>
            </div>
            <div class="pilot-stat">
              <div class="ps-val">${p.missionCount}</div>
              <div class="ps-label">Missions</div>
            </div>
            <div class="pilot-stat">
              <div class="ps-val" style="color:var(--green);">${p.successRate}%</div>
              <div class="ps-label">Success</div>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;flex-shrink:0;">
          <div style="font-size:11px;color:var(--text-muted);">✉️ ${p.email||'—'}</div>
          <div style="font-size:11px;color:var(--text-muted);">📞 ${p.phone||'—'}</div>
          ${p.currentMission
            ? `<span style="font-size:11px;color:var(--accent);">🎯 ${p.currentMission}</span>`
            : ''}
          <button class="btn-sm btn-resolve" style="border-color:var(--red);color:var(--red);margin-top:4px;"
            onclick="removePilot('${p.id}','${p.name}')">Remove</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Pilots load error:', err);
  }
}

function openAddPilotModal() {
  document.getElementById('form-add-pilot').reset();
  openModal('modal-add-pilot');
}

document.getElementById('form-add-pilot').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd.entries());
  body.totalFlightHours = Number(body.totalFlightHours);
  body.specialization   = [];
  body.certifiedDroneTypes = [];
  body.joinedDate = new Date().toISOString().split('T')[0];
  try {
    await apiPost('/pilots', body);
    closeModal('modal-add-pilot');
    loadPilots();
  } catch (err) {
    alert('Failed to register pilot: ' + err.message);
  }
});

async function removePilot(id, name) {
  if (!confirm(`Remove pilot ${name} (${id}) from the registry?`)) return;
  try {
    await apiDelete(`/pilots/${id}`);
    loadPilots();
  } catch (err) {
    alert('Failed to remove pilot: ' + err.message);
  }
}
