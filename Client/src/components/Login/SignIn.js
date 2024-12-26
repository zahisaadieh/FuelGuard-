import React, { useState,useContext  } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { UserContext } from "../../App";

import img1 from '../img/Picture1.png';
import img2 from '../img/Picture2.png';
import img3 from '../img/Picture3.png';
import img4 from '../img/Picture4.png';
import img5 from '../img/Picture5.png';
import img6 from '../img/Picture6.png';
import img7 from '../img/Picture7.png';
import img8 from '../img/pump.png';

const SignIn = () => {
    const { setUserRole } = useContext(UserContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const HandleSignIn = async () => {
        setLoading(true);
        try {
            Swal.close();

            const { data } = await axios.post(`http://localhost:3000/api/user/signin`, formData);

            if (data.status === "ok") {
                const { role, userName, userLastname, userId, customerId } = data;
                
                localStorage.setItem("userRole", role);
                localStorage.setItem("userId", userId);
                localStorage.setItem("userName", userName);
                localStorage.setItem("userLastname", userLastname);
                

                if (customerId) {
                    localStorage.setItem("customerId", customerId);  
                }
                setUserRole(role);

                Swal.fire({
                    icon: "success",
                    title: "Sign In Successful",
                    text: `Welcome back, ${userName} ${userLastname}`,
                    confirmButtonText: "Okay",
                    customClass: "bg-blue-500 text-white",
                }).then(() => {
                    // Navigate based on user role
                    switch (role.toLowerCase()) {
                      case "admin":
                        navigate("/admin");
                        break;
                      case "manager":
                        navigate("/");
                        break;
                      case "customer":
                        navigate("/customer");
                        break;
                      default:
                        navigate("/signin");
                    }
                  });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.error || "Something went wrong, please try again.",
                    confirmButtonText: "Okay",
                    customClass: "bg-red-500 text-white",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Something went wrong, please try again.",
                confirmButtonText: "Okay",
                customClass: "bg-red-500 text-white",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gray-50">

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
                    <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
                    <p className="text-gray-500 mt-2">Enter your credentials to sign in</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                        <div className="mt-1">
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                        <div className="mt-1">
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            />
                        </div>
                    </div>

                    <button
                        onClick={HandleSignIn}
                        disabled={loading}
                        className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-center"
                    >
                        {loading ? (
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
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                    <br />
                    <p className="mt-6 text-xs text-gray-600 text-center cursor-pointer">
                        <span
                            onClick={() => navigate('/forget_password')}
                            className="border-b border-gray-500 border-dotted text-[#0000FF]"
                        >
                            Forget password?
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
