const Employee = require('../Models/Employee');


exports.createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, salaryAmount, shiftName } = req.body;

    
    const existingEmployee = await Employee.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email or phone number already exists' });
    }

    const employee = new Employee({
      firstName,
      lastName,
      email,
      phoneNumber,
      salaryAmount,
      shiftName,
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, salaryAmount, shiftName } = req.body;

    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { phoneNumber }],
      _id: { $ne: id },
    });

    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email or phone number already exists' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { firstName, lastName, email, phoneNumber, salaryAmount, shiftName },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    salaryAmount,
    shiftName,
    leftDate,
  } = req.body;

  try {
   
    if (!firstName || !lastName || !email || !phoneNumber || !shiftName) {
      return res.status(400).json({
        status: 'error',
        message: 'All required fields must be provided.',
      });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        salaryAmount,
        shiftName,
        leftDate: leftDate ? new Date(leftDate) : null, 
      },
      { new: true, runValidators: true } 
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Employee updated successfully.',
      data: updatedEmployee,
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the employee.',
    });
  }
};

