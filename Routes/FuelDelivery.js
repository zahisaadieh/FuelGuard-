const express = require('express');
const router = express.Router();
const {deleteFuelDelivery ,updateFuelDelivery, addFuelDelivery, getSuppliers, getInventories,getFuelDeliveries } = require('../Controllers/FuelDelivery');

router.post('/add', addFuelDelivery);
router.get('/suppliers', getSuppliers);
router.get('/inventories', getInventories);
router.get('/', getFuelDeliveries);
router.put('/:id', updateFuelDelivery);
router.delete('/:id', deleteFuelDelivery);


module.exports = router;
