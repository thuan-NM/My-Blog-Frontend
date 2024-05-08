
import { Link } from "react-router-dom";

const UserItem = ({ user, onAddFriend, onRemoveFriend, isFriend, viewed, isActive }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-12">
      <div className="company_profile_info">
        <div className="company-up-info">
          <img src={user.profilePictureUrl || `images/userava.jpg`} />
          <h3>{user.lastName}</h3>
          <h4>Graphic Designer</h4>
          <ul>
            <li><a href="#" title="" className="follow">Theo dõi</a></li>
            <li><a href="#" title="" className="message-us"><i className="fa fa-envelope"></i></a></li>
            <li><a href="#" title="" className="hire-us">Tuyển dụng</a></li>
          </ul>
        </div>
        <Link to={`/userprofile/${user._id}`}>Xem trang cá nhân</Link>
        {/* <a href="user-profile.html" title="" className="view-more-pro">Xem trang cá nhân</a> */}
      </div>
    </div>
  );
};

export default UserItem;
