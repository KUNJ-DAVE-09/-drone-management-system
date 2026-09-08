const Drone = require('../models/Drone');

const getAll = (req, res) => res.json(Drone.getAll());
const getById = (req, res) => {
  const drone = Drone.getById(req.params.id);
  if (!drone) return res.status(404).json({ error: 'Drone not found' });
  res.json(drone);
};
const getStats = (req, res) => res.json(Drone.getStats());
const create = (req, res) => {
  const drone = Drone.create(req.body);
  res.status(201).json(drone);
};
const update = (req, res) => {
  const drone = Drone.update(req.params.id, req.body);
  if (!drone) return res.status(404).json({ error: 'Drone not found' });
  res.json(drone);
};
const remove = (req, res) => {
  const success = Drone.remove(req.params.id);
  if (!success) return res.status(404).json({ error: 'Drone not found' });
  res.json({ message: 'Drone removed successfully' });
};
// Simulate live telemetry update
const simulateTelemetry = (req, res) => {
  const drones = Drone.getAll();
  drones.forEach(d => {
    if (d.status === 'ACTIVE' || d.status === 'MISSION') {
      Drone.update(d.id, {
        latitude: d.latitude + (Math.random() - 0.5) * 0.005,
        longitude: d.longitude + (Math.random() - 0.5) * 0.005,
        altitude: Math.max(0, d.altitude + (Math.random() - 0.5) * 50),
        speed: Math.max(0, d.speed + (Math.random() - 0.5) * 10),
        heading: (d.heading + (Math.random() - 0.5) * 10 + 360) % 360,
        batteryLevel: Math.max(0, d.batteryLevel - Math.random() * 0.5)
      });
    }
  });
  res.json({ message: 'Telemetry updated', drones: Drone.getAll() });
};

module.exports = { getAll, getById, getStats, create, update, remove, simulateTelemetry };
