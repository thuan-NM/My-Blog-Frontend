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
                navigate('/confirmation-success'); // Redirect to a success page or home
            } catch (error) {
                message.error('Failed to confirm interview.');
                navigate('/'); // Redirect to home or error page
            }
        };

        confirmInterview(); // Call the function to confirm interview when the component loads
    }, [token, navigate]);

    return (
        <div className="process-comm">
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        </div>
    );
};

export default ConfirmInterview;
