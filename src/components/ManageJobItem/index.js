import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Button, Modal } from 'antd';
import CandidateManageModal from "../CandidateManageModal";

const ManageJobItem = () => {
    const storedToken = localStorage.getItem('token');
    const decodedToken = jwtDecode(storedToken);
    const [isLoading, setIsLoading] = useState(true);
    const [jobstatus, setJobstatus] = useState([])
    const [openModalId, setOpenModalId] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const jobstatusResponse = await axios.get(`http://localhost:3001/jobstatus/${decodedToken.userId}`)
                setJobstatus(jobstatusResponse.data.data);
                setIsLoading(false);
            } catch (error) {
            }
        };
        fetchPost();
    }, [jobstatus]);
    if (isLoading) {
        <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
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

    console.log(jobstatus)
    return (
        <div class="tab-pane fade" id="mange" role="tabpanel" aria-labelledby="mange-tab">
            {jobstatus.map((item) =>
            (
                <div class="posts-bar" key={item._id}>
                    <div class="post-bar bgclr">
                        <div class="wordpressdevlp">
                            <h2>{item.experience}</h2>
                            <p><i class="la la-clock-o"></i>{new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                        <br />
                        <div class="row no-gutters">
                            <div class="col-md-6 col-sm-12">
                                <div class="cadidatesbtn">
                                    <button type="button" class="btn btn-primary" onClick={() => showModal(item._id)}>
                                        <span class="badge badge-light">{item.jobStatusCount}</span>Ứng viên
                                    </button>
                                    <Modal key={item._id} title="Các ứng viên đã ứng tuyển" open={openModalId === item._id} onOk={handleOk} onCancel={handleCancel} width={800}
                                        footer={
                                            <Button key="submit" onClick={handleOk}>
                                                Đóng
                                            </Button>}
                                    >
                                        <CandidateManageModal candidates={item} key={item._id} />
                                    </Modal>
                                    <a href="#">
                                        <i class="far fa-trash-alt"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <ul class="bk-links bklink">
                                    <li><a href="#" title=""><i class="la la-bookmark"></i></a></li>
                                    <li><a href="#" title=""><i class="la la-envelope"></i></a></li>
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