import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd"
import overviewServices from "../../services/overview.services";

const OverviewModal = ({ user, isOverviewModalOpen, setIsOverviewModalOpen, setOverview }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [overviewdata, setOverviewdata] = useState("");
    const navigate = useNavigate();

    const handleModal = (e) => {
        e.preventDefault();
        setIsOverviewModalOpen(!isOverviewModalOpen)
    }

    const handleEdit = async (e) => {
        try {
            e.preventDefault();
            const newOverview = {
                overviewdata: overviewdata,
                // lay user -> author
                user: user,
            };
            const res = await overviewServices.postOverview(newOverview);
            message.success(res.message);
            if (res.status === 401) {
                navigate('/auth');
            }
            setOverviewdata('');
        } catch (error) {
            message.error(error.response.data.message);
            if (error.response && error.response.status === 401) {
                navigate('/auth');
            }
        }
        handleModal(e);
    }
    return (
        <div className={`overview-box ${isOverviewModalOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
            <div className="overview-edit">
                <h3>Tổng quan</h3>
                <span>5000 ký tự</span>
                <form>
                    <textarea onChange={(e) => setOverviewdata(e.target.value)}></textarea>
                    <button className="save" onClick={handleEdit}>Lưu</button>
                    <button className="cancel" onClick={handleModal}>Hủy bỏ</button>
                </form>
                <Link className="close-box"><i className="la la-close" onClick={handleModal}></i></Link>
            </div>
        </div>
    )
}

export default OverviewModal;