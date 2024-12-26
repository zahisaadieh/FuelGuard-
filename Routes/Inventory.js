// Routes/Inventory.js
const express = require('express');
const router = express.Router();
const {updateInventoryQuantity, addInventory, getInventoryData,getInventory  } = require('../Controllers/Inventory');

router.post('/add', addInventory);
router.get('/data', getInventoryData);
router.get('/', getInventory);
router.post('/update-quantity/:inventoryID',updateInventoryQuantity);


module.exports = router;
