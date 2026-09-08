const alertTypes = ['HOSTILE_DETECTION', 'LOW_BATTERY', 'SIGNAL_LOSS', 'GEOFENCE_BREACH', 'WEATHER', 'MECHANICAL', 'CYBER_THREAT', 'BORDER_VIOLATION'];

let alerts = [
  {
    id: 'ALT-001',
    type: 'HOSTILE_DETECTION',
    severity: 'CRITICAL',
    title: 'Hostile Movement Detected',
    message: 'Drone Garuda-Alpha detected 12 armed personnel crossing LOC at grid 32.76N/74.87E',
    droneId: 'DRN-001',
    missionId: 'MSN-001',
    sector: 'LOC Sector Alpha',
    latitude: 32.76,
    longitude: 74.87,
    acknowledged: false,
    acknowledgedBy: null,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    resolved: false,
    resolvedAt: null
  },
  {
    id: 'ALT-002',
    type: 'LOW_BATTERY',
    severity: 'HIGH',
    title: 'Critical Battery Level',
    message: 'Drone Vajra-Delta battery at 23%. Immediate RTB or charging required.',
    droneId: 'DRN-004',
    missionId: null,
    sector: 'Base Camp Kashmir',
    latitude: 34.0837,
    longitude: 74.7973,
    acknowledged: true,
    acknowledgedBy: 'USR-001',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    resolved: false,
    resolvedAt: null
  },
  {
    id: 'ALT-003',
    type: 'WEATHER',
    severity: 'MEDIUM',
    title: 'Adverse Weather Conditions',
    message: 'High wind speeds (>40 knots) reported in Eastern Sector. Missions may be affected.',
    droneId: null,
    missionId: null,
    sector: 'Eastern Command',
    latitude: 27.3516,
    longitude: 88.6065,
    acknowledged: false,
    acknowledgedBy: null,
    timestamp: new Date(Date.now() - 600000).toISOString(),
    resolved: false,
    resolvedAt: null
  },
  {
    id: 'ALT-004',
    type: 'CYBER_THREAT',
    severity: 'HIGH',
    title: 'GPS Jamming Detected',
    message: 'GPS jamming signal detected in Northern Sector. Drones switching to INS navigation.',
    droneId: null,
    missionId: 'MSN-001',
    sector: 'Northern Command',
    latitude: 32.7266,
    longitude: 74.8570,
    acknowledged: false,
    acknowledgedBy: null,
    timestamp: new Date(Date.now() - 900000).toISOString(),
    resolved: false,
    resolvedAt: null
  }
];

let alertIdCounter = 5;

module.exports = {
  getAll: () => alerts,
  getById: (id) => alerts.find(a => a.id === id),
  getUnacknowledged: () => alerts.filter(a => !a.acknowledged),
  create: (data) => {
    const alert = {
      id: `ALT-${String(alertIdCounter++).padStart(3, '0')}`,
      ...data,
      acknowledged: false,
      acknowledgedBy: null,
      resolved: false,
      resolvedAt: null,
      timestamp: new Date().toISOString()
    };
    alerts.push(alert);
    return alert;
  },
  acknowledge: (id, userId) => {
    const idx = alerts.findIndex(a => a.id === id);
    if (idx === -1) return null;
    alerts[idx].acknowledged = true;
    alerts[idx].acknowledgedBy = userId;
    alerts[idx].acknowledgedAt = new Date().toISOString();
    return alerts[idx];
  },
  resolve: (id) => {
    const idx = alerts.findIndex(a => a.id === id);
    if (idx === -1) return null;
    alerts[idx].resolved = true;
    alerts[idx].resolvedAt = new Date().toISOString();
    return alerts[idx];
  },
  getStats: () => ({
    total: alerts.length,
    unacknowledged: alerts.filter(a => !a.acknowledged).length,
    critical: alerts.filter(a => a.severity === 'CRITICAL').length,
    high: alerts.filter(a => a.severity === 'HIGH').length,
    medium: alerts.filter(a => a.severity === 'MEDIUM').length,
    resolved: alerts.filter(a => a.resolved).length
  })
};
