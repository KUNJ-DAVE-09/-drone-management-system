// In-memory data store (replace with DB in production)
const { v4: uuidv4 } = require('uuid');

const droneStatuses = ['ACTIVE', 'IDLE', 'MAINTENANCE', 'MISSION', 'OFFLINE', 'CHARGING'];
const droneTypes = ['SURVEILLANCE', 'COMBAT', 'LOGISTICS', 'RECONNAISSANCE', 'EW', 'SWARM'];

let drones = [
  {
    id: 'DRN-001',
    name: 'Garuda-Alpha',
    type: 'SURVEILLANCE',
    status: 'ACTIVE',
    batteryLevel: 87,
    altitude: 1200,
    speed: 85,
    latitude: 32.7266,
    longitude: 74.8570,
    heading: 45,
    range: 150,
    payload: 'EO/IR Camera',
    pilot: 'PLT-001',
    missionId: 'MSN-001',
    regiment: '50 Para',
    serialNumber: 'IA-DRN-2024-001',
    lastMaintenance: '2024-12-01',
    flightHours: 342,
    maxAltitude: 5000,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DRN-002',
    name: 'Shakti-Bravo',
    type: 'COMBAT',
    status: 'MISSION',
    batteryLevel: 65,
    altitude: 800,
    speed: 120,
    latitude: 33.1234,
    longitude: 75.4321,
    heading: 90,
    range: 200,
    payload: 'Anti-tank Missile System',
    pilot: 'PLT-002',
    missionId: 'MSN-002',
    regiment: '9 Para SF',
    serialNumber: 'IA-DRN-2024-002',
    lastMaintenance: '2024-11-15',
    flightHours: 187,
    maxAltitude: 6000,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DRN-003',
    name: 'Agni-Charlie',
    type: 'RECONNAISSANCE',
    status: 'IDLE',
    batteryLevel: 100,
    altitude: 0,
    speed: 0,
    latitude: 32.0811,
    longitude: 76.9966,
    heading: 0,
    range: 300,
    payload: 'SAR Radar',
    pilot: null,
    missionId: null,
    regiment: '1 SF',
    serialNumber: 'IA-DRN-2024-003',
    lastMaintenance: '2024-12-10',
    flightHours: 512,
    maxAltitude: 8000,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DRN-004',
    name: 'Vajra-Delta',
    type: 'LOGISTICS',
    status: 'CHARGING',
    batteryLevel: 23,
    altitude: 0,
    speed: 0,
    latitude: 34.0837,
    longitude: 74.7973,
    heading: 0,
    range: 100,
    payload: 'Cargo Bay 20kg',
    pilot: null,
    missionId: null,
    regiment: 'HQ Northern Command',
    serialNumber: 'IA-DRN-2024-004',
    lastMaintenance: '2024-12-05',
    flightHours: 89,
    maxAltitude: 4000,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DRN-005',
    name: 'Indra-Echo',
    type: 'EW',
    status: 'MAINTENANCE',
    batteryLevel: 0,
    altitude: 0,
    speed: 0,
    latitude: 31.6340,
    longitude: 74.8723,
    heading: 0,
    range: 120,
    payload: 'Electronic Warfare Suite',
    pilot: null,
    missionId: null,
    regiment: '71 Signal Regiment',
    serialNumber: 'IA-DRN-2024-005',
    lastMaintenance: '2024-12-12',
    flightHours: 228,
    maxAltitude: 5500,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DRN-006',
    name: 'Brahma-Foxtrot',
    type: 'SWARM',
    status: 'ACTIVE',
    batteryLevel: 78,
    altitude: 500,
    speed: 60,
    latitude: 33.7782,
    longitude: 75.3456,
    heading: 270,
    range: 50,
    payload: 'Swarm Coordination Unit',
    pilot: 'PLT-003',
    missionId: 'MSN-003',
    regiment: 'Tech Corps',
    serialNumber: 'IA-DRN-2024-006',
    lastMaintenance: '2024-12-08',
    flightHours: 45,
    maxAltitude: 3000,
    createdAt: new Date().toISOString()
  }
];

module.exports = {
  getAll: () => drones,
  getById: (id) => drones.find(d => d.id === id),
  create: (data) => {
    const drone = {
      id: `DRN-${String(drones.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'IDLE',
      batteryLevel: 100,
      altitude: 0,
      speed: 0,
      flightHours: 0,
      createdAt: new Date().toISOString()
    };
    drones.push(drone);
    return drone;
  },
  update: (id, data) => {
    const idx = drones.findIndex(d => d.id === id);
    if (idx === -1) return null;
    drones[idx] = { ...drones[idx], ...data, updatedAt: new Date().toISOString() };
    return drones[idx];
  },
  remove: (id) => {
    const idx = drones.findIndex(d => d.id === id);
    if (idx === -1) return false;
    drones.splice(idx, 1);
    return true;
  },
  getStats: () => ({
    total: drones.length,
    active: drones.filter(d => d.status === 'ACTIVE').length,
    mission: drones.filter(d => d.status === 'MISSION').length,
    idle: drones.filter(d => d.status === 'IDLE').length,
    maintenance: drones.filter(d => d.status === 'MAINTENANCE').length,
    charging: drones.filter(d => d.status === 'CHARGING').length,
    offline: drones.filter(d => d.status === 'OFFLINE').length,
    byType: droneTypes.reduce((acc, type) => {
      acc[type] = drones.filter(d => d.type === type).length;
      return acc;
    }, {})
  })
};
