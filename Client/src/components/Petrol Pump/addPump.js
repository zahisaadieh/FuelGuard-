import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddPump() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pumpName, setPumpName] = useState('');
  const [inventoryID, setInventoryID] = useState('');
  const [inventories, setInventories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/inventory');
      setInventories(response.data);
    } catch (error) {
      console.error('Error fetching inventories:', error);
      Swal.fire('Error', 'Failed to fetch inventories', 'error');
    }
  };

  const handleAddPump = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await axios.post('http://localhost:3000/api/pump/add', {
        pumpName,
        inventoryID,
      });
  
      
      if (response.data.message === 'Pump added successfully') {
        Swal.fire({
          title: 'Success!',
          text: 'Pump added successfully.',
          icon: 'success',
          confirmButtonText: 'Okay',
        });
        setPumpName('');
        setInventoryID('');
        toggleModal();
      }
    } catch (error) {
      if (error.response && error.response.data) {
      
        const errorMessage = error.response.data.message;
        if (errorMessage === 'Pump with this name already exists.') {
          Swal.fire({
            title: 'Error',
            text: 'A pump with this name already exists. Please choose a different name.',
            icon: 'error',
            confirmButtonText: 'Try Again',
          });
        } else if (errorMessage === 'Inventory not found.') {
          Swal.fire({
            title: 'Error',
            text: 'The selected inventory does not exist. Please select a valid inventory.',
            icon: 'error',
            confirmButtonText: 'Try Again',
          });
        } else {
         
          Swal.fire({
            title: 'Error',
            text: errorMessage || 'Failed to add pump. Please try again later.',
            icon: 'error',
            confirmButtonText: 'Okay',
          });
        }
      } else {
        
        Swal.fire({
          title: 'Error',
          text: 'An unexpected error occurred. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Okay',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div>
      <button
        onClick={toggleModal}
        className="ml-8 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Add Pump
      </button>

      {isModalOpen && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">Add a Pump</h3>
              <button
                onClick={toggleModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1l6 6m0 0l6 6m-6-6L1 13m6-6L1 1"
                  />
                </svg>
              </button>
            </div>

            <form className="p-4 space-y-6" onSubmit={handleAddPump}>
              <div>
                <label htmlFor="pumpName" className="block text-sm font-medium text-gray-700">
                  Name of Pump
                </label>
                <input
                  type="text"
                  id="pumpName"
                  name="pumpName"
                  value={pumpName}
                  onChange={(e) => setPumpName(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5"
                  placeholder="Enter pump name"
                />
              </div>

              <div>
                <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
                  Select Inventory
                </label>
                <select
                  value={inventoryID}
                  onChange={(e) => setInventoryID(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5"
                >
                  <option value="">Select Inventory</option>
                  {inventories.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.inventoryName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Pump'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddPump;
