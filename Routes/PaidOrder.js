const express = require('express');
const router = express.Router();

const {  getCustomerInvoices } = require('../Controllers/PaidOrder');


router.get('/', getCustomerInvoices);

module.exports = router;
