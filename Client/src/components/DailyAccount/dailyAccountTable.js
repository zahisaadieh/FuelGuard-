import React, { useEffect, useState } from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; 
};

const calculateTotalSoldLitres = (pumps, date) => {
  return pumps
    .map(({ dailyTransactions }) => {
      const dayData = dailyTransactions.find((t) => formatDate(t.date) === formatDate(date));
      return dayData ? dayData.totalSoldLitre : 0;
    })
    .reduce((acc, soldLitre) => acc + soldLitre, 0);
};

const calculateTotalCost = (pumps, date) => {
  return pumps
    .map(({ dailyTransactions }) => {
      const dayData = dailyTransactions.find((t) => formatDate(t.date) === formatDate(date));
      return dayData ? dayData.totalSoldLitre * dayData.pricePerLiter : 0;
    })
    .reduce((acc, cost) => acc + cost, 0);
};

const SelectDate = ({ year, month, day, onYearChange, onMonthChange, onDayChange, minYear }) => {
  const monthsInYear = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = new Date(year, month, 0).getDate(); 

  return (
    <div className="flex justify-center mb-6">
      <select value={year} onChange={(e) => onYearChange(Number(e.target.value))} className="px-4 py-2 mr-4 border border-gray-300">
        {Array.from({ length: new Date().getFullYear() - minYear + 1 }, (_, i) => minYear + i).map((yr) => (
          <option key={yr} value={yr}>{yr}</option>
        ))}
      </select>
      <select value={month} onChange={(e) => onMonthChange(Number(e.target.value))} className="px-4 py-2 mr-4 border border-gray-300">
        {monthsInYear.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <select value={day} onChange={(e) => onDayChange(Number(e.target.value))} className="px-4 py-2 border border-gray-300">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen" role="status">
    <svg
      aria-hidden="true"
      className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
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
  </div>
);

const DailyAccountTable = ({ data, pumps, year, month, day }) => {
  const uniqueDates = Array.from(
    new Set(pumps.flatMap(({ dailyTransactions }) =>
      dailyTransactions.filter(({ date }) => {
        const transactionDate = new Date(date);
        return transactionDate.getFullYear() === year &&
               transactionDate.getMonth() + 1 === month &&
               transactionDate.getDate() === day;
      }).map(({ date }) => date)
    ))
  );

  return (
    <div>
      {data.map(({ inventory, pumps }) => (
        <div key={inventory._id} className="mb-10">
          <h3 className="text-xl font-bold mb-4">{inventory.inventoryName}</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Date</th>
                {pumps.map(({ pump }) => (
                  <th key={pump._id} className="border border-gray-300 px-4 py-2">
                    {pump.pumpName} (Sold Litres)
                  </th>
                ))}
                <th className="border border-gray-300 px-4 py-2">Total Litres</th>
                <th className="border border-gray-300 px-4 py-2">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {uniqueDates.map((date) => (
                <tr key={date} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">{date}</td>
                  {pumps.map(({ dailyTransactions }) => {
                    const dayData = dailyTransactions.find((t) => formatDate(t.date) === formatDate(date));
                    return (
                      <td key={dayData?.date} className="border border-gray-300 px-4 py-2 text-center">
                        {dayData?.totalSoldLitre.toFixed(2) || 0}
                      </td>
                    );
                  })}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {calculateTotalSoldLitres(pumps, date).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    ${calculateTotalCost(pumps, date).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-center font-semibold">
            Remaining Capacity for {inventory.inventoryName}: {inventory.currentCapacity.toFixed(2)} Litres
          </div>
        </div>
      ))}
    </div>
  );
};

const DailyAccount = () => {
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/dailyAccount');
        if (!response.ok) throw new Error('Failed to fetch data from the server.');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/order');
        if (!response.ok) throw new Error('Failed to fetch orders from the server.');
        const result = await response.json();
        setOrders(result);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  const inventories = data;
  const minYear = Math.min(...inventories.map(({ pumps }) => {
    return Math.min(...pumps.flatMap(({ dailyTransactions }) => dailyTransactions.map(({ date }) => new Date(date).getFullYear()))); 
  }));

  const filteredOrdersPaid = orders?.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return orderDate.getFullYear() === year && orderDate.getMonth() + 1 === month && orderDate.getDate() === day && order.Status === 'Paid';
  });

  const filteredOrdersDebt = orders?.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return orderDate.getFullYear() === year && orderDate.getMonth() + 1 === month && orderDate.getDate() === day && order.Status === 'Released';
  });

  const totalPaid = filteredOrdersPaid?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  const totalDebt = filteredOrdersDebt?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Daily Account Table for All Inventories</h2>

      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
        <h3 className="text-lg font-bold">Total Paid for {year}-{month}-{day}</h3>
        <p className="text-2xl font-semibold">${totalPaid.toFixed(2)}</p>
      </div>

      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <h3 className="text-lg font-bold">Total Debt for {year}-{month}-{day}</h3>
        <p className="text-2xl font-semibold">${totalDebt.toFixed(2)}</p>
      </div>

      <SelectDate
        year={year} month={month} day={day}
        onYearChange={setYear} onMonthChange={setMonth} onDayChange={setDay}
        minYear={minYear}
      />

      <DailyAccountTable data={inventories} pumps={inventories[0]?.pumps || []} year={year} month={month} day={day} />
    </div>
  );
};

export default DailyAccount;
