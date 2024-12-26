import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CustomerInvoices = () => {
  const [userId, setUserId] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/customerInvoices/${userId}`);
      const releasedOrders = response.data.orders.filter((order) => order.Status === "Released");
      setOrders(releasedOrders);
      setSelectedOrders([]);
      setError(null);
    } catch (err) {
      setOrders([]);
      setSelectedOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  const handleMarkAsPaid = async () => {
    if (selectedOrders.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Orders Selected",
        text: "Please select at least one order to mark as paid.",
      });
      return;
    }

    const totalPaidAmount = orders
      .filter((order) => selectedOrders.includes(order._id))
      .reduce((total, order) => total + order.totalAmount, 0);

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to mark the selected orders as paid. Total: $${totalPaidAmount}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, mark as paid!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post("http://localhost:3000/api/customerInvoices/markOrdersAsPaid", {
            orderIds: selectedOrders,
            totalPaidAmount: totalPaidAmount,
          });

          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Orders marked as paid successfully!",
          });
          handleSubmit(); 
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error marking orders as paid. Please try again.",
          });
        }
      }
    });
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Customer Invoices</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Fetch Orders
        </button>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="mb-4 flex justify-end">
        <button
          onClick={handleMarkAsPaid}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Mark as Paid
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Select</th>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer Name</th>
              <th className="px-4 py-3 text-left">Fuel Type</th>
              <th className="px-4 py-3 text-left">Litre Ordered</th>
              <th className="px-4 py-3 text-left">Price Per Liter</th>
              <th className="px-4 py-3 text-left">Total Amount</th>
              <th className="px-4 py-3 text-left">Order Date & Time</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => handleSelectOrder(order._id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-3">{order._id}</td>
                  <td className="px-4 py-3">{order.customerId.userId.firstName} {order.customerId.userId.lastName}</td>
                  <td className="px-4 py-3">{order.fuelTypeId.fuelName}</td>
                  <td className="px-4 py-3">{order.litreOrdered}</td>
                  <td className="px-4 py-3">{order.pricePerLiter.toFixed(2)}</td>
                  <td className="px-4 py-3">{order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3">{formatDateTime(order.orderDate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-3 text-center text-gray-500">No released orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerInvoices;
