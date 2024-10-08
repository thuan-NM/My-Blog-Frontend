import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import followServices from "../../services/follow.services";

const UserCard = ({ user }) => {
    const [followers, setFollowers] = useState({})
    const [following, setFollowing] = useState({})
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFollow = async () => {
            try {
                const followersResponse = await followServices.getFollowers(user._id);
                const followingResponse = await followServices.getFollowing(user._id);
                setFollowers(followersResponse.data);
                setFollowing(followingResponse.data)
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchFollow();
    }, [followers, following]);

    return (
        <>
            {user && (<div className="user-data full-width">
                <div className="user-profile">
                    <div className="username-dt">
                        <div className="usr-pic">
                            <img src={user.profilePictureUrl || `../images/userava.jpg`} />
                        </div>
                    </div>
                    <div className="user-specs">
                        <h3>{user.companyname != null ? user.companyname : user.lastName}</h3>
                        <span>Graphic Designer at Self Employed</span>
                    </div>
                </div>
                <ul className="user-fw-status">
                    <li>
                        <h4>Đang theo dõi</h4>
                        <span>{following.followingCount}</span>
                    </li>
                    <li>
                        <h4>Người theo dõi</h4>
                        <span>{followers.followersCount}</span>
                    </li>
                    <li>
                        <Link to={`/myprofile`}>Xem trang cá nhân</Link>
                    </li>
                </ul>
            </div>)}
        </>
    )
}
export default UserCard;