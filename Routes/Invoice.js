const express = require('express');
const router = express.Router();
const invoiceController = require('../Controllers/Invoice');


router.get('/invoices', invoiceController.getInvoicesWithSuppliers);


router.get('/suppliers', invoiceController.getSuppliers);

router.get('/suppliers/:supplierID/unpaid-invoices', invoiceController.getUnpaidInvoices);


router.post('/invoices/pay', invoiceController.payInvoice);


module.exports = router;
 