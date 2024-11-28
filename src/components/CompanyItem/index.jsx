
import { Link } from "react-router-dom";
import followServices from "../../services/follow.services";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const CompanyItem = ({ company }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if the user is already followed
    const checkFollowStatus = async () => {
      try {
        const data = await followServices.getFollowing(user._id);
        if (data.isSuccess) {
          const followingList = data.data.following || [];

          setIsFollowing(followingList.some(follow => follow.followId === company._id));
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();
  }, [company._id, user._id]);
  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await followServices.unfollowUser({ userId: user._id, followId: company._id });
      } else {
        await followServices.followUser({ userId: user._id, followId: company._id });
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
          <div className="company-item-avt">
            <source srcSet={company.profilePictureUrl} type="image/svg+xml" />
            <img src={company.profilePictureUrl} alt="..." />
          </div>
          <h3 className="w-10/12 truncate ">{company.companyname}</h3>
          <h4></h4>
          <ul className="!w-full">
            <li className="!w-full"><button onClick={handleFollowToggle} className={`${!isFollowing ? `follow` : `unfollow`} !w-9/12 py-1 h-auto`}>
              {isFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
            </button></li>
          </ul>
        </div>
        <Link to={`/companyprofile/${company._id}`}>Xem trang công ty</Link>
      </div>
    </div>
  );
};

export default CompanyItem;
