import { Link } from "react-router-dom";
import followServices from "../../services/follow.services";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const UserItem = ({ userdata, onAddFriend, onRemoveFriend, isFriend, viewed, isActive }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if the user is already followed
    const checkFollowStatus = async () => {
      try {
        const { data } = await followServices.getFollowing(user._id);
        const followingList = data.following || [];

        setIsFollowing(followingList.some(follow => follow.followId === userdata._id));
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();
  }, [userdata._id, user._id]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await followServices.unfollowUser({ userId: user._id, followId: userdata._id });
      } else {
        await followServices.followUser({ userId: user._id, followId: userdata._id });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-12">
      <div className="company_profile_info">
        <div className="company-up-info">
          <img src={userdata.profilePictureUrl || `../images/userava.jpg`} alt="Profile" />
          <h3>{userdata.lastName}</h3>
          <h4>Graphic Designer</h4>
          <ul>
            <li><button onClick={handleFollowToggle} className={!isFollowing?`follow`:`unfollow`}>
              {isFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
            </button></li>
            <li><a href="#" title="" className="message-us"><i className="fa fa-envelope"></i></a></li>
            <li><a href="#" title="" className="hire-us">Tuyển dụng</a></li>
          </ul>
        </div>
        <Link to={`/userprofile/${userdata._id}`}>Xem trang cá nhân</Link>
      </div>
    </div>
  );
};

export default UserItem;
