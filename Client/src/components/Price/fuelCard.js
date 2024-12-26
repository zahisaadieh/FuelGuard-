import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';  

const FuelCard = () => {
    const [fuelTypes, setFuelTypes] = useState([]);
    const [newPrice, setNewPrice] = useState({});

    useEffect(() => {
        fetchFuelTypes();
    }, []);

    const fetchFuelTypes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/fueltype');
            setFuelTypes(response.data);
            const initialPrices = {};
            response.data.forEach(fuel => {
                initialPrices[fuel._id] = fuel.pricePerLiter;
            });
            setNewPrice(initialPrices);
        } catch (error) {
            console.error('Error fetching fuel types:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load fuel types.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handlePriceChange = async (id) => {
        if (newPrice[id] <= 0) {
            Swal.fire({
                title: 'Invalid Price!',
                text: 'Price must be a positive number.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            await axios.put(`http://localhost:3000/api/fueltype/${id}`, {
                pricePerLiter: newPrice[id],
            });
            Swal.fire({
                title: 'Success!',
                text: 'Price updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            setNewPrice((prevPrices) => ({
                ...prevPrices,
                [id]: '',
            }));
            fetchFuelTypes(); 
        } catch (error) {
            console.error('Error updating price:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update price.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleInputChange = (id, value) => {

        if (value >= 0 || value === '') {
            setNewPrice({ ...newPrice, [id]: value });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Fuel Types</h1>

            <div className="flex flex-wrap justify-center gap-6">
                {fuelTypes.map(fuel => (
                    <div key={fuel._id} className="bg-white shadow-md rounded-lg p-6 w-64 text-center">
                        <h2 className="text-2xl font-semibold mb-2">{fuel.fuelName}</h2>
                        <p className="text-lg mb-4">
                            Price per Liter: <span className="font-medium">${fuel.pricePerLiter.toFixed(2)}</span>
                        </p>
                        <input
                            type="number"
                            value={newPrice[fuel._id] || ''}
                            onChange={(e) => handleInputChange(fuel._id, e.target.value)}
                            step="0.01"
                            className="border border-gray-300 rounded px-2 py-1 mb-4 w-full"
                            placeholder="Enter new price"
                        />
                        <button
                            onClick={() => handlePriceChange(fuel._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Update Price
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FuelCard;
