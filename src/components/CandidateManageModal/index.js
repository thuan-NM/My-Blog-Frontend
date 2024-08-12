import axios from "axios";
import React from "react";
import jobstatusServices from "../../services/jobstatus.services";

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
            await jobstatusServices.hireWithUserId({ postid: candidates._id },candidateId)
        } catch (error) {
            console.error('Error hiring candidate:', error);
            // Show an error message
        }
    };

    const denied = async (candidateId) => {
        try {
            await jobstatusServices.denyWithUserId({ postid: candidates._id },candidateId)
        } catch (error) {
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
                <div class="post-bar" key={candidate._id}>
                    <div class="post_topbar applied-post">
                        <div class="usy-dtt usy-dt">
                            <div className="usy-sec">
                                <img src={candidate.user.profilePictureUrl || `images/userava.jpg`} width={45} height={45} />
                                <div class="usy-name">
                                    <h3>{candidate.user.firstName} {candidate.user.lastName}</h3>
                                    <div class="epi-sec epi2">
                                    </div>
                                </div>
                            </div>
                            <div class="devepbtn appliedinfo noreply">
                                <button class="clrbtn" onClick={() => hired(candidate.user._id)}>Tuyển</button>
                                <button class="clrbtn" >Xem trang cá nhân</button>
                                <button class="clrbtn" onClick={() => denied(candidate.user._id)}>
                                    Từ chối
                                </button>
                            </div>
                        </div>
                        <div class="job_descp noborder">
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