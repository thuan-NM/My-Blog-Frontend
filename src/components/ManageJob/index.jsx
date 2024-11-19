import React, { useState } from "react";
import WaitForInterview from "../WaitForInterview";
import ManageJobItem from "../ManageJobItem"
import InterviewSchedule from "../InterviewSchedule";
import ManageCandidate from "../ManageCandidate";

const ManageJob = () => {
    const [activeTab, setActiveTab] = useState("managejob");

    const renderTabContent = () => {
        switch (activeTab) {
            case "managejob":
                return <ManageJobItem />;
            case "managecandidate":
                return <ManageCandidate />;
            default:
                return <ManageJobItem />;
        }
    }

    return (
        <>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                    <a className={`nav-link ${activeTab == "managejob" ? "animate__animated animate__faster animate__zoomIn active" : ""}`} id="manage-tab" data-toggle="tab" role="tab" aria-controls="home" aria-selected="true" onClick={() => setActiveTab("managejob")}>Quản lý công việc</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab == "managecandidate" ? "animate__animated animate__faster animate__zoomIn active" : ""}`} id="denied-tab" data-toggle="tab" role="tab" aria-controls="profile" aria-selected="false" onClick={() => setActiveTab("managecandidate")}>Quản lý ứng cử viên</a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                {renderTabContent()}
            </div>
        </>
    )
}

export default ManageJob;
