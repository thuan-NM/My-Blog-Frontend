// InterviewActionPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import JobstatusServices from '../../services/jobstatus.services';
import { message, Spin, Button as AntdButton, Typography, Card, Space, Modal, Input } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

// Utility function to generate random codes
const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return `${Array.from({ length: 3 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('')}-${Array.from({ length: 3 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('')}`;
};

const InterviewActionPage = () => {
    const { action, jobStatusId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [companyId, setCompanyId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [interviewDate, setInterviewDate] = useState(null);
    const [code1] = useState(generateRandomCode());
    const [code2] = useState(generateRandomCode());
    const [roomCreated, setRoomCreated] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [feedback, setFeedback] = useState('');
    const hasRunOnce = useRef(false);
    const navigate = useNavigate();

    const createRoom = useCallback(async (userId, companyId) => {
        try {
            const roomDataPayload = {
                name: `${userId}-${companyId}`,
                userkey: code1,
                companykey: code2,
            };
            const roomResponse = await axios.post("http://localhost:5000/rooms/create", roomDataPayload);

            if (roomResponse.data.success) {
                setRoomData(roomResponse.data.data);
                setRoomCreated(true);
            } else {
                throw new Error(roomResponse.data.message || 'Failed to create room.');
            }
        } catch (error) {
            console.error("Error creating room:", error);
            if (error.response?.data?.message === 'Room already exists') {
                setRoomData(error.response.data.data);
                setRoomCreated(true);
                message.info('Room already exists. Using existing room.');
            } else {
                setStatusMessage('Failed to create room.');
                message.error('Failed to create room.');
            }
        }
    }, [code1, code2]);

    const handleAction = useCallback(async (userId, companyId, interviewDateTime) => {
        try {
            let response;
            if (action === 'accept') {
                await createRoom(userId, companyId);
                response = await JobstatusServices.acceptInterview(jobStatusId,code1);
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
                message.success(statusMessage);
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
    }, [action, createRoom, jobStatusId]);

    useEffect(() => {
        if (!action || !jobStatusId) {
            setStatusMessage('Invalid request. Missing action or jobStatusId.');
            setIsLoading(false);
            return;
        }

        if (hasRunOnce.current) return;
        hasRunOnce.current = true;

        const fetchJobstatusDetails = async () => {
            try {
                const jobStatus = await JobstatusServices.getJobstatusDetails(jobStatusId);
                console.log('Job status', jobStatus)
                setCompanyId(jobStatus.companyid);
                setUserId(jobStatus.userid);
                setInterviewDate(jobStatus.date);
                handleAction(jobStatus.userid, jobStatus.companyid);
            } catch (error) {
                console.error("Error fetching job status details:", error);
                setStatusMessage('Failed to retrieve job status details.');
                setIsLoading(false);
            }
        };

        fetchJobstatusDetails();
    }, [action, jobStatusId, handleAction]);

    const joinRoom = () => {
        if (roomData) {
            navigate(`/room/${roomData._id}`, { state: { userKey: roomData.userkey } });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin />
            </div>
        );
    }

    return (
        <div className=" !h-full">
            <Card className="w-full max-w-lg p-8 rounded shadow-lg mx-auto !mt-24">
                <div className="text-center mb-6 flex flex-col">
                    <img src={`../../images/cover.jpg`} className="h-24 mx-auto mb-2 w-10/12" />
                    <div>
                        <Title level={3}>Thông báo lịch phỏng vấn</Title>
                    </div>
                </div>
                <Space direction="vertical" size="middle" className="w-full">
                    {action === 'accept' && roomCreated && roomData && (
                        <div>
                            <Text>Xin chào,</Text>
                            <Text>Chúng tôi rất vui khi bạn đã đồng ý về việc sắp xếp lịch phỏng vấn. Thông tin chi tiết như sau:</Text>
                            {(
                                <Text className="block mb-2">Ngày và Giờ: <span className="font-semibold">{new Date(interviewDate).toLocaleString()}</span></Text>
                            )}
                            <Text>Để tiện trao đổi chi tiết về bản thân bạn, vui lòng tham gia vào phòng phỏng vấn dưới đây vào đúng thời gian đã nêu:</Text>

                            <div className="text-left">
                                <Text className="block mb-2">Mật khẩu để tham gia phòng là: <span className="font-bold text-md bg-neutral-100 p-2">{roomData.userkey}</span></Text>
                                <div className='flex !justify-center'>
                                    <AntdButton type="primary" className="w-1/2 mt-4 !mx-auto">
                                        <Link to={`${process.env.REACT_APP_API_ROOM_APP_API_URL}/call/${userId}/${companyId}`}>
                                            Tham gia ngay
                                        </Link>
                                    </AntdButton>
                                </div>
                            </div>
                        </div>
                    )}

                    {action === 'reschedule' && (
                        <div className="text-center">
                            <Text>Yêu cầu dời lịch của bạn đã được gửi đi thành công. Vui lòng chờ đợi thông tin tiếp theo từ phía công ty qua email!</Text>
                        </div>
                    )}
                    <div className='!mx-auto text-center mt-4'>
                        <Link to={"/"} className="px-6 py-3 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition duration-300 ease-in-out">
                            Về trang chủ
                        </Link>
                    </div>
                </Space>
            </Card>

        </div>
    );
};

export default InterviewActionPage;