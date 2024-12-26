const express = require('express');
const router = express.Router();
const { AddSupplier, GetSuppliers,GetSupplier } = require('../Controllers/Supplier');  // Import controller methods


router.get('/get', GetSuppliers);

router.get('/', GetSupplier);


router.post('/add', AddSupplier);

module.exports = router;

