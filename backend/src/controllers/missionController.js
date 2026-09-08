const Mission = require('../models/Mission');

const getAll = (req, res) => res.json(Mission.getAll());
const getById = (req, res) => {
  const m = Mission.getById(req.params.id);
  if (!m) return res.status(404).json({ error: 'Mission not found' });
  res.json(m);
};
const getStats = (req, res) => res.json(Mission.getStats());
const create = (req, res) => res.status(201).json(Mission.create(req.body));
const update = (req, res) => {
  const m = Mission.update(req.params.id, req.body);
  if (!m) return res.status(404).json({ error: 'Mission not found' });
  res.json(m);
};
const remove = (req, res) => {
  const ok = Mission.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Mission not found' });
  res.json({ message: 'Mission removed' });
};
const abort = (req, res) => {
  const m = Mission.update(req.params.id, { status: 'ABORTED', endTime: new Date().toISOString() });
  if (!m) return res.status(404).json({ error: 'Mission not found' });
  res.json(m);
};

module.exports = { getAll, getById, getStats, create, update, remove, abort };
