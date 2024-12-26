import React, { useState } from 'react';
import Swal from 'sweetalert2';

function AddEmployee({ onSuccess = () => {} }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [shiftName, setShiftName] = useState('Day');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (setter) => (e) => setter(e.target.value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phoneNumber || !salaryAmount) {
      Swal.fire('Error', 'All fields are required.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire('Error', 'Please enter a valid email address.', 'error');
      return;
    }

    const phoneRegex = /^\+961 \d{2} \d{3} \d{3}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Swal.fire('Error', 'Please enter a valid phone number (e.g., +961 XX XXX XXX).', 'error');
      return;
    }

    const employeeData = { firstName, lastName, email, phoneNumber, salaryAmount, shiftName };

    try {
      setIsSubmitting(true);

      const response = await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire('Success', 'Employee added successfully!', 'success');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setSalaryAmount('');
        setShiftName('Day');
        toggleModal();
        onSuccess(result);
      } else {
        Swal.fire('Error', result.message || 'Failed to add employee.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', `An error occurred: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
      >
        Add Employee
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-semibold">Add an Employee</h3>
              <button onClick={toggleModal} className="text-gray-500 hover:text-red-500">
                &times;
              </button>
            </div>

            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={handleChange(setFirstName)}
                  className="border rounded-lg w-full p-2"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={handleChange(setLastName)}
                  className="border rounded-lg w-full p-2"
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={handleChange(setEmail)}
                  className="border rounded-lg w-full p-2"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handleChange(setPhoneNumber)}
                  className="border rounded-lg w-full p-2"
                  placeholder="+961 XX XXX XXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Salary Amount</label>
                <input
                  type="number"
                  value={salaryAmount}
                  onChange={handleChange(setSalaryAmount)}
                  className="border rounded-lg w-full p-2"
                  placeholder="Enter salary amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Shift</label>
                <select
                  value={shiftName}
                  onChange={handleChange(setShiftName)}
                  className="border rounded-lg w-full p-2"
                >
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white ${
                  isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } font-medium rounded-lg text-sm px-5 py-2.5`}
              >
                {isSubmitting ? 'Submitting...' : 'Add Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddEmployee;
