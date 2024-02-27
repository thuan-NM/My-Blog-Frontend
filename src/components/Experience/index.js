import React from "react";
import { Link } from "react-router-dom";

const Experience = () => {
    return (
        <div className="user-profile-ov st2 animate__animated animate__fast zoomIn">
            <h3>
                <Link className="exp-bx-open">Experience</Link>
                <Link className="exp-bx-open"><i className="bi bi-pencil-fill ms-2"></i>
                </Link>
                <Link className="exp-bx-open">
                <i className="bi bi-plus-circle-fill ms-2"></i>
                </Link>
            </h3>
            <h4>Web designer <Link ><i className="fa fa-pencil"></i></Link></h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id. Vivamus sit amet augue nec urna efficitur tincidunt. Vivamus consectetur aliquam lectus commodo viverra. </p>
            <h4>UI / UX Designer <Link ><i className="fa fa-pencil"></i></Link></h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id.</p>
            <h4>PHP developer <Link ><i className="fa fa-pencil"></i></Link></h4>
            <p className="no-margin">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor aliquam felis, nec condimentum ipsum commodo id. Vivamus sit amet augue nec urna efficitur tincidunt. Vivamus consectetur aliquam lectus commodo viverra. </p>
        </div>
    )
}

export default Experience;