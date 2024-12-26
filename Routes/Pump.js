const express = require('express');
const router = express.Router();
const pumpController = require('../Controllers/Pump');


router.post('/add', pumpController.addPump);
router.get('/', pumpController.getPumps);
router.post('/stop', pumpController.stopPumpTransaction);

module.exports = router;
