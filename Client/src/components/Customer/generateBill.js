import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const FuelRequest = () => {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerLastname, setCustomerLastname] = useState('');
  const [fuelTypes, setFuelTypes] = useState([]);
  const [fuelType, setFuelType] = useState('');
  const [pricePerLitre, setPricePerLitre] = useState(0);
  const [litresOrdered, setLitresOrdered] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [creditLimit, setCreditLimit] = useState(0);
  const [remainingLimit, setRemainingLimit] = useState(0);

  useEffect(() => {
    const storedCustomerId = localStorage.getItem('customerId');
    const storedCustomerName = localStorage.getItem('userName');
    const storedCustomerLastname = localStorage.getItem('userLastname');

    if (storedCustomerId) setCustomerId(storedCustomerId);
    if (storedCustomerName) setCustomerName(storedCustomerName);
    if (storedCustomerLastname) setCustomerLastname(storedCustomerLastname);

    const fetchFuelTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/fueltype');
        setFuelTypes(response.data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error Fetching Fuel Types',
          text: 'Could not fetch fuel types. Please try again later.',
        });
      }
    };

    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/customers/${storedCustomerId}`);
        const customer = response.data.customer;
        setCreditLimit(customer.creditLimit);
        setRemainingLimit(customer.remainingLimit);
      } catch (error) {
        console.error('Error fetching customer details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error Fetching Customer Details',
          text: 'Could not fetch customer details. Please try again later.',
        });
      }
    };

    fetchFuelTypes();
    if (storedCustomerId) fetchCustomerDetails();
  }, []);

  useEffect(() => {
    setTotalAmount(litresOrdered * pricePerLitre);
  }, [litresOrdered, pricePerLitre]);

  const handleFuelTypeChange = (e) => {
    const selectedFuelType = e.target.value;
    setFuelType(selectedFuelType);

    const selectedFuel = fuelTypes.find(fuel => fuel.fuelName === selectedFuelType);
    setPricePerLitre(selectedFuel ? selectedFuel.pricePerLiter : 0);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedFuel = fuelTypes.find(fuel => fuel.fuelName === fuelType);
    if (!selectedFuel) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Fuel Type',
        text: 'Please select a valid fuel type.',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm Fuel Request',
      text: `Are you sure you want to order ${litresOrdered} litres of ${fuelType}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.post('http://localhost:3000/api/order/add', {
          customerId,
          fuelTypeId: selectedFuel._id,
          litreOrdered: litresOrdered,
          pricePerLiter: pricePerLitre,
          totalAmount,
        });

        Swal.fire({
          icon: 'success',
          title: 'Fuel Request Successful',
          text: 'Your fuel request has been submitted successfully!',
        });
      } catch (error) {
        console.error('Error making fuel request:', error);
        Swal.fire({
          icon: 'error',
          title: 'Request Failed',
          text: 'There was an issue with the fuel request. Please try again.',
        });
      }
    }
  };

  const fullName = `${customerName} ${customerLastname}`;

  return (
    <div className="relative flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-6">
      {/* Fuel Request Form */}
      <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Fuel Request</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={fullName}
              readOnly
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer ID</label>
            <input
              type="text"
              value={customerId}
              readOnly
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
            <select
              value={fuelType}
              onChange={handleFuelTypeChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
            >
              <option value="">Select Fuel Type</option>
              {fuelTypes.map(fuel => (
                <option key={fuel._id} value={fuel.fuelName}>
                  {fuel.fuelName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price per Litre</label>
            <input
              type="text"
              value={`$${pricePerLitre.toFixed(2)}`}
              readOnly
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Litres Ordered</label>
            <input
              type="number"
              value={litresOrdered}
              onChange={e => setLitresOrdered(Number(e.target.value))}
              min="1"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="text"
              value={`$${totalAmount.toFixed(2)}`}
              readOnly
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Request Fuel
            </button>
          </div>
        </form>
      </div>

      {/* Customer Credit & Remaining Limit Card */}
      <div className="absolute top-10 right-10 w-64 p-6 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Credit</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Credit Limit:</span>
            <span className="text-gray-600">${creditLimit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Remaining Limit:</span>
            <span className="text-gray-600">${remainingLimit.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelRequest;
