
const express = require('express');
const router = express.Router();
const managerController = require('../Controllers/Manager');


router.post('/add', managerController.addManager);

router.get('/', managerController.getManagers);

router.put('/:id/activate',managerController.isActivated)

module.exports = router;
