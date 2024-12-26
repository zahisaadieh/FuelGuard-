// Routes/Admin.js
const express = require('express');
const router = express.Router();
const { addAdmin, getAdmins, isActivated } = require('../Controllers/Admin');

router.post('/add', addAdmin); 
router.get('/', getAdmins);    
router.put('/:id/activate', isActivated);

module.exports = router;

