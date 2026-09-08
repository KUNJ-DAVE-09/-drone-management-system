const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'india_army_drone_secret_2024';

const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const user = User.getByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  User.update(user.id, { lastLogin: new Date().toISOString() });
  const { password: _, ...userWithoutPwd } = user;
  res.json({ token, user: userWithoutPwd, expiresIn: 28800 });
};

const me = (req, res) => {
  const user = User.getById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

module.exports = { login, me };
