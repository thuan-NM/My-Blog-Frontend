
import { Link } from "react-router-dom";

const UserItem = ({ user, onAddFriend, onRemoveFriend, isFriend, viewed, isActive }) => {
  return (
    // <div className="user-item d-flex justify-content-between m-3">
    //   <div className=" d-flex flex-column justify-content-center">
    //     <h4>{user.firstName} {user.lastName}</h4>
    //   </div>
    //   <div>
    //     {!isActive ?(
    //       <Link to={`/userprofile/${user._id}`} className="m-3 btn btn-light user-item-button">
    //         View Profile
    //       </Link>
    //     ):(
    //       <Link to={`/userprofile/${user._id}`} className="m-3 btn btn-light disabled user-item-button">
    //         Your Profile
    //       </Link>
    //     )}
    //     {!viewed &&
    //       (!isFriend ? (
    //         <button className="m-3 btn btn-light user-item-button" onClick={onAddFriend}>
    //           Add Friend
    //         </button>
    //       ) : (
    //         <button className="m-3 btn btn-light user-item-button" onClick={onRemoveFriend}>
    //           Remove Friend
    //         </button>
    //       ))
    //     }
    //   </div>
    // </div>
    <div class="col-lg-3 col-md-4 col-sm-6 col-12">
      <div class="company_profile_info">
        <div class="company-up-info">
          <img src="images/favicon.png" alt="" />
          <h3>{user.lastName}</h3>
          <h4>Graphic Designer</h4>
          <ul>
            <li><a href="#" title="" class="follow">Follow</a></li>
            <li><a href="#" title="" class="message-us"><i class="fa fa-envelope"></i></a></li>
            <li><a href="#" title="" class="hire-us">Hire</a></li>
          </ul>
        </div>
        <a href="user-profile.html" title="" class="view-more-pro">View Profile</a>
      </div>
    </div>
  );
};

export default UserItem;
