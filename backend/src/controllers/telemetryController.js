// Telemetry controller - returns live simulated data for all drones
const Drone = require('../models/Drone');

const getLive = (req, res) => {
  const drones = Drone.getAll();
  const telemetry = drones.map(d => ({
    droneId: d.id,
    name: d.name,
    status: d.status,
    latitude: d.latitude,
    longitude: d.longitude,
    altitude: d.altitude,
    speed: d.speed,
    heading: d.heading,
    batteryLevel: d.batteryLevel,
    timestamp: new Date().toISOString()
  }));
  res.json(telemetry);
};

const getDroneTelemetry = (req, res) => {
  const drone = Drone.getById(req.params.id);
  if (!drone) return res.status(404).json({ error: 'Drone not found' });
  res.json({
    droneId: drone.id,
    name: drone.name,
    status: drone.status,
    latitude: drone.latitude,
    longitude: drone.longitude,
    altitude: drone.altitude,
    speed: drone.speed,
    heading: drone.heading,
    batteryLevel: drone.batteryLevel,
    signal: Math.floor(80 + Math.random() * 20),
    gpsLock: drone.status !== 'OFFLINE',
    timestamp: new Date().toISOString()
  });
};

module.exports = { getLive, getDroneTelemetry };
