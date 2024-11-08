import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobstatusServices from '../../services/jobstatus.services';
import { message, Spin } from 'antd';
import roomServices from '../../services/room.services';
import axios from 'axios';

// Hàm tạo mã ngẫu nhiên với định dạng x1S-42q
const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const part1 = Array.from({ length: 3 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    const part2 = Array.from({ length: 3 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    return `${part1}-${part2}`;
};

const InterviewActionPage = () => {
    const { action, jobStatusId } = useParams(); // Lấy action và jobStatusId từ URL
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [companyId, setCompanyId] = useState(null); // State lưu companyId
    const [userId, setUserId] = useState(null); // State lưu userId
    const [code1, setCode1] = useState(generateRandomCode()); // State lưu mã đầu tiên
    const [code2, setCode2] = useState(generateRandomCode()); // State lưu mã thứ hai
    const hasRunOnce = useRef(false); // Sử dụng useRef để lưu cờ trạng thái
    const navigate = useNavigate(); // Sử dụng để điều hướng

    useEffect(() => {
        if (!action || !jobStatusId) {
            setStatusMessage('Invalid request. Missing action or jobStatusId.');
            setIsLoading(false);
            return;
        }

        if (hasRunOnce.current) return;

        hasRunOnce.current = true;

        // Fetch job status details to get companyId and userId
        const fetchJobstatusDetails = async () => {
            try {
                const jobStatus = await JobstatusServices.getJobstatusDetails(jobStatusId);
                console.log(jobStatus);
                setCompanyId(jobStatus.companyid);
                setUserId(jobStatus.userid);

                // Call handleAction after setting companyId and userId
                handleAction(jobStatus.userid, jobStatus.companyid);
            } catch (error) {
                console.error("Error fetching job status details:", error);
                setStatusMessage("Failed to retrieve job status details.");
                setIsLoading(false);
            }
        };

        // Define handleAction within the useEffect scope to access updated state
        const handleAction = async (userId, companyId) => {
            try {
                let response;
                if (action === 'accept') {
                    const roomData = {
                        name: `${userId}-${companyId}`,
                        userkey: code1,
                        companykey: code2
                    };

                    // Create a new room
                    const roomResponse = await axios.post("http://localhost:5000/rooms/create", roomData);

                    if (roomResponse) {
                        message.success('Room created successfully!');
                    }

                    response = await JobstatusServices.acceptInterview(jobStatusId);
                } else if (action === 'reschedule') {
                    response = await JobstatusServices.rescheduleInterview(jobStatusId);
                } else {
                    setStatusMessage('Invalid action. Please try again.');
                    setIsLoading(false);
                    return;
                }

                if (response.isSuccess) {
                    setStatusMessage(
                        action === 'accept'
                            ? 'Interview accepted successfully.'
                            : 'Reschedule request submitted successfully.'
                    );
                    message.success('Action completed successfully.');
                } else {
                    setStatusMessage(response.message || 'Failed to process the request.');
                    message.error(response.message || 'Request failed.');
                }
            } catch (error) {
                console.error('Error processing interview action:', error);
                setStatusMessage(error.response?.data?.message || 'An unexpected error occurred.');
                message.error('An unexpected error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobstatusDetails();
    }, [action, jobStatusId]);


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin tip="Processing your request...">
                    <div className="content"></div>
                </Spin>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Interview Action</h2>
            <p className="text-gray-700">{statusMessage}</p>
            {companyId && userId && (
                <p className="text-gray-700">Company ID: {companyId}, User ID: {userId}</p>
            )}
            <p className="text-gray-700">Generated Code 1: {code1}</p>
            <p className="text-gray-700">Generated Code 2: {code2}</p>
            <button
                onClick={() => navigate('/')} // Điều hướng về trang chủ
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                Go to Home
            </button>
        </div>
    );
};

export default InterviewActionPage;
