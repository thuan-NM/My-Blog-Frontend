import React, { useState } from "react";
import WaitForInterview from "../WaitForInterview";
import InterviewSchedule from "../InterviewSchedule";
import ScheduledCandidate from "../ScheduledCandidate";

const ManageInterview = () => {
    const [activeTab, setActiveTab] = useState("schedule");

    const renderTabContent = () => {
        switch (activeTab) {
            case "schedule":
                return <InterviewSchedule />;
            case "action":
                return <ScheduledCandidate />;
            case "waiting":
                return <WaitForInterview />;
            default:
                return <InterviewSchedule />;
        }
    }

    return (
        <>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                    <a className={`nav-link ${activeTab == "schedule" ? "animate__animated animate__faster animate__zoomIn active" : ""}`} id="manage-tab" data-toggle="tab" role="tab" aria-controls="home" aria-selected="true" onClick={() => setActiveTab("schedule")}>Xếp lịch phỏng vấn</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab == "action" ? "animate__animated animate__faster animate__zoomIn active" : ""}`} id="denied-tab" data-toggle="tab" role="tab" aria-controls="profile" aria-selected="false" onClick={() => setActiveTab("action")}>Các ứng viên chưa xác nhận</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab == "waiting" ? "animate__animated animate__faster animate__zoomIn active" : ""}`} id="applied-tab" data-toggle="tab" role="tab" aria-controls="applied" aria-selected="false" onClick={() => setActiveTab("waiting")}>Chờ phỏng vấn</a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                {renderTabContent()}
            </div>
        </>
    )
}

export default ManageInterview;
