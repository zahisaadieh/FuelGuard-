// Ccard.jsx
import React, { useState } from 'react';
import EditCustomer from './editCustomer';
import Swal from 'sweetalert2';

const Ccard = ({ user, customer, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(user.isActivated);
  const [loading, setLoading] = useState(false);

  const handleSave = async (updatedCustomer) => {
    try {
      await onSave(updatedCustomer);
      setIsModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Customer Updated',
        text: 'Customer details have been successfully updated.',
      });
    } catch (error) {
      console.log('Error Second: ', error)
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Something went wrong while updating the customer.',
      });
    }
  };


  const toggleActiveStatus = async () => {
    setLoading(true);
    try {
      const updatedCustomer = { ...user, isActivated: !isActive };
      const response = await fetch(`http://localhost:3000/api/customers/${user._id}/activate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActivated: updatedCustomer.isActivated }),
      });

      if (!response.ok) throw new Error('Failed to update activation status');

      setIsActive(!isActive);
      onSave(updatedCustomer);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Activation Failed',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
      {/* Edit Button - positioned in the top-right corner */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-2 right-2 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800"
      >
        Edit
      </button>
  
      <div className="flex flex-col items-start p-4"> 
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {`${user.firstName} ${user.lastName}`}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">ID: {customer._id}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">phoneNumber: {user.phoneNumber}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">Credit Limit: {customer.creditLimit}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">Remaining Limit: {customer.remainingLimit.toFixed(2)}</span> 
        <span className="text-sm text-gray-500 dark:text-gray-400">Date: {new Date(user.createdAt).toLocaleDateString()}</span>
      </div>
  
      <div className="flex mt-4 justify-end px-4 pb-4"> 
        <button
          onClick={toggleActiveStatus}
          disabled={loading}
          className={`px-4 py-2 rounded ${loading ? 'bg-gray-400' : isActive ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {loading ? 'Updating...' : isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
  
      {/* Modal */}
      {isModalOpen && (
        <EditCustomer customerData={{ ...user, ...customer }} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );  
};

export default Ccard;
