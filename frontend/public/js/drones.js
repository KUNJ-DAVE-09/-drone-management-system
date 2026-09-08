/* =====================================================
   IADMS — Drones Page
   ===================================================== */

async function loadDrones() {
  try {
    const drones = await apiGet('/drones');
    const tbody = document.getElementById('drones-table-body');
    if (drones.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:24px;">No drones registered.</td></tr>';
      return;
    }
    tbody.innerHTML = drones.map(d => `
      <tr>
        <td><code style="color:var(--accent);font-size:12px;">${d.id}</code></td>
        <td><strong>${d.name}</strong></td>
        <td><span style="font-size:11px;color:var(--text-muted);">${d.type}</span></td>
        <td>${statusBadge(d.status)}</td>
        <td>${batteryBar(d.batteryLevel)}</td>
        <td style="font-family:monospace;font-size:12px;">${d.altitude > 0 ? d.altitude.toFixed(0) + ' m' : '—'}</td>
        <td style="font-family:monospace;font-size:12px;">${d.speed > 0 ? d.speed.toFixed(0) + ' kph' : '—'}</td>
        <td style="font-size:12px;color:var(--text-muted);">${d.regiment || '—'}</td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="btn-sm btn-ack" onclick="editDroneStatus('${d.id}','${d.status}','${d.name}')">Edit</button>
            <button class="btn-sm btn-resolve" style="border-color:var(--red);color:var(--red);" onclick="deleteDrone('${d.id}','${d.name}')">Remove</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Drones load error:', err);
  }
}

function openAddDroneModal() {
  document.getElementById('form-add-drone').reset();
  openModal('modal-add-drone');
}

document.getElementById('form-add-drone').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd.entries());
  body.maxAltitude = Number(body.maxAltitude);
  body.range       = Number(body.range);
  try {
    await apiPost('/drones', body);
    closeModal('modal-add-drone');
    loadDrones();
  } catch (err) {
    alert('Failed to register drone: ' + err.message);
  }
});

async function editDroneStatus(id, currentStatus, name) {
  const statuses = ['ACTIVE','IDLE','MISSION','MAINTENANCE','CHARGING','OFFLINE'];
  const newStatus = prompt(
    `Update status for ${name}\nCurrent: ${currentStatus}\n\nOptions: ${statuses.join(', ')}`,
    currentStatus
  );
  if (!newStatus || !statuses.includes(newStatus.toUpperCase())) return;
  try {
    await apiPut(`/drones/${id}`, { status: newStatus.toUpperCase() });
    loadDrones();
  } catch (err) {
    alert('Failed to update drone: ' + err.message);
  }
}

async function deleteDrone(id, name) {
  if (!confirm(`Remove drone ${name} (${id}) from the fleet?`)) return;
  try {
    await apiDelete(`/drones/${id}`);
    loadDrones();
  } catch (err) {
    alert('Failed to remove drone: ' + err.message);
  }
}
