require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const droneRoutes = require('./routes/drones');
const missionRoutes = require('./routes/missions');
const pilotRoutes = require('./routes/pilots');
const alertRoutes = require('./routes/alerts');
const telemetryRoutes = require('./routes/telemetry');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/pilots', pilotRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/telemetry', telemetryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OPERATIONAL',
    system: 'Indian Army Drone Management System',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    classification: 'TOP SECRET'
  });
});

// Catch-all: serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║   INDIAN ARMY DRONE MANAGEMENT SYSTEM v1.0       ║
║   Server running on port ${PORT}                    ║
║   Classification: TOP SECRET                     ║
╚══════════════════════════════════════════════════╝
  `);
});

module.exports = app;
