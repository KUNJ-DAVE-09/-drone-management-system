const Pilot = require('../models/Pilot');

const getAll = (req, res) => res.json(Pilot.getAll());
const getById = (req, res) => {
  const p = Pilot.getById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Pilot not found' });
  res.json(p);
};
const getStats = (req, res) => res.json(Pilot.getStats());
const create = (req, res) => res.status(201).json(Pilot.create(req.body));
const update = (req, res) => {
  const p = Pilot.update(req.params.id, req.body);
  if (!p) return res.status(404).json({ error: 'Pilot not found' });
  res.json(p);
};
const remove = (req, res) => {
  const ok = Pilot.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Pilot not found' });
  res.json({ message: 'Pilot removed' });
};

module.exports = { getAll, getById, getStats, create, update, remove };
