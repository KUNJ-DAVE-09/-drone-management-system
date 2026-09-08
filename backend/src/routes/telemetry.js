const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/telemetryController');

router.get('/live', ctrl.getLive);
router.get('/:id', ctrl.getDroneTelemetry);

module.exports = router;
