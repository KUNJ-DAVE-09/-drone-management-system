let pilots = [
  {
    id: 'PLT-001',
    name: 'Subedar Arjun Verma',
    rank: 'Subedar',
    regiment: '50 Para',
    specialization: ['SURVEILLANCE', 'RECONNAISSANCE'],
    clearanceLevel: 'SECRET',
    licenseNumber: 'IA-DPL-2022-001',
    certifiedDroneTypes: ['SURVEILLANCE', 'RECONNAISSANCE', 'LOGISTICS'],
    status: 'ON_MISSION',
    currentMission: 'MSN-001',
    totalFlightHours: 1240,
    missionCount: 87,
    successRate: 98.8,
    lastMedical: '2024-10-15',
    phone: '+91-9800001001',
    email: 'arjun.verma@army.mil.in',
    joinedDate: '2019-03-01',
    createdAt: new Date().toISOString()
  },
  {
    id: 'PLT-002',
    name: 'Havildar Ranjit Singh',
    rank: 'Havildar',
    regiment: '9 Para SF',
    specialization: ['COMBAT', 'STRIKE'],
    clearanceLevel: 'TOP_SECRET',
    licenseNumber: 'IA-DPL-2021-002',
    certifiedDroneTypes: ['COMBAT', 'EW', 'SURVEILLANCE'],
    status: 'ON_MISSION',
    currentMission: 'MSN-002',
    totalFlightHours: 876,
    missionCount: 54,
    successRate: 100,
    lastMedical: '2024-11-01',
    phone: '+91-9800001002',
    email: 'ranjit.singh@army.mil.in',
    joinedDate: '2020-07-15',
    createdAt: new Date().toISOString()
  },
  {
    id: 'PLT-003',
    name: 'Naib Subedar Priya Sharma',
    rank: 'Naib Subedar',
    regiment: 'Tech Corps',
    specialization: ['SWARM_OPS', 'EW'],
    clearanceLevel: 'SECRET',
    licenseNumber: 'IA-DPL-2023-003',
    certifiedDroneTypes: ['SWARM', 'EW', 'SURVEILLANCE'],
    status: 'ON_MISSION',
    currentMission: 'MSN-003',
    totalFlightHours: 320,
    missionCount: 23,
    successRate: 95.6,
    lastMedical: '2024-12-01',
    phone: '+91-9800001003',
    email: 'priya.sharma@army.mil.in',
    joinedDate: '2022-01-10',
    createdAt: new Date().toISOString()
  },
  {
    id: 'PLT-004',
    name: 'Sepoy Deepak Nair',
    rank: 'Sepoy',
    regiment: '1 SF',
    specialization: ['ISR', 'RECONNAISSANCE'],
    clearanceLevel: 'SECRET',
    licenseNumber: 'IA-DPL-2024-004',
    certifiedDroneTypes: ['RECONNAISSANCE', 'SURVEILLANCE'],
    status: 'STANDBY',
    currentMission: null,
    totalFlightHours: 156,
    missionCount: 12,
    successRate: 91.6,
    lastMedical: '2024-11-20',
    phone: '+91-9800001004',
    email: 'deepak.nair@army.mil.in',
    joinedDate: '2023-06-01',
    createdAt: new Date().toISOString()
  }
];

module.exports = {
  getAll: () => pilots,
  getById: (id) => pilots.find(p => p.id === id),
  create: (data) => {
    const pilot = {
      id: `PLT-${String(pilots.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'STANDBY',
      missionCount: 0,
      successRate: 100,
      createdAt: new Date().toISOString()
    };
    pilots.push(pilot);
    return pilot;
  },
  update: (id, data) => {
    const idx = pilots.findIndex(p => p.id === id);
    if (idx === -1) return null;
    pilots[idx] = { ...pilots[idx], ...data, updatedAt: new Date().toISOString() };
    return pilots[idx];
  },
  remove: (id) => {
    const idx = pilots.findIndex(p => p.id === id);
    if (idx === -1) return false;
    pilots.splice(idx, 1);
    return true;
  },
  getStats: () => ({
    total: pilots.length,
    onMission: pilots.filter(p => p.status === 'ON_MISSION').length,
    standby: pilots.filter(p => p.status === 'STANDBY').length,
    offDuty: pilots.filter(p => p.status === 'OFF_DUTY').length,
    avgFlightHours: Math.round(pilots.reduce((a, p) => a + p.totalFlightHours, 0) / pilots.length)
  })
};
