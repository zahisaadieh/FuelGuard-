import React, { useEffect, useState } from 'react';

const PostOrders = () => {
  const [orders, setOrders] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('userName');
  const customerLastname = localStorage.getItem('userLastname');

  useEffect(() => {
    const fetchPostOrders = async () => {
      if (!customerId) {
        setError('Customer ID not found in local storage.');
        setLoading(false);
        return;
      }

      try {
        const orderResponse = await fetch(`http://localhost:3000/api/postOrder?customerId=${customerId}`);
        if (!orderResponse.ok) {
          throw new Error(`Failed to fetch post orders: ${orderResponse.status}`);
        }
        const orderData = await orderResponse.json();
        setOrders(orderData.orders);

        const fuelResponse = await fetch('http://localhost:3000/api/fueltype');
        if (!fuelResponse.ok) {
          throw new Error(`Failed to fetch fuel types: ${fuelResponse.status}`);
        }
        const fuelData = await fuelResponse.json();
        setFuelTypes(fuelData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostOrders();
  }, [customerId]);

  const getFuelName = (fuelTypeId) => {
    const fuel = fuelTypes.find((fuel) => fuel._id === fuelTypeId);
    return fuel ? fuel.fuelName : 'Unknown';
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Orders for {customerName} {customerLastname}
      </h1>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-16 w-16"></div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-100 text-red-800 p-4 mb-6 rounded-lg shadow-md">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="bg-gray-100 text-gray-800 p-4 mb-6 rounded-lg shadow-md">
          <p>No orders found.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Fuel Type</th>
                <th className="px-6 py-3 text-left">Litres Ordered</th>
                <th className="px-6 py-3 text-left">Price per Litre</th>
                <th className="px-6 py-3 text-left">Total Amount</th>
                <th className="px-6 py-3 text-left">Order Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 border-b">
                  <td className="px-6 py-4">{order._id}</td>
                  <td className="px-6 py-4">{getFuelName(order.fuelTypeId)}</td>
                  <td className="px-6 py-4">{order.litreOrdered} L</td>
                  <td className="px-6 py-4">${order.pricePerLiter.toFixed(2)}</td>
                  <td className="px-6 py-4">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {new Date(order.orderDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{order.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PostOrders;
