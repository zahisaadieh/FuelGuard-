import React, { useState } from 'react';
import Swal from 'sweetalert2'; 

function AddSupplier({ onSuccess }) {
 
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  
  const handleEmailChange = (e) => setEmail(e.target.value.trim());
  const handleNameChange = (e) => setName(e.target.value.trim());
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !name || !phoneNumber) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'All fields are required.',
      });
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a valid email address.',
      });
      return;
    }
  
    const phoneRegex = /^\+961 \d{2} \d{3} \d{3}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a valid phone number (e.g., +961 XXXXXXXX).',
      });
      return;
    }
  
  
    const supplierData = { email, name, phoneNumber };
  
    try {
      setIsSubmitting(true);
  
    
      const response = await fetch('http://localhost:3000/api/supplier/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplierData),
      });
  
      const result = await response.json();
  
      if (result.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Supplier added successfully!',
        });
      
        setEmail('');
        setName('');
        setPhoneNumber('');
        
        toggleModal();
        
        onSuccess(result.record);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.error || 'Unknown error',
        });
      }
    } catch (error) {
      console.error('Failed to add supplier:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `An error occurred while adding the supplier: ${error.message || 'Unknown error'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      
      <button
        onClick={toggleModal}
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        type="button"
      >
        Add Supplier
      </button>

      
      {isModalOpen && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow">
          
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">Add a Supplier</h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
                >
                  <span className="sr-only">Close modal</span>
                  &times;
                </button>
              </div>

              
              <div className="p-4">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                      placeholder="name@company.com"
                      required
                    />
                  </div>

                 
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={handleNameChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                      placeholder="Enter name"
                      required
                    />
                  </div>

                 
                  <div>
                    <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                      Phone Number (e.g., +961 XX XXX XXX)
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                      placeholder="+961XXXXXXXX"
                      required
                    />
                  </div>

              
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full text-white ${
                      isSubmitting ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'
                    } focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Add'}
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

export default AddSupplier;
