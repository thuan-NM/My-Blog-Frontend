import React, { useEffect, useState } from 'react';
import { message, Spin, Button } from 'antd';
import { jwtDecode } from 'jwt-decode';
import jobstatusServices from '../../services/jobstatus.services';
import { FaBriefcase, FaBuilding, FaClock } from 'react-icons/fa';
import moment from 'moment';

const AppliedJobs = () => {
    const storedToken = localStorage.getItem("token");
    const [decodedToken, setDecodedToken] = useState(null);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mapping statuses to Vietnamese and explanations
    const statusMap = {
        "Applied": {
            statusText: "Đã ứng tuyển",
            explanation: "Nộp đơn ứng tuyển thành công, đang chờ phản hồi bên phía công ty."
        },
        "Confirmation Pending": {
            statusText: "Chờ xác nhận",
            explanation: "Công ty đã gửi yêu cầu cho bạn để xác nhận phỏng vấn, hãy kiểm tra Email."
        },
        "Interview": {
            statusText: "Xác nhận phỏng vấn",
            explanation: "Đã xác nhận ứng tuyển, đang chờ phía công ty sắp lịch phỏng vấn."
        },
        "Interview Scheduled": {
            statusText: null, // We'll display the date instead
            explanation: "Công ty đã sắp lịch phỏng vấn, hãy kiểm tra Email để xác nhận phỏng vấn."
        },
        "Interview Confirmed": {
            statusText: null, // We'll display the date instead
            explanation: "Đã xác nhận ngày phỏng vấn, hãy có mặt đúng giờ để bắt đầu phỏng vấn."
        },
        "Reschedule Requested": {
            statusText: "Yêu cầu dời lịch",
            explanation: "Đã yêu cầu dời lịch phỏng vấn, hãy chờ phản hồi từ phía công ty."
        },
        "Hired": {
            statusText: "Được nhận",
            explanation: "Bạn đã được nhận vào vị trí này. Chúc mừng!"
        },
        "Denied": {
            statusText: "Đã bị từ chối",
            explanation: "Rất tiếc, bạn đã không được chọn cho vị trí này."
        },
    };

    useEffect(() => {
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setDecodedToken(decoded);
            } catch (error) {
                console.error("Lỗi khi giải mã token:", error);
                message.error("Token không hợp lệ hoặc bị thiếu. Vui lòng đăng nhập lại.");
                setIsLoading(false);
            }
        } else {
            message.error("Token không được tìm thấy. Vui lòng đăng nhập lại.");
            setIsLoading(false);
        }
    }, [storedToken]);

    useEffect(() => {
        if (!decodedToken || !decodedToken.userId) return;

        fetchAppliedJobs();
    }, [decodedToken]);

    const fetchAppliedJobs = async () => {
        setIsLoading(true);
        try {
            const response = await jobstatusServices.getJobstatusByApplier(decodedToken.userId);
            if (response.isSuccess) {
                setAppliedJobs(response.data);
            } else {
                message.error(response.message || 'Không thể lấy danh sách công việc đã ứng tuyển.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách công việc đã ứng tuyển:', error);
            message.error('Đã xảy ra lỗi khi lấy danh sách công việc đã ứng tuyển.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinMeeting = async (jobStatus) => {
        try {
            // Fetch job status details to get company ID
            const response = await jobstatusServices.getJobstatusDetails(jobStatus._id);
            const companyId = response.companyid;

            // Construct the video call URL
            const videoCallUrl = `http://localhost:5173/call/${decodedToken.userId}/${companyId}`;

            // Open the video call in a new tab
            window.open(videoCallUrl, '_blank');
        } catch (error) {
            console.error('Lỗi khi tham gia phỏng vấn:', error);
            message.error('Đã xảy ra lỗi khi tham gia phỏng vấn.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <Spin />
            </div>
        );
    }

    if (!decodedToken) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-red-600 text-lg font-semibold">Truy cập không hợp lệ. Vui lòng đăng nhập.</p>
            </div>
        );
    }

    if (appliedJobs.length === 0) {
        return (
            <div className="bg-white rounded-[4px] shadow-md p-6 text-center">
                <p className="text-gray-600">Bạn chưa ứng tuyển công việc nào.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-0">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 lg:grid-cols-1">
                {appliedJobs.map(({ jobStatus, post }) => {
                    const statusInfo = statusMap[jobStatus.status] || {};
                    let statusText = statusInfo.statusText;
                    let explanation = statusInfo.explanation;

                    // For statuses where we need to display the interview date
                    if (jobStatus.status === "Interview Scheduled" || jobStatus.status === "Interview Confirmed") {
                        statusText = moment(jobStatus.interviewDate).format('DD/MM/YYYY HH:mm');
                    }

                    return (
                        <div key={jobStatus._id} className="bg-white rounded-[4px] shadow-lg p-6 hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-[1.005] relative">
                            {/* Status Badge */}
                            <div
                                className={`absolute top-4 right-4 text-white text-xs font-semibold px-2 py-1 rounded-full ${jobStatus.status === "Denied" ? "bg-red-500" : "bg-green-500"}`}
                            >
                                {statusText}
                            </div>

                            {/* Job details */}
                            <div className="flex items-center mb-4">
                                <FaBriefcase className="text-blue-500 text-3xl mr-4" />
                                <div>
                                    <h2 className="text-xl font-bold">{post.title}</h2>
                                    <div className="flex items-center text-gray-700">
                                        <FaBuilding className="mr-2" />
                                        <p>{post.author.userdata.companyname || 'Công ty không xác định'}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Applied Date */}
                            <div className="flex items-center mt-2">
                                <FaClock className="text-gray-600 mr-2" />
                                <p className="text-gray-700">Ngày ứng tuyển: {moment(jobStatus.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                            </div>
                            {/* Explanation */}
                            <div className="mt-2">
                                <p className="text-gray-700">{explanation}</p>
                            </div>
                            {/* Join Meeting Button */}
                            {jobStatus.status === "Interview Confirmed" && (
                                <Button type="primary" className="mt-6 w-full" onClick={() => handleJoinMeeting(jobStatus)}>
                                    Tham gia phòng họp
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AppliedJobs;
