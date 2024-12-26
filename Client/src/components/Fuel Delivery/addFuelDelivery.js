import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddFuelDelivery({ onSuccess,setIsChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierID, setSupplierID] = useState('');
  const [inventoryID, setInventoryID] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    fetchSuppliers();
    fetchInventories();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/supplier');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      Swal.fire('Error', 'Failed to fetch suppliers', 'error');
    }
  };

  const fetchInventories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/inventory');
      setInventories(response.data);
    } catch (error) {
      console.error('Error fetching inventories:', error);
      Swal.fire('Error', 'Failed to fetch inventories', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:3000/api/fuel-delivery/add', {
        supplierID,
        inventoryID,
        quantity: parseFloat(quantity),
        pricePerLiter: parseFloat(pricePerLiter),
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message || 'Fuel delivery added successfully!',
      });
      
 
      setSupplierID('');
      setInventoryID('');
      setQuantity('');
      setPricePerLiter('');
      toggleModal();


      if (onSuccess) onSuccess(response.data);
      setIsChange(old => !old)
    } catch (error) {
      console.error('Error adding fuel delivery:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to add fuel delivery',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
     
      <button
        onClick={toggleModal}
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 ml-4"
      >
        Add Fuel Delivery
      </button>

   
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold">Add Fuel Delivery</h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm w-8 h-8"
                >
                  &times;
                </button>
              </div>

              <div className="p-4">
                <form onSubmit={handleSubmit}>
                
                  <select
                    value={supplierID}
                    onChange={(e) => setSupplierID(e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 mb-4"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>

              
                  <select
                    value={inventoryID}
                    onChange={(e) => setInventoryID(e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 mb-4"
                  >
                    <option value="">Select Inventory</option>
                    {inventories.map((i) => (
                      <option key={i._id} value={i._id}>{i.inventoryName}</option>
                    ))}
                  </select>

               
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantity"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 mb-4"
                  />

              
                  <input
                    type="number"
                    value={pricePerLiter}
                    onChange={(e) => setPricePerLiter(e.target.value)}
                    placeholder="Price per Liter"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 mb-4"
                  />

            
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
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

export default AddFuelDelivery;
