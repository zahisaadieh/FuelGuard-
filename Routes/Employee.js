const express = require('express');
const router = express.Router();
const employeeController = require('../Controllers/Employee');

router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getEmployees);
router.put('/:id', employeeController.updateEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
