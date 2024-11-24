import React from "react";
import { Link } from "react-router-dom";

const Overview = ({ overview, setIsOverviewModalOpen, isOverviewModalOpen, isAuthor }) => {
    return (
        <div className={`user-profile-ov animate__animated animate__faster zoomIn`}>
            <h3>
                <Link className="overview-open" >Tổng quan</Link>
                {isAuthor && <Link className="overview-open" onClick={() => setIsOverviewModalOpen(!isOverviewModalOpen)}><button className="edit-info"><i className="bi bi-pencil-fill ms-2"></i></button></Link>}
            </h3>
            {(overview.data) ? (
                overview.data.split('\n').map((p) => (
                    <p className="ms-2" key={p}>{p}</p>
                ))
            ): "Trống"}
        </div>
    )
}

export default Overview