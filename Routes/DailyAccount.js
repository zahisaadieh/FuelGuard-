const express = require('express');
const router = express.Router();
const inventoryController = require('../Controllers/DailyAccount');

router.get('/', inventoryController.getAllInventoriesAndTransactions);

module.exports = router;
