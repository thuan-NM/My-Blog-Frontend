import React, { useEffect, useState } from "react";
import { message, Input } from 'antd';
import { jwtDecode } from "jwt-decode";
import jobstatusServices from "../../services/jobstatus.services";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Search } = Input;

const ManageJobItem = () => {
    const storedToken = localStorage.getItem('token');
    const decodedToken = jwtDecode(storedToken);
    const [isLoading, setIsLoading] = useState(true);
    const [jobstatus, setJobstatus] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJobStatus = async () => {
            try {
                const jobstatusResponse = await jobstatusServices.getJobstatusWithAuthorId(decodedToken.companyId);
                setJobstatus(jobstatusResponse.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching job status:', error);
            }
        };
        fetchJobStatus();
    }, [decodedToken.companyId]);

    const handleSearch = async (value) => {
        setSearchTerm(value);
        if (value.trim()) {
            try {
                // Thêm companyId vào yêu cầu tìm kiếm
                const response = await jobstatusServices.searchJobStatus(value, decodedToken.companyId);
                setJobstatus(response.data); // Cập nhật kết quả tìm kiếm
            } catch (error) {
                message.error('Tìm kiếm không thành công');
            }
        } else {
            setIsLoading(true);
            const jobstatusResponse = await jobstatusServices.getJobstatusWithAuthorId(decodedToken.companyId);
            setJobstatus(jobstatusResponse.data);
            setIsLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setIsLoading(true);
        const jobstatusResponse = jobstatusServices.getJobstatusWithAuthorId(decodedToken.companyId);
        jobstatusResponse
            .then(response => {
                setJobstatus(response.data);
                setIsLoading(false);
            })
            .catch(() => {
                message.error('Không thể tải lại dữ liệu');
                setIsLoading(false);
            });
    };

    const handleDelete = async (postId) => {
        try {
            const res = await postServices.deletePostWithID(postId);
            message.success({
                content: res.message,
                style: { marginTop: '8vh' },
                duration: 2,
            });
        } catch (error) {
            message.error(error.response.data.message);
            console.error('Error deleting job status:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="spinner animate__animated animate__fast animate__fadeIn">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        );
    }

    if (jobstatus.length === 0) {
        return (
            <div className="animate__animated animate__fast animate__fadeIn">
                <div className="nobody">
                    <ExclamationCircleOutlined />
                    Không có kết quả
                </div>
            </div>
        );
    }

    return (
        <div className="tab-pane fade show active animate__animated animate__fast animate__fadeIn" id="mange" role="tabpanel" aria-labelledby="mange-tab">
            <Search
                placeholder="Tìm kiếm công việc"
                enterButton="Tìm kiếm"
                size="large"
                onSearch={handleSearch}
                value={searchTerm} // Liên kết giá trị tìm kiếm
                onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm khi người dùng gõ
                allowClear // Cho phép xóa tìm kiếm
                onClear={handleClearSearch} // Thực hiện khi nút clear được nhấn
                style={{ marginBottom: '20px' }}
            />
            {jobstatus.map((item) => (
                <div className="posts-bar" key={item._id}>
                    <div className="post-bar bgclr">
                        <div className="wordpressdevlp">
                            <h2>{item.postTitle || item.title}</h2> {/* Sử dụng postTitle trả về từ backend */}
                            <p className="flex items-center"><i className="la la-clock-o"></i>{new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                        <br />
                        <div className="row no-gutters">
                            <div className="col-md-6 col-sm-12">
                                <div className="cadidatesbtn">
                                    <Link to={`/viewcandidate/${item._id}`} type="button" className="btn btn-primary !bg-[#e44d3a] outline-none border-none">
                                        <span className="badge badge-light">{item.jobStatusCount}</span>Ứng viên
                                    </Link>
                                    <a className="clrbtn" onClick={() => handleDelete(item._id)}>
                                        <i className="far fa-trash-alt"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <ul className="bk-links bklink">
                                    <li></li>
                                    <li></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ManageJobItem;
