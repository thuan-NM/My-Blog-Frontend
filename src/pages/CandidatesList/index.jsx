import React, { useEffect, useState } from "react";
import jobstatusServices from "../../services/jobstatus.services";
import { message, Drawer, Modal, DatePicker } from "antd"; // Import Modal and DatePicker
import { Link, useParams } from "react-router-dom";
import postServices from "../../services/post.services";
import JobIntroduce from "../../components/JobIntroduce";
import { Dropdown, Space } from 'antd';
import { BarsOutlined } from '@ant-design/icons';
import moment from 'moment';

const CandidateList = () => {
    const { postId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [job, setJob] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedCvUrl, setSelectedCvUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const [interviewDate, setInterviewDate] = useState(null); // State for interview date
    const [selectedCandidate, setSelectedCandidate] = useState(null); // To store candidate's ID

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const candidatesResponse = await jobstatusServices.getCandidateOfJob(postId);
                const jobResponse = await postServices.getJobsWithId(postId);
                setJob(jobResponse.data);
                setCandidates(candidatesResponse.data);
            } catch (error) {
                message.error("Failed to load candidates.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCandidate();
    }, [postId]);

    if (isLoading) {
        return (
            <div className="process-comm">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        );
    }

    const scheduleInterview = (candidateId) => {
        setSelectedCandidate(candidateId); // Store the candidate ID
        setIsModalOpen(true); // Open the modal
    };

    const handleOk = async () => {
        if (!interviewDate) {
            message.error("Please select an interview date");
            return;
        }

        try {
            const res = await jobstatusServices.scheduleInterview({
                postId,
                candidateId: selectedCandidate,
                interviewDate: interviewDate.toISOString(),
            });
            message.success(res.message);
            setIsModalOpen(false);
        } catch (error) {
            message.error("Failed to schedule interview");
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="main-section mt-[20px]">
            <div className="container">
                <div className="main-section-data">
                    <div className="row">
                        <div className="col-lg-8 col-md-4 pd-left-none no-pd">
                            {candidates.map((candidate) => {
                                const items = [
                                    {
                                        label: (
                                            <button
                                                className="!p-1 !px-6 text-md font-medium w-full"
                                                onClick={() => scheduleInterview(candidate.user._id)} // Open modal to set interview
                                            >
                                                Đặt lịch phỏng vấn
                                            </button>
                                        ),
                                        key: '0',
                                    },
                                    {
                                        label: (
                                            <button
                                                className="!p-1 !px-6 text-md !text-black font-medium w-full"
                                                onClick={() => denied(candidate.user._id)}
                                            >
                                                Từ chối
                                            </button>
                                        ),
                                        key: '1',
                                    }
                                ];

                                return (
                                    <div className="bg-white p-4 mb-3" key={candidate.user._id}>
                                        <div className="flex justify-between mb-8">
                                            <Link to={`/userprofile/${candidate.user._id}`} className="w-1/3 flex items-center">
                                                <img
                                                    src={candidate.user.profilePictureUrl || `../images/userava.jpg`}
                                                    width={55}
                                                    height={55}
                                                    alt="profile"
                                                    className="!mr-2 rounded-full"
                                                />
                                                <div className="w-full text-lg font-medium flex flex-col">
                                                    <div>{candidate.user.firstName} {candidate.user.lastName}</div>
                                                    <div className="text-neutral-500 !text-md">{candidate.user.email}</div>
                                                </div>
                                            </Link>
                                            <div className="flex items-center">
                                                <Dropdown
                                                    menu={{ items }}
                                                    trigger={['click']}
                                                >
                                                    <a onClick={(e) => e.preventDefault()}>
                                                        <Space>
                                                            <BarsOutlined className="text-3xl text-black" />
                                                        </Space>
                                                    </a>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <hr className="!border-2 !border-neutral-400" />
                                        <div>
                                            <div className="text-lg font-semibold mb-2">
                                                Lời giới thiệu:
                                            </div>
                                            <div className="ml-4">
                                                - {candidate.coverLetter}
                                            </div>
                                            <div className="flex justify-end">
                                                <Link
                                                    to={candidate.cv}
                                                    target="_blank"
                                                    className="clrbtn mt-2 !underline hover:!underline hover:!text-neutral-400 text-black"
                                                >
                                                    Xem CV ứng viên
                                                </Link>
                                            </div>
                                        </div>
                                        <hr className="!border-2 !border-neutral-400" />
                                    </div>
                                );
                            })}
                        </div>
                        <JobIntroduce job={job} />
                    </div>
                </div>
            </div>

            {/* Modal for scheduling interview */}
            <Modal
                title="Đặt lịch phỏng vấn"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={(value) => setInterviewDate(value)} // Set selected date
                    placeholder="Chọn thời gian phỏng vấn"
                />
            </Modal>
        </div>
    );
};

export default CandidateList;
