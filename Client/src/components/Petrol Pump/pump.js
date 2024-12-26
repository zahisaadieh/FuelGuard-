import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2

function Pump({ name, fuelType, pricePerLiter, pumpId }) {
  const [isPumping, setIsPumping] = useState(false);
  const [liters, setLiters] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [oldCounter, setOldCounter] = useState(0);
  const [currentCounter, setCurrentCounter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [litreRequest, setLitreRequest] = useState(0);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchOldCounter = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/fuelTransaction/${pumpId}`);
        const data = await response.json();
        if (data && data.currentCounter !== undefined) {
          setOldCounter(data.currentCounter);
          setCurrentCounter(data.currentCounter);
        }
      } catch (error) {
        console.error('Error fetching old counter:', error);
        Swal.fire({
          title: 'Error',
          text: 'Unable to fetch pump counter data.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchOldCounter();
  }, [pumpId]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = async () => {
    if (!searchQuery) {
      setIsReadOnly(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/order/${searchQuery}`);
      const data = await response.json();

      if (data && data.status === 'Post') {
        if (data.fuelName === fuelType) {
          const adjustedLitre = Math.min(data.litreOrdered, (data.remainingLimit/data.pricePerLiter).toFixed(2));
          setLitreRequest(adjustedLitre);
          setIsReadOnly(true);

          Swal.fire({
            title: 'Order Found',
            text: `Litres requested: ${adjustedLitre.toFixed(2)} liters.`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Fuel Mismatch',
            text: `Requested fuel: ${data.fuelName}. Expected: ${fuelType}.`,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: 'The order has already been used.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      Swal.fire({
        title: 'Network Error',
        text: 'Order not found. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleLitreRequestChange = (e) => {
    const value = parseFloat(e.target.value);
    setLitreRequest(isNaN(value) ? 0 : value);
  };

  const startPump = () => {
    if (litreRequest <= 0) {
      Swal.fire({
        title: 'Invalid Request',
        text: 'Please enter a valid litre request before starting.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (!isPumping) {
      setLiters(0);
      setTotalPrice(0);
      setIsPumping(true);

      intervalRef.current = setInterval(() => {
        setLiters((prevLiters) => {
          if (prevLiters >= litreRequest) {
            clearInterval(intervalRef.current);
            setIsPumping(false);
            return prevLiters;
          }

          const newLiters = parseFloat((prevLiters + 0.1).toFixed(2));
          setTotalPrice(parseFloat((newLiters * pricePerLiter).toFixed(2)));
          setCurrentCounter((prevCounter) => parseFloat((prevCounter + 0.1).toFixed(2)));

          return newLiters;
        });
      }, 100);
    }
  };

  const stopPump = async () => {
    if (isPumping) {
      setIsPumping(false);
      clearInterval(intervalRef.current);
  
      const transactionData = {
        pumpId,
        orderId: searchQuery || null, 
        oldCounter, 
        currentCounter,
        pricePerLiter,
      };
  
      try {
        const response = await fetch('http://localhost:3000/api/pump/stop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData),
        });
        const data = await response.json();
  
        Swal.fire({
          title: data.status === 'ok' ? 'Transaction Saved' : 'Error',
          text: data.message,
          icon: data.status === 'ok' ? 'success' : 'error',
          confirmButtonText: 'OK',
        });
        
        if (data.status === 'ok') {
          setLitreRequest(0);
          setSearchQuery('');
          setIsReadOnly(false);
        }
      } catch (error) {
        Swal.fire({
          title: 'Network Error',
          text: 'Unable to save transaction.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };
  

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-6 mx-auto">
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter order ID"
        />
        <button
          onClick={handleSearchClick}
          className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Search Order
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center mb-4">{name}</h2>

      <div className="text-center mb-4">
        <p className="text-lg font-semibold">Fuel Type: {fuelType}</p>
        <p className="text-lg font-semibold">Price per Liter: £{pricePerLiter.toFixed(2)}</p>
      </div>

      <div className="flex justify-between mb-4">
        <p className="text-lg font-semibold">Old Counter: {oldCounter.toFixed(2)} L</p>
        <p className="text-lg font-semibold">Current Counter: {currentCounter.toFixed(2)} L</p>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2" htmlFor="litreRequest">
          Litre Request:
        </label>
        <input
          type="number"
          id="litreRequest"
          value={litreRequest}
          onChange={handleLitreRequestChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter requested litres"
          readOnly={isReadOnly}
        />
      </div>

      <div className="text-center mb-6">
        <p className="text-xl font-semibold">Liters Dispensed: {liters.toFixed(2)} L</p>
        <p className="text-xl font-semibold text-red-500">Total Cost: £{totalPrice.toFixed(2)}</p>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={startPump}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
          disabled={isPumping}
        >
          Start
        </button>

        <button
          onClick={stopPump}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
          disabled={!isPumping}
        >
          Stop
        </button>
      </div>
    </div>
  );
}

export default Pump;
