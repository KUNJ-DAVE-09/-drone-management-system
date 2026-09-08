const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/alertController');

router.get('/', ctrl.getAll);
router.get('/stats', ctrl.getStats);
router.get('/unacknowledged', ctrl.getUnacknowledged);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.post('/:id/acknowledge', ctrl.acknowledge);
router.post('/:id/resolve', ctrl.resolve);

module.exports = router;
