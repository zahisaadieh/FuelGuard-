import React, { useState } from 'react';
import EditSupplier from './editSupplier';

const Scard = ({ supplier, onUpdateSupplier }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (updatedSupplier) => {
    onUpdateSupplier(updatedSupplier);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative p-4">
     
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-2 right-2 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Edit
      </button>

      <div className="mt-4 flex flex-col items-start pb-4">
        <h5 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">{supplier.name}</h5>
        <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
          <strong>Email:</strong> {supplier.email}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Phone:</strong> {supplier.phoneNumber}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Date:</strong> {new Date(supplier.createdAt).toLocaleDateString()}
        </p>
      </div>

      {isModalOpen && <EditSupplier supplier={supplier} onSave={handleSave} onCancel={handleCancel} />}
    </div>
  );
};

export default Scard;
