// components/ScheduledCandidate.js
import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import { jwtDecode } from 'jwt-decode'; // Đảm bảo đúng import
import { FaUserTie, FaBriefcase } from 'react-icons/fa';
import moment from 'moment';
import jobstatusServices from '../../services/jobstatus.services';

const ScheduledCandidate = () => {
    const storedToken = localStorage.getItem("token");
    const [decodedToken, setDecodedToken] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    // Lấy danh sách ứng viên đã xác nhận phỏng vấn
    useEffect(() => {
        if (!decodedToken || !decodedToken.companyId) return;

        fetchInterviewCandidates();
    }, [decodedToken]);

    const fetchInterviewCandidates = async () => {
        const status = "Interview Scheduled"; // hoặc ["Interview Scheduled"] nếu API yêu cầu mảng
        setIsLoading(true);
        try {
            const response = await jobstatusServices.getCandidatesWithStatus(decodedToken.companyId, status);
            console.log("Fetch response:", response); // Kiểm tra cấu trúc phản hồi
            if (response.isSuccess) { // Hoặc response.data.isSuccess tùy vào cấu trúc
                setCandidates(response.data); // Hoặc response.data.data
            } else {
                message.error(response.message || 'Không thể lấy danh sách ứng viên phỏng vấn.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách ứng viên:', error);
            message.error('Lỗi khi lấy danh sách ứng viên phỏng vấn.');
        } finally {
            setIsLoading(false);
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

    return (
        <div className="container mx-auto p-0">
            {candidates.length === 0 ? (
                <div className="bg-white rounded-[4px] shadow-md p-6 text-center">
                    <p className="text-gray-600">Không có ứng viên nào chưa xác nhận phỏng vấn.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
                    {candidates.map((candidate) => (
                        <div
                            key={candidate.id} // Sử dụng candidate.id làm key duy nhất
                            className="bg-white rounded-[4px] shadow-lg p-6 hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-[1.005] relative"
                        >
                            <div
                                className={`absolute top-4 right-4 text-white text-xs font-semibold px-2 py-1 rounded-full bg-green-500`}
                            >
                                {moment(candidate.interviewDate).format('DD/MM/YYYY HH:mm')}
                            </div>

                            <div className="flex items-center mb-4">
                                <FaUserTie className="text-blue-500 text-3xl mr-4" />
                                <div>
                                    <p className="text-xl font-bold text-gray-800">{candidate.user.firstName} {candidate.user.lastName}</p>
                                    <p className="text-sm text-gray-500">{candidate.user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center mt-4">
                                <FaBriefcase className="text-gray-600 mr-2" />
                                <p className="text-gray-700 font-medium">{candidate.jobTitle || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScheduledCandidate;
