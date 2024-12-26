import React, { useState, useEffect } from 'react';

const EditManager = ({ isOpen, onClose, manager, onSave }) => {
  
  const [email, setEmail] = useState(manager?.email || '');
  const [firstName, setFirstName] = useState(manager?.firstName || '');
  const [lastName, setLastName] = useState(manager?.lastName || '');
  const [phone, setPhone] = useState(manager?.phone || '');

  
  useEffect(() => {
    if (manager) {
      setEmail(manager.email);
      setFirstName(manager.firstName);
      setLastName(manager.lastName);
      setPhone(manager.phone);
    }
  }, [manager]);

  const handleSave = () => {
    const updatedManager = { email, firstName, lastName, phone };
    onSave(updatedManager);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-md">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Manager</h3>
            <button onClick={onClose} className="text-gray-400 hover:bg-gray-200 rounded-lg p-2">
              <span className="sr-only">Close</span>
              ✖
            </button>
          </div>
          <div className="p-4">
            <form className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="w-full bg-blue-600 text-white p-2 rounded mt-4"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditManager;
