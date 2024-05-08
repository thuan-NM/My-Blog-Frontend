import React, { useState } from "react";
import ManageJobItem from "../ManageJobItem"
import AppliedJob from "../AppliedJob"
import DeniedJob from "../DeniedJob";
import HiredJob from "../HiredJob";

const ManageJob = () => {
    const [activeTab, setActiveTab] = useState("manage");

    const renderTabContent = () => {
        switch (activeTab) {
            case "manage":
                return <ManageJobItem />;
            case "denied":
                return <DeniedJob />;
            case "applied":
                return <AppliedJob />;
            case "hired":
                return <HiredJob />;
            default:
                return <ManageJobItem />;
        }
    }

    return (
        <>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                    <a className={`nav-link ${activeTab == "manage" ? "animate__animated animate__faster animate__zoomIn active" : ""}`} id="manage-tab" data-toggle="tab" role="tab" aria-controls="home" aria-selected="true" onClick={() => setActiveTab("manage")}>Quản lý công việc</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab == "denied" ? "animate__animated animate__faster animate__zoomIn active" : ""}`} id="denied-tab" data-toggle="tab" role="tab" aria-controls="profile" aria-selected="false" onClick={() => setActiveTab("denied")}>Bị từ chối</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab == "applied" ? "animate__animated animate__faster animate__zoomIn active" : ""}`} id="applied-tab" data-toggle="tab" role="tab" aria-controls="applied" aria-selected="false" onClick={() => setActiveTab("applied")}>Đã ứng tuyển</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab == "hired" ? "animate__animated animate__faster animate__zoomIn active" : ""}`} id="hired-tab" data-toggle="tab" role="tab" aria-controls="hired" aria-selected="false" onClick={() => setActiveTab("hired")}>Được tuyển</a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                {renderTabContent()}
            </div>
        </>
    )
}

export default ManageJob;
