const express = require('express');
const router = express.Router();
const customerController = require('../Controllers/Customer');


router.post('/add', customerController.addCustomer);

router.get('/', customerController.getCustomers);

router.get('/:customerId', customerController.getCustomerById);

router.put('/:id/activate',customerController.isActivated);

router.put('/:id', customerController.updateCustomer);




module.exports = router;
