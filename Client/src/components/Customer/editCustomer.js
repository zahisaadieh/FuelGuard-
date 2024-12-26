// EditCustomer.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EditCustomer = ({ customerData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ...customerData
  })
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.creditLimit) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill in all fields before saving.',
      });
      return false;
    }
    if (isNaN(formData.creditLimit) || parseFloat(formData.creditLimit) < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Credit Limit',
        text: 'Credit limit must be a positive number.',
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (typeof onSave === 'function') {
        await onSave(formData);
      } else {
        console.error('onSave is not a function');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Something went wrong while updating the customer.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-md">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Customer</h3>
            <button onClick={onClose} className="text-gray-400 hover:bg-gray-200 rounded-lg p-2">✖</button>
          </div>

          <div className="p-4">
            <form className="space-y-4">
              <div>
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData(old => ({ ...old, email: e.target.value }))} className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">First Name</label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData(old => ({ ...old, firstName: e.target.value }))} className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Last Name</label>
                <input type="text" value={formData.lastName} onChange={(e) => setFormData(old => ({ ...old, lastName: e.target.value }))} className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData((old) => ({ ...old, phoneNumber: value }));
                  }}
                  className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Credit Limit</label>
                <input type="number" value={formData.creditLimit} onChange={(e) => setFormData(old => ({ ...old, creditLimit: e.target.value }))} className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white" />
              </div>

              <button
                type="button"
                onClick={handleSave}
                className={`w-full p-2 rounded mt-4 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
