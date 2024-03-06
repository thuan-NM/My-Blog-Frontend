import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd"

const OverviewModal = ({ user, isOverviewModalOpen, setIsOverviewModalOpen ,setOverview}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [overviewdata,setOverviewdata] = useState("");

    const handleModal = (e) => {
        e.preventDefault();
        setIsOverviewModalOpen(!isOverviewModalOpen)
    }

    const handleEdit = (e) => {
        e.preventDefault();
        const newOverview = {
            overviewdata: overviewdata,
            // lay user -> author
            user: user,
        };
        const token = localStorage.getItem("token");
        axios
            .post("http://localhost:3001/overviews", newOverview, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                message.success(res.data.message);
                if (res.status === 401) {
                    // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
                    navigate("/auth");
                }
                setOverviewdata("");
            })
            .catch((error) => {
                message.error(error.response.data.message);
                if (error.response && error.response.status === 401) {
                    // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
                    navigate("/auth");
                }
            });
        handleModal(e);
    }
    return (
            <div className={`overview-box ${isOverviewModalOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
                <div className="overview-edit">
                    <h3>Overview</h3>
                    <span>5000 character left</span>
                    <form>
                        <textarea onChange={(e)=>setOverviewdata(e.target.value)}></textarea>
                        <button className="save" onClick={handleEdit}>Save</button>
                        <button className="cancel" onClick={handleModal}>Cancel</button>
                    </form>
                    <Link className="close-box"><i className="la la-close" onClick={handleModal}></i></Link>
                </div>
            </div>
    )
}

export default OverviewModal;