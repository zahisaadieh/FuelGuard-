const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/CustomerInvoice');

router.get('/:userId', orderController.getReleasedOrdersByCustomer);

router.post('/markOrdersAsPaid', orderController.markOrdersAsPaid);

module.exports = router;
