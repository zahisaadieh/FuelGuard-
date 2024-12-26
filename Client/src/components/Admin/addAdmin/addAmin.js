import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddAdminForm({ onSuccess }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

  
    const phoneRegex = /^\d{8}$/;

  
    const openModal = () => setIsModalOpen(true);

 
    const closeModal = () => {
        setIsModalOpen(false);
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
    };

   
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
    
      
        if (!phoneRegex.test(phoneNumber)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Please enter a valid phone number (e.g., +961 3 123456).',
            });
            setLoading(false);
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:3000/api/admins/add', {
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
            });
    
            Swal.fire({
                icon: 'success',
                title: 'Admin Added',
                text: response.data.message || 'The admin was added successfully.',
            });
    
            onSuccess(); 
            closeModal(); 
        } catch (error) {
            console.error('Error adding admin:', error.message);
    
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'An error occurred while adding the admin.',
            });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
        
            <button
                onClick={openModal}
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
                Add Admin
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-md">
                        <div className="bg-white rounded-lg shadow dark:bg-gray-700">
                            
                            <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add a Admin</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    &times;
                                </button>
                            </div>


                            <div className="p-4">
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                  
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-gray-50 border rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white"
                                            required
                                        />
                                    </div>

                        
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-gray-50 border rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white"
                                            required
                                        />
                                    </div>

                              
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="bg-gray-50 border rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white"
                                            required
                                        />
                                    </div>

                              
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="bg-gray-50 border rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white"
                                            required
                                        />
                                    </div>

                                
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="XXXXXXXX"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                                                setPhoneNumber(value);
                                            }}
                                            className="bg-gray-50 border rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-white"
                                            required
                                        />
                                    </div>

                             
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {loading ? 'Adding...' : 'Add Admin'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddAdminForm;
