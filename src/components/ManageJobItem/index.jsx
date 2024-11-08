import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { message } from 'antd';
import jobstatusServices from "../../services/jobstatus.services";
import postServices from "../../services/post.services";
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom";

const ManageJobItem = () => {
    const storedToken = localStorage.getItem('token');
    const decodedToken = jwtDecode(storedToken);
    const [isLoading, setIsLoading] = useState(true);
    const [jobstatus, setJobstatus] = useState([])

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const jobstatusResponse = await jobstatusServices.getJobstatusWithAuthorId(decodedToken.companyId)
                setJobstatus(jobstatusResponse.data);
                setIsLoading(false);
            } catch (error) {
            }
        };
        fetchPost();
    }, [jobstatus]);

    if (isLoading || jobstatus) {
        <div className="spinner animate__animated animate__fast animate__fadeIn">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
    }

    if (jobstatus.length == 0) {
        return (
            <div className="animate__animated animate__fast animate__fadeIn">
                <div className="nobody">
                    <ExclamationCircleOutlined />
                    Không có kết quả
                </div>
            </div>
        )
    }
    const handleDelete = async (postId) => {
        try {
            const res = await postServices.deletePostWithID(postId)
            message.success({
                content: res.message,
                style: { marginTop: '8vh' }, // Di chuyển vị trí thông báo xuống dưới
                duration: 2,
              });
        } catch (error) {
            message.error(error.response.data.message)
            console('Error deleting job status:', error);
        }
    };
    return (
        <div className="tab-pane fade show active animate__animated animate__fast animate__fadeIn" id="mange" role="tabpanel" aria-labelledby="mange-tab">
            {jobstatus.map((item) =>
            (
                <div className="posts-bar" key={item._id}>
                    <div className="post-bar bgclr">
                        <div className="wordpressdevlp">
                            <h2>{item.title}</h2>
                            <p className="flex items-center"><i className="la la-clock-o"></i>{new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                        <br />
                        <div className="row no-gutters">
                            <div className="col-md-6 col-sm-12">
                                <div className="cadidatesbtn ">
                                    <Link to={`/viewcandidate/${item._id}`} type="button" className="btn btn-primary !bg-[#e44d3a] outline-none border-none" >
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
            )
            )}
        </div>
    )
}

export default ManageJobItem;