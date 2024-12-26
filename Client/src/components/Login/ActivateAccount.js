import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import api from "../../Config/axios";
import Swal from 'sweetalert2';

const ActivateAccount = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const { isLoading, data, error, isError } = useQuery('activate_account', async () => {
        if (!token) throw new Error("Token is missing");
        return await api.post(`/user/activate_account?token=${token}`);
    }, {
        enabled: !!token 
    });

    useEffect(() => {
        if (isLoading) {
            Swal.fire({
                title: 'Please wait...',
                text: 'Activating your account...',
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }

        if (isError) {
            Swal.close(); 
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error?.message || 'Something went wrong!',
            });
        }

        if (data) {
            if (data.data.status === 'error') {
                Swal.close(); 
                Swal.fire({
                    icon: 'error',
                    title: 'Activation Failed',
                    text: data.data.error || 'Account activation failed!',
                });
            } else if (data.data.status === 'ok') {
                Swal.close(); 
                Swal.fire({
                    icon: 'success',
                    title: 'Account Activated',
                    text: 'Your account has been successfully activated!',
                    confirmButtonText: 'Okay',
                    customClass: 'bg-green-500 text-white'
                });
            }
        }
    }, [isLoading, isError, data, error]);

    if (isLoading || isError) return null;

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <p className="text-lg text-green-600 font-semibold">Account activated successfully!</p>
        </div>
    );
};

export default ActivateAccount;
