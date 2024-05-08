import React from "react";
import { Link } from "react-router-dom";

const Overview = ({overview, setIsOverviewModalOpen, isOverviewModalOpen,isAuthor}) => {
    
    return (
        <div className={`user-profile-ov animate__animated animate__faster zoomIn`} onClick={() => setIsOverviewModalOpen(!isOverviewModalOpen)}>
            <h3>
                <Link className="overview-open" >Tổng quan</Link>
                {isAuthor&&<Link className="overview-open" ><button className="edit-info"><i className="bi bi-pencil-fill ms-2"></i></button></Link>}
            </h3>
            <p>{overview.data||""}</p>
        </div>
    )
}

export default Overview