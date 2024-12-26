import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function FuelDeliveryTable({ isChange }) {
  const [fuelData, setFuelData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [years, setYears] = useState([]);
  const [months] = useState([
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
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fuelResponse = await fetch('http://localhost:3000/api/fuel-delivery');
        const fuelData = await fuelResponse.json();
        setFuelData(fuelData);

        const supplierResponse = await fetch('http://localhost:3000/api/supplier');
        const suppliers = await supplierResponse.json();
        setSuppliers(suppliers);

        const inventoryResponse = await fetch('http://localhost:3000/api/inventory');
        const inventories = await inventoryResponse.json();
        setInventories(inventories);


        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        setFilterYear(currentYear.toString());
        setFilterMonth(currentMonth.toString());

        const uniqueYears = [...new Set(fuelData.map((item) => new Date(item.deliveryDate).getFullYear()))];
        setYears(uniqueYears);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isChange]);
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

  const handleYearFilter = (e) => setFilterYear(e.target.value);
  const handleMonthFilter = (e) => setFilterMonth(e.target.value);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditFormData(fuelData[index]);
  };

  const handleSave = async () => {
    const updatedData = [...fuelData];
    updatedData[editingIndex] = editFormData;
    setFuelData(updatedData);
    setEditingIndex(null);

    try {
      const response = await fetch(`http://localhost:3000/api/fuel-delivery/${editFormData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to update fuel delivery');
      }

      const updatedFuelDelivery = await response.json();
      console.log('Fuel delivery updated:', updatedFuelDelivery);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Fuel delivery updated successfully.",
      });

    } catch (error) {
      console.error('Error saving updated fuel delivery:', error);
    }
  };


  const handleCancel = () => {
    setEditingIndex(null);
    setEditFormData(fuelData[editingIndex]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };





  const handleDelete = async (id) => {
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Invalid ID",
        text: "The provided ID is invalid. Please try again.",
      });
      return;
    }

    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this action!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (!confirm.isConfirmed) {
        Swal.fire("Cancelled", "The fuel delivery was not deleted.", "info");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/fuel-delivery/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: result.message || "The fuel delivery was successfully deleted.",
        });

        const updatedFuelData = fuelData.filter((data) => data._id !== id);
        setFuelData(updatedFuelData);
      } else if (response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "The fuel delivery could not be found. Please refresh and try again. It may already be deleted.",
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "An error occurred while deleting the fuel delivery.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "Something went wrong. Please try again later.",
      });
    }
  };




  const filteredData = fuelData.filter((data) => {
    const deliveryDate = new Date(data.deliveryDate);
    const yearMatch = filterYear ? deliveryDate.getFullYear().toString() === filterYear : true;
    const monthMatch = filterMonth ? (deliveryDate.getMonth() + 1).toString() === filterMonth : true;
    return yearMatch && monthMatch;
  });


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
        <table className="w-full text-sm text-center text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Supplier Name</th>
              <th className="px-6 py-3">Inventory</th>
              <th className="px-6 py-3">Price per Liter</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Total Amount</th>
              <th className="px-6 py-3">Delivery Date</th>
              <th className="px-6 py-3">Edit</th>
              <th className="px-6 py-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((data, index) => (
              <tr key={data._id} className="bg-white border-b">
                {editingIndex === index ? (
                  <>
                    <td className="px-6 py-4">{data.supplierID?.name}</td>
                    <td className="px-6 py-4">{data.inventoryID?.inventoryName}</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="pricePerLiter"
                        value={editFormData.pricePerLiter}
                        onChange={handleInputChange}
                        className="w-full text-center"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="quantity"
                        value={editFormData.quantity}
                        onChange={handleInputChange}
                        className="w-full text-center"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {(editFormData.pricePerLiter * editFormData.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        name="deliveryDate"
                        value={editFormData.deliveryDate}
                        onChange={handleInputChange}
                        className="w-full text-center"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">{data.supplierID?.name}</td>
                    <td className="px-6 py-4">{data.inventoryID?.inventoryName}</td>
                    <td className="px-6 py-4">{data.pricePerLiter}</td>
                    <td className="px-6 py-4">{data.quantity}</td>
                    <td className="px-6 py-4">{(data.pricePerLiter * data.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4">{new Date(data.deliveryDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => handleEditClick(index)}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => handleDelete(data._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FuelDeliveryTable;
