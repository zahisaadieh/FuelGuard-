import React, { useEffect, useState } from 'react';

const CustomerInvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerId = localStorage.getItem('customerId');
  const customerName = localStorage.getItem('userName');
  const customerLastName = localStorage.getItem('userLastname');

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!customerId) {
        setError('Customer ID not found in local storage.');
        setLoading(false);
        return;
      }

      try {
        const invoiceResponse = await fetch(`http://localhost:3000/api/paidOrder?customerId=${customerId}`);
        if (!invoiceResponse.ok) {
          throw new Error(`Failed to fetch invoices: ${invoiceResponse.status}`);
        }
        const invoiceData = await invoiceResponse.json();
        setInvoices(invoiceData.invoices);

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

    fetchInvoices();
  }, [customerId]);

  const getFuelName = (fuelType) => {
    if (typeof fuelType === 'string') {
      return fuelType;
    }

    const fuel = fuelTypes.find((fuel) => fuel._id === fuelType);
    return fuel ? fuel.fuelName : 'Unknown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Invoices for {customerName} {customerLastName}
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

      {!loading && !error && invoices.length === 0 && (
        <div className="bg-gray-100 text-gray-800 p-4 mb-6 rounded-lg shadow-md">
          <p>No invoices found.</p>
        </div>
      )}

      {!loading && !error && invoices.length > 0 && (
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
                <th className="px-6 py-3 text-left">Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.orderId} className="hover:bg-gray-50 border-b">
                  <td className="px-6 py-4">{invoice.orderId}</td>
                  <td className="px-6 py-4">{getFuelName(invoice.fuelType)}</td>
                  <td className="px-6 py-4">{invoice.litreOrdered} L</td>
                  <td className="px-6 py-4">${invoice.pricePerLiter.toFixed(2)}</td>
                  <td className="px-6 py-4">${invoice.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">{formatDate(invoice.orderDate)}</td>
                  <td className="px-6 py-4">{formatDate(invoice.paidDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerInvoiceTable;
