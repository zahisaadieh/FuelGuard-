const express = require('express');
const router = express.Router();
const { getLastCurrentCounter } = require('../Controllers/FuelTransaction'); 

router.get('/:id', getLastCurrentCounter);

module.exports = router;
