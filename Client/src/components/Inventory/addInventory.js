import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddInventory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventoryName, setInventoryName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    
    if (!inventoryName || !capacity || !fuelType) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all fields.',
      });
      return;
    }
    if (capacity <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Capacity must be a positive number.',
      });
      return;
    }

    const inventoryData = {
      inventoryName,
      capacity: Number(capacity),
      currentCapacity: 0,
      fuelType,
    };
 
    setIsLoading(true);

    try {
    
      const response = await axios.post('http://localhost:3000/api/inventory/add', inventoryData);

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Inventory added successfully!',
        });
       
        setInventoryName('');
        setCapacity('');
        setFuelType('');
        toggleModal();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.error || 'An error occurred.',
        });
      }
    } catch (error) {
      console.error('Failed to add inventory:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while adding the inventory.',
      });
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="ml-8 mb-4 mt-4 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Add Inventory
      </button>

      {isModalOpen && (
        <div
          id="inventory-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
        >
          <div className="relative p-6 w-full max-w-lg">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add Inventory
                </h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                
                  <div>
                    <label htmlFor="inventoryName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Inventory Name
                    </label>
                    <input
                      type="text"
                      id="inventoryName"
                      value={inventoryName}
                      onChange={(e) => setInventoryName(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="capacity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Capacity
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="fuelType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Fuel Type
                    </label>
                    <input
                      type="text"
                      id="fuelType"
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add Inventory'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddInventory;
