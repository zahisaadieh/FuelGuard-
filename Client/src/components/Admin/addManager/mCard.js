import React, { useState } from 'react';
import EditManager from './editManager';

const Mcard = ({ manager, onUpdateManager }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(manager.isActivated); 
  const [loading, setLoading] = useState(false); 

  const handleSave = (updatedManager) => {
    onUpdateManager(updatedManager);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const toggleActiveStatus = async () => {
    const updatedManager = { ...manager, isActivated: !isActive };

    try {
      setLoading(true);

      const response = await fetch(`http://localhost:3000/api/managers/${manager._id}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActivated: updatedManager.isActivated }),
      });

      if (response.ok) {
        setIsActive(!isActive);
        onUpdateManager(updatedManager);
      } else {
        throw new Error('Failed to update activation status');
      }
    } catch (error) {
      console.error('Error updating activation status:', error);
    } finally {
  
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
    
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-2 right-2 inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Edit
      </button>


      <div className="mt-8 flex flex-col items-center pb-10">
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {`${manager.firstName} ${manager.lastName}`}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{manager.email}</span>
        <div className="flex mt-4 md:mt-6">
          
          <button
            onClick={toggleActiveStatus}
            disabled={loading}
            className={`px-4 py-2 rounded ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {loading ? 'Updating...' : isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      
      {isModalOpen && (
        <EditManager manager={manager} onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default Mcard;
