import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../components/Pagination";
import { useQuery } from "react-query";
import UserItem from "../../components/UserItem";
import PostItem from "../../components/PostItem";
import Profile from "../../components/Profile";
import { useParams } from 'react-router-dom';
import { useHashtags } from "../../contexts/HashtagContext";
import { useAuth } from "../../contexts/AuthContext";

function UserProfile() {
  const [currentPage, setCurrentPage] = useState(1);
  const { handleHashtags } = useHashtags();
  const {user} = useAuth();
  const pageSize = 5;
  const [curUser, setUser] = useState({});
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [activeButton, setActiveButton] = useState("Posts");

    const handleButtonClick = (buttonName) => {
      setActiveButton(buttonName);
    };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for ID:", userId);
        const response = await axios.get(`http://localhost:3001/users/${userId}`);
        setUser(response.data.data);
        setUserDataLoaded(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    setActiveButton("Posts")
    fetchUserData();
  }, [userId]);

  const { data, isLoading, error } = useQuery(
    ['posts', currentPage, curUser._id],
    () => axios.get(`http://localhost:3001/posts/user/${curUser._id}?page=${currentPage}&pageSize=${pageSize}`)
      .then((response) => response.data),
    { enabled: userDataLoaded } // Enable the query only when userDataLoaded is true
  );

  if (!userDataLoaded) {
    return <p>Loading user data...</p>;
  }

  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>Error fetching posts: {error.message}</p>;
  }

  if (curUser == null) {
    return <p>No results found1.</p>;
  }

  return (
    <div>
      <div className="btn-group mt-3 d-flex justify-content-center" role="group" aria-label="Vertical button group">
              <button
                type="button"
                className={`buttonswitch ${activeButton === "Posts" ? 'active' : ''}`}
                onClick={() => handleButtonClick("Posts")}>
                Post
              </button>
              <button
                type="button"
                className={`buttonswitch ${activeButton === "List Friend" ? 'active' : ''}`}
                onClick={() => handleButtonClick("List Friend")}>
                List Friend
              </button>
              </div>
              <div className="row mt-3 d-flex justify-content-evenly my-profile-container">
      <div className="col-4 mt-3">
            <Profile user={curUser}/>
      </div>
      {activeButton=="List Friend" && (
          <div className="col-7 right-container mt-3">
            <h2 className="text-center title-item">Friends</h2>
            <ul>
              {curUser.friend.map((friend)=>(
                <UserItem key={friend._id} user={friend}
                isFriend={curUser.friend && curUser.friend.some((user) => user._id === friend._id)}
                viewed={true}
                isActive={user._id == friend._id}
                />
              ))}
            </ul>
          </div> 
          )}
          {activeButton=="Posts" && (
            <div className="col-7 right-container mt-3">
            <h2 className="text-center title-item">Posts</h2>
            <ul>
              {data.data.length==0 
              ?<h4 className="text-center mt-5">You Don't Have Any Post !!!</h4> 
              :(
                data.data.map((post) => (
                  <PostItem key={post._id} post={post} handleHashtags={handleHashtags}/>
                  ))
              )}
            </ul>
        </div>
        )}
        </div>
      {/* <div className="row mt-3">
          <div className="col-6">
            <h4 className="text-center">List Friend</h4>
              <ul>
                {user.friend.map((friend)=>(
                  <UserItem key={friend._id} user={friend}
                  isFriend={user.friend && user.friend.some((user) => user._id === friend._id)}/>
                ))}
              </ul>
          </div>
          <div className="col-6">
              <h4 className="text-center">Posts</h4>
              <ul>
                {data.data.map((post) => (
                <PostItem key={post._id} post={post} handleHashtags={handleHashtags}/>
                ))}
              </ul>
          </div>
        </div> */}
      <Pagination
        page={currentPage}
        pageSize={pageSize}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default UserProfile;
