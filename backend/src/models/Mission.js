const missionStatuses = ['PLANNED', 'BRIEFING', 'ACTIVE', 'COMPLETED', 'ABORTED', 'STANDBY'];
const missionTypes = ['BORDER_PATROL', 'ISR', 'STRIKE', 'LOGISTICS', 'SEARCH_RESCUE', 'EW_OPS', 'SWARM_OPS'];

let missions = [
  {
    id: 'MSN-001',
    name: 'Op. Eagle Eye',
    type: 'BORDER_PATROL',
    status: 'ACTIVE',
    priority: 'HIGH',
    classification: 'SECRET',
    sector: 'Northern Command - LOC Sector Alpha',
    objective: 'Continuous surveillance of LOC border region, detect any infiltration attempts',
    assignedDrones: ['DRN-001'],
    assignedPilots: ['PLT-001'],
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: null,
    estimatedDuration: 240,
    waypoints: [
      { lat: 32.7266, lng: 74.8570, alt: 1200, action: 'SURVEIL' },
      { lat: 32.8100, lng: 74.9000, alt: 1200, action: 'SURVEIL' },
      { lat: 32.8500, lng: 74.8200, alt: 1500, action: 'SURVEIL' },
      { lat: 32.7600, lng: 74.7800, alt: 1200, action: 'RTB' }
    ],
    commandingOfficer: 'Col. Rajesh Kumar',
    regiment: '50 Para',
    threatLevel: 'MODERATE',
    notes: 'Increased activity observed in Sector Alpha. Enhanced surveillance required.',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'MSN-002',
    name: 'Op. Thunderstrike',
    type: 'STRIKE',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    classification: 'TOP SECRET',
    sector: 'Northern Command - Forward Area Beta',
    objective: 'Neutralize identified enemy artillery position at grid reference 33N/75E',
    assignedDrones: ['DRN-002'],
    assignedPilots: ['PLT-002'],
    startTime: new Date(Date.now() - 1800000).toISOString(),
    endTime: null,
    estimatedDuration: 90,
    waypoints: [
      { lat: 33.1234, lng: 75.4321, alt: 800, action: 'INGRESS' },
      { lat: 33.1500, lng: 75.4500, alt: 600, action: 'TARGET_ACQUIRE' },
      { lat: 33.1600, lng: 75.4600, alt: 400, action: 'ENGAGE' },
      { lat: 33.1000, lng: 75.3800, alt: 800, action: 'EGRESS' }
    ],
    commandingOfficer: 'Brig. Vikram Singh',
    regiment: '9 Para SF',
    threatLevel: 'CRITICAL',
    notes: 'Coordinates confirmed by 3 independent intel sources. ROE applied.',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'MSN-003',
    name: 'Op. Swarm Shield',
    type: 'SWARM_OPS',
    status: 'ACTIVE',
    priority: 'HIGH',
    classification: 'SECRET',
    sector: 'Western Command - Forward Base Gamma',
    objective: 'Swarm deployment exercise with coordination between 6 micro-drones for area denial',
    assignedDrones: ['DRN-006'],
    assignedPilots: ['PLT-003'],
    startTime: new Date(Date.now() - 900000).toISOString(),
    endTime: null,
    estimatedDuration: 60,
    waypoints: [
      { lat: 33.7782, lng: 75.3456, alt: 500, action: 'DEPLOY' },
      { lat: 33.7900, lng: 75.3600, alt: 500, action: 'PATTERN' },
      { lat: 33.7700, lng: 75.3300, alt: 500, action: 'PATTERN' }
    ],
    commandingOfficer: 'Lt. Col. Priya Sharma',
    regiment: 'Tech Corps',
    threatLevel: 'LOW',
    notes: 'Routine exercise. Data to be analysed post-mission.',
    createdAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'MSN-004',
    name: 'Op. Silent Hawk',
    type: 'ISR',
    status: 'PLANNED',
    priority: 'MEDIUM',
    classification: 'SECRET',
    sector: 'Eastern Command - Arunachal Sector',
    objective: 'Intelligence, Surveillance and Reconnaissance of forward positions',
    assignedDrones: ['DRN-003'],
    assignedPilots: ['PLT-004'],
    startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: null,
    estimatedDuration: 180,
    waypoints: [],
    commandingOfficer: 'Col. Deepak Nair',
    regiment: '1 SF',
    threatLevel: 'MODERATE',
    notes: 'Pre-mission briefing at 1800 hrs.',
    createdAt: new Date().toISOString()
  }
];

module.exports = {
  getAll: () => missions,
  getById: (id) => missions.find(m => m.id === id),
  create: (data) => {
    const mission = {
      id: `MSN-${String(missions.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'PLANNED',
      createdAt: new Date().toISOString()
    };
    missions.push(mission);
    return mission;
  },
  update: (id, data) => {
    const idx = missions.findIndex(m => m.id === id);
    if (idx === -1) return null;
    missions[idx] = { ...missions[idx], ...data, updatedAt: new Date().toISOString() };
    return missions[idx];
  },
  remove: (id) => {
    const idx = missions.findIndex(m => m.id === id);
    if (idx === -1) return false;
    missions.splice(idx, 1);
    return true;
  },
  getStats: () => ({
    total: missions.length,
    active: missions.filter(m => m.status === 'ACTIVE').length,
    planned: missions.filter(m => m.status === 'PLANNED').length,
    completed: missions.filter(m => m.status === 'COMPLETED').length,
    aborted: missions.filter(m => m.status === 'ABORTED').length,
    critical: missions.filter(m => m.priority === 'CRITICAL').length
  })
};
