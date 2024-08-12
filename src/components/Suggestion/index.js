import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import userServices from "../../services/user.services";

const Suggestions = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersResponse = await userServices.getUsersList();
                setData(usersResponse.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [data]);
    
    if (isLoading) {
        return (
            <div className="process-comm">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>)
    }

    if (user == null || user.friendRequests == null) {
        return <p>No results found1.</p>;
    }
    return (
        <div className="widget suggestions full-width">
            <div className="sd-title">
                <h3>Những người bạn có thể biết</h3>
                <i className="la la-ellipsis-v"></i>
            </div>
            <div className="suggestions-list">
                {data.map((suggestion) => (user && user._id && user._id != suggestion._id && (
                    <div className="suggestion-usd" key={suggestion._id} >
                        <Link to={`/userprofile/${suggestion._id}`}>
                            <img src={suggestion.profilePictureUrl || `images/userava.jpg`} />
                        </Link>
                        <Link to={`/userprofile/${suggestion._id}`} className="sgt-text">
                            <h4>{suggestion.firstName} {suggestion.lastName}</h4>
                            <span>Graphic Designer</span>
                        </Link>
                        <span><i className="la la-plus"></i></span>
                    </div>
                )))}
                <div className="view-more">
                    <Link to={"/users"}>Xem thêm</Link>
                </div>
            </div>

        </div>
    )
}

export default Suggestions;