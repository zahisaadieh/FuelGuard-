import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InvoiceTable() {
    const [invoices, setInvoices] = useState([]);
    const [years, setYears] = useState([]);
    const [filterYear, setFilterYear] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const months = [
        { value: '', label: 'All Months' },
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/invoices');
                setInvoices(response.data);


                const yearsSet = new Set(response.data.map(invoice => new Date(invoice.createdAt).getFullYear()));
                setYears([...yearsSet].sort().reverse());
            } catch (error) {
                console.error('Error fetching invoices:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const handleYearFilter = (e) => setFilterYear(e.target.value);
    const handleMonthFilter = (e) => setFilterMonth(e.target.value);


    const filteredInvoices = invoices.filter((invoice) => {
        const deliveryDate = new Date(invoice.createdAt);
        const yearMatch = filterYear ? deliveryDate.getFullYear().toString() === filterYear : true;
        const monthMatch = filterMonth ? (deliveryDate.getMonth() + 1).toString() === filterMonth : true;
        return yearMatch && monthMatch;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen" role="status">
                <div className="flex items-center justify-center">
                    <svg
                        aria-hidden="true"
                        className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }


    return (
        <div>
            <div className="mb-4">
                <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                        <span>Year</span>
                        <select value={filterYear} onChange={handleYearFilter} className="ml-2 p-1 border rounded-lg">
                            <option value="">All Years</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <span>Month</span>
                        <select value={filterMonth} onChange={handleMonthFilter} className="ml-2 p-1 border rounded-lg">
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Invoice ID</th>
                            <th className="px-6 py-3">Supplier Name</th>
                            <th className="px-6 py-3">Total Amount</th>
                            <th className="px-6 py-3">Amount Paid</th>
                            <th className="px-6 py-3">Remaining Amount</th>
                            <th className="px-6 py-3">Payment Status</th>
                            <th className="px-6 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map((invoice) => (
                            <tr key={invoice._id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                <td className="px-6 py-4">{invoice.invoiceName}</td>
                                <td className="px-6 py-4">{invoice.supplierID ? invoice.supplierID.name : 'N/A'}</td>
                                <td className="px-6 py-4">${invoice.totalAmount}</td>
                                <td className="px-6 py-4">
                                    ${invoice.payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    ${invoice.remainingAmount}
                                </td>

                                <td className="px-6 py-4">
                                    {invoice.remainingAmount === 0 ? 'Paid' : invoice.paymentStatus}
                                </td>
                                <td className="px-6 py-4">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InvoiceTable;
