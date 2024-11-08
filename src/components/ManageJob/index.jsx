import React, { useState } from "react";
import WaitForInterview from "../WaitForInterview";
import ManageJobItem from "../ManageJobItem"
import InterviewSchedule from "../InterviewSchedule";

const ManageJob = () => {
    const [activeTab, setActiveTab] = useState("manage");

    const renderTabContent = () => {
        switch (activeTab) {
            case "manage":
                return <ManageJobItem />;
            case "schedule":
                return <InterviewSchedule />;
            case "interview":
                return <WaitForInterview />;
            // case "hired":
            //     return <HiredJob />;
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
                    <a className={`nav-link ${activeTab == "schedule" ? "animate__animated animate__faster animate__zoomIn active" : ""}`} id="denied-tab" data-toggle="tab" role="tab" aria-controls="profile" aria-selected="false" onClick={() => setActiveTab("schedule")}>Xếp lịch phỏng vấn</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab == "interview" ? "animate__animated animate__faster animate__zoomIn active" : ""}`} id="applied-tab" data-toggle="tab" role="tab" aria-controls="applied" aria-selected="false" onClick={() => setActiveTab("interview")}>Chờ phỏng vấn</a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                {renderTabContent()}
            </div>
        </>
    )
}

export default ManageJob;
