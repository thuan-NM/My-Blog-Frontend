import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import jobstatusServices from '../../services/jobstatus.services'; // Import your service to call backend

const ConfirmInterview = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const confirmInterview = async () => {
            try {
                const res = await jobstatusServices.confirmRequest(token); // Call your backend to confirm interview
                message.success(res.message);
                navigate('/confirmation-success'); // Redirect to a success page or home
            } catch (error) {
                message.error('Failed to confirm interview.');
                navigate('/'); // Redirect to home or error page
            }
        };

        confirmInterview(); // Call the function to confirm interview when the component loads
    }, [token, navigate]);

    return (
        <div>
            <h1>Confirming interview...</h1>
        </div>
    );
};

export default ConfirmInterview;
