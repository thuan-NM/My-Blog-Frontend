import React, { useState, useEffect } from 'react';
import { message, Modal, DatePicker, Button, Spin } from 'antd';
import { jwtDecode } from 'jwt-decode'; // Đảm bảo đúng import
import { FaCalendarAlt, FaUserTie, FaBriefcase } from 'react-icons/fa';
import moment from 'moment';
import jobstatusServices from '../../services/jobstatus.services';

const { confirm } = Modal;

const InterviewSchedule = () => {
    const storedToken = localStorage.getItem("token");
    const [decodedToken, setDecodedToken] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScheduling, setIsScheduling] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [interviewDateTime, setInterviewDateTime] = useState(null);

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
        if (!decodedToken || !decodedToken.companyId) return;

        fetchInterviewCandidates();
    }, [decodedToken]);

    const showScheduleModal = (candidate) => {
        setSelectedCandidate(candidate);
        setIsModalVisible(true);
    };

    const fetchInterviewCandidates = async () => {
        setIsLoading(true);
        try {
            const response = await jobstatusServices.getInterviewCandidates(decodedToken.companyId);
            if (response.isSuccess) {
                setCandidates(response.data);
            } else {
                message.error(response.message || 'Không thể lấy danh sách ứng viên phỏng vấn.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách ứng viên:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSchedule = async () => {
        if (!interviewDateTime) {
            message.error("Vui lòng chọn ngày và giờ cho buổi phỏng vấn.");
            return;
        }

        if (interviewDateTime.isBefore(moment())) {
            message.error("Vui lòng chọn thời gian trong tương lai cho buổi phỏng vấn.");
            return;
        }

        setIsScheduling(true);
        try {
            const response = await jobstatusServices.scheduleInterview({
                postId: selectedCandidate.postId,
                candidateId: selectedCandidate.user._id,
                interviewDate: interviewDateTime.toISOString(),
            });

            if (response.isSuccess) {
                message.success("Đã xếp lịch phỏng vấn thành công.");
                // Gọi lại hàm fetchInterviewCandidates để làm mới danh sách ứng viên
                fetchInterviewCandidates();
                setIsModalVisible(false); // Đóng modal sau khi cập nhật lịch
            } else {
                message.error(response.message || "Không thể xếp lịch phỏng vấn.");
            }
        } catch (error) {
            console.error("Lỗi khi xếp lịch phỏng vấn:", error);
            message.error("Đã xảy ra lỗi khi xếp lịch phỏng vấn.");
        } finally {
            setIsScheduling(false);
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
                    <p className="text-gray-600">Không có ứng viên nào đang chờ xếp lịch.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
                    {candidates.map((candidate) => (
                        <div key={candidate.id} className="bg-white rounded-[4px] shadow-lg p-6 hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-[1.005] relative">
                            <div
                                className={`absolute top-4 right-4 text-white text-xs font-semibold px-2 py-1 rounded-full ${candidate.status !== "Interview" ? "bg-[#E44D3A]" : "bg-green-500"
                                    }`}
                            >
                                {candidate.status !== "Interview" ? 'Yêu cầu dời lịch' : 'Chưa xếp lịch'}
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
                            <div className="flex items-center mt-2">
                                <FaCalendarAlt className="text-gray-600 mr-2" />
                                {candidate.status === "Reschedule Requested" ? (
                                    <p className="text-[#E44D3A]">
                                        Lịch phỏng vấn: {moment.utc(candidate.interviewDate).format('DD/MM/YYYY HH:mm')}
                                    </p>
                                ) : (
                                    <p className="text-red-600">Chưa xếp lịch phỏng vấn</p>
                                )}
                            </div>
                            <Button type="primary" className="mt-6 w-full" onClick={() => showScheduleModal(candidate)}>
                                {candidate.interviewDate ? "Chỉnh sửa lịch" : "Xếp lịch phỏng vấn"}
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                title="Xếp lịch phỏng vấn"
                open={isModalVisible}
                onOk={handleSchedule}
                onCancel={() => setIsModalVisible(false)}
                okText="Lên lịch"
                cancelText="Hủy bỏ"
                okButtonProps={{ loading: isScheduling }}
                centered
                className="rounded-lg"
            >
                <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={(dateTime) => setInterviewDateTime(dateTime)}
                    placeholder="Chọn ngày và giờ"
                    className="w-full mt-2"
                    disabledDate={(current) => current && current < moment().startOf('day')}
                    disabledTime={(date) => {
                        if (date && date.isSame(moment(), 'day')) {
                            const currentHour = moment().hour();
                            const currentMinute = moment().minute();
                            return {
                                disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
                                disabledMinutes: (selectedHour) => selectedHour === currentHour
                                    ? Array.from({ length: currentMinute }, (_, i) => i)
                                    : []
                            };
                        }
                        return {};
                    }}
                />
            </Modal>
        </div>
    );
};

export default InterviewSchedule;
