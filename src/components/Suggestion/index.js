import React from "react";

const Suggestions = ({suggestion}) => {
    return (
        <div className="suggestion-usd">
            <img src={suggestion.profilePictureUrl || `images/userava.jpg`} />
            <div className="sgt-text">
                <h4>{suggestion.firstName} {suggestion.lastName}</h4>
                <span>Graphic Designer</span>
            </div>
            <span><i className="la la-plus"></i></span>
        </div>
    )
}

export default Suggestions;