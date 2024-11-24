import React, { useState, useEffect } from 'react';
import { message, Modal, Button, Spin, Space } from 'antd';
import { jwtDecode } from 'jwt-decode'; // Đảm bảo đúng import
import { FaUserTie, FaBriefcase } from 'react-icons/fa';
import moment from 'moment';
import jobstatusServices from '../../services/jobstatus.services';

const { confirm } = Modal;

const ManageCandidate = () => {
    const storedToken = localStorage.getItem("token");
    const [decodedToken, setDecodedToken] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({}); // Sử dụng đối tượng để quản lý loading
    const status = ["Interview Confirmed", "Hired", "Denied"];

    useEffect(() => {
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setDecodedToken(decoded);
            } catch (error) {
                console.error("Error decoding token:", error);
                message.error("Invalid or missing token. Please log in again.");
                setIsLoading(false);
            }
        } else {
            message.error("Token not found. Please log in again.");
            setIsLoading(false);
        }
    }, [storedToken]);

    useEffect(() => {
        if (!decodedToken || !decodedToken.companyId) return;

        fetchInterviewCandidates();
    }, [decodedToken]); // Loại bỏ candidates.length == 0

    const fetchInterviewCandidates = async () => {
        setIsLoading(true);
        try {
            const response = await jobstatusServices.getCandidatesWithStatus(decodedToken.companyId, status);
            if (response.isSuccess) {
                setCandidates(response.data);
            } else {
                message.error(response.message || 'Unable to fetch interview candidates.');
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleHire = (candidate) => {
        confirm({
            title: `Bạn có muốn tuyển ${candidate.user.firstName} ${candidate.user.lastName} không?`,
            content: `${candidate.user.firstName} ${candidate.user.lastName}`,
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                const candidateId = candidate.id;
                setActionLoading(prev => ({ ...prev, [candidateId]: true }));
                try {
                    const postid = candidate.postId;
                    const response = await jobstatusServices.hireWithUserId({ postid }, candidate.user._id);
                    if (response.isSuccess) {
                        message.success('Tuyển thành công.');
                        fetchInterviewCandidates();
                    } else {
                        message.error(response.message || 'Tuyển thất bại.');
                    }
                } catch (error) {
                    console.error('Tuyển thất bại:', error);
                    message.error('Có lỗi xảy ra khi tuyển.');
                } finally {
                    setActionLoading(prev => ({ ...prev, [candidateId]: false }));
                }
            },
        });
    };

    const handleDeny = (candidate) => {
        confirm({
            title: `Bạn có thật sự muốn từ chối ${candidate.user.firstName} ${candidate.user.lastName} không?`,
            content: `${candidate.user.firstName} ${candidate.user.lastName}`,
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                const candidateId = candidate.id;
                setActionLoading(prev => ({ ...prev, [candidateId]: true }));
                try {
                    const postid = candidate.postId;
                    const response = await jobstatusServices.denyWithUserId({ postid }, candidate.user._id);
                    if (response.isSuccess) {
                        message.success('Đã từ chối.');
                        fetchInterviewCandidates();
                    } else {
                        message.error(response.message || 'Từ chối thất bại.');
                    }
                } catch (error) {
                    console.error('Từ chối thất bại:', error);
                    message.error('Có lỗi xảy ra khi từ chối.');
                } finally {
                    setActionLoading(prev => ({ ...prev, [candidateId]: false }));
                }
            },
        });
    };

    const handleDelete = (candidate) => {
        confirm({
            title: 'Bạn có muốn xóa người này không?',
            content: `${candidate.user.firstName} ${candidate.user.lastName}`,
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                const candidateId = candidate.id;
                setActionLoading(prev => ({ ...prev, [candidateId]: true }));
                try {
                    const response = await jobstatusServices.deleteJobstatusWithID(candidateId);
                    if (response.isSuccess) {
                        message.success('Xóa thành công.');
                        // Cập nhật danh sách ứng viên cục bộ
                        setCandidates(prevCandidates => prevCandidates.filter(c => c.id !== candidateId));
                        // Hoặc gọi lại fetchInterviewCandidates để lấy danh sách mới từ server
                        // fetchInterviewCandidates();
                    } else {
                        message.error(response.message || 'Lỗi khi xóa.');
                    }
                } catch (error) {
                    console.error('Lỗi khi xóa:', error);
                    message.error('Có lỗi xảy ra khi xóa.');
                } finally {
                    setActionLoading(prev => ({ ...prev, [candidateId]: false }));
                }
            },
        });
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
                <p className="text-red-600 text-lg font-semibold">Vui lòng đăng nhập để tiếp tục.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {candidates.length === 0 ? (
                <div className="bg-white rounded-md shadow-md p-6 text-center">
                    <p className="text-gray-600">Không có ứng cử viên nào để xét duyệt.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
                    {candidates.map((candidate) => {
                        const candidateId = candidate.id;
                        return (
                            <div
                                key={candidateId} // Sử dụng candidate.id làm key
                                className="bg-white rounded-md shadow-lg p-6 hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105 relative"
                            >
                                <div
                                    className={`absolute top-4 right-4 `}
                                >
                                    <div className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${candidate.status === "Interview Confirmed"
                                        ? "bg-green-500"
                                        : candidate.status === "Hired"
                                            ? "bg-blue-500"
                                            : "bg-red-500"
                                        }`}>
                                        {(candidate.status === "Denied" && "Đã từ chối") || (candidate.status === "Hired" && "Đã tuyển dụng") || "Chờ xử lý"}

                                    </div>

                                </div>

                                <div className="flex items-center mb-4">
                                    <FaUserTie className="text-blue-500 text-3xl mr-4" />
                                    <div>
                                        <p className="text-xl font-bold text-gray-800">
                                            {candidate.user.firstName} {candidate.user.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">{candidate.user.email}</p>
                                    </div>
                                </div>
                                {/* Status and Actions */}
                                <div className="mt-6 flex justify-between">
                                    <div>
                                        <div className='flex flex-row justify-between'>
                                            <div className='flex items-center'>
                                                <p className="text-gray-700 font-medium"><strong className='font-semibold '>Vị trí công việc: </strong>{candidate.jobTitle || 'Not updated'}</p>
                                            </div>

                                        </div>
                                        <p className={`text-sm font-semibold ${candidate.status === "Interview Confirmed"
                                            ? "text-green-600"
                                            : candidate.status === "Hired"
                                                ? "text-blue-600"
                                                : "text-red-600"
                                            }`}>

                                            Thời gian phỏng vấn: {(moment.utc(candidate.interviewDate).format('DD/MM/YYYY HH:mm'))}
                                        </p>
                                    </div>
                                    <Space className="mt-2">
                                        {candidate.status === "Interview Confirmed" && (
                                            <>
                                                <Button
                                                    type="primary"
                                                    loading={actionLoading[candidateId]}
                                                    onClick={() => handleHire(candidate)}
                                                >
                                                    Tuyển
                                                </Button>
                                                <Button
                                                    danger
                                                    loading={actionLoading[candidateId]}
                                                    onClick={() => handleDeny(candidate)}
                                                >
                                                    Từ chối
                                                </Button>
                                            </>
                                        )}
                                        {candidate.status === "Denied" && (
                                            <Button
                                                type="default"
                                                danger
                                                loading={actionLoading[candidateId]}
                                                onClick={() => handleDelete(candidate)}
                                            >
                                                Xóa
                                            </Button>
                                        )}
                                        {/* No buttons for "Hired" status */}
                                    </Space>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ManageCandidate;
