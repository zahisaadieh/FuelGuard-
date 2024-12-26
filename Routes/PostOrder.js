const express = require('express');
const router = express.Router();
const {  getPostOrders } = require('../Controllers/PostOrder');


router.get('/', getPostOrders);

module.exports = router;
