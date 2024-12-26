const express = require('express');
const router = express.Router();
const { createOrder , getAllOrders, searchOrderById } = require('../Controllers/Order');

router.post('/add', createOrder);

router.get('/', getAllOrders);

router.get('/:orderId', searchOrderById);


module.exports = router;
