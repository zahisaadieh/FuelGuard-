import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import img1 from '../img/Picture1.png';
import img2 from '../img/Picture2.png';
import img3 from '../img/Picture3.png';
import img4 from '../img/Picture4.png';
import img5 from '../img/Picture5.png';
import img6 from '../img/Picture6.png';
import img7 from '../img/Picture7.png';
import img8 from '../img/pump.png';

const ResetPassword = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        email: ''
    });

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const HandleResetPassword = async () => {
        try {
            if (formData.password !== formData.confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Password must be equal to confirm password.',
                    confirmButtonText: 'Okay',
                    customClass: 'bg-red-500 text-white'
                });
            } else {
                const { data } = await axios.post(`http://localhost:3000/api/user/reset_password?token=${token}`, {
                    password: formData.password,
                });

                if (data.status === "ok") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Password changed successfully!',
                        confirmButtonText: 'Okay',
                        customClass: 'bg-green-500 text-white'
                    }).then(() => {
                        navigate('/signin');
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Something went wrong. Please try again.',
                        confirmButtonText: 'Okay',
                        customClass: 'bg-red-500 text-white'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Something went wrong. Please try again.',
                confirmButtonText: 'Okay',
                customClass: 'bg-red-500 text-white'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center relative">

            <img src={img1} alt="decorative1" className="absolute top-10 left-10 w-20 h-20" />
            <img src={img2} alt="decorative2" className="absolute top-20 right-10 w-20 h-20" />
            <img src={img3} alt="decorative3" className="absolute bottom-10 left-20 w-20 h-20" />
            <img src={img4} alt="decorative4" className="absolute bottom-20 right-20 w-20 h-20" />
            <img src={img5} alt="decorative5" className="absolute top-1/4 left-1/4 w-20 h-20" />
            <img src={img6} alt="decorative6" className="absolute top-1/3 right-1/4 w-20 h-20" />
            <img src={img7} alt="decorative7" className="absolute bottom-1/4 left-1/3 w-20 h-20" />
            <img src={img8} alt="decorative8" className="absolute top-2/3 right-1/4 w-20 h-20" />

      
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6 relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Reset Your Password</h2>
                    <p className="text-gray-500 mt-2">Enter your new password below</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">New Password</label>
                        <div className="mt-1">
                            <input
                                id="password"
                                type="password"
                                placeholder="New password"
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="mt-1">
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            />
                        </div>
                    </div>

                    <button
                        onClick={HandleResetPassword}
                        className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-center"
                    >
                        <svg
                            className="w-5 h-5 animate-spin mr-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <path d="M20 8v6M23 11h-6" />
                        </svg>
                        <span>Reset Password</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
