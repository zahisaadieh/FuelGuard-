import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddInvoice() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get('/api/suppliers')
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error('Error fetching suppliers:', error));
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      setInvoices([]);
      setSelectedInvoice('');

      axios
        .get(`/api/suppliers/${selectedSupplier}/unpaid-invoices`)
        .then((response) => setInvoices(response.data))
        .catch((error) => console.error('Error fetching invoices:', error));
    } else {
      setInvoices([]);
      setSelectedInvoice('');
    }
  }, [selectedSupplier]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handlePayment = (e) => {
    e.preventDefault();

    if (!selectedInvoice || !paymentAmount) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select an invoice and enter a payment amount.',
      });
      return;
    }

    const invoice = invoices.find((invoice) => invoice._id === selectedInvoice);

    if (invoice && parseFloat(paymentAmount) > invoice.remainingAmount) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Payment',
        text: 'The payment amount cannot exceed the remaining balance of the invoice.',
      });
      return;
    }

    setLoading(true);

    axios
      .post('/api/invoices/pay', { invoiceID: selectedInvoice, paymentAmount })
      .then((response) => {
        setLoading(false);

        Swal.fire({
          icon: 'success',
          title: 'Payment Successful',
          text: response.data.message,
        });

        setInvoices((prev) =>
          prev.map((invoice) =>
            invoice._id === selectedInvoice
              ? { ...invoice, remainingAmount: invoice.remainingAmount - paymentAmount }
              : invoice
          )
        );

        setPaymentAmount('');
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Error processing payment.',
        });
      });
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="mt-4 ml-8 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Add Invoice
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
          tabIndex="-1"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add an invoice
                </h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4">
                <form className="space-y-4" onSubmit={handlePayment}>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Select The Supplier
                    </label>
                    <select
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="">Select a supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Select Invoice
                    </label>
                    <select
                      value={selectedInvoice}
                      onChange={(e) => setSelectedInvoice(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="">Select an invoice</option>
                      {invoices.map((invoice) => (
                        <option key={invoice._id} value={invoice._id}>
                          {invoice.invoiceName} - Remaining: {invoice.remainingAmount}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Payment Amount
                    </label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    disabled={loading}
                  >
                    {loading ? 'Processing Payment...' : 'Add Payment'}
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

export default AddInvoice;
