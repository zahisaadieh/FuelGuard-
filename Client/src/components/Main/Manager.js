import { useState } from "react";
import { useQuery } from "react-query";
import { Outlet, useNavigate } from "react-router-dom";
import Error from "../Error/ErrorMessage";
import api from "../../Config/axios";
import NavBar from "../NavBar/navBar";
import Footer from "../Footer/footer";

const Manager = () => {
    const navigate = useNavigate();

    const { isLoading, data, error, isError } = useQuery('verify-user', async () => {
        return await api.post(`/user/verify_user`);
    });

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center">
                    <svg
                        className="animate-spin h-10 w-10 text-blue-500 mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                    <p className="text-lg text-gray-700 font-medium">Verifying your account...</p>
                </div>
            </div>
        );

    if (isError)
        return <Error error={error} />;

    if (data.data.status === "error")
        return navigate('/signin');

    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    );
};

export default Manager;
