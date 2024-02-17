import React, { useState } from "react";
import axios from "axios";
import UserItem from "../../components/UserItem";
import SearchBar from "../../components/SearchBar";
import { useQuery, useQueryClient } from "react-query";
import Pagination from "../../components/Pagination";
import { useFriend } from "../../contexts/FriendContext";
import { useSearch } from "../../contexts/SearchContext";;
import { useAuth } from "../../contexts/AuthContext";// Điều chỉnh đường dẫn tới auth-context của bạn

function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { handleAcceptFriendRequest, handleRemoveFriend, handleSendFriendRequest } = useFriend();
  const { handleSearchFriend, searchTerm, searchResults, showFriendLists, setSearchTerm, setSearchResults, setShowFriendLists } = useSearch();
  const { user } = useAuth();

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const { data, isLoading, error } = useQuery(
    ["users", currentPage, user],
    () =>
      axios
        .get(
          `http://localhost:3001/users?page=${currentPage}&pageSize=${pageSize}`
        )
        .then((response) => response.data),
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching posts: {error.message}</p>;
  }

  if (data.data.length === 0 || data === null) {
    return <p>No results found.</p>;
  }

  if (user == null || user.friendRequests == null) {
    return <p>No results found1.</p>;
  }
  const searchTermInfo = searchTerm;
  return (
    // <div className="m-3">
    //   <SearchBar
    //     searchTerm={searchTerm}
    //     setSearchTerm={setSearchTerm}
    //     handleSearch={handleSearchFriend}
    //   />
    //   {user.friendRequests.map((request) => (
    //       <FriendRequest
    //             key={request._id}
    //             request={request}
    //             onAcceptFriend={() => handleAcceptFriendRequest(request, true)}
    //             onDeclineFriend={() => handleAcceptFriendRequest(request, false)}
    //         />
    //   ))}
    //   {showFriendLists && (
    //     <>
    //       {data.data.map((curUser) => 
    //         // Check if the user is logged in before displaying the information
    //         ( user && user._id && user._id != curUser._id && (
    //             <UserItem
    //                 key={curUser._id}
    //                 user={curUser}
    //                 onAddFriend={() => {handleSendFriendRequest(curUser)}}
    //                 onRemoveFriend={() => {handleRemoveFriend(curUser._id)}}
    //                 isFriend={user.friend && user.friend.some((friend) => friend._id === curUser._id)}
    //             />
    //         ))
    //       )} 
    //     </>
    //   )}
    //   {(!showFriendLists && searchResults.length == 0) &&(
    //     <div className="d-flex justify-content-center my-5">
    //       <h3 className="searchstate me-1">Nothing found, try searching again </h3>
    //       <button className="btn-close-search" onClick={() => {setSearchResults([]),setShowFriendLists(true),setCurrentPage(1)}}>X</button>
    //     </div>
    //   )}
    //   {searchResults.length>0 && (
    //     <>
    //       <div className="d-flex">
    //         <button className="btn-back" onClick={() => {setSearchResults([]),setShowFriendLists(true),setCurrentPage(1)}}><i className="bi bi-chevron-compact-left text-center" ></i><p className="text-center">Back</p></button>
    //       </div>
    //       {searchResults.map((result) => (
    //         <UserItem
    //           key={result._id}
    //           user={result}
    //           onAddFriend={() => handleSendFriendRequest(result)}
    //           isFriend={user.friend && user.friend.some((friend) => friend._id === result._id)}
    //         />
    //       ))}
    //     </>
    //   )}
    //   <Pagination
    //     page={currentPage}
    //     pageSize={pageSize}
    //     totalPages={data.totalPages}
    //     onPageChange={handlePageChange}
    //   />
    // </div>
    <section class="companies-info">
      <div class="container">
        <div class="company-title">
          <h3>All Users</h3>
        </div>
        <div class="companies-list">
          <div class="row">
          {data.data.map((curUser) => 
             // Check if the user is logged in before displaying the information
             ( user && user._id && user._id != curUser._id && (
                 <UserItem
                     key={curUser._id}
                     user={curUser}
                     onAddFriend={() => {handleSendFriendRequest(curUser)}}
                     onRemoveFriend={() => {handleRemoveFriend(curUser._id)}}
                     isFriend={user.friend && user.friend.some((friend) => friend._id === curUser._id)}
                 />
             ))
           )} 
          </div>
        </div>
        <div class="process-comm">
          <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Users;