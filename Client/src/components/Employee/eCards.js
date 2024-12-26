import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Ecard from './ecard';
import SearchEBar from './SearchEBar';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';

function Ecards() {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/employees');
        const employeesWithFullNames = response.data.map((employee) => ({
          ...employee,
          name: `${employee.firstName} ${employee.lastName}`,
        }));
        setEmployees(employeesWithFullNames);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee._id === updatedEmployee._id ? updatedEmployee : employee
      )
    );
    setIsEditModalOpen(false);
  };

  return (
    <div className="myCards">
      <div className="searchbutton">
        <SearchEBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <AddEmployee />
      </div>
      <div className="cards-container grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee) => (
          <Ecard
            key={employee._id}
            employee={employee}
            onEdit={() => handleEdit(employee)}
          />
        ))}
      </div>

      {isEditModalOpen && selectedEmployee && (
        <EditEmployee
          supplier={selectedEmployee}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Ecards;
