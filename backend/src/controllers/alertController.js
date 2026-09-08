const Alert = require('../models/Alert');

const getAll = (req, res) => res.json(Alert.getAll());
const getById = (req, res) => {
  const a = Alert.getById(req.params.id);
  if (!a) return res.status(404).json({ error: 'Alert not found' });
  res.json(a);
};
const getStats = (req, res) => res.json(Alert.getStats());
const getUnacknowledged = (req, res) => res.json(Alert.getUnacknowledged());
const create = (req, res) => res.status(201).json(Alert.create(req.body));
const acknowledge = (req, res) => {
  const a = Alert.acknowledge(req.params.id, req.user?.id || 'USR-001');
  if (!a) return res.status(404).json({ error: 'Alert not found' });
  res.json(a);
};
const resolve = (req, res) => {
  const a = Alert.resolve(req.params.id);
  if (!a) return res.status(404).json({ error: 'Alert not found' });
  res.json(a);
};

module.exports = { getAll, getById, getStats, getUnacknowledged, create, acknowledge, resolve };
