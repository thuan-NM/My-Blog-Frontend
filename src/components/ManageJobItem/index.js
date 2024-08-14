import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Button, message, Modal } from 'antd';
import CandidateManageModal from "../CandidateManageModal";
import jobstatusServices from "../../services/jobstatus.services";
import postServices from "../../services/post.services";

const ManageJobItem = () => {
    const storedToken = localStorage.getItem('token');
    const decodedToken = jwtDecode(storedToken);
    const [isLoading, setIsLoading] = useState(true);
    const [jobstatus, setJobstatus] = useState([])
    const [openModalId, setOpenModalId] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const jobstatusResponse = await jobstatusServices.getJobstatusWithUserId(decodedToken.userId)
                setJobstatus(jobstatusResponse.data);
                setIsLoading(false);
            } catch (error) {
            }
        };
        fetchPost();
    }, [jobstatus]);
    if (isLoading) {
        <div className="spinner animate__animated animate__fast animate__fadeIn">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
    }

    if (jobstatus.length == 0) {
        return (
            <div className="animate__animated animate__fast animate__fadeIn">
                <h1 className="nobody">
                    Không có bất cứ gì!
                </h1>
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        )
    }

    const showModal = (id) => {
        setOpenModalId(id);
    };

    const handleOk = () => {
        setOpenModalId(null);
    };

    const handleCancel = () => {
        setOpenModalId(null);
    };

    const handleDelete = async (postId) => {
        try {
            const res = await postServices.deletePostWithID(postId)
            message.success(res.message)
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
                            <h5 className="fw-semibold mb-3">{item.experience}</h5>
                            <p><i className="la la-clock-o"></i>{new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                        <br />
                        <div className="row no-gutters">
                            <div className="col-md-6 col-sm-12">
                                <div className="cadidatesbtn">
                                    <button type="button" className="btn btn-primary" onClick={() => showModal(item._id)}>
                                        <span className="badge badge-light">{item.jobStatusCount}</span>Ứng viên
                                    </button>
                                    <Modal title="Các ứng viên đã ứng tuyển" open={openModalId === item._id} onOk={handleOk} onCancel={handleCancel} width={800}
                                        footer={
                                            <Button key="submit" onClick={handleOk}>
                                                Đóng
                                            </Button>}
                                    >
                                        <CandidateManageModal candidates={item}/>
                                    </Modal>
                                    <a className="clrbtn" onClick={() => handleDelete(item._id)}>
                                        <i className="far fa-trash-alt"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <ul className="bk-links bklink">
                                    <li><a href="#" title=""><i className="la la-bookmark"></i></a></li>
                                    <li><a href="#" title=""><i className="la la-envelope"></i></a></li>
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