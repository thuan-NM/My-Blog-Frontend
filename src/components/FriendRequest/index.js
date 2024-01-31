const FriendRequest = ({ request, onAcceptFriend , onDeclineFriend}) => {
  return (
    <div className="user-item d-flex justify-content-between">
        <p>Friend request from user with ID {request.username}</p>
        <div>
            <button className="m-3 btn btn-light" onClick={onAcceptFriend}>Accept Friend Request</button>
            <button className="m-3 btn btn-light" onClick={onDeclineFriend}>Decline Friend Request</button>
      </div>
    </div>
  );
};

export default FriendRequest;