
import { Link } from "react-router-dom";

const UserItem = ({ user, onAddFriend, onRemoveFriend,isFriend,viewed,isActive }) => {
  return (
    <div className="user-item d-flex justify-content-between m-3">
      <div className=" d-flex flex-column justify-content-center">
        <h4>{user.firstName} {user.lastName}</h4>
      </div>
      <div>
        {!isActive ?(
          <Link to={`/userprofile/${user._id}`} className="m-3 btn btn-light user-item-button">
            View Profile
          </Link>
        ):(
          <Link to={`/userprofile/${user._id}`} className="m-3 btn btn-light disabled user-item-button">
            Your Profile
          </Link>
        )}
        {!viewed &&
          (!isFriend ? (
            <button className="m-3 btn btn-light user-item-button" onClick={onAddFriend}>
              Add Friend
            </button>
          ) : (
            <button className="m-3 btn btn-light user-item-button" onClick={onRemoveFriend}>
              Remove Friend
            </button>
          ))
        }
      </div>
    </div>
  );
};

export default UserItem;
