import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userServices from "../../services/user.services";
import followServices from "../../services/follow.services";
import { useAuth } from "../../contexts/AuthContext";

const Suggestions = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch the list of all users
                const usersResponse = await userServices.getUsersList();
                const allUsers = usersResponse.data || [];

                // Fetch the list of users the current user is following
                const followingResponse = await followServices.getFollowing(user._id);
                const followingList = followingResponse.data.following.map(follow => follow.followId);

                // Filter out users that the current user is already following
                const suggestions = allUsers.filter(u => u._id !== user._id && !followingList.includes(u._id));

                setData(suggestions);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [user._id]);

    const handleFollow = async (followId) => {
        try {
            // Call the follow API
            await followServices.followUser({ userId: user._id, followId });

            // Update the suggestion list by removing the followed user
            setData(prevData => prevData.filter(user => user._id !== followId));
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="process-comm">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return <p>No suggestions found.</p>;
    }

    return (
        <div className="widget suggestions full-width">
            <div className="sd-title">
                <i class="bi bi-person-plus-fill"></i>
                <h3>Gợi ý </h3>
                <i className="la la-ellipsis-v"></i>
            </div>
            <div className="suggestions-list">
                {data.map((suggestion) => (
                    <div className="suggestion-usd" key={suggestion._id}>
                        <div className="d-flex align-items-center">
                            <Link to={`/userprofile/${suggestion._id}`}>
                                <img src={suggestion.profilePictureUrl || `../images/userava.jpg`} alt="Profile" />
                            </Link>
                            <Link to={`/userprofile/${suggestion._id}`} className="sgt-text">
                                <h4>{suggestion.firstName} {suggestion.lastName}</h4>
                                <span>Graphic Designer</span>
                            </Link>
                        </div>
                        <span
                            onClick={() => handleFollow(suggestion._id)}
                            style={{ cursor: 'pointer', color: 'green' }}
                            title="Follow">
                            <i className="la la-plus"></i>
                        </span>
                    </div>
                ))}
                <div className="view-more">
                    <Link to={"/users"}>Xem thêm</Link>
                </div>
            </div>
        </div>
    );
};

export default Suggestions;
