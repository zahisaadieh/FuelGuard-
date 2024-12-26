const express = require('express');
const router = express.Router();
const FuelTypeController = require('../Controllers/FuelType');

router.get('/', FuelTypeController.getFuelType);

router.put('/:id', FuelTypeController.updatedFuelType);

module.exports = router;

