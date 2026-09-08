const bcrypt = require('bcryptjs');

let users = [
  {
    id: 'USR-001',
    username: 'admin',
    password: bcrypt.hashSync('Admin@Army2024', 10),
    name: 'Brigadier Arun Mehta',
    rank: 'Brigadier',
    role: 'SYSTEM_ADMIN',
    regiment: 'HQ Northern Command',
    email: 'admin@army.mil.in',
    phone: '+91-9800000001',
    clearanceLevel: 'TOP_SECRET',
    active: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: 'USR-002',
    username: 'ops_officer',
    password: bcrypt.hashSync('Ops@Army2024', 10),
    name: 'Colonel Rajesh Kumar',
    rank: 'Colonel',
    role: 'OPS_OFFICER',
    regiment: '50 Para',
    email: 'raj.kumar@army.mil.in',
    phone: '+91-9800000002',
    clearanceLevel: 'SECRET',
    active: true,
    lastLogin: new Date().toISOString()
  }
];

module.exports = {
  getAll: () => users.map(u => { const { password, ...rest } = u; return rest; }),
  getById: (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  },
  getByUsername: (username) => users.find(u => u.username === username),
  create: (data) => {
    const user = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      ...data,
      password: bcrypt.hashSync(data.password, 10),
      active: true,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    const { password, ...rest } = user;
    return rest;
  },
  update: (id, data) => {
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data, updatedAt: new Date().toISOString() };
    const { password, ...rest } = users[idx];
    return rest;
  }
};
