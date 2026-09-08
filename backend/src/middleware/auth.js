const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'india_army_drone_secret_2024';

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = auth;
