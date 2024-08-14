import React, { useEffect, useState } from "react";
import axios from "axios";
import UserItem from "../../components/UserItem";
import SearchBar from "../../components/SearchBar";
import { useQuery, useQueryClient } from "react-query";
import Pagination from "../../components/Pagination";
import { useFriend } from "../../contexts/FriendContext";
import { useSearch } from "../../contexts/SearchContext";;
import { useAuth } from "../../contexts/AuthContext";// Điều chỉnh đường dẫn tới auth-context của bạn
import userServices from "../../services/user.services";

function Users() {
  const { handleAcceptFriendRequest, handleRemoveFriend, handleSendFriendRequest } = useFriend();
  const { handleSearchFriend, searchTerm, searchResults, showFriendLists, setSearchTerm, setSearchResults, setShowFriendLists } = useSearch();
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const userResponse = await userServices.getUsersList();
        setData(userResponse.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [data]);

  if (isLoading) {
    return <div className="process-comm">
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
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
    <section className="companies-info">
      <div className="container">
        <div className="company-title">
          <h3>Tất cả người dùng</h3>
        </div>
        <div className="companies-list">
          <div className="row">
            {data.map((curUser) =>
            // Check if the user is logged in before displaying the information
            (user && user._id && user._id != curUser._id && (
              <UserItem
                key={curUser._id}
                user={curUser}
                onAddFriend={() => { handleSendFriendRequest(curUser) }}
                onRemoveFriend={() => { handleRemoveFriend(curUser._id) }}
                isFriend={user.friend && user.friend.some((friend) => friend._id === curUser._id)}
              />
            ))
            )}
          </div>
        </div>
        <div className="process-comm">
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Users;