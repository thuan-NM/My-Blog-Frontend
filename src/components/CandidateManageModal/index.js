import axios from "axios";
import React from "react";
import jobstatusServices from "../../services/jobstatus.services";
import { message } from "antd";

const CandidateManageModal = ({ candidates }) => {
    const token = localStorage.getItem("token")
    if (candidates.userapply.length == 0) {
        return (
            <div>
                <h1 className="nobody">
                    Không ai ứng tuyển công việc này!
                </h1>
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        )
    }

    const hired = async (candidateId) => {
        try {
            const res = await jobstatusServices.hireWithUserId({ postid: candidates._id },candidateId)
            message.success(res.message)
        } catch (error) {
            message.error(error.response.data.message)
            console.error('Error hiring candidate:', error);
            // Show an error message
        }
    };

    const denied = async (candidateId) => {
        try {
            const res = await jobstatusServices.denyWithUserId({ postid: candidates._id },candidateId)
            message.success(res.message)
        } catch (error) {
            message.error(error.response.data.message)
            console.error('Error denying candidate:', error);
            // Show an error message
        }
    };

    return (
        <div>
            {candidates.userapply.map((candidate) => (
                // <div>
                //     {candidate.firstName} {candidate.lastName}
                // </div>
                <div className="post-bar" key={candidate.user._id} >
                    <div className="post_topbar applied-post">
                        <div className="usy-dtt usy-dt">
                            <div className="usy-sec">
                                <img src={candidate.user.profilePictureUrl || `images/userava.jpg`} width={45} height={45} />
                                <div className="usy-name">
                                    <h3>{candidate.user.firstName} {candidate.user.lastName}</h3>
                                    <div className="epi-sec epi2">
                                    </div>
                                </div>
                            </div>
                            <div className="devepbtn appliedinfo noreply">
                                <button className="clrbtn" onClick={() => hired(candidate.user._id)}>Tuyển</button>
                                <button className="clrbtn" >Xem trang cá nhân</button>
                                <button className="clrbtn" onClick={() => denied(candidate.user._id)}>
                                    Từ chối
                                </button>
                            </div>
                        </div>
                        <div className="job_descp noborder">
                            <span><span className="fw-bold me-2">Giới thiệu:</span> {candidate.info.introduce}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CandidateManageModal;