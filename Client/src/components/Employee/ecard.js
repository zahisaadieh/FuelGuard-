import React from 'react';

const Ecard = ({ employee, onEdit }) => {
  const {
    name,
    email,
    phoneNumber,
    salaryAmount,
    shiftName,
    leftDate,
    createdAt,
  } = employee;

  return (
    <div className="w-full max-w-sm border border-gray-200 rounded-lg shadow bg-white flex flex-col">
      <div className="flex flex-col p-4">
        <div className="mb-2">
          <h5 className="text-xl font-medium text-gray-900">{name}</h5>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>Phone: {phoneNumber}</p>
          <p>Salary: ${salaryAmount}</p>
          <p>Shift: {shiftName}</p>
          <p>
            Status:{' '}
            {leftDate
              ? `Left on ${new Date(leftDate).toLocaleDateString()}`
              : 'Still working'}
          </p>
          <p>Joined: {new Date(createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex justify-center p-4">
        <button
          onClick={onEdit}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default Ecard;
